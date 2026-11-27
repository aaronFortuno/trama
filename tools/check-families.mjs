import assert from 'node:assert/strict';
import { readings } from '../data/readings.js';
import { families, familyById } from '../data/families.js';
import { countFacetResults, familyMembers, groupFamilyCards } from '../reading-families.js';
import { filterCatalog, indexCatalog } from '../catalog.js';
import { defaultSettings, makeCode, readCode } from '../worksheet-code.js';
import { sanitizeAnalyticsEvent } from '../analytics.js';

assert.equal(families.length, familyById.size);
assert.equal(new Set(readings.map(r => r.code + ':' + r.language)).size, readings.length, 'Codes identify one variant per language');
for (const reading of readings) if (reading.familyId) assert(familyById.has(reading.familyId), 'Public family must be registered');
for (const family of families) {
  for (const locale of ['ca', 'es']) {
    const versions = readings.filter(r => r.familyId === family.id && r.language === locale);
    assert(versions.length > 1);
    assert.deepEqual(familyMembers(readings, versions[0]).map(r => r.code), family.variantCodes);
    assert.equal(new Set(versions.map(r => r.workId)).size, versions.length, 'Each degree has an independent work identity');
    for (const reading of versions) {
      assert(reading.code === family.code || new RegExp(`^${family.code}[A-Z]$`).test(reading.code));
      const recovered = readCode(makeCode(reading, defaultSettings(reading.level)), readings);
      assert.equal(recovered.reading.id, reading.id, 'Variant suffixes must survive code round-trips');
    }
  }
}
const indexed = indexCatalog(readings);
const variants = filterCatalog(indexed, { family: 'with-variants', language: 'ca' });
assert.equal(variants.length, families.reduce((total, family) => total + family.variantCodes.length, 0));
assert.equal(groupFamilyCards(variants).length, families.length);
const pilot = variants.filter(item => item.reading.familyId === 'biblioteca-objectes');
const genreCounts = countFacetResults(pilot, 'genre');
assert.equal(genreCounts.total, 1);
assert.equal(genreCounts.counts.get('informative'), 1, 'Three variants contribute one proposal to a shared genre');
assert.equal(countFacetResults(pilot, 'genre', { groupFamilies: false }).total, 3, 'Selection and printing keep concrete worksheets');
assert.equal(countFacetResults(pilot, 'difficulty').counts.get('intermediate'), 1, 'Two matching degrees in one family count once');
assert.equal(countFacetResults(pilot, 'level').counts.size, 3, 'A family remains discoverable through any of its levels');
assert.equal(filterCatalog(pilot, { level: 'primary-cycle-2', difficulty: 'initial' }).length, 0, 'All constraints must match the same variant');
assert.equal(filterCatalog(pilot, { family: 'with-variants', language: 'ca', level: 'primary-cycle-2' }).length, 1);
const translationsOnly = readings.filter(r => r.code === 'L208');
assert.equal(filterCatalog(indexCatalog(translationsOnly), { family: 'with-variants' }).length, 0);
assert.equal(groupFamilyCards(variants).flatMap(group => group.familyMatches).length, variants.length);
assert.equal(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'family', valor: 'private-name' }), false);
assert(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'family', valor: 'with-variants' }));
console.log('Family degrees, language separation, grouping, codes and analytics checked.');
