import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hash, checkLibraryFamily } from './check-library-expansion.mjs';
import { compileObservatoryFamily } from '../data/observatory-expansion-model.js';
import { observatoryPublications } from '../data/observatory-expansion.js';
export { hash };
const profile = { codes: /^L(?:289|29[0-7])$/, universe: 'observatori-del-turo',
  ranges: [[140,190,6,'3-primary','intermediate'],[220,280,8,'4-primary','intermediate'],[310,390,10,'5-primary','intermediate']] };
export const checkObservatoryFamily = (entry, options = {}) => checkLibraryFamily(entry, { ...options, profile });
export async function loadObservatoryDrafts() {
  const rows = [];
  for (const range of ['289-291', '292-294', '295-297']) {
    const source = `data/observatory-2026-11-26-${range}.js`;
    if (!fs.existsSync(source)) continue;
    const { observatoryDraftFamilies } = await import(new URL('../' + source, import.meta.url));
    rows.push(...observatoryDraftFamilies.map(spec => ({ source, sourceSha256: hash(fs.readFileSync(source, 'utf8')), spec, ...compileObservatoryFamily(spec) })));
  }
  return rows;
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-observatory-expansion.mjs')) {
  const drafts = await loadObservatoryDrafts();
  const code = process.argv.find(value => value.startsWith('--code='))?.slice(7);
  (code ? drafts.filter(entry => entry.spec.code === code) : drafts).forEach(entry => checkObservatoryFamily(entry));
  const reviews = new Map(JSON.parse(fs.readFileSync('docs/universes/observatory-expansion-2026-11-26-review.json', 'utf8')).map(row => [`${row.code}:${row.language}`, row]));
  for (const entry of observatoryPublications) {
    checkObservatoryFamily(entry, { published: true });
    const source = drafts.find(draft => draft.spec.code === entry.code);
    assert(source);
    assert.deepEqual(entry.readings, source.readings);
    assert.deepEqual(entry.choices, source.choices);
    for (const reading of entry.readings) {
      const review = reviews.get(`${reading.code}:${reading.language}`);
      assert(review && review.author !== review.reviewer);
      assert.equal(review.result, 'independent-review-passed');
      assert.equal(review.status, 'provisional'); assert.equal(review.teacherValidation, 'pending');
      assert.equal(review.sha256, hash(reading), `${reading.code}: stale review`);
    }
  }
  if (process.argv.includes('--complete')) { assert.equal(drafts.length, 9); assert.equal(observatoryPublications.length, 9); }
  console.log(JSON.stringify({ draftedFamilies: drafts.length, publishedFamilies: observatoryPublications.length, publishedLanguageEditions: observatoryPublications.length * 6 }));
}
