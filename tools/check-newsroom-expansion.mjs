import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hash, checkLibraryFamily } from './check-library-expansion.mjs';
import { compileNewsroomFamily } from '../data/newsroom-expansion-model.js';
import { newsroomPublications } from '../data/newsroom-expansion.js';
export { hash };
const profile = { codes: /^L28[0-8]$/, universe: 'redaccio-del-pati',
  ranges: [[250,330,8,'5-primary','intermediate'],[360,450,10,'6-primary','intermediate'],[480,590,12,'1-secondary','intermediate']] };
export const checkNewsroomFamily = (entry, options = {}) => checkLibraryFamily(entry, { ...options, profile });
export async function loadNewsroomDrafts() {
  const rows = [];
  for (const range of ['280-282', '283-285', '286-288']) {
    const source = `data/newsroom-2026-11-26-${range}.js`;
    if (!fs.existsSync(source)) continue;
    const { newsroomDraftFamilies } = await import(new URL('../' + source, import.meta.url));
    rows.push(...newsroomDraftFamilies.map(spec => ({ source, sourceSha256: hash(fs.readFileSync(source, 'utf8')), spec, ...compileNewsroomFamily(spec) })));
  }
  return rows;
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-newsroom-expansion.mjs')) {
  const drafts = await loadNewsroomDrafts();
  const code = process.argv.find(value => value.startsWith('--code='))?.slice(7);
  (code ? drafts.filter(entry => entry.spec.code === code) : drafts).forEach(entry => checkNewsroomFamily(entry));
  const reviews = new Map(JSON.parse(fs.readFileSync('docs/universes/newsroom-expansion-2026-11-26-review.json', 'utf8')).map(row => [`${row.code}:${row.language}`, row]));
  for (const entry of newsroomPublications) {
    checkNewsroomFamily(entry, { published: true });
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
  if (process.argv.includes('--complete')) { assert.equal(drafts.length, 9); assert.equal(newsroomPublications.length, 9); }
  console.log(JSON.stringify({ draftedFamilies: drafts.length, publishedFamilies: newsroomPublications.length, publishedLanguageEditions: newsroomPublications.length * 6 }));
}
