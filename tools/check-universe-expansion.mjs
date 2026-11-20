import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readings } from '../data/readings.js';
import { universes } from '../data/universes.js';
import { newUniverseEntries, newUniverseReadings } from '../data/readings-new-universes.js';
import { groupFamilyCards } from '../reading-families.js';
import { labels, labelFor, wordCount } from '../catalog.js';
import { annotationRange } from '../reading-annotations.js';

const expansion = universes.filter(universe => universe.id !== 'biblioteca-de-les-coses');
if (process.argv.includes('--complete')) {
  assert.equal(universes.length, 5);
  assert.equal(newUniverseEntries.length, 20);
  const review = JSON.parse(fs.readFileSync('docs/universes/review-2026-11-20.json', 'utf8'));
  assert.equal(review.readings.length, newUniverseReadings.length);
  for (const reading of newUniverseReadings) {
    const record = review.readings.find(item => item.id === reading.id);
    assert(record && record.result === 'independent-review-passed' && record.teacherValidation === 'pending');
    assert.equal(record.sha256, createHash('sha256').update(JSON.stringify(reading)).digest('hex'), `${reading.id}: editorial changes require independent revalidation`);
  }
}
assert.equal(new Set(readings.map(reading => reading.id)).size, readings.length);
assert.equal(new Set(readings.map(reading => reading.code + ':' + reading.language)).size, readings.length);
for (const universe of expansion) {
  assert(fs.existsSync(`docs/universes/${universe.id}.md`), `${universe.id}: missing continuity guide`);
  assert.equal(labelFor('universe', universe.id, 'es'), universe.name.es);
  assert.equal(newUniverseEntries.filter(entry => entry.universeId === universe.id).length, 5);
  for (const language of ['ca', 'es']) {
    const members = readings.filter(reading => reading.language === language && reading.universeIds?.includes(universe.id));
    assert(members.some(reading => reading.code === universe.seedCode));
    assert.equal(groupFamilyCards(members.map(reading => ({ reading }))).length, 6, `${universe.id}: six autonomous proposals`);
  }
}
for (const reading of newUniverseReadings) {
  assert(reading.title && reading.summary && reading.paragraphs.length >= 4);
  assert(wordCount(reading) >= 160 && wordCount(reading) <= 550);
  assert(reading.themes.length && reading.themes.every(theme => Object.hasOwn(labels.theme, theme)));
  assert(Object.hasOwn(labels.genre, reading.genre));
  assert(Object.hasOwn(labels.level, reading.level) && Object.hasOwn(labels.difficulty, reading.difficulty));
  assert(reading.questions.length >= 7);
  assert(reading.images.length >= 2);
  for (const image of reading.images) {
    assert(fs.existsSync(image.src), image.src);
    assert(image.alt && image.afterParagraph >= 1 && image.afterParagraph <= reading.paragraphs.length);
  }
  assert(fs.existsSync(`docs/universes/prompts/${reading.code.toLowerCase()}.txt`));
  for (const question of reading.questions) {
    assert(Object.hasOwn(labels.question, question.type));
    assert(question.prompt && question.answer && question.lines >= 1 && question.lines <= 8);
    if (question.type !== 'opinion') assert(question.evidence?.length);
    for (const reference of question.evidence ?? []) assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), `${reading.id} ${question.id}: ${reference.text}`);
    if (question.type === 'vocabulary') assert(reading.annotations.some(note => note.questionId === question.id));
  }
  for (const annotation of reading.annotations) assert(annotationRange(reading.paragraphs[annotation.paragraph - 1], annotation));
  const translation = newUniverseReadings.find(other => other.code === reading.code && other.language !== reading.language);
  assert(translation);
  assert.deepEqual(reading.questions.map(question => [question.type, question.lines]), translation.questions.map(question => [question.type, question.lines]));
  assert.equal(reading.paragraphs.length, translation.paragraphs.length);
}
console.log(JSON.stringify({ universes: universes.length, newWorks: newUniverseEntries.length, languageVersions: newUniverseReadings.length, newWorlds: expansion.map(universe => universe.id) }));
