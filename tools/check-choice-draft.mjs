import assert from 'node:assert/strict';
import { readings } from '../data/readings.js';
import { localizedChoice } from '../data/question-choices.js';
import { annotationRange } from '../reading-annotations.js';

const id = process.argv.find(arg => arg.startsWith('--batch='))?.slice(8);
assert(/^\d{3}$/.test(id ?? ''), 'Use --batch=001');
const entries = (await import(`../data/question-choices/batch-${id}.js`))[`choiceBatch${id}`];
const keys = new Set();
let questions = 0;
for (const entry of entries) {
  const key = `${entry.code}:${entry.language}`;
  assert(!keys.has(key), `${key}: duplicate`); keys.add(key);
  const reading = readings.find(reading => reading.code === entry.code && reading.language === entry.language);
  assert(reading, `${key}: unknown reading`);
  assert(Object.keys(entry.questions).length > 0, `${key}: no alternatives`);
  for (const [questionId, raw] of Object.entries(entry.questions)) {
    const question = reading.questions.find(question => question.id === questionId);
    assert(question, `${key}: unknown question ${questionId}`);
    assert.notEqual(question.type, 'opinion', `${key}:${questionId}: keep opinion open`);
    assert(raw.prompt && raw.explanation, `${key}:${questionId}: prompt and explanation required`);
    assert.equal(raw.options.length, 4);
    assert(raw.options.every(text => typeof text === 'string' && text.trim()));
    assert.equal(new Set(raw.options.map(text => text.trim())).size, 4);
    assert(['a', 'b', 'c', 'd'].includes(raw.correct));
    const choice = localizedChoice(raw, question);
    const evidence = choice.evidence ?? question.evidence;
    assert(evidence?.length, `${key}:${questionId}: evidence required`);
    for (const reference of evidence) assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), `${key}:${questionId}: ${reference.text}`);
    questions++;
  }
}
const codes = [...new Set(entries.map(entry => entry.code))];
for (const code of codes) for (const locale of ['es', 'ca']) assert(keys.has(`${code}:${locale}`), `${code}: missing ${locale}`);
console.log(JSON.stringify({ batch: id, works: codes.length, languageVersions: entries.length, alternatives: questions, codes, editorialReview: 'required separately' }));
