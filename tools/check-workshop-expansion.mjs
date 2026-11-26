import assert from 'node:assert/strict';
import fs from 'node:fs';
import { hash, checkLibraryFamily } from './check-library-expansion.mjs';
import { compileWorkshopFamily } from '../data/workshop-expansion-model.js';
import { workshopPublications } from '../data/workshop-expansion.js';
export { hash };
const profile = { codes: /^L(?:29[89]|30[0-6])$/, universe: 'taller-de-la-placa',
  ranges: [[180,240,8,'4-primary','intermediate'],[270,340,10,'5-primary','intermediate'],[360,450,12,'6-primary','intermediate']] };
export const checkWorkshopFamily = (entry, options = {}) => checkLibraryFamily(entry, { ...options, profile });
export async function loadWorkshopDrafts() {
  const rows = [];
  for (const range of ['298-300', '301-303', '304-306']) {
    const source = `data/workshop-2026-11-26-${range}.js`;
    if (!fs.existsSync(source)) continue;
    const { workshopDraftFamilies } = await import(new URL('../' + source, import.meta.url));
    rows.push(...workshopDraftFamilies.map(spec => ({ source, sourceSha256: hash(fs.readFileSync(source, 'utf8')), spec, ...compileWorkshopFamily(spec) })));
  }
  return rows;
}
if (process.argv[1]?.replaceAll('\\', '/').endsWith('/check-workshop-expansion.mjs')) {
  const drafts = await loadWorkshopDrafts();
  const code = process.argv.find(value => value.startsWith('--code='))?.slice(7);
  (code ? drafts.filter(entry => entry.spec.code === code) : drafts).forEach(entry => checkWorkshopFamily(entry));
  const reviews = new Map(JSON.parse(fs.readFileSync('docs/universes/workshop-expansion-2026-11-26-review.json', 'utf8')).map(row => [`${row.code}:${row.language}`, row]));
  for (const entry of workshopPublications) {
    checkWorkshopFamily(entry, { published: true });
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
  if (process.argv.includes('--complete')) { assert.equal(drafts.length, 9); assert.equal(workshopPublications.length, 9); }
  console.log(JSON.stringify({ draftedFamilies: drafts.length, publishedFamilies: workshopPublications.length, publishedLanguageEditions: workshopPublications.length * 6 }));
}
