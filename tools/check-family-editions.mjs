import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readings } from '../data/readings.js';
import { familyAdaptations } from '../data/family-adaptations.js';
import { familyEditionPlan } from '../data/family-edition-plan.js';
import { labels, wordCount } from '../catalog.js';

const rank = reading => ['3-primary', '4-primary', '5-primary', '6-primary', '1-secondary'].indexOf(reading.level) * 3 + ['initial', 'intermediate', 'advanced'].indexOf(reading.difficulty);
const sources = [...new Set(familyAdaptations.map(edition => edition.source))];
assert.equal(new Set(readings.map(reading => reading.id)).size, readings.length);
for (const source of sources) {
  const plan = familyEditionPlan.find(family => family.code === source);
  assert(plan, `Unknown source ${source}`);
  const editions = familyAdaptations.filter(edition => edition.source === source);
  assert.deepEqual(editions.map(edition => edition.suffix).sort(), ['A', 'B']);
  for (const language of ['es', 'ca']) {
    const members = plan.variantCodes.map(code => readings.find(reading => reading.code === code && reading.language === language));
    assert(members.every(Boolean));
    assert(rank(members[0]) < rank(members[1]) && rank(members[1]) < rank(members[2]), `${source}: demand must increase`);
    assert(wordCount(members[0]) < wordCount(members[1]) && wordCount(members[1]) < wordCount(members[2]), `${source}-${language}: length must increase`);
    assert(members[0].questions.length < members[2].questions.length);
    for (const reading of [members[0], members[2]]) {
      assert.equal(reading.familyId, plan.id);
      assert.equal(reading.title, members[1].title);
      assert(reading.summary && reading.paragraphs.length >= 3);
      assert(reading.questions.length >= 6);
      assert(reading.themes.length && reading.themes.every(theme => Object.hasOwn(labels.theme, theme)));
      assert(Object.hasOwn(labels.genre, reading.genre));
      for (const image of reading.images) {
        assert(fs.existsSync(image.src));
        assert(image.alt && image.afterParagraph >= 1 && image.afterParagraph <= reading.paragraphs.length);
      }
      if (wordCount(reading) > 350) assert(reading.images.length >= 2);
      assert.equal(new Set(reading.questions.map(question => question.id)).size, reading.questions.length);
      for (const question of reading.questions) {
        assert(question.prompt && question.answer && question.lines >= 1 && question.lines <= 8);
        assert(Object.hasOwn(labels.question, question.type));
        if (question.type !== 'opinion') assert(question.evidence?.length, `${reading.code}: answer needs evidence`);
        for (const reference of question.evidence ?? []) assert(reading.paragraphs[reference.paragraph - 1]?.includes(reference.text), `${reading.code}-${language} ${question.id}: ${reference.text}`);
        if (question.type === 'vocabulary') assert(reading.annotations.some(annotation => annotation.questionId === question.id), `${reading.code}-${language}: vocabulary underline`);
      }
    }
  }
  const versions = ['A', 'B'].map(suffix => ['es', 'ca'].map(language => readings.find(reading => reading.code === source + suffix && reading.language === language)));
  for (const [es, ca] of versions) {
    assert.deepEqual(es.questions.map(question => [question.type, question.lines]), ca.questions.map(question => [question.type, question.lines]));
    const ratio = wordCount(ca) / wordCount(es);
    assert(ratio > .75 && ratio < 1.35, `${source}: translation length mismatch`);
  }
}
console.log(JSON.stringify({ newFamilies: sources.length, newWorks: familyAdaptations.length, languageVersions: familyAdaptations.length * 2, sources }));
