// Run only after an independent reviewer approves the exact source SHA.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadNewsroomDrafts, checkNewsroomFamily, hash } from './check-newsroom-expansion.mjs';
import { newsroomPublications } from '../data/newsroom-expansion.js';
import { localizedChoice, choiceReviewSnapshot } from '../data/question-choices.js';
import { checkMaterialRelease, recordRelease } from './record-release.mjs';
const arg = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const code = arg('code'), reviewer = arg('reviewer'), author = arg('author'), sourceSha256 = arg('source-sha')?.toLowerCase(), edition = arg('edition'), date = arg('date');
assert(/^L28[0-8]$/.test(code ?? '') && author && reviewer && author !== reviewer);
assert(/^[a-f0-9]{64}$/.test(sourceSha256 ?? '') && /^v\d+\.\d+(?:\.\d+)?$/.test(edition ?? '') && /^\d{4}-\d{2}-\d{2}$/.test(date ?? ''));
checkMaterialRelease(edition.slice(1));
const draft = (await loadNewsroomDrafts()).find(entry => entry.spec.code === code);
assert(draft && draft.sourceSha256 === sourceSha256, 'Source must exactly match the independent review');
checkNewsroomFamily(draft, { published: true });
const metadata = { author, reviewer, date, edition, source: draft.source, sourceSha256, result: 'independent-review-passed', status: 'provisional', teacherValidation: 'pending' };
const reviews = draft.readings.map(reading => ({ code: reading.code, language: reading.language, ...metadata, sha256: hash(reading) }));
const alternatives = draft.readings.flatMap(reading => {
  const choices = draft.choices.find(entry => entry.code === reading.code && entry.language === reading.language).questions;
  return reading.questions.flatMap(question => choices[question.id] ? [{ code: reading.code, language: reading.language, questionId: question.id, ...metadata,
    sha256: hash(choiceReviewSnapshot(reading, question, localizedChoice(choices[question.id], question))) }] : []);
});
const publication = { code, edition, family: draft.family, readings: draft.readings, choices: draft.choices };
const publications = [...newsroomPublications.filter(entry => entry.code !== code), publication].sort((a, b) => a.code.localeCompare(b.code));
for (const [file, rows] of [['docs/universes/newsroom-expansion-2026-11-26-review.json', reviews], ['docs/question-choices/newsroom-2026-11-26-review.json', alternatives]]) {
  const codes = new Set(draft.readings.map(reading => reading.code));
  fs.writeFileSync(file, JSON.stringify([...JSON.parse(fs.readFileSync(file, 'utf8')).filter(entry => !codes.has(entry.code)), ...rows], null, 2) + '\n');
}
fs.writeFileSync('data/newsroom-expansion-published.js', '// Complete, independently reviewed and illustrated families. Generated from the authoring sources.\nexport const newsroomPublications = ' + JSON.stringify(publications, null, 2) + ';\n');
const total = 6 + publications.length;
const guideFile = 'docs/universes/redaccio-del-pati.md';
let guide = fs.readFileSync(guideFile, 'utf8');
const section = `<!-- newsroom-expansion:start -->\n## Ampliació del 26 de novembre del 2026\n\nL’univers arriba a **${total} històries independents**. Les ${publications.length} noves són famílies completes: suport de 5è (250–330 paraules, 8 preguntes), referència de 6è (360–450 paraules, 10 preguntes) i ampliació de 1r d’ESO (480–590 paraules, 12 preguntes), totes en català i castellà. Cada grau té textos, tasques, solucionari i evidències propis, i comparteix la situació i les il·lustracions amb els altres. Les alternatives ABCD són pròpies de cada variant i llengua; les opinions i la creació personal mantenen resposta textual.\n\n| Família | Història | Variants |\n| --- | --- | --- |\n${publications.map(entry => `| ${entry.code} | ${entry.family.name.ca} | ${entry.family.variantCodes.join(' · ')} |`).join('\n')}\n\nLa [guia d’autoria](newsroom-expansion-2026-11-26-authoring.md), el [registre editorial](newsroom-expansion-2026-11-26-review.json) i els [prompts de les escenes](newsroom-expansion-2026-11-26-images.json) documenten la tanda. Cada història reintrodueix l’equip i el context necessaris; no s’ha de llegir en cap ordre. Clara i Omar alternen iniciativa, dubtes, creació i ajuda. Les versions han superat revisió independent i són **provisionals, pendents de validació docent**.\n<!-- newsroom-expansion:end -->`;
guide = guide.includes('<!-- newsroom-expansion:start -->') ? guide.replace(/<!-- newsroom-expansion:start -->[\s\S]*?<!-- newsroom-expansion:end -->/, section) : guide.trimEnd() + '\n\n' + section + '\n';
fs.writeFileSync(guideFile, guide);
recordRelease({ version: edition.slice(1), date,
  ca: `${code}: ${draft.spec.title[1]}. Nova família de La redacció del pati, amb suport de 5è, referència de 6è i ampliació de 1r d’ESO, en català i castellà; preguntes textuals i ABCD, solucionari, evidències i dues il·lustracions. L’univers arriba a ${total} històries independents. Contingut provisional, pendent de validació docent.`,
  es: `${code}: ${draft.spec.title[0]}. Nueva familia de La redacción del patio, con apoyo de 5.º, referencia de 6.º y ampliación de 1.º de ESO, en catalán y castellano; preguntas textuales y ABCD, solucionario, evidencias y dos ilustraciones. El universo llega a ${total} historias independientes. Contenido provisional, pendiente de validación docente.` });
console.log(JSON.stringify({ code, edition, totalUniverseStories: total, readingReviews: reviews.length, choiceReviews: alternatives.length }));
