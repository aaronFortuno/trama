import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readings } from '../data/readings.js';
import { questionChoices, choiceCodes, multipleChoice, choiceReviewSnapshot } from '../data/question-choices.js';
import { choiceBatches } from '../data/question-choices-batches.js';
import { questionMode, responseQuestion } from '../question-responses.js';
import { defaultSettings, worksheetLayout, makeLinkCode, readCode } from '../worksheet-code.js';
import { indexCatalog, filterCatalog } from '../catalog.js';
import { annotationRange } from '../reading-annotations.js';

const catalog = indexCatalog(readings);
const baseCodes = search => [...new Set(filterCatalog(catalog, { search, language: 'es' }).map(({ reading }) => reading.code.replace(/[A-Z]$/, '')))].sort();
const firstFive = ['L001', 'L002', 'L003', 'L004', 'L005'];
for (const query of ['-5', '-L005', '-l005', '1-5', 'L001-L005', '1–5']) assert.deepEqual(baseCodes(query), firstFive, query);
assert.deepEqual(baseCodes('3-5'), ['L003', 'L004', 'L005']);
assert.equal(filterCatalog(catalog, { search: '5-1' }).length, 0);
assert.equal(filterCatalog(catalog, { search: '-0' }).length, 0);
assert(filterCatalog(catalog, { search: '5-', language: 'ca' }).every(({ reading }) => Number(reading.code.match(/\d+/)[0]) >= 5));
assert(filterCatalog(catalog, { search: '-5', language: 'ca', level: '5-primary' }).every(({ reading }) => reading.language === 'ca' && reading.level === '5-primary'));
assert.deepEqual([...new Set(filterCatalog(catalog, { search: '-5 aigua', language: 'ca' }).map(({ reading }) => reading.code.replace(/[A-Z]$/, '')))], ['L005']);
assert(filterCatalog(catalog, { search: '-5' }).some(({ reading }) => reading.code === 'L001A'), 'ranges include family variants');

const review = [
  ...JSON.parse(fs.readFileSync('docs/question-choices-review.json', 'utf8')),
  ...choiceBatches.flatMap(batch => JSON.parse(fs.readFileSync(batch.review, 'utf8'))),
  ...JSON.parse(fs.readFileSync('docs/question-choices/library-2026-11-26-review.json', 'utf8')),
];
const approved = new Map(review.map(entry => [`${entry.code}:${entry.language}:${entry.questionId}`, entry]));
assert.deepEqual(Object.keys(questionChoices), firstFive);
assert.equal(approved.size, review.length, 'review records must be unique');
assert.equal(new Set(choiceBatches.map(batch => batch.id)).size, choiceBatches.length);
for (const batch of choiceBatches) {
  assert(/^\d{3}$/.test(batch.id));
  assert(/^v\d+\.\d+(?:\.\d+)?$/.test(batch.edition));
  const keys = new Set();
  const codes = [...new Set(batch.readings.map(entry => entry.code))];
  const start = (Number(batch.id) - 1) * 5 + 1;
  const expectedCodes = batch.codes;
  assert(Array.isArray(expectedCodes) && expectedCodes.length && new Set(expectedCodes).size === expectedCodes.length);
  assert(expectedCodes.every(code => Number(code.match(/\d+/)[0]) >= start && Number(code.match(/\d+/)[0]) < start + 5));
  assert.deepEqual([...codes].sort(), expectedCodes, `${batch.id}: incomplete sequential batch`);
  for (const record of JSON.parse(fs.readFileSync(batch.review, 'utf8'))) {
    assert(record.author && record.reviewer && record.author !== record.reviewer, 'author and reviewer must differ');
    assert.equal(record.edition, batch.edition);
    assert.equal(record.status, 'provisional');
    assert.equal(record.teacherValidation, 'pending');
  }
  for (const entry of batch.readings) {
    const key = `${entry.code}:${entry.language}`;
    assert(!keys.has(key)); keys.add(key);
    const reading = readings.find(reading => reading.code === entry.code && reading.language === entry.language);
    assert(reading, `${key}: unknown reading`);
    assert(Object.keys(entry.questions).length, `${key}: empty batch entry`);
    for (const id of Object.keys(entry.questions)) assert(reading.questions.some(question => question.id === id), `${key}: unknown question ${id}`);
  }
  for (const code of codes) for (const locale of ['es', 'ca']) assert(keys.has(`${code}:${locale}`), `${code}: incomplete language pair`);
}
let checked = 0;
for (const reading of readings) {
  const settings = defaultSettings(reading.level);
  assert.equal(settings.questionMode, 'open');
  const available = reading.questions.filter(question => multipleChoice(reading, question));
  if (firstFive.includes(reading.code)) assert.equal(available.length, 4);
  else assert.equal(available.length > 0, choiceCodes.includes(reading.code), `${reading.code}-${reading.language}`);
  for (const question of available) {
    const key = `${reading.code}:${reading.language}:${question.id}`;
    const choice = multipleChoice(reading, question);
    assert.notEqual(question.type, 'opinion');
    assert(choice.prompt && choice.explanation);
    assert.deepEqual(choice.options.map(option => option.id), ['a', 'b', 'c', 'd']);
    assert.equal(new Set(choice.options.map(option => option.text)).size, 4);
    assert.equal(choice.options.filter(option => option.id === choice.correct).length, 1);
    const record = approved.get(key);
    assert(record, `${key}: independent review required`);
    assert.equal(record.result, 'independent-review-passed', key);
    assert.equal(record.sha256, createHash('sha256').update(JSON.stringify(choiceReviewSnapshot(reading, question))).digest('hex'), key);
    const open = responseQuestion(reading, question, settings);
    assert.equal(open.prompt, question.prompt);
    settings.questionLines[question.id] = 5;
    settings.questionMode = 'choice';
    const closed = responseQuestion(reading, question, settings);
    assert.equal(closed.prompt, choice.prompt);
    assert(closed.answer.startsWith(choice.correct.toUpperCase() + '. '));
    for (const reference of closed.evidence ?? []) assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), key);
    settings.questionModes[question.id] = 'open';
    const sanitized = worksheetLayout(reading, { ...settings, questionModes: { ...settings.questionModes, bogus: 'choice' } });
    assert.equal(questionMode(reading, question, sanitized), 'open');
    assert.equal(responseQuestion(reading, question, sanitized).prompt, question.prompt);
    assert.equal(sanitized.questionLines[question.id], 5);
    assert(!Object.hasOwn(sanitized.questionModes, 'bogus'));
    const decoded = readCode(makeLinkCode(reading, sanitized), readings);
    assert.equal(decoded.settings.questionMode, 'choice');
    assert.equal(decoded.settings.questionModes[question.id], 'open');
    settings.questionMode = 'open';
    checked++;
  }
  settings.questionMode = 'choice';
  for (const question of reading.questions.filter(question => !multipleChoice(reading, question))) {
    assert.equal(questionMode(reading, question, settings), 'open', 'unsupported questions remain open');
  }
}
assert.equal(checked, approved.size, 'all records must match an active alternative');
const coverage = JSON.parse(fs.readFileSync('docs/question-choices-coverage.json', 'utf8'));
assert.equal(coverage.totalWorks, new Set(readings.map(reading => reading.code)).size);
assert.equal(coverage.coveredWorks, choiceCodes.length);
assert.equal(coverage.localizedAlternatives, checked);
for (const work of coverage.works) for (const [locale, status] of Object.entries(work.languages)) {
  const reading = readings.find(reading => reading.code === work.code && reading.language === locale);
  const expected = reading.questions.flatMap((question, index) => multipleChoice(reading, question) ? [{ id: question.id, number: index + 1 }] : []);
  assert.deepEqual(status.questions, expected, `${work.code}-${locale}: stale coverage`);
}
console.log(JSON.stringify({ reviewedAlternatives: checked, readings: choiceCodes.length, batches: choiceBatches.length, languages: 2, ranges: 'ok', layoutsAndCodes: 'ok' }));
