import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readings } from '../data/readings.js';
import { questionChoices, multipleChoice, choiceReviewSnapshot } from '../data/question-choices.js';
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

const review = JSON.parse(fs.readFileSync('docs/question-choices-review.json', 'utf8'));
const approved = new Map(review.map(entry => [`${entry.code}:${entry.language}:${entry.questionId}`, entry]));
assert.deepEqual(Object.keys(questionChoices), firstFive);
assert.equal(approved.size, 40);
let checked = 0;
for (const reading of readings) {
  const settings = defaultSettings(reading.level);
  assert.equal(settings.questionMode, 'open');
  const available = reading.questions.filter(question => multipleChoice(reading, question));
  assert.equal(available.length, firstFive.includes(reading.code) ? 4 : 0, `${reading.code}-${reading.language}`);
  for (const question of available) {
    const key = `${reading.code}:${reading.language}:${question.id}`;
    const choice = multipleChoice(reading, question);
    assert.notEqual(question.type, 'opinion');
    assert(choice.prompt && choice.explanation);
    assert.deepEqual(choice.options.map(option => option.id), ['a', 'b', 'c', 'd']);
    assert.equal(new Set(choice.options.map(option => option.text)).size, 4);
    assert.equal(choice.options.filter(option => option.id === choice.correct).length, 1);
    const record = approved.get(key);
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
assert.equal(checked, 40);
console.log(JSON.stringify({ reviewedAlternatives: checked, readings: 5, languages: 2, ranges: 'ok', layoutsAndCodes: 'ok' }));
