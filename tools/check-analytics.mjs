import assert from 'node:assert/strict';
import { countBucket, sanitizeAnalyticsEvent, startAnalytics, trackFamilyActivity, trackFeature, trackReadingOpened, trackReadingFeature, sendReadingReport } from '../analytics.js';
import { readings } from '../data/readings.js';

const canary = 'PRIVATE-school-code-search-collection-filename';
const first = readings[0];
const dirty = { url: canary, referrer: canary, title: canary, name: canary, settings: { classroomCode: canary }, collectionId: canary };
const metadata = { codi: first.code, llengua: first.language, nivell: first.level, dificultat: first.difficulty, ...(first.familyId ? { familia: first.familyId } : {}) };
const opened = sanitizeAnalyticsEvent('obre_lectura', { ...dirty, codi: first.code, llengua: first.language, nivell: canary, dificultat: canary });
assert.deepEqual(opened, { name: 'obre_lectura', data: metadata });
assert.deepEqual(sanitizeAnalyticsEvent('obre_lectura', { codi: canary, llengua: canary }), { name: 'obre_lectura' });
for (const name of [canary, '__proto__', 'constructor', 'click', 'notifica_error']) assert.equal(sanitizeAnalyticsEvent(name, dirty), false);
assert.equal(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'theme', valor: canary }), false);
assert.deepEqual(sanitizeAnalyticsEvent('aplica_filtre', { ...dirty, filtre: 'length', valor: 'long', nivell: '6-primary' }), {
  name: 'aplica_filtre', data: { filtre: 'length', valor: 'long', nivell: '6-primary' },
});
assert.deepEqual(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'length', valor: 'long', nivell: canary }), {
  name: 'aplica_filtre', data: { filtre: 'length', valor: 'long' },
});
const catalogContext = { nivell: '6-primary', dificultat: 'advanced', llengua: 'es', extensio: 'long', variants: true, univers: 'biblioteca-de-les-coses', abast: 'cataleg', origen: 'selector', resultats: '0' };
assert.deepEqual(sanitizeAnalyticsEvent('aplica_filtre', { ...dirty, ...catalogContext, filtre: 'difficulty', valor: 'advanced' }), {
  name: 'aplica_filtre', data: { filtre: 'difficulty', valor: 'advanced', ...catalogContext },
});
assert.deepEqual(sanitizeAnalyticsEvent('aplica_filtre', { filtre: 'universe', valor: 'biblioteca-de-les-coses', nivell: canary, univers: canary, tema: canary, llengua: canary, abast: canary, resultats: canary }), {
  name: 'aplica_filtre', data: { filtre: 'universe', valor: 'biblioteca-de-les-coses' },
});
assert.equal(sanitizeAnalyticsEvent('familia', { accio: 'obre', familia: canary, llengua: 'es' }), false);
assert.deepEqual(sanitizeAnalyticsEvent('familia', { ...dirty, accio: 'compara', familia: 'biblioteca-objectes', llengua: 'es', origen: 'visor' }), {
  name: 'familia', data: { accio: 'compara', familia: 'biblioteca-objectes', llengua: 'es', origen: 'visor' },
});
for (const [input, output] of [[0, '0'], [1, '1'], [2, '2-5'], [5, '2-5'], [6, '6-15'], [15, '6-15'], [16, '16-50'], [50, '16-50'], [51, '51+'], [490, '51+'], [-1, undefined], [NaN, undefined], ['5', undefined]]) {
  assert.equal(countBucket(input), output);
}
const samples = {
  obre_lot: { origen: 'capcalera', vista: 'cataleg', quantitat: '6-15', colleccio: false },
  genera_document: { abast: 'lot', format: 'pdf', contingut: 'solucionari', quantitat: '6-15', doble_cara: true, colleccio: true, maquetats: false },
  canvia_vista: { vista: 'solucionari' },
  personalitza_fitxa: { bloc: 'codi_aula', accio: 'ajusta', estat: true },
  plantilla: { accio: 'aplica', tipus: 'personal' },
  colleccio: { accio: 'crea', quantitat: '2-5' },
  copia_configuracio: { accio: 'exporta' },
  restableix_maquetat: { abast: 'fitxa' },
  cerca_cataleg: { tipus: 'text', resultats: '0' },
  neteja_filtres: { filtre: 'tots' },
  canvia_idioma: { llengua: 'es' },
};
for (const [name, data] of Object.entries(samples)) {
  assert.deepEqual(sanitizeAnalyticsEvent(name, { ...data, ...dirty }), { name, data });
  assert.equal(sanitizeAnalyticsEvent(name, dirty), false);
}
assert.equal(sanitizeAnalyticsEvent('genera_document', { ...samples.genera_document, quantitat: 10 }), false);
assert.equal(sanitizeAnalyticsEvent('obre_lot', { ...samples.obre_lot, quantitat: 10 }), false);
assert.equal(sanitizeAnalyticsEvent('obre_lot', { ...samples.obre_lot, origen: canary }), false);
assert.equal(sanitizeAnalyticsEvent('obre_lot', { ...samples.obre_lot, colleccio: canary }), false);
assert.equal(sanitizeAnalyticsEvent('cerca_cataleg', { tipus: 'text', resultats: canary }), false);
assert.deepEqual(sanitizeAnalyticsEvent('personalitza_fitxa', { bloc: 'text', accio: 'ajusta', estat: 'true' }), {
  name: 'personalitza_fitxa', data: { bloc: 'text', accio: 'ajusta' },
});

// Mock the browser and collector: this test never makes a network request.
const sent = [];
const nodes = [];
const storage = new Map();
const win = new EventTarget();
Object.assign(globalThis, { window: win, location: { protocol: 'https:', hostname: 'trama.ortogra.fi' }, localStorage: {
  getItem: key => storage.get(key), removeItem: key => storage.delete(key),
}, document: { createElement() { const script = new EventTarget(); script.dataset = {}; script.remove = () => {}; return script; }, head: { append: script => nodes.push(script) } } });
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} });
for (const restriction of ['local', 'gpc', 'dnt', 'disabled']) {
  location.hostname = restriction === 'local' ? 'localhost' : 'trama.ortogra.fi';
  navigator.globalPrivacyControl = restriction === 'gpc';
  navigator.doNotTrack = restriction === 'dnt' ? '1' : null;
  if (restriction === 'disabled') storage.set('umami.disabled', '1');
  startAnalytics();
  trackFeature('plantilla', samples.plantilla);
  assert.equal(nodes.length, 0, restriction + ' must not load the tracker');
  storage.clear();
}
navigator.globalPrivacyControl = false;
navigator.doNotTrack = null;
startAnalytics();
assert.equal(nodes.length, 1);
assert.equal(nodes[0].dataset.excludeSearch, 'true');
assert.equal(nodes[0].dataset.excludeHash, 'true');
const baseline = window.tramaBeforeSend('event', { ...dirty });
assert.equal(baseline, false); // Unknown named event.
const pageview = window.tramaBeforeSend('event', { url: canary, referrer: canary, title: canary });
assert.equal(pageview.url, '/');
assert.equal(pageview.title, 'Trama');
assert(!JSON.stringify(pageview).includes(canary));
assert.equal(window.tramaBeforeSend('identify', {}), false);
trackReadingOpened(first, { origen: 'enllac' });
trackFeature(canary, dirty);
window.umami = { track(name, data) { sent.push(window.tramaBeforeSend('event', { ...dirty, name, data })); return Promise.resolve(); } };
nodes[0].dispatchEvent(new Event('load'));
assert.equal(sent.length, 1, 'Queue must send the direct-link opening once');
assert.equal(sent[0].data.codi, first.code);
assert.equal(sent[0].data.origen, 'enllac');
assert(!JSON.stringify(sent).includes(canary));
trackReadingOpened({ ...first, personal: true }, { origen: 'cataleg' });
assert.deepEqual(sent.at(-1).data, { origen: 'cataleg' });
trackReadingFeature('genera_document', { ...first, personal: true }, samples.genera_document);
assert(!sent.at(-1).data.codi);
const familyReading = readings.find(reading => reading.familyId);
trackFamilyActivity(familyReading, 'obre', 'cataleg');
assert.equal(sent.at(-1).name, 'familia');
assert.equal(sent.at(-1).data.familia, familyReading.familyId);
const familyEvents = sent.length;
trackFamilyActivity({ ...familyReading, personal: true }, 'compara');
assert.equal(sent.length, familyEvents, 'Personal family content must not be tracked');
const familyOpening = sanitizeAnalyticsEvent('obre_lectura', { codi: familyReading.code, llengua: familyReading.language, familia: canary });
assert.equal(familyOpening.data.familia, familyReading.familyId, 'Family metadata is derived from the public catalogue');
navigator.globalPrivacyControl = true;
const previous = sent.length;
trackFeature('plantilla', samples.plantilla);
assert.equal(sent.length, previous);
assert.equal(window.tramaBeforeSend('event', { name: 'plantilla', data: samples.plantilla }), false);
navigator.globalPrivacyControl = false;
const track = window.umami.track;
window.umami.track = () => { throw Error('blocked'); };
assert.doesNotThrow(() => trackFeature('plantilla', samples.plantilla));
window.umami.track = () => Promise.reject(Error('blocked'));
trackFeature('plantilla', samples.plantilla);
await new Promise(resolve => setImmediate(resolve));
window.umami.track = track;

let reports = 0;
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  assert.equal(body.payload.name, 'notifica_error');
  assert.deepEqual(body.payload.data, { codi: first.code, llengua: first.language, nivell: first.level, dificultat: first.difficulty, part: 'text', motiu: 'wording', element: '1' });
  assert(!JSON.stringify(body).includes(canary));
  reports++;
  return { ok: true, json: async () => ({ cache: 'acknowledgement' }) };
};
assert.equal(await sendReadingReport(first, { part: 'text', element: '1', motiu: 'wording' }), true);
assert.equal(await sendReadingReport(first, { part: 'text', element: canary, motiu: 'wording' }), false);
assert.equal(await sendReadingReport({ ...first, personal: true }, { part: 'text', element: '1', motiu: 'wording' }), false);
assert.equal(reports, 1);
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  assert.equal(body.payload.data.part, 'question');
  assert.equal(body.payload.data.element, 'cartel-q1');
  assert(['abcd', 'oberta'].includes(body.payload.data.format_pregunta));
  reports++;
  return { ok: true, json: async () => ({ cache: 'acknowledgement' }) };
};
const pilot = readings.find(reading => reading.code === 'L001' && reading.language === 'ca');
assert.equal(await sendReadingReport(pilot, { part: 'question', element: 'cartel-q1', motiu: 'wording', responseMode: 'choice' }), true);
assert.equal(await sendReadingReport(pilot, { part: 'question', element: 'cartel-q1', motiu: 'wording', responseMode: 'open' }), true);
assert.equal(await sendReadingReport(pilot, { part: 'question', element: 'cartel-q1', motiu: 'wording', responseMode: canary }), false);
assert.equal(await sendReadingReport(pilot, { part: 'question', element: 'cartel-q5', motiu: 'wording', responseMode: 'choice' }), false);
assert.equal(reports, 3);

const difficultyReports = [];
globalThis.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  difficultyReports.push(body.payload.data);
  return { ok: true, json: async () => ({ cache: 'acknowledgement' }) };
};
for (const language of ['ca', 'es']) {
  const reading = readings.find(item => item.code === 'L001' && item.language === language);
  for (const motiu of ['too_easy', 'too_difficult']) {
    assert.equal(await sendReadingReport({ ...reading, level: canary, difficulty: canary }, {
      part: 'text', element: '', motiu, nivell: canary, dificultat: canary,
    }), true);
    assert.deepEqual(difficultyReports.at(-1), {
      codi: reading.code, llengua: reading.language, nivell: reading.level, dificultat: reading.difficulty,
      part: 'text', motiu,
    }, 'Difficulty reports use catalogue metadata rather than caller-provided values');
    assert.equal(await sendReadingReport(reading, { part: 'question', element: reading.questions[0].id, motiu }), false);
  }
}
const difficultyCount = difficultyReports.length;
assert.equal(await sendReadingReport(first, { part: 'text', motiu: canary }), false);
navigator.globalPrivacyControl = true;
assert.equal(await sendReadingReport(first, { part: 'text', motiu: 'too_difficult' }), false);
navigator.globalPrivacyControl = false;
assert.equal(difficultyReports.length, difficultyCount);
console.log('Analytics: vocabulary, metadata, privacy restrictions, startup queue, blocked collector and reports OK (no network).');
