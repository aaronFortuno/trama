import { animateRefresh, setDisclosure } from './motion.js';
import { syncSelects } from './select-menu.js';
import { language, languages, t } from './i18n.js';

export const labels = {
  language: { es: 'Castellà', ca: 'Català' },
  level: {
    '1-primary': '1r de primària', '2-primary': '2n de primària', '3-primary': '3r de primària',
    '4-primary': '4t de primària', '5-primary': '5è de primària', '6-primary': '6è de primària',
    '1-secondary': '1r d’ESO', '2-secondary': '2n d’ESO', '3-secondary': '3r d’ESO', '4-secondary': '4t d’ESO',
    '1-baccalaureate': '1r de batxillerat', '2-baccalaureate': '2n de batxillerat',
  },
  difficulty: { initial: 'Inicial', intermediate: 'Intermèdia', advanced: 'Avançada' },
  length: { short: 'Curta', medium: 'Mitjana', long: 'Llarga' },
  theme: { nature: 'Natura', community: 'Comunitat', adventure: 'Aventures', science: 'Ciència', arts: 'Art i cultura', everyday: 'Vida quotidiana', history: 'Història', math: 'Matemàtiques' },
  question: { literal: 'Literal', inference: 'Inferència', opinion: 'Opinió', vocabulary: 'Vocabulari', structure: 'Estructura del text', summary: 'Resum' },
  genre: { narrative: 'Narració', informative: 'Divulgació', instructional: 'Text instructiu', interview: 'Entrevista', letter: 'Carta' },
};

const languageNames = new Map(languages.map(code => [code, new Intl.DisplayNames(code, { type: 'language' })]));
const rankedFacets = ['level', 'difficulty', 'length'];
const firstBatchSize = 12;
const rowsPerBatch = 2;

// Editorial word ranges for the levels covered by the catalogue.
const lengthLimits = new Map([
  ['4-primary', { shortMax: 185, mediumMax: 210 }],
  ['5-primary', { shortMax: 240, mediumMax: 265 }],
  ['6-primary', { shortMax: 290, mediumMax: 300 }],
]);

export function labelFor(facet, value, locale = language()) {
  if (value === 'unspecified') return t('Sense especificar', {}, locale);
  if (Object.hasOwn(labels[facet] ?? {}, value)) return t(labels[facet][value], {}, locale);
  let label = value.replaceAll('-', ' ');
  if (facet === 'language') {
    try { label = languageNames.get(locale).of(value); } catch { /* Retain the supplied label if it is not a language tag. */ }
  }
  return label.charAt(0).toLocaleUpperCase(locale) + label.slice(1);
}

export function wordCount(reading) {
  return reading.paragraphs.join(' ').match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function lengthBucket(count, level) {
  const limits = lengthLimits.get(level);
  if (!limits) return 'unspecified';
  if (count <= limits.shortMax) return 'short';
  if (count <= limits.mediumMax) return 'medium';
  return 'long';
}

function lengthLabel(value, level, numberFormat) {
  const label = labelFor('length', value);
  const limits = lengthLimits.get(level);
  if (!limits || value === 'unspecified') return label;
  const { shortMax, mediumMax } = limits;
  const format = count => numberFormat.format(count);
  const ranges = {
    short: `≤${format(shortMax)}`,
    medium: `${format(shortMax + 1)}–${format(mediumMax)}`,
    long: `>${format(mediumMax)}`,
  };
  return `${label} (${ranges[value]})`;
}

function normalize(value) {
  return value.toLocaleLowerCase('ca').normalize('NFD').replace(/\p{M}/gu, '');
}

export function indexCatalog(readings) {
  return readings.map((reading) => {
    const count = wordCount(reading);
    const facets = {
      language: [reading.language], level: [reading.level], difficulty: [reading.difficulty], length: [lengthBucket(count, reading.level)],
      theme: reading.themes, question: reading.questions.map(({ type }) => type), genre: [reading.genre],
    };
    const terms = languages.flatMap(locale => Object.entries(facets).flatMap(([facet, values]) => values.map(value => labelFor(facet, value, locale))));
    const searchText = normalize([reading.code, reading.title, reading.summary, ...terms].join(' '));
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

function sortFacet(facet, a, b, compare) {
  if (rankedFacets.includes(facet)) {
    const order = Object.keys(labels[facet]);
    const rankA = Object.hasOwn(labels[facet], a) ? order.indexOf(a) : order.length;
    const rankB = Object.hasOwn(labels[facet], b) ? order.indexOf(b) : order.length;
    if (rankA !== rankB) return rankA - rankB;
  }
  return compare(labelFor(facet, a), labelFor(facet, b));
}

export function mountCatalog({ root, readings, onSelect }) {
  let catalog = indexCatalog(readings);
  for (let index = catalog.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [catalog[index], catalog[other]] = [catalog[other], catalog[index]];
  }

  const search = root.querySelector('#search');
  const fields = [...root.querySelectorAll('[data-facet]')];
  const levelField = root.querySelector('#filter-level');
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
  let limit = firstBatchSize;
  let visibleIds;
  const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && document.activeElement !== more) loadMore();
  }) : null;

  function updateOptions() {
    const { compare } = new Intl.Collator(language(), { numeric: true });
    const numbers = new Intl.NumberFormat(language());
    const levelMatches = catalog.filter(item => item.reading.level === levelField.value);
    const level = levelMatches.length ? levelField.value : '';
    const levelReadings = level ? levelMatches : catalog;
    for (const field of fields) {
      const facet = field.dataset.facet;
      const selected = field.value;
      const source = facet === 'length' || facet === 'difficulty' ? levelReadings : catalog;
      const options = [...new Set(source.flatMap(item => item.facets[facet]))];
      options.sort((a, b) => sortFacet(facet, a, b, compare));
      const optionLabel = value => facet === 'length' ? lengthLabel(value, level, numbers) : labelFor(facet, value);
      field.replaceChildren(field.options[0], ...options.map(value => new Option(optionLabel(value), value)));
      field.value = options.includes(selected) ? selected : '';
    }
    syncSelects(root);
  }
  levelField.addEventListener('change', updateOptions);
  for (const field of fields) field.addEventListener('change', refresh);

  function cardFor({ reading, count }, words) {
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
    card.querySelector('.card-code').textContent = reading.code;
    card.querySelector('.card-personal').hidden = !reading.personal;
    card.querySelector('.card-words').textContent = t(count === 1 ? '{count} paraula' : '{count} paraules', { count: words.format(count) });
    const countQuestions = reading.questions.length;
    card.querySelector('.card-questions').textContent = t(countQuestions === 1 ? '{count} pregunta' : '{count} preguntes', { count: words.format(countQuestions) });
    open.dataset.id = reading.id;
    open.firstElementChild.id = `reading-open-${reading.id}`;
    open.setAttribute('aria-labelledby', `${open.firstElementChild.id} ${title.id}`);
    open.addEventListener('click', () => onSelect(reading.id));
    return card;
  }

  function render({ append = false, animated = false, translated = false } = {}) {
    const words = new Intl.NumberFormat(language());
    const facets = Object.fromEntries(fields.map((field) => [field.dataset.facet, field.value]));
    const activeCount = Object.values(facets).filter(Boolean).length;
    const matches = filterCatalog(catalog, { search: search.value, ...facets });
    const total = matches.length;
    const showing = Math.min(limit, total);
    const visible = matches.slice(0, showing);
    const ids = visible.map(({ reading }) => reading.id).join(' ');
    if (translated || ids !== visibleIds) {
      const cards = visible.slice(append ? grid.childElementCount : 0).map(item => cardFor(item, words));
      if (append) {
        grid.append(...cards);
        for (const card of cards) animateRefresh(card);
      } else {
        grid.replaceChildren(...cards);
        if (!translated) {
          const scrollPane = compact.matches ? root.closest('main') : results;
          scrollPane.scrollTop = 0;
        }
        if (animated) animateRefresh(total ? grid : emptyState);
      }
      visibleIds = ids;
    }
    resultCount.textContent = total === 1 ? '1 lectura' : t('{count} lectures', { count: words.format(total) });
    emptyState.hidden = total !== 0;
    more.hidden = showing === total;
    more.textContent = t('Mostra més lectures ({showing} de {total})', {
      showing: words.format(showing), total: words.format(total),
    });
    observer?.unobserve(more);
    observer?.takeRecords();
    if (!more.hidden) observer?.observe(more);
    indicator.textContent = activeCount ? ` (${activeCount})` : '';
    reset.hidden = !activeCount && !search.value.trim();
  }

  function refresh() {
    limit = firstBatchSize;
    render({ animated: true });
  }

  function loadMore(focusFirst = false) {
    if (more.hidden || root.hidden) return;
    const firstNewCard = grid.childElementCount;
    const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    limit = firstNewCard + columns * rowsPerBatch;
    render({ append: true });
    if (focusFirst) grid.children[firstNewCard]?.querySelector('button').focus();
  }

  function clear() {
    search.value = '';
    for (const field of fields) field.value = '';
    updateOptions();
    refresh();
    search.focus();
  }

  reset.setAttribute('aria-label', t('Neteja la cerca i els filtres'));
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
  updateOptions();
  more.addEventListener('click', () => loadMore(true));
  render();

  return {
    replaceReadings(items) {
      const positions = new Map(catalog.map(({ reading }, index) => [reading.id, index]));
      const newPosition = catalog.length;
      catalog = indexCatalog(items).sort((a, b) => (
        (positions.get(a.reading.id) ?? newPosition) - (positions.get(b.reading.id) ?? newPosition)
      ));
      updateOptions();
      refresh();
    },
    reveal(code) {
      search.value = code;
      for (const field of fields) field.value = '';
      updateOptions();
      refresh();
    },
    translate() {
      reset.setAttribute('aria-label', t('Neteja la cerca i els filtres'));
      updateOptions();
      render({ translated: true });
    },
    focus(readingId) {
      const button = [...grid.querySelectorAll('button[data-id]')].find(({ dataset }) => dataset.id === readingId);
      (button ?? root.querySelector('#readings-title')).focus();
    },
  };
}
