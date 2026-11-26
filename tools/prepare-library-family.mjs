// A coordinator runs this only after receiving an independent editorial pass
// for the exact source SHA. It never infers editorial approval from tests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadLibraryDrafts, checkLibraryFamily, hash } from './check-library-expansion.mjs';
import { libraryPublications } from '../data/library-expansion.js';
import { localizedChoice, choiceReviewSnapshot } from '../data/question-choices.js';
import { recordRelease } from './record-release.mjs';

const arg = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const code = arg('code'), reviewer = arg('reviewer'), author = arg('author'), sourceSha256 = arg('source-sha')?.toLowerCase(), edition = arg('edition'), date = arg('date');
assert(/^L2[67]\d$/.test(code ?? '') && author && reviewer && author !== reviewer);
assert(/^[a-f0-9]{64}$/.test(sourceSha256 ?? '') && /^v\d+\.\d+(?:\.\d+)?$/.test(edition ?? '') && /^\d{4}-\d{2}-\d{2}$/.test(date ?? ''));
const draft = (await loadLibraryDrafts()).find(entry => entry.spec.code === code);
assert(draft && draft.sourceSha256 === sourceSha256, 'Source must exactly match the independent review');
checkLibraryFamily(draft, { published: true });
const metadata = { author, reviewer, date, edition, source: draft.source, sourceSha256, result: 'independent-review-passed', status: 'provisional', teacherValidation: 'pending' };
const reviews = draft.readings.map(reading => ({ code: reading.code, language: reading.language, ...metadata, sha256: hash(reading) }));
const alternatives = draft.readings.flatMap(reading => {
  const choices = draft.choices.find(entry => entry.code === reading.code && entry.language === reading.language).questions;
  return reading.questions.flatMap(question => choices[question.id] ? [{ code: reading.code, language: reading.language, questionId: question.id, ...metadata,
    sha256: hash(choiceReviewSnapshot(reading, question, localizedChoice(choices[question.id], question))) }] : []);
});
const publication = { code, edition, family: draft.family, readings: draft.readings, choices: draft.choices };
const publications = [...libraryPublications.filter(entry => entry.code !== code), publication].sort((a, b) => a.code.localeCompare(b.code));
for (const [file, rows] of [['docs/universes/library-expansion-2026-11-26-review.json', reviews], ['docs/question-choices/library-2026-11-26-review.json', alternatives]]) {
  const codes = new Set(draft.readings.map(reading => reading.code));
  const merged = [...JSON.parse(fs.readFileSync(file, 'utf8')).filter(entry => !codes.has(entry.code)), ...rows];
  fs.writeFileSync(file, JSON.stringify(merged, null, 2) + '\n');
}
fs.writeFileSync('data/library-expansion-published.js', '// Complete, independently reviewed and illustrated families. Generated from the authoring sources.\nexport const libraryPublications = ' + JSON.stringify(publications, null, 2) + ';\n');
const published = publications.length, total = 4 + published;
const guideFile = 'docs/universes/biblioteca-de-les-coses.md';
let guide = fs.readFileSync(guideFile, 'utf8');
const section = `<!-- library-expansion:start -->\n## Ampliació del 26 de novembre del 2026\n\nL’univers té **${total} històries independents**. Les ${published} incorporacions d’aquesta tanda són famílies completes en català i castellà: suport de 6è de primària intermig (300–390 paraules, 8 preguntes), referència de 1r d’ESO intermig (440–540 paraules, 10 preguntes) i ampliació de 1r d’ESO avançat (570–680 paraules, 12 preguntes). Les variants comparteixen situació i il·lustracions, però tenen textos, preguntes, solucionari i evidències propis. Les alternatives ABCD s’ofereixen quan són pertinents; l’opinió i la producció personal continuen obertes.\n\n| Família | Història | Variants |\n| --- | --- | --- |\n${publications.map(entry => `| ${entry.code} | ${entry.family.name.ca} | ${entry.family.variantCodes.join(' · ')} |`).join('\n')}\n\nCada història reintrodueix el servei i els personatges que necessita; no hi ha ordre obligatori. La Rosa continua sent la coordinadora adulta; la Noa i l’Adil alternen iniciativa, dubtes i rectificacions. Les veïnes i els usuaris secundaris no estableixen un repartiment visual fix. El local, la finestra verda amb arc i la paleta es mantenen, amb una escena pròpia per història i una segona vista compartida del local.\n\nLa [guia d’autoria](library-expansion-2026-11-26-authoring.md), el [registre de revisió per variant i llengua](library-expansion-2026-11-26-review.json) i els [prompts i originals de les il·lustracions](library-expansion-2026-11-26-images.json) documenten aquesta ampliació. Totes les versions publicades han superat revisió independent i són **provisionals, pendents de validació docent**. Les empremtes dels textos i de les alternatives permeten detectar canvis posteriors que calgui revalidar.\n<!-- library-expansion:end -->`;
guide = guide.includes('<!-- library-expansion:start -->') ? guide.replace(/<!-- library-expansion:start -->[\s\S]*?<!-- library-expansion:end -->/, section) : guide.trimEnd() + '\n\n' + section + '\n';
fs.writeFileSync(guideFile, guide);
recordRelease({ version: edition.slice(1), date,
  ca: `${code}: ${draft.spec.title[1]}. Nova família de La biblioteca de les coses, amb suport de 6è i dues versions de 1r d’ESO, en català i castellà; preguntes textuals i ABCD, solucionari, evidències i dues il·lustracions. L’univers arriba a ${total} històries independents. Contingut provisional, pendent de validació docent.`,
  es: `${code}: ${draft.spec.title[0]}. Nueva familia de La biblioteca de las cosas, con apoyo de 6.º y dos versiones de 1.º de ESO, en catalán y castellano; preguntas textuales y ABCD, solucionario, evidencias y dos ilustraciones. El universo llega a ${total} historias independientes. Contenido provisional, pendiente de validación docente.` });
console.log(JSON.stringify({ code, edition, totalUniverseStories: total, readingReviews: reviews.length, choiceReviews: alternatives.length }));
