import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {readings} from '../data/readings.js';
import {families} from '../data/families.js';
import {wordCount, labels} from '../catalog.js';
import {annotationRange} from '../reading-annotations.js';

const batch = process.argv.find(argument => argument.startsWith('--batch='))?.slice(8) ?? '2026-11-22';
assert(['2026-11-22', '2026-11-23'].includes(batch), 'Unknown editorial batch');
const suffix = batch === '2026-11-22' ? '' : `-${batch}`;
const {familyExpansionAdaptations} = await import(`../data/family-expansion${suffix}-adaptations.js`);
const {familyExpansionPlan} = await import(`../data/family-expansion${suffix}-plan.js`);
const review = JSON.parse(fs.readFileSync(`docs/family-expansion${suffix}-review.json`, 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const years = ['2-primary', '3-primary', '4-primary', '5-primary', '6-primary', '1-secondary'];
const sources = [...new Set(familyExpansionAdaptations.map(edition => edition.source))];
if (process.argv.includes('--complete')) assert.equal(sources.length, familyExpansionPlan.length);
assert.equal(new Set(readings.map(reading => reading.id)).size, readings.length);
for (const original of review.originals) {
  const reading = readings.find(reading => reading.id === original.id);
  const {familyId, ...preserved} = reading;
  assert.equal(hash(preserved), original.sha256, `${original.id}: original changed`);
}
for (const source of sources) {
  const family = families.find(family => family.code === source);
  assert(family && familyExpansionPlan.some(family => family.code === source));
  assert.deepEqual(family.variantCodes, [source + 'A', source, source + 'B']);
  for (const language of ['es', 'ca']) {
    const [support, original, extension] = family.variantCodes.map(code => readings.find(reading => reading.code === code && reading.language === language));
    assert(support && original && extension);
    assert(years.indexOf(support.level) < years.indexOf(original.level) && years.indexOf(original.level) < years.indexOf(extension.level));
    assert(wordCount(support) < wordCount(original) && wordCount(original) < wordCount(extension), `${source}-${language}: length must increase`);
    assert(support.questions.length < extension.questions.length);
    for (const reading of [support, extension]) {
      assert.equal(reading.familyId, family.id);
      assert.equal(reading.title, original.title);
      assert.deepEqual(reading.images.map(image => image.src), original.images.map(image => image.src));
      assert(reading.themes.length && reading.themes.every(theme => Object.hasOwn(labels.theme, theme)));
      assert(Object.hasOwn(labels.genre, reading.genre));
      assert(reading.paragraphs.length >= 3 && reading.summary);
      for (const image of reading.images) assert(fs.existsSync(image.src) && image.alt && image.afterParagraph >= 1 && image.afterParagraph <= reading.paragraphs.length);
      if (wordCount(reading) > 350) assert(reading.images.length >= 2);
      if (reading.level === '2-primary') {
        assert(wordCount(reading) >= 40 && wordCount(reading) <= 80);
        assert.equal(reading.questions.length, 4);
        assert(reading.questions.every(question => question.type === 'literal' && question.lines === 1));
        assert(reading.paragraphs.every(text => wordCount({paragraphs:[text]}) <= 30));
      } else assert(reading.questions.length >= (reading.level === '3-primary' ? 5 : 6));
      for (const question of reading.questions) {
        assert(question.prompt && question.answer && question.lines >= 1 && question.lines <= 8);
        assert(Object.hasOwn(labels.question, question.type));
        if (question.type !== 'opinion') assert(question.evidence?.length);
        for (const reference of question.evidence ?? []) assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), `${reading.code}-${language}: ${reference.text}`);
        if (question.type === 'vocabulary') assert(reading.annotations.some(annotation => annotation.questionId === question.id));
      }
      const record = review.readings.find(record => record.id === reading.id);
      assert(record && record.result === 'independent-review-passed', `${reading.id}: review required`);
      assert.equal(record.sha256, hash(reading), `${reading.id}: changed since review`);
      const other = readings.find(other => other.code === reading.code && other.language !== reading.language);
      assert.deepEqual(reading.questions.map(question => [question.type, question.lines]), other.questions.map(question => [question.type, question.lines]));
      assert(wordCount(other) / wordCount(reading) > .75 && wordCount(other) / wordCount(reading) < 1.35);
    }
  }
}
console.log(JSON.stringify({families:sources.length, works:sources.length * 2, languageVersions:sources.length * 4, sources}));
