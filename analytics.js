const host = 'trama.ortogra.fi';
const scriptURL = 'https://maquestria.tail72bc84.ts.net:8443/script.js';
const websiteId = 'b84afe8e-e26b-4e71-8150-3b167d4f89a3';

function analyticsAllowed() {
  return location.protocol === 'https:' && location.hostname === host &&
    navigator.doNotTrack !== '1' && window.doNotTrack !== '1' && navigator.globalPrivacyControl !== true;
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
  window.tramaBeforeSend = (type, payload) => {
    if (!analyticsAllowed() || type !== 'event' || !payload || (payload.name && payload.name !== 'obre_lectura')) return false;
    // Keep the pageview and event name; never send a reading ID, hash, or form value.
    return { website: websiteId, hostname: host, title: 'Trama', url: '/', name: payload.name };
  };
  document.head.append(script);
}

export function trackReadingOpened() {
  if (!analyticsAllowed()) return;
  try { window.umami?.track?.('obre_lectura')?.catch?.(() => {}); } catch { /* Analytics is optional. */ }
}
