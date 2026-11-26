import fs from 'node:fs';
import { readings } from '../data/readings.js';
import { multipleChoice } from '../data/question-choices.js';
import { choiceBatches } from '../data/question-choices-batches.js';
import { libraryPublications } from '../data/library-expansion.js';
import { newsroomPublications } from '../data/newsroom-expansion.js';
import { observatoryPublications } from '../data/observatory-expansion.js';

const date = process.argv.find(arg => arg.startsWith('--date='))?.slice(7) ?? new Date().toISOString().slice(0, 10);
const number = code => Number(code.match(/\d+/)[0]);
const codes = [...new Set(readings.map(reading => reading.code))].sort((a, b) => number(a) - number(b) || a.localeCompare(b));
const works = codes.map(code => {
  const versions = readings.filter(reading => reading.code === code);
  const ca = versions.find(reading => reading.language === 'ca');
  const languages = Object.fromEntries(versions.map(reading => {
    const questions = reading.questions.flatMap((question, index) => multipleChoice(reading, question) ? [{ id: question.id, number: index + 1 }] : []);
    return [reading.language, { status: questions.length ? 'independent-review-passed' : 'pending', questions }];
  }));
  return { code, baseCode: 'L' + code.match(/\d+/)[0], variant: /[A-Z]$/.test(code), level: ca.level, difficulty: ca.difficulty, title: ca.title,
    status: Object.values(languages).every(version => version.questions.length) ? 'provisional' : 'pending', languages };
});
const covered = works.filter(work => work.status === 'provisional');
const ranges = [];
for (let start = 1; start <= Math.max(...codes.map(number)); start += 5) {
  const end = Math.min(start + 4, Math.max(...codes.map(number)));
  const selected = works.filter(work => number(work.code) >= start && number(work.code) <= end);
  const complete = selected.filter(work => work.status === 'provisional').length;
  ranges.push({ start, end, total: selected.length, covered: complete, status: complete === selected.length ? 'complete' : complete ? 'partial' : 'pending' });
}
const coverage = { date, totalWorks: works.length, coveredWorks: covered.length, pendingWorks: works.length - covered.length,
  localizedAlternatives: works.reduce((sum, work) => sum + Object.values(work.languages).reduce((count, language) => count + language.questions.length, 0), 0), ranges, works };
fs.writeFileSync('docs/question-choices-coverage.json', JSON.stringify(coverage, null, 2) + '\n');
const rows = ranges.map(range => `| L${String(range.start).padStart(3, '0')}–L${String(range.end).padStart(3, '0')} | ${range.covered}/${range.total} | ${range.status === 'complete' ? 'Complet ES/CA' : range.status === 'partial' ? 'Parcial' : 'Pendent'} |`).join('\n');
const batches = ['| Prototip | v1.56 | 5 | [Registre](question-choices-review.json) |',
  ...choiceBatches.map(batch => `| ${batch.id} | ${batch.edition} | ${new Set(batch.readings.map(entry => entry.code)).size} | [Registre de revisió](../${batch.review}) |`),
  ...(libraryPublications.length ? [`| Biblioteca · famílies noves | ${libraryPublications.at(-1).edition} | ${libraryPublications.length * 3} | [Registre de revisió](question-choices/library-2026-11-26-review.json) |`] : []),
  ...(newsroomPublications.length ? [`| Redacció · famílies noves | ${newsroomPublications.at(-1).edition} | ${newsroomPublications.length * 3} | [Registre de revisió](question-choices/newsroom-2026-11-26-review.json) |`] : []),
  ...(observatoryPublications.length ? [`| Observatori · famílies noves | ${observatoryPublications.at(-1).edition} | ${observatoryPublications.length * 3} | [Registre de revisió](question-choices/observatory-2026-11-26-review.json) |`] : [])].join('\n');
fs.writeFileSync('docs/question-choices-progress.md', `# Seguiment de les alternatives ABCD\n\nActualitzat el ${date}. **${covered.length} de ${works.length} fitxes concretes** tenen alternatives en català i castellà; en queden ${works.length - covered.length} pendents. Hi ha ${coverage.localizedAlternatives} alternatives lingüístiques revisades.\n\nLa xifra inclou lectures base i variants de família, que es treballen independentment. Cobrir una lectura vol dir donar alternativa a les preguntes adequades; les opinions i activitats de producció es mantenen obertes. Provisional significa revisió independent superada i validació docent pendent. El prototip base L001–L005 ha estat acceptat pel docent pel que fa al format.\n\n## Rangs del catàleg\n\nPots escriure un rang com 6-10 al cercador del web. La taula compta les fitxes concretes de cada rang, incloses les germanes A/B. Un rang només figura complet quan totes les seves fitxes tenen alternatives pròpies en tots dos idiomes.\n\n| Rang | Fitxes amb alternatives | Estat |\n| --- | --- | --- |\n${rows}\n\n## Lots publicats\n\n| Lot | Versió | Fitxes noves | Revisió independent |\n| --- | --- | --- | --- |\n${batches || '| — | v1.56 | 5 del prototip | [Registre](question-choices-review.json) |'}\n\nEl detall per codi, llengua i número de pregunta és a [question-choices-coverage.json](question-choices-coverage.json). Els criteris editorials i de gradació són a [question-choices.md](question-choices.md).\n`);
console.log(JSON.stringify({ covered: covered.length, total: works.length, pending: coverage.pendingWorks, localizedAlternatives: coverage.localizedAlternatives }));
