import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gl } from '../locales/gl.js';
import { eu } from '../locales/eu.js';
import { es } from '../locales/es.js';
import { languages, language, setLanguage, t, defaultReadingLanguage } from '../i18n.js';
import { labels, filterCatalog, indexCatalog } from '../catalog.js';
import { universes } from '../data/universes.js';
import { readings } from '../data/readings.js';
import { sanitizeAnalyticsEvent } from '../analytics.js';

assert.deepEqual(languages, ['ca', 'es', 'gl', 'eu']);
const html = fs.readFileSync('index.html', 'utf8').replace(/<article\b[^>]*class="[^"]*\brelease\b[^"]*"[^>]*>[\s\S]*?<\/article>/g, '');
const source = fs.readdirSync('.').filter(file => file.endsWith('.js')).map(file => fs.readFileSync(file, 'utf8'))
  .concat(html).join('\n').replaceAll("\\'", "'").replaceAll('\\"', '"');
const expected = new Set([
  ...Object.keys(es).filter(key => source.includes(key)),
  ...Object.values(labels).flatMap(Object.values),
  ...universes.map(world => world.description.ca),
]);
const parameters = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
for (const [locale, dictionary] of Object.entries({ gl, eu })) {
  for (const key of expected) assert(Object.hasOwn(dictionary, key), `${locale}: missing ${key}`);
  for (const [key, value] of Object.entries(dictionary)) {
    assert(typeof value === 'string' && value.trim(), `${locale}: empty ${key}`);
    assert.deepEqual(parameters(value), parameters(key), `${locale}: placeholders ${key}`);
    assert(!value.includes('\ufffd'), `${locale}: broken encoding`);
  }
}
assert.deepEqual(Object.keys(gl).sort(), Object.keys(eu).sort());
const storage = new Map([['trama.catalog-language', 'ca']]);
globalThis.localStorage = { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) };
globalThis.document = { documentElement: {} };
for (const locale of languages) {
  setLanguage(locale);
  assert.equal(language(), locale);
  assert.equal(document.documentElement.lang, locale);
  assert.equal(defaultReadingLanguage(['ca', 'es']), ['ca', 'es'].includes(locale) ? locale : 'es');
  assert.equal(defaultReadingLanguage(['ca']), 'ca');
  assert.equal(defaultReadingLanguage(['en']), 'en');
  assert.equal(storage.get('trama.catalog-language'), 'ca', 'Interface changes must not write the reading preference');
  assert.deepEqual(sanitizeAnalyticsEvent('canvia_idioma', { llengua: locale }), { name: 'canvia_idioma', data: { llengua: locale } });
}
setLanguage('unknown');
assert.equal(language(), 'eu');
assert.equal(t('Unknown source', {}, 'unknown'), 'Unknown source');
assert.equal(t('Cerca al catàleg', {}, 'gl'), 'Busca no catálogo');
assert.equal(t('Cerca al catàleg', {}, 'eu'), 'Bilatu katalogoan');
assert.equal(t('{count} propostes', { count: 12 }, 'eu'), '12 proposamen');
assert.equal(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'language', valor: 'eu' }), false, 'No invented reading languages');
assert(filterCatalog(indexCatalog(readings), { language: 'es', search: 'ingurumena' }).length > 0, 'Basque taxonomy must be searchable');
assert(filterCatalog(indexCatalog(readings), { language: 'es', search: 'natureza' }).length > 0, 'Galician taxonomy must be searchable');
console.log(JSON.stringify({ locales: languages, translated: Object.keys(gl).length, activeSources: expected.size, parameters: 'ok', independentLanguages: 'ok', analytics: 'ok' }));
