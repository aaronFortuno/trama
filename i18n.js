import { es } from './locales/es.js';
import { gl } from './locales/gl.js';
import { eu } from './locales/eu.js';

const dictionaries = { ca: {}, es, gl, eu };
export const languages = Object.keys(dictionaries);
const preference = 'trama.language';
let locale = 'ca';
try {
  const saved = localStorage.getItem(preference);
  if (Object.hasOwn(dictionaries, saved)) locale = saved;
} catch { /* Use the default language. */ }

export const language = () => locale;
export const t = (source, values = {}, target = locale) => ((Object.hasOwn(dictionaries, target) ? dictionaries[target][source] : undefined) ?? source)
  .replace(/\{(\w+)\}/g, (token, name) => values[name] ?? token);

// The interface can be translated before readings exist in that language.
export function defaultReadingLanguage(available = ['ca', 'es']) {
  const supported = new Set(available);
  return supported.has(locale) ? locale : supported.has('es') ? 'es' : supported.has('ca') ? 'ca' : [...supported][0] ?? 'es';
}

export function setLanguage(value) {
  if (!Object.hasOwn(dictionaries, value)) return;
  locale = value;
  document.documentElement.lang = locale;
  try { localStorage.setItem(preference, locale); } catch { /* Keep the language for this visit. */ }
}

export function bindTranslations(root) {
  const updates = [];
  const releases = new Map([...root.querySelectorAll('.release')].map(node => [node, node.querySelector('p')?.textContent.trim()]));
  const targetFor = node => {
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    const release = element?.closest?.('.release');
    return release && !['ca', 'es'].includes(locale) && !Object.hasOwn(dictionaries[locale], releases.get(release)) ? 'ca' : locale;
  };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  const known = value => Object.values(dictionaries).some(dictionary => Object.hasOwn(dictionary, value));
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest('[lang]:not(html), [translate="no"]')) continue;
      const original = node.data;
      const source = original.trim();
      if (known(source)) updates.push(() => { node.data = original.replace(source, t(source, {}, targetFor(node))); });
    } else {
      if (node.closest('[translate="no"]')) continue;
      for (const attr of ['aria-label', 'alt', 'placeholder', 'title', 'content', 'label']) {
        const source = node.getAttribute(attr);
        if (source && known(source)) updates.push(() => node.setAttribute(attr, t(source, {}, targetFor(node))));
      }
      if (node.matches('time[datetime]')) {
        const date = new Date(node.dateTime);
        if (!Number.isNaN(date.getTime())) updates.push(() => {
          node.textContent = new Intl.DateTimeFormat(targetFor(node), { dateStyle: 'long', timeZone: 'UTC' }).format(date);
        });
      }
    }
  }
  const update = () => {
    updates.forEach(run => run());
    for (const release of releases.keys()) release.lang = targetFor(release);
  };
  update();
  return update;
}
