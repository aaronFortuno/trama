import assert from 'node:assert/strict';
import { readings } from '../data/readings.js';
import { universeById, universes } from '../data/universes.js';
import { filterCatalog, indexCatalog } from '../catalog.js';
import { importReading } from '../reading-files.js';
import { sanitizeAnalyticsEvent } from '../analytics.js';

assert.equal(universeById.size, universes.length, 'Universe IDs must be unique');
for (const reading of readings) {
  const worlds = reading.universeIds ?? [];
  assert(Array.isArray(worlds));
  assert.equal(new Set(worlds).size, worlds.length);
  worlds.forEach(id => assert(universeById.has(id), `${reading.code}: unknown universe ${id}`));
  if (reading.familyId !== undefined) assert.equal(typeof reading.familyId, 'string', 'A reading has at most one family');
  for (const translation of readings.filter(item => item.workId === reading.workId)) {
    assert.deepEqual(translation.universeIds ?? [], worlds, `${reading.code}: translated worlds differ`);
    assert.equal(translation.familyId, reading.familyId, `${reading.code}: translated family differs`);
  }
}
const indexed = indexCatalog(readings);
const world = filterCatalog(indexed, { universe: 'biblioteca-de-les-coses', language: 'es' });
assert(world.some(item => item.reading.code === 'L208'));
assert(world.some(item => item.reading.code === 'L246'));
const unassigned = filterCatalog(indexed, { universe: 'no-universe', language: 'es' });
assert(!unassigned.some(item => item.reading.code === 'L208'));
const assigned = readings.filter(r => r.language === 'es' && r.universeIds?.length);
assert.equal(assigned.length + unassigned.length, readings.filter(r => r.language === 'es').length);
for (const universe of universes) {
  const members = filterCatalog(indexed, { universe: universe.id, language: 'es' });
  assert(members.some(item => item.reading.code === universe.seedCode), `${universe.id}: seed must belong to its world`);
}
const fixture = { title: 'Prova', language: 'ca', paragraphs: ['Una lectura independent.'], universeIds: ['primer', 'segon'], familyId: 'familia-prova' };
const imported = await importReading(new File([JSON.stringify(fixture)], 'prova.json'));
assert.deepEqual(imported.universeIds, ['primer', 'segon']);
assert.equal(imported.familyId, 'familia-prova');
const multi = indexCatalog([{ ...imported, themes: [], genre: 'narrative', questions: [] }]);
assert.equal(filterCatalog(multi, { universe: 'primer' }).length, 1);
assert.equal(filterCatalog(multi, { universe: 'segon' }).length, 1);
for (const invalid of [{ familyId: ['primera', 'segona'] }, { universeIds: ['primer', 'primer'] }, { universeIds: 'primer' }]) {
  await assert.rejects(importReading(new File([JSON.stringify({ ...fixture, ...invalid })], 'error.json')));
}
assert.deepEqual(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'universe', valor: 'biblioteca-de-les-coses' }), { name: 'aplica_filtre', data: { filtre: 'universe', valor: 'biblioteca-de-les-coses' } });
assert.equal(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'universe', valor: 'private-user-universe' }), false);
console.log(`Editorial metadata checked; ${world.length} Spanish universe readings and ${unassigned.length} unassigned, with matching translations.`);
