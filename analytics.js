import { labels } from './catalog.js';
import { readings } from './data/readings.js';
import { familyById } from './data/families.js';
import { multipleChoice } from './data/question-choices.js';

const host = 'trama.ortogra.fi';
const scriptURL = 'https://maquestria.tail72bc84.ts.net:8443/script.js';
const collectURL = new URL('/api/send', scriptURL);
const websiteId = 'b84afe8e-e26b-4e71-8150-3b167d4f89a3';
const publicCodes = new Set(readings.map(reading => reading.code));
const publicVersions = new Map(readings.map(reading => [reading.code + ':' + reading.language, reading]));
const publicIds = new Map(readings.map(reading => [reading.id, reading]));
const page = { website: websiteId, hostname: host, title: 'Trama', url: '/' };
let trackerLoading = false;
const pendingEvents = [];

// Only fixed vocabulary and coarse counts may leave the browser. Never pass
// settings, DOM text, filenames, collection/template IDs or user-written text.
const counts = ['0', '1', '2-5', '6-15', '16-50', '51+'];
const catalogFields = {
  nivell: Object.keys(labels.level), dificultat: Object.keys(labels.difficulty), llengua: Object.keys(labels.language),
  extensio: Object.keys(labels.length), tema: Object.keys(labels.theme), tipus_text: Object.keys(labels.genre),
  univers: Object.keys(labels.universe), variants: 'boolean', abast: ['cataleg', 'colleccio', 'seleccio'],
  origen: ['selector', 'lectura'], resultats: counts,
};
const eventRules = {
  obre_lot: { required: ['origen', 'vista', 'quantitat', 'colleccio'], fields: {
    origen: ['capcalera'], vista: ['cataleg', 'lectura'], quantitat: counts, colleccio: 'boolean',
  } },
  obre_lectura: { reading: true, fields: { origen: ['cataleg', 'anterior', 'seguent', 'idioma', 'familia', 'enllac'], colleccio: 'boolean', maquetat: 'boolean' } },
  genera_document: { reading: true, required: ['abast', 'format', 'contingut', 'quantitat'], fields: {
    abast: ['individual', 'lot'], format: ['impressio', 'pdf', 'zip'], contingut: ['alumnat', 'solucionari'], quantitat: counts,
    doble_cara: 'boolean', colleccio: 'boolean', maquetats: 'boolean',
  } },
  canvia_vista: { reading: true, required: ['vista'], fields: { vista: ['alumnat', 'solucionari'] } },
  personalitza_fitxa: { required: ['bloc', 'accio'], fields: {
    bloc: ['text', 'marges', 'resposta', 'encapcalament', 'peu', 'imatges', 'codi_aula', 'vocabulari', 'pistes', 'preguntes'],
    accio: ['ajusta', 'amaga', 'recupera', 'linies', 'consulta'], estat: 'boolean',
  } },
  plantilla: { required: ['accio'], fields: { accio: ['aplica', 'crea', 'actualitza', 'elimina', 'reordena'], tipus: ['predefinida', 'personal'] } },
  colleccio: { required: ['accio'], fields: { accio: ['selecciona', 'crea', 'afegeix', 'obre', 'reordena', 'retira', 'elimina'], quantitat: counts } },
  copia_configuracio: { required: ['accio'], fields: { accio: ['exporta', 'importa'] } },
  restableix_maquetat: { required: ['abast'], fields: { abast: ['fitxa', 'tots'] } },
  cerca_cataleg: { required: ['tipus', 'resultats'], fields: { ...catalogFields, tipus: ['codi', 'text'] } },
  familia: { required: ['accio', 'familia', 'llengua'], fields: {
    accio: ['obre', 'compara'], familia: [...familyById.keys()], llengua: Object.keys(labels.language),
    origen: ['cataleg', 'anterior', 'seguent', 'visor'], quantitat: counts,
  } },
  neteja_filtres: { required: ['filtre'], fields: { filtre: ['tots', 'level', 'difficulty', 'theme', 'genre', 'length', 'universe', 'family'] } },
  canvia_idioma: { required: ['llengua'], fields: { llengua: ['ca', 'es'] } },
};

export function countBucket(value) {
  if (!Number.isInteger(value) || value < 0) return undefined;
  return value === 0 ? '0' : value === 1 ? '1' : value <= 5 ? '2-5' : value <= 15 ? '6-15' : value <= 50 ? '16-50' : '51+';
}

function readingData(reading) {
  const entry = !reading?.personal && publicIds.get(reading?.id);
  return entry ? { codi: entry.code, llengua: entry.language } : {};
}

function allowedFields(data, fields) {
  const clean = {};
  for (const [key, allowed] of Object.entries(fields)) {
    if (allowed === 'boolean' ? typeof data[key] === 'boolean' : allowed.includes(data[key])) clean[key] = data[key];
  }
  return clean;
}

export function sanitizeAnalyticsEvent(name, data = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) data = {};
  if (name === 'aplica_filtre') {
    if (!knownFilter(data.filtre, data.valor)) return false;
    const selection = { filtre: data.filtre, valor: data.valor };
    return { name, data: { ...selection, ...allowedFields(data, catalogFields) } };
  }
  const rule = Object.hasOwn(eventRules, name) && eventRules[name];
  if (!rule) return false;
  const clean = allowedFields(data, rule.fields);
  if (rule.required?.some(key => !Object.hasOwn(clean, key))) return false;
  if (rule.reading) {
    const entry = publicVersions.get(data.codi + ':' + data.llengua);
    if (entry) {
      Object.assign(clean, { codi: entry.code, llengua: entry.language, nivell: entry.level, dificultat: entry.difficulty });
      if (familyById.has(entry.familyId)) clean.familia = entry.familyId;
    }
    else if (name === 'obre_lectura' && data.llengua === undefined && publicCodes.has(data.codi)) clean.codi = data.codi;
  }
  return Object.keys(clean).length ? { name, data: clean } : { name };
}

export const reportReasons = {
  text: {
    wording: 'Errada de llengua', fact: 'Dada incorrecta', coherence: 'Incoherència',
    too_easy: 'Text massa fàcil per al nivell indicat',
    too_difficult: 'Text massa difícil per al nivell indicat',
  },
  image: { error: 'Conté un error', mismatch: 'No encaixa amb el text', inappropriate: 'És inadequada' },
  question: { wording: 'Està mal formulada', unsupported: 'No es pot respondre a partir del text', inappropriate: 'És inadequada' },
  solution: { incorrect: 'Resposta incorrecta', incomplete: 'Resposta incompleta', mismatch: 'No correspon a la pregunta' },
};

function analyticsRestriction() {
  if (location.protocol !== 'https:' || location.hostname !== host) return 'local';
  if (navigator.globalPrivacyControl === true) return 'gpc';
  if ([navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack].some(value => ['1', 'yes', 1].includes(value))) return 'dnt';
  try { if (localStorage.getItem('umami.disabled')) return 'disabled'; } catch { /* Storage can be unavailable. */ }
  return '';
}

const trackerReady = () => typeof window.umami?.track === 'function';
const notifyAnalytics = () => window.dispatchEvent(new Event('trama-analytics-change'));

export function reportAvailability() {
  return analyticsRestriction() || (trackerReady() ? '' : trackerLoading ? 'loading' : 'script');
}

export function allowAnalytics() {
  if (analyticsRestriction() !== 'disabled') return;
  try { localStorage.removeItem('umami.disabled'); } catch { return; }
  startAnalytics();
  notifyAnalytics();
}

function knownFilter(facet, value) {
  return Object.hasOwn(labels, facet) && Object.hasOwn(labels[facet], value);
}

function beforeSend(type, payload) {
  if (analyticsRestriction() || type !== 'event' || !payload) return false;
  const { name, data } = payload;
  if (name === undefined) return page;
  const event = sanitizeAnalyticsEvent(name, data);
  return event ? { ...page, ...event } : false;
}

export function startAnalytics() {
  if (analyticsRestriction() || trackerLoading || trackerReady()) return;
  const script = document.createElement('script');
  script.id = 'trama-analytics';
  script.src = scriptURL;
  script.async = true;
  script.dataset.websiteId = websiteId;
  script.dataset.domains = host;
  script.dataset.excludeSearch = 'true';
  script.dataset.excludeHash = 'true';
  script.dataset.doNotTrack = 'true';
  script.dataset.beforeSend = 'tramaBeforeSend';
  window.tramaBeforeSend = beforeSend;
  trackerLoading = true;
  const timeout = setTimeout(finish, 6000);
  function finish() {
    clearTimeout(timeout);
    script.removeEventListener('load', finish);
    script.removeEventListener('error', finish);
    trackerLoading = false;
    if (!trackerReady()) script.remove();
    const events = pendingEvents.splice(0);
    if (trackerReady()) for (const event of events) track(event.name, event.data);
    notifyAnalytics();
  }
  script.addEventListener('load', finish);
  script.addEventListener('error', finish);
  document.head.append(script);
  notifyAnalytics();
}

function track(name, data) {
  if (analyticsRestriction()) return;
  const event = sanitizeAnalyticsEvent(name, data);
  if (!event) return;
  if (!trackerReady()) {
    if (trackerLoading && pendingEvents.length < 40) pendingEvents.push(event);
    return;
  }
  try { window.umami.track(event.name, event.data)?.catch?.(() => {}); } catch { /* Analytics is optional. */ }
}

export function trackReadingOpened(reading, context = {}) {
  track('obre_lectura', { ...context, ...readingData(reading) });
}

export function trackFilterApplied(filtre, valor, context = {}) {
  const data = typeof context === 'string' ? { nivell: context } : context;
  track('aplica_filtre', { ...data, filtre, valor, ...(Number.isInteger(data.resultats) ? { resultats: countBucket(data.resultats) } : {}) });
}

export function trackFamilyActivity(reading, accio, origen = 'visor') {
  const entry = !reading?.personal && publicIds.get(reading?.id);
  if (!entry || !familyById.has(entry.familyId)) return;
  const quantity = readings.filter(item => item.familyId === entry.familyId && item.language === entry.language).length;
  track('familia', { accio, familia: entry.familyId, llengua: entry.language, origen, quantitat: countBucket(quantity) });
}

export function trackFeature(name, data) { track(name, data); }

export function trackReadingFeature(name, reading, data = {}) {
  track(name, { ...data, ...readingData(reading) });
}

export async function sendReadingReport(reading, { part, element, motiu, responseMode }) {
  if (reportAvailability() || reading.personal) return false;
  const entry = readings.find(item => item.id === reading.id);
  if (!entry || !Object.hasOwn(reportReasons, part) || !Object.hasOwn(reportReasons[part], motiu)) return false;

  if (part === 'text') {
    const number = Number(element);
    if (element && (String(number) !== element || !Number.isInteger(number) || number < 1 || number > entry.paragraphs.length)) return false;
  } else if (part === 'image') {
    if (!entry.images.some(image => image.id === element)) return false;
  } else if (!entry.questions.some(question => question.id === element && (part !== 'solution' || question.answer))) {
    return false;
  }
  const data = { codi: entry.code, llengua: entry.language, nivell: entry.level, dificultat: entry.difficulty, part, motiu };
  if (element) data.element = element;
  if (['question', 'solution'].includes(part) && responseMode !== undefined) {
    if (!['open', 'choice'].includes(responseMode)) return false;
    if (responseMode === 'choice' && !multipleChoice(entry, entry.questions.find(question => question.id === element))) return false;
    data.format_pregunta = responseMode === 'choice' ? 'abcd' : 'oberta';
  }

  // The tracker does not return a delivery status. This explicit action checks
  // the collector's acknowledgement so the dialog can report a blocked send.
  try {
    const headers = { 'Content-Type': 'application/json', 'x-umami-website-id': websiteId, 'x-umami-hostname': host };
    const cache = window.umami.getSession?.()?.cache;
    if (cache) headers['x-umami-cache'] = cache;
    const response = await fetch(collectURL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ type: 'event', payload: { ...page, name: 'notifica_error', data } }),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return false;
    const result = await response.json();
    return Boolean(typeof result?.cache === 'string' && result.cache && !result.disabled && !result.error);
  } catch { return false; }
}
