import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { compileLibraryFamily } from '../data/library-expansion-model.js';
import { libraryPublications } from '../data/library-expansion.js';
import { labels, wordCount } from '../catalog.js';
import { annotationRange } from '../reading-annotations.js';

export const librarySourceFiles = ['269-272', '273-276', '277-279'].map(range => `data/library-2026-11-26-${range}.js`);
export const hash = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
export async function loadLibraryDrafts() {
  const rows = [];
  for (const source of librarySourceFiles) {
    const { libraryDraftFamilies } = await import(new URL('../' + source, import.meta.url));
    rows.push(...libraryDraftFamilies.map(spec => ({ source, sourceSha256: hash(fs.readFileSync(source, 'utf8')), spec, ...compileLibraryFamily(spec) })));
  }
  return rows;
}

export function checkLibraryFamily(entry, { published = false } = {}) {
  assert(/^L2[67]\d$/.test(entry.spec?.code ?? entry.code));
  assert.equal(entry.readings.length, 6);
  const code = entry.spec?.code ?? entry.code;
  assert.deepEqual(entry.family.variantCodes, [code + 'A', code, code + 'B']);
  const choiceByReading = new Map(entry.choices.map(row => [`${row.code}:${row.language}`, row.questions]));
  const counts = [];
  for (const reading of entry.readings) {
    assert.equal(reading.familyId, entry.family.id);
    assert.deepEqual(reading.universeIds, ['biblioteca-de-les-coses']);
    assert(reading.title && reading.summary && reading.workId && reading.id);
    assert(reading.themes.length && reading.themes.every(theme => Object.hasOwn(labels.theme, theme)));
    assert(Object.hasOwn(labels.genre, reading.genre));
    const variant = reading.code === code + 'A' ? 0 : reading.code === code ? 1 : 2;
    const [min, max, questions, level, difficulty] = [[300,390,8,'6-primary','intermediate'],[440,540,10,'1-secondary','intermediate'],[570,680,12,'1-secondary','advanced']][variant];
    const words = wordCount(reading);
    assert(words >= min && words <= max, `${reading.code}/${reading.language}: ${words} outside ${min}–${max}`);
    assert.equal(reading.questions.length, questions);
    assert.equal(reading.level, level); assert.equal(reading.difficulty, difficulty);
    assert.equal(new Set(reading.questions.map(question => question.id)).size, questions);
    const alternatives = choiceByReading.get(`${reading.code}:${reading.language}`);
    assert(alternatives && Object.keys(alternatives).length >= questions - 3);
    for (const question of reading.questions) {
      const key = `${reading.code}/${reading.language}/${question.id}`;
      assert(question.prompt && question.answer && question.lines >= 1 && question.lines <= 8, key);
      assert(Object.hasOwn(labels.question, question.type), key);
      if (question.type !== 'opinion') assert(question.evidence?.length, key + ': missing evidence');
      for (const reference of question.evidence ?? []) assert(annotationRange(reading.paragraphs[reference.paragraph - 1], reference), key + ': nonliteral evidence ' + reference.text);
      if (question.type === 'vocabulary') assert(reading.annotations.some(mark => mark.questionId === question.id), key + ': missing vocabulary underline');
      const alternative = alternatives[question.id];
      if (alternative) {
        assert.notEqual(question.type, 'opinion', key);
        assert.equal(alternative.options.length, 4, key);
        assert.equal(new Set(alternative.options).size, 4, key);
        assert(alternative.options.every(option => typeof option === 'string' && option.trim()), key);
        assert(/^[abcd]$/.test(alternative.correct) && alternative.prompt && alternative.explanation, key);
      }
    }
    for (const mark of reading.annotations) assert(annotationRange(reading.paragraphs[mark.paragraph - 1], mark), `${reading.code}: invalid annotation`);
    assert.equal(reading.images.length, 2);
    assert.equal(new Set(reading.images.map(image => image.src)).size, 2);
    for (const image of reading.images) {
      assert(image.alt && image.afterParagraph >= 1 && image.afterParagraph <= reading.paragraphs.length);
      if (published) {
        assert(fs.existsSync(image.src), image.src);
        const bytes = fs.readFileSync(image.src);
        assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', image.src);
        assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', image.src);
      }
    }
    counts.push({ code: reading.code, language: reading.language, words, questions, choices: Object.keys(alternatives).length });
  }
  return counts;
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-library-expansion.mjs')) {
  const drafts = await loadLibraryDrafts();
  assert.equal(drafts.length, 11);
  drafts.forEach(entry => checkLibraryFamily(entry));
  const reviews = new Map(JSON.parse(fs.readFileSync('docs/universes/library-expansion-2026-11-26-review.json', 'utf8')).map(row => [`${row.code}:${row.language}`, row]));
  for (const entry of libraryPublications) {
    checkLibraryFamily(entry, { published: true });
    const source = drafts.find(draft => draft.spec.code === entry.code);
    assert(source);
    assert.deepEqual(entry.readings, source.readings, `${entry.code}: published data differs from source`);
    assert.deepEqual(entry.choices, source.choices, `${entry.code}: published choices differ from source`);
    for (const reading of entry.readings) {
      const review = reviews.get(`${reading.code}:${reading.language}`);
      assert(review && review.author !== review.reviewer);
      assert.equal(review.result, 'independent-review-passed');
      assert.equal(review.status, 'provisional');
      assert.equal(review.teacherValidation, 'pending');
      assert.equal(review.sha256, hash(reading), `${reading.code}: stale review`);
    }
  }
  if (process.argv.includes('--complete')) assert.equal(libraryPublications.length, 11);
  console.log(JSON.stringify({ draftedFamilies: drafts.length, publishedFamilies: libraryPublications.length, publishedLanguageEditions: libraryPublications.length * 6 }));
}
