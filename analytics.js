import { labels } from './catalog.js';
import { readings } from './data/readings.js';

const host = 'trama.ortogra.fi';
const scriptURL = 'https://maquestria.tail72bc84.ts.net:8443/script.js';
const websiteId = 'b84afe8e-e26b-4e71-8150-3b167d4f89a3';
const publicCodes = new Set(readings.map(reading => reading.code));

function analyticsAllowed() {
  return location.protocol === 'https:' && location.hostname === host &&
    navigator.doNotTrack !== '1' && window.doNotTrack !== '1' && navigator.globalPrivacyControl !== true;
}

function knownFilter(facet, value) {
  return Object.hasOwn(labels, facet) && Object.hasOwn(labels[facet], value);
}

function beforeSend(type, payload) {
  if (!analyticsAllowed() || type !== 'event' || !payload) return false;
  const { name, data } = payload;
  const page = { website: websiteId, hostname: host, title: 'Trama', url: '/' };

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
