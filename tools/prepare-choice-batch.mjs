// Prepare a reviewed batch locally. This tool neither commits nor contacts GitHub.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readings } from '../data/readings.js';
import { choiceBatches } from '../data/question-choices-batches.js';
import { localizedChoice, choiceReviewSnapshot } from '../data/question-choices.js';

const option = name => process.argv.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const id = option('batch');
assert(/^\d{3}$/.test(id ?? ''), 'Use --batch=006');
const n = Number(id);
const lastCode = Math.max(...readings.map(reading => Number(reading.code.match(/\d+/)[0])));
assert(n >= 1 && n <= Math.ceil(lastCode / 5));
const entries = (await import(`../data/question-choices/batch-${id}.js`))[`choiceBatch${id}`];
const reviewPath = `docs/question-choices/batch-${id}-review.json`;
const records = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
assert(records.length > 0);
const edition = records[0].edition;
assert(/^v\d+\.\d+(?:\.\d+)?$/.test(edition));
const date = option('date') ?? records[0].date;
assert(/^\d{4}-\d{2}-\d{2}$/.test(date));
assert(choiceBatches.length === n - 1 || choiceBatches.length === n, 'Register complete batches in order');
const approved = new Map(records.map(record => [`${record.code}:${record.language}:${record.questionId}`, record]));
assert.equal(approved.size, records.length);
let total = 0;
for (const entry of entries) {
  const reading = readings.find(reading => reading.code === entry.code && reading.language === entry.language);
  assert(reading);
  for (const [id, raw] of Object.entries(entry.questions)) {
    const question = reading.questions.find(question => question.id === id);
    assert(question);
    const record = approved.get(`${entry.code}:${entry.language}:${id}`);
    assert(record && record.author && record.reviewer && record.author !== record.reviewer);
    assert.equal(record.result, 'independent-review-passed');
    assert.equal(record.status, 'provisional');
    assert.equal(record.teacherValidation, 'pending');
    assert.equal(record.edition, edition);
    assert.equal(record.sha256, createHash('sha256').update(JSON.stringify(choiceReviewSnapshot(reading, question, localizedChoice(raw, question)))).digest('hex'));
    total++;
  }
}
assert.equal(total, records.length);
const codes = [...new Set(entries.map(entry => entry.code))].sort();
const start = (n - 1) * 5 + 1;
const expected = choiceBatches.find(batch => batch.id === id)?.codes ?? [...new Set(readings.filter(reading => {
  const value = Number(reading.code.match(/\d+/)[0]);
  return value >= start && value < start + 5 && !['L001', 'L002', 'L003', 'L004', 'L005'].includes(reading.code);
}).map(reading => reading.code))].sort();
assert.deepEqual(codes, expected, 'Incomplete batch inventory');
for (const code of codes) for (const language of ['ca', 'es']) assert(entries.some(entry => entry.code === code && entry.language === language));
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({ batch: id, edition, works: codes.length, alternatives: total, review: 'verified', writes: false }));
} else {
  let html = fs.readFileSync('index.html', 'utf8');
  const current = /id="changelog-open"[^>]*aria-label="(v[\d.]+) · Obre l’historial de canvis"/.exec(html)?.[1];
  assert(current, 'Cannot locate current release');
  if (current !== edition) {
    const newer = edition.slice(1).split('.').map(Number);
    const older = current.slice(1).split('.').map(Number);
    const firstDifference = [0, 1, 2].map(index => (newer[index] ?? 0) - (older[index] ?? 0)).find(value => value !== 0);
    assert(firstDifference > 0, 'Choose an edition newer than the current release');
    assert(!html.includes(`<h3>${edition}</h3>`), 'Release is already in history; keep the newer release intact');
  }
  const registered = [...choiceBatches.filter(batch => Number(batch.id) < n), { id, edition, codes, review: reviewPath, readings: entries }];
  const imports = registered.map(batch => `import { choiceBatch${batch.id} } from './question-choices/batch-${batch.id}.js';`);
  const items = registered.map(({ readings, ...batch }) => `  { ...${JSON.stringify(batch)}, readings: choiceBatch${batch.id} },`);
  fs.writeFileSync('data/question-choices-batches.js', imports.join('\n') + '\n\n// Only independently reviewed, complete batches are registered here.\nexport const choiceBatches = [\n' + items.join('\n') + '\n];\n');
  const coverage = JSON.parse(execFileSync(process.execPath, ['tools/build-choice-coverage.mjs', '--date=' + date], { encoding: 'utf8' }).trim());
  const range = `L${String(start).padStart(3, '0')}–L${String(Math.min(start + 4, lastCode)).padStart(3, '0')}`;
  const ca = `El lot ${id} incorpora alternatives ABCD a ${codes.length} fitxes del rang ${range}, incloses les variants existents, en català i castellà. ${total} alternatives lingüístiques noves amb revisió independent superada. La cobertura arriba a ${coverage.covered} de ${coverage.total} fitxes concretes; les opinions i activitats de producció es mantenen obertes.`;
  const es = `El lote ${id} incorpora alternativas ABCD a ${codes.length} fichas del rango ${range}, incluidas las variantes existentes, en catalán y castellano. ${total} alternativas lingüísticas nuevas con revisión independiente superada. La cobertura alcanza ${coverage.covered} de ${coverage.total} fichas concretas; las opiniones y actividades de producción se mantienen abiertas.`;
  if (current !== edition) {
    html = html.replace(`aria-label="${current} · Obre l’historial de canvis">${current}</button>`, `aria-label="${edition} · Obre l’historial de canvis">${edition}</button>`);
    const marker = '<div class="dialog-scroll" tabindex="0" role="region" aria-labelledby="changelog-title">';
    assert(html.includes(marker));
    const dateText = new Intl.DateTimeFormat('ca', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
    html = html.replace(marker, marker + `\n      <article class="release">\n        <header><h3>${edition}</h3><time datetime="${date}">${dateText}</time></header>\n        <p>${ca}</p>\n      </article>`);
    fs.writeFileSync('index.html', html);
    fs.writeFileSync('CHANGELOG.md', fs.readFileSync('CHANGELOG.md', 'utf8').replace(/^# Historial de Trama\r?\n/, `# Historial de Trama\n\n## ${edition.slice(1)} · ${dateText}\n\n${ca}\n`));
    const prefix = 'export const es = Object.fromEntries(' + String.fromCharCode(96);
    const dictionary = fs.readFileSync('locales/es.js', 'utf8');
    assert(dictionary.startsWith(prefix));
    fs.writeFileSync('locales/es.js', dictionary.replace(prefix, prefix + `\n${edition} · Obre l’historial de canvis|${edition} · Abrir el historial de cambios\n${ca}|${es}`));
  }
  console.log(JSON.stringify({ batch: id, edition, ...coverage, alternatives: total, next: 'Run local checks, then commit and push explicitly.' }));
}
