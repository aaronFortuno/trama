import { labels } from './catalog.js';
import { readings } from './data/readings.js';

const host = 'trama.ortogra.fi';
const scriptURL = 'https://maquestria.tail72bc84.ts.net:8443/script.js';
const collectURL = new URL('/api/send', scriptURL);
const websiteId = 'b84afe8e-e26b-4e71-8150-3b167d4f89a3';
const publicCodes = new Set(readings.map(reading => reading.code));
const page = { website: websiteId, hostname: host, title: 'Trama', url: '/' };

export const reportReasons = {
  text: { wording: 'Errada de llengua', fact: 'Dada incorrecta', coherence: 'Incoherència' },
  image: { error: 'Conté un error', mismatch: 'No encaixa amb el text', inappropriate: 'És inadequada' },
  question: { wording: 'Està mal formulada', unsupported: 'No es pot respondre a partir del text', inappropriate: 'És inadequada' },
  solution: { incorrect: 'Resposta incorrecta', incomplete: 'Resposta incompleta', mismatch: 'No correspon a la pregunta' },
};

function analyticsAllowed() {
  return location.protocol === 'https:' && location.hostname === host &&
    navigator.globalPrivacyControl !== true &&
    ![navigator.doNotTrack, window.doNotTrack, navigator.msDoNotTrack].some(value => ['1', 'yes', 1].includes(value));
}

function knownFilter(facet, value) {
  return Object.hasOwn(labels, facet) && Object.hasOwn(labels[facet], value);
}

function beforeSend(type, payload) {
  if (!analyticsAllowed() || type !== 'event' || !payload) return false;
  const { name, data } = payload;
  if (name === undefined) return page;
  if (name === 'obre_lectura') {
    if (publicCodes.has(data?.codi)) return { ...page, name, data: { codi: data.codi } };
    return { ...page, name };
  }
  // Imported readings may add arbitrary options to the catalogue. Send only
  // values that are part of Trama's own filter vocabulary.
  if (name === 'aplica_filtre' && knownFilter(data?.filtre, data?.valor)) {
    const { filtre, valor, nivell } = data;
    const selection = { filtre, valor };
    if (filtre === 'length' && knownFilter('level', nivell)) selection.nivell = nivell;
    return { ...page, name, data: selection };
  }
  return false;
}

export function startAnalytics() {
  if (!analyticsAllowed() || document.getElementById('trama-analytics')) return;
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
  document.head.append(script);
}

function track(name, data) {
  if (!analyticsAllowed()) return;
  try { window.umami?.track?.(name, data)?.catch?.(() => {}); } catch { /* Analytics is optional. */ }
}

export function trackReadingOpened(reading) {
  track('obre_lectura', reading.personal ? undefined : { codi: reading.code });
}

export function trackFilterApplied(filtre, valor, nivell) {
  track('aplica_filtre', { filtre, valor, nivell });
}

export async function sendReadingReport(reading, { part, element, motiu }) {
  if (!analyticsAllowed() || typeof window.umami?.track !== 'function' || reading.personal) return false;
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
  const data = { codi: entry.code, llengua: entry.language, part, motiu };
  if (element) data.element = element;

  // The tracker does not return a delivery status. This explicit action checks
  // the collector's acknowledgement so the dialog can report a blocked send.
  try {
    if (localStorage.getItem('umami.disabled')) return false;
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
