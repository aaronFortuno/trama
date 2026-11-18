import assert from 'node:assert/strict';
import { annotationRange } from '../reading-annotations.js';
import { evidenceColors, passageSegments, prepareAnswerEvidence } from '../answer-evidence.js';
import { defaultSettings, makeLinkCode, readCode, worksheetLayout } from '../worksheet-code.js';
import { readings } from '../data/readings.js';
import { importReading } from '../reading-files.js';

const paragraph = 'Una clau antiga obre la porta.';
const fixture = { paragraphs: [paragraph], questions: [
  { id: 'first', evidence: [{ paragraph: 1, text: 'clau antiga' }] },
  { id: 'second', evidence: [{ paragraph: 1, text: 'antiga obre' }] },
  { id: 'opinion' },
] };
const prepared = prepareAnswerEvidence(fixture, fixture.questions);
const annotations = [{ ...annotationRange(paragraph, { text: 'antiga' }), questionId: 'word' },
  { ...annotationRange(paragraph, { text: 'porta' }), definition: 'entrada', number: 1 }];
const options = { marks: annotations, evidence: prepared.ranges.get(0) };
const segments = passageSegments(paragraph, options);
assert.equal(segments.map(part => part.text).join(''), paragraph);
assert(segments.some(part => part.evidence.length === 2 && part.underlined));
assert.deepEqual(segments.flatMap(part => part.labels.map(item => item.number)), [1, 2]);
assert.equal(segments.flatMap(part => part.notes).length, 1);
const left = passageSegments(paragraph.slice(0, 12), options);
const right = passageSegments(paragraph.slice(12), { ...options, offset: 12 });
assert.equal([...left, ...right].map(part => part.text).join(''), paragraph);
assert(left.flatMap(part => part.labels).length > 0, 'page fragments retain a visible question label');
assert.equal(right.flatMap(part => part.notes).length, 1);
assert.equal(prepareAnswerEvidence(fixture, fixture.questions.slice(1)).byQuestion.get('second').number, 1);
assert.equal(new Set(evidenceColors).size, evidenceColors.length);
const portable = { title: 'Prova', language: 'ca', paragraphs: [paragraph], questions: [{ id: 'prova-q1', prompt: 'Què obre?', answer: 'La clau.', lines: 1, evidence: [{ paragraph: 1, text: 'clau antiga' }] }] };
const imported = await importReading(new File([JSON.stringify(portable)], 'prova.json'));
assert.deepEqual(imported.questions[0].evidence, portable.questions[0].evidence);
await assert.rejects(importReading(new File([JSON.stringify({ ...portable, questions: [{ ...portable.questions[0], evidence: [{ paragraph: 1, text: 'inexistent' }] }] })], 'error.json')));

let count = 0;
let references = 0;
for (const reading of readings) {
  const settings = { ...defaultSettings(reading.level), showEvidence: false };
  assert.equal(worksheetLayout(reading, settings).showEvidence, false);
  assert.equal(readCode(makeLinkCode(reading, settings), readings).settings.showEvidence, false);
  const linked = prepareAnswerEvidence(reading, reading.questions);
  assert(linked.byQuestion.size > 0, `${reading.code}-${reading.language}: catalogue reading needs reviewed evidence`);
  if (linked.byQuestion.size) count++;
  for (const question of reading.questions) for (const reference of question.evidence ?? []) {
    assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), `${reading.code}-${reading.language}: ${question.id}`);
    assert(reference.text.length <= 1200);
    references++;
  }
}
assert.equal(count, readings.length, 'all catalogue language versions have reviewed evidence');
console.log(`Evidence rendering and settings checked; ${count}/${readings.length} readings have ${references} exact references.`);
