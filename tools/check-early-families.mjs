import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readings } from '../data/readings.js';
import { earlyFamilyAdaptations } from '../data/early-family-adaptations.js';
import { earlyFamilyPlan } from '../data/early-family-plan.js';
import { families } from '../data/families.js';
import { wordCount, indexCatalog, filterCatalog } from '../catalog.js';
import { annotationRange } from '../reading-annotations.js';
import { defaultSettings, validSetting } from '../worksheet-code.js';

const sources = [...new Set(earlyFamilyAdaptations.map(edition => edition.source))];
if (process.argv.includes('--complete')) assert.equal(sources.length, earlyFamilyPlan.length);
assert.equal(new Set(readings.map(reading => reading.id)).size, readings.length);
const reviewPath = 'docs/early-families-review.json';
const review = fs.existsSync(reviewPath) ? JSON.parse(fs.readFileSync(reviewPath, 'utf8')) : { readings: [] };
const versions = [];
for (const source of sources) {
  const family = families.find(item => item.code === source);
  assert(family && earlyFamilyPlan.some(item => item.code === source));
  assert.deepEqual(family.variantCodes, [source + 'A', source, source + 'B']);
  assert.deepEqual(earlyFamilyAdaptations.filter(item => item.source === source).map(item => item.suffix).sort(), ['A', 'B']);
  for (const language of ['es', 'ca']) {
    const [support, original, extension] = family.variantCodes.map(code => readings.find(reading => reading.code === code && reading.language === language));
    assert(support && original && extension);
    assert.deepEqual([support.level, original.level, extension.level], ['2-primary', '3-primary', '4-primary']);
    assert(wordCount(support) >= 40 && wordCount(support) <= 80, `${support.code}-${language}: short support text`);
    assert(wordCount(support) < wordCount(original) && wordCount(original) < wordCount(extension));
    assert.equal(support.questions.length, 4);
    assert(support.questions.every(question => question.type === 'literal' && question.lines === 1));
    assert(support.paragraphs.length >= 3 && support.paragraphs.length <= 5);
    assert(support.paragraphs.every(text => wordCount({ paragraphs: [text] }) <= 30), `${support.code}-${language}: short paragraphs`);
    assert(extension.questions.length >= 7 && wordCount(extension) >= 150 && wordCount(extension) <= 260);
    for (const reading of [support, extension]) {
      assert.equal(reading.title, original.title);
      assert.equal(reading.familyId, family.id);
      assert.deepEqual(reading.images.map(image => image.src), original.images.map(image => image.src));
      for (const image of reading.images) assert(fs.existsSync(image.src) && image.afterParagraph >= 1 && image.afterParagraph <= reading.paragraphs.length);
      for (const question of reading.questions) {
        assert(question.prompt && question.answer && question.lines >= 1 && question.lines <= 8);
        if (question.type !== 'opinion') assert(question.evidence?.length);
        for (const reference of question.evidence ?? []) assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), `${reading.code}-${language}: ${reference.text}`);
      }
      const record = review.readings.find(item => item.id === reading.id);
      assert(record && record.result === 'independent-review-passed', `${reading.id}: review required`);
      assert.equal(record.sha256, createHash('sha256').update(JSON.stringify(reading)).digest('hex'), `${reading.id}: changed since review`);
      versions.push(reading);
    }
  }
}
for (const reading of versions) {
  const other = versions.find(item => item.code === reading.code && item.language !== reading.language);
  assert.deepEqual(reading.questions.map(item => [item.type, item.lines]), other.questions.map(item => [item.type, item.lines]));
}
const type2 = defaultSettings('2-primary'), type3 = defaultSettings('3-primary');
assert(type2.fontSize > type3.fontSize && type2.leading >= type3.leading);
assert(Object.entries(type2).filter(([key]) => !['excluded', 'questionLines', 'images'].includes(key)).every(([key, value]) => validSetting(key, value)));
const indexed = indexCatalog(versions);
assert(filterCatalog(indexed, { level: '2-primary' }).every(item => item.facets.length[0] !== 'unspecified'));
console.log(JSON.stringify({ families: sources.length, works: sources.length * 2, languageVersions: versions.length, sources }));
