import { es } from './locales/es.js';

const dictionaries = { ca: {}, es };
export const languages = Object.keys(dictionaries);
const preference = 'trama.language';
let locale = 'ca';
try {
  const saved = localStorage.getItem(preference);
  if (Object.hasOwn(dictionaries, saved)) locale = saved;
} catch { /* Use the default language. */ }

export const language = () => locale;
export const t = (source, values = {}, target = locale) => (dictionaries[target][source] ?? source)
  .replace(/\{(\w+)\}/g, (token, name) => values[name] ?? token);

export function setLanguage(value) {
  if (!Object.hasOwn(dictionaries, value)) return;
  locale = value;
  document.documentElement.lang = locale;
  try { localStorage.setItem(preference, locale); } catch { /* Keep the language for this visit. */ }
}

export function bindTranslations(root) {
  const updates = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  const known = value => Object.values(dictionaries).some(dictionary => Object.hasOwn(dictionary, value));
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest('[lang]:not(html)')) continue;
      const original = node.data;
      const source = original.trim();
      if (known(source)) updates.push(() => { node.data = original.replace(source, t(source)); });
    } else {
      for (const attr of ['aria-label', 'alt', 'placeholder', 'title', 'content', 'label']) {
        const source = node.getAttribute(attr);
        if (source && known(source)) updates.push(() => node.setAttribute(attr, t(source)));
      }
      if (node.matches('time[datetime]')) {
        const date = new Date(node.dateTime);
        if (!Number.isNaN(date.getTime())) updates.push(() => {
          node.textContent = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
        });
      }
    }
  }
  const update = () => updates.forEach(run => run());
  update();
  return update;
}
