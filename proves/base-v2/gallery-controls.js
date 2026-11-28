import { mountDialog } from './dialog.js?v=0.10.0';

const labels = {
  ca: { search: 'Cerca al catàleg', help: name => `Com funciona ${name}`, close: 'Tanca l’ajuda' },
  es: { search: 'Buscar en el catálogo', help: name => `Cómo funciona ${name}`, close: 'Cerrar la ayuda' },
  gl: { search: 'Busca no catálogo', help: name => `Como funciona ${name}`, close: 'Pechar a axuda' },
  eu: { search: 'Bilatu katalogoan', help: name => `Nola funtzionatzen du ${name}k?`, close: 'Itxi laguntza' },
};
export const galleryLabels = locale => labels[locale] ?? labels.ca;

const counts = {
  trama: {
    ca: ['comprensió lectora', 'comprensions lectores', 'per a la teva aula'],
    es: ['comprensión lectora', 'comprensiones lectoras', 'para tu aula'],
    gl: ['comprensión lectora', 'comprensións lectoras', 'para a túa aula'],
    eu: ['irakurmen-ariketa', 'irakurmen-ariketa', 'zure ikasgelarako'],
  },
  sentit: {
    ca: ['comprensió oral', 'comprensions orals', 'per a la teva aula'],
    es: ['comprensión oral', 'comprensiones orales', 'para tu aula'],
  },
  'mon-a-ma': { ca: ['tema de medi', 'temes de medi', 'per a la teva aula'] },
  'fil-i-compte': { ca: ['problema de càlcul', 'problemes de càlcul', 'per a la teva aula'] },
};

export function formatCatalogCount(project, count, locale) {
  const [single, plural, suffix] = counts[project][locale] ?? counts[project].ca;
  return `${new Intl.NumberFormat(locale).format(count)} ${count === 1 ? single : plural} ${suffix}`;
}

export function gallerySearchFocusTarget(search) {
  return search.offsetWidth ? search : search.closest('.of-gallery-head')?.querySelector('[data-of-search-toggle]') ?? search;
}

export function mountGallerySearch(head) {
  const panel = head.querySelector('[data-of-search-panel]');
  const trigger = head.querySelector('[data-of-search-toggle]');
  const search = panel?.querySelector('input[type="search"]');
  if (!search || !trigger) return;
  const compact = matchMedia('(max-width: 790px)');

  function sync() {
    if (panel.matches(':popover-open')) panel.hidePopover();
    panel.toggleAttribute('popover', compact.matches);
    panel.classList.toggle('of-popup', compact.matches);
    trigger.toggleAttribute('data-compact', compact.matches);
    trigger.setAttribute('aria-expanded', 'false');
  }

  panel.addEventListener('beforetoggle', event => {
    if (event.newState === 'open') panel.style.setProperty('--of-search-top', `${head.getBoundingClientRect().bottom + 6}px`);
  });
  panel.addEventListener('toggle', () => {
    const open = panel.matches(':popover-open');
    trigger.setAttribute('aria-expanded', String(open));
    if (open) search.focus({ preventScroll: true });
  });
  search.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || !panel.matches(':popover-open')) return;
    event.preventDefault();
    panel.hidePopover();
    trigger.focus({ preventScroll: true });
  });
  compact.addEventListener('change', sync);
  sync();
}

export function mountGalleryHelp(dialog, trigger, update = () => {}) {
  mountDialog(dialog, trigger, { onOpen: update });
}
