import { animateRefresh, setDisclosure } from './motion.js';

export const labels = {
  language: { es: 'Castellà', ca: 'Català' },
  level: {
    '1-primary': '1r de primària', '2-primary': '2n de primària', '3-primary': '3r de primària',
    '4-primary': '4t de primària', '5-primary': '5è de primària', '6-primary': '6è de primària',
    '1-secondary': '1r d’ESO', '2-secondary': '2n d’ESO', '3-secondary': '3r d’ESO', '4-secondary': '4t d’ESO',
    '1-baccalaureate': '1r de batxillerat', '2-baccalaureate': '2n de batxillerat',
  },
  difficulty: { initial: 'Inicial', intermediate: 'Intermèdia', advanced: 'Avançada' },
  length: { short: 'Curta (fins a 180 paraules)', medium: 'Mitjana (181–280)', long: 'Llarga (més de 280)' },
  theme: { nature: 'Natura', community: 'Comunitat', adventure: 'Aventures', science: 'Ciència', arts: 'Art i cultura', everyday: 'Vida quotidiana' },
  question: { literal: 'Literal', inference: 'Inferència', opinion: 'Opinió', vocabulary: 'Vocabulari', structure: 'Estructura del text' },
  genre: { narrative: 'Narració', informative: 'Divulgació', instructional: 'Text instructiu', interview: 'Entrevista', letter: 'Carta' },
};

const languageNames = new Intl.DisplayNames('ca', { type: 'language' });
const sortLabels = new Intl.Collator('ca', { numeric: true });
const words = new Intl.NumberFormat('ca');
const rankedFacets = ['level', 'difficulty', 'length'];
const pageSize = 12;

export function labelFor(facet, value) {
  if (Object.hasOwn(labels[facet] ?? {}, value)) return labels[facet][value];
  let label = value.replaceAll('-', ' ');
  if (facet === 'language') {
    try { label = languageNames.of(value); } catch { /* Retain the supplied label if it is not a language tag. */ }
  }
  return label.charAt(0).toLocaleUpperCase('ca') + label.slice(1);
}

export function wordCount(reading) {
  return reading.paragraphs.join(' ').match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function lengthBucket(count) {
  if (count <= 180) return 'short';
  if (count <= 280) return 'medium';
  return 'long';
}

function normalize(value) {
  return value.toLocaleLowerCase('ca').normalize('NFD').replace(/\p{M}/gu, '');
}

export function indexCatalog(readings) {
  return readings.map((reading) => {
    const count = wordCount(reading);
    const facets = {
      language: [reading.language], level: [reading.level], difficulty: [reading.difficulty], length: [lengthBucket(count)],
      theme: reading.themes, question: reading.questions.map(({ type }) => type), genre: [reading.genre],
    };
    const terms = Object.entries(facets).flatMap(([facet, values]) => values.map((value) => labelFor(facet, value)));
    const searchText = normalize([reading.title, reading.summary, ...terms].join(' '));
    return { reading, count, facets, searchText };
  });
}

export function filterCatalog(catalog, { search = '', ...facets } = {}) {
  const terms = normalize(search).trim().split(/\s+/).filter(Boolean);
  return catalog.filter((item) => (
    terms.every((term) => item.searchText.includes(term))
    && Object.entries(facets).every(([facet, value]) => !value || item.facets[facet].includes(value))
  ));
}

function sortFacet(facet, a, b) {
  if (rankedFacets.includes(facet)) {
    const order = Object.keys(labels[facet]);
    const rankA = Object.hasOwn(labels[facet], a) ? order.indexOf(a) : order.length;
    const rankB = Object.hasOwn(labels[facet], b) ? order.indexOf(b) : order.length;
    if (rankA !== rankB) return rankA - rankB;
  }
  return sortLabels.compare(labelFor(facet, a), labelFor(facet, b));
}

export function mountCatalog({ root, readings, onSelect }) {
  const catalog = indexCatalog(readings);
  const search = root.querySelector('#search');
  const fields = [...root.querySelectorAll('[data-facet]')];
  const grid = root.querySelector('#reading-grid');
  const resultCount = root.querySelector('#result-count');
  const emptyState = root.querySelector('#catalog-empty');
  const reset = root.querySelector('#filters-reset');
  const more = root.querySelector('#show-more');
  const toggle = root.querySelector('#filters-toggle');
  const filters = root.querySelector('#filters-body');
  const results = root.querySelector('.catalog-results-scroll');
  const compact = matchMedia('(max-width: 790px)');
  const indicator = root.querySelector('#filter-indicator');
  const template = document.querySelector('#reading-card');
  let limit = pageSize;
  let visibleIds;

  for (const field of fields) {
    const facet = field.dataset.facet;
    const options = [...new Set(catalog.flatMap((item) => item.facets[facet]))];
    options.sort((a, b) => sortFacet(facet, a, b));
    for (const value of options) field.add(new Option(labelFor(facet, value), value));
    field.addEventListener('change', refresh);
  }

  function cardFor({ reading, count }) {
    const card = template.content.firstElementChild.cloneNode(true);
    const art = card.querySelector('.card-art');
    const image = art.querySelector('img');
    const title = card.querySelector('.card-title');
    const summary = card.querySelector('.card-summary');
    const difficulty = card.querySelector('.card-difficulty');
    const open = card.querySelector('.card-open');
    const imagePath = reading.images[0]?.src;
    if (imagePath) {
      image.src = imagePath;
      image.addEventListener('error', () => image.remove(), { once: true });
    } else {
      image.remove();
    }
    card.querySelector('.card-genre').textContent = labelFor('genre', reading.genre);
    card.querySelector('.card-level').textContent = `${labelFor('language', reading.language)} · ${labelFor('level', reading.level)}`;
    title.textContent = reading.title;
    title.lang = reading.language;
    title.id = `reading-title-${reading.id}`;
    summary.textContent = reading.summary;
    summary.lang = reading.language;
    difficulty.textContent = labelFor('difficulty', reading.difficulty);
    difficulty.dataset.difficulty = reading.difficulty;
    card.querySelector('.card-words').textContent = `${words.format(count)} ${count === 1 ? 'paraula' : 'paraules'}`;
    const countQuestions = reading.questions.length;
    card.querySelector('.card-questions').textContent = `${countQuestions} ${countQuestions === 1 ? 'pregunta' : 'preguntes'}`;
    open.dataset.id = reading.id;
    open.firstElementChild.id = `reading-open-${reading.id}`;
    open.setAttribute('aria-labelledby', `${open.firstElementChild.id} ${title.id}`);
    open.addEventListener('click', () => onSelect(reading.id));
    return card;
  }

  function render({ append = false, animated = false } = {}) {
    const facets = Object.fromEntries(fields.map((field) => [field.dataset.facet, field.value]));
    const activeCount = Object.values(facets).filter(Boolean).length;
    const matches = filterCatalog(catalog, { search: search.value, ...facets });
    const total = matches.length;
    const showing = Math.min(limit, total);
    const visible = matches.slice(0, showing);
    const ids = visible.map(({ reading }) => reading.id).join(' ');
    if (ids !== visibleIds) {
      const cards = visible.slice(append ? grid.childElementCount : 0).map(cardFor);
      if (append) {
        grid.append(...cards);
        for (const card of cards) animateRefresh(card);
        cards[0]?.querySelector('button').focus();
      } else {
        grid.replaceChildren(...cards);
        results.scrollTop = 0;
        if (animated) animateRefresh(total ? grid : emptyState);
      }
      visibleIds = ids;
    }
    resultCount.textContent = total === 1 ? '1 lectura' : `${words.format(total)} lectures`;
    if (showing < total) resultCount.textContent += ` · Se’n mostren ${words.format(showing)}`;
    emptyState.hidden = total !== 0;
    more.hidden = showing === total;
    indicator.textContent = activeCount ? ` (${activeCount})` : '';
    reset.hidden = !activeCount && !search.value.trim();
  }

  function refresh() {
    limit = pageSize;
    render({ animated: true });
  }

  function clear() {
    search.value = '';
    for (const field of fields) field.value = '';
    refresh();
    search.focus();
  }

  reset.setAttribute('aria-label', 'Neteja la cerca i els filtres');
  search.addEventListener('input', refresh);
  reset.addEventListener('click', clear);
  root.querySelector('#empty-reset').addEventListener('click', clear);
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'false';
    toggle.setAttribute('aria-expanded', String(expanded));
    setDisclosure(filters, expanded);
  });
  function resizeFilters() {
    setDisclosure(filters, !compact.matches || toggle.getAttribute('aria-expanded') === 'true', { animated: false });
  }
  compact.addEventListener('change', resizeFilters);
  resizeFilters();
  more.addEventListener('click', () => {
    limit += pageSize;
    render({ append: true });
  });
  render();

  return {
    focus(readingId) {
      const button = [...grid.querySelectorAll('button[data-id]')].find(({ dataset }) => dataset.id === readingId);
      (button ?? root.querySelector('#readings-title')).focus();
    },
  };
}
