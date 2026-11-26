import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hash, checkLibraryFamily } from './check-library-expansion.mjs';
import { compileRiversideFamily } from '../data/riverside-expansion-model.js';
import { riversidePublications } from '../data/riverside-expansion.js';
export { hash };
const profile = { codes: /^L(?:30[7-9]|31[0-5])$/, universe: 'camins-de-la-ribera',
  ranges: [[180,240,8,'4-primary','intermediate'],[270,340,10,'5-primary','intermediate'],[360,450,12,'6-primary','intermediate']] };
export const checkRiversideFamily = (entry, options = {}) => checkLibraryFamily(entry, { ...options, profile });
export async function loadRiversideDrafts() {
  const rows = [];
  for (const range of ['307-309', '310-312', '313-315']) {
    const source = `data/riverside-2026-11-26-${range}.js`;
    if (!fs.existsSync(source)) continue;
    const { riversideDraftFamilies } = await import(new URL('../' + source, import.meta.url));
    rows.push(...riversideDraftFamilies.map(spec => ({ source, sourceSha256: hash(fs.readFileSync(source, 'utf8')), spec, ...compileRiversideFamily(spec) })));
  }
  return rows;
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-riverside-expansion.mjs')) {
  const drafts = await loadRiversideDrafts();
  const code = process.argv.find(value => value.startsWith('--code='))?.slice(7);
  (code ? drafts.filter(entry => entry.spec.code === code) : drafts).forEach(entry => checkRiversideFamily(entry));
  const reviews = new Map(JSON.parse(fs.readFileSync('docs/universes/riverside-expansion-2026-11-26-review.json', 'utf8')).map(row => [`${row.code}:${row.language}`, row]));
  for (const entry of riversidePublications) {
    checkRiversideFamily(entry, { published: true });
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
  if (process.argv.includes('--complete')) { assert.equal(drafts.length, 9); assert.equal(riversidePublications.length, 9); }
  console.log(JSON.stringify({ draftedFamilies: drafts.length, publishedFamilies: riversidePublications.length, publishedLanguageEditions: riversidePublications.length * 6 }));
}
