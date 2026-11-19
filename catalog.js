import { animateRefresh, closeDialog, mountDisclosures, openDialog } from './motion.js';
import { placeMenu, syncSelects } from './select-menu.js';
import { language, languages, t } from './i18n.js';
import { collectionsKey, listCollections, moveCollectionReading, removeCollection, removeCollectionReading, saveCollectionEntries } from './collections.js';
import { mountCatalogGestures } from './catalog-gestures.js';
import { universes } from './data/universes.js';
import { familyById } from './data/families.js';
import { familyMembers, groupFamilyCards } from './reading-families.js';

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
  universe: { 'no-universe': 'Sense univers', ...Object.fromEntries(universes.map(universe => [universe.id, universe.name.ca])) },
  family: { 'with-variants': 'Amb variants', 'no-variants': 'Sense variants' },
  theme: { nature: 'Natura', community: 'Comunitat', adventure: 'Aventures', science: 'Ciència', arts: 'Art i cultura', everyday: 'Vida quotidiana', history: 'Història', math: 'Matemàtiques', environment: 'Medi ambient', sports: 'Esport', technology: 'Tecnologia', geography: 'Geografia', games: 'Jocs i enigmes' },
  question: { literal: 'Literal', inference: 'Inferència', opinion: 'Opinió', vocabulary: 'Vocabulari', structure: 'Estructura del text', summary: 'Resum' },
  genre: { narrative: 'Narració', informative: 'Divulgació', instructional: 'Text instructiu', interview: 'Entrevista', letter: 'Carta', news: 'Notícia', review: 'Ressenya', diary: 'Diari', argument: 'Article d’opinió' },
};

const languageNames = new Map(languages.map(code => [code, new Intl.DisplayNames(code, { type: 'language' })]));
const rankedFacets = ['level', 'difficulty', 'length'];
const firstBatchSize = 12;
const rowsPerBatch = 2;
const catalogLanguageKey = 'trama.catalog-language';
const activeCollectionKey = 'trama.collection.active.v1';

function savedPreference(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Keep the selection for this visit. */ }
}

// Editorial word ranges for the levels covered by the catalogue.
const lengthLimits = new Map([
  ['3-primary', { shortMax: 125, mediumMax: 145 }],
  ['4-primary', { shortMax: 185, mediumMax: 210 }],
  ['5-primary', { shortMax: 240, mediumMax: 265 }],
  ['6-primary', { shortMax: 285, mediumMax: 359 }],
  ['1-secondary', { shortMax: 375, mediumMax: 475 }],
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
    long: `≥${format(mediumMax + 1)}`,
  };
  return `${label} (${ranges[value]})`;
}

function normalize(value) {
  return value.toLocaleLowerCase('ca').normalize('NFD').replace(/\p{M}/gu, '');
}

export function indexCatalog(readings) {
  const families = new Map();
  for (const reading of readings) if (reading.familyId) {
    const key = `${reading.familyId}:${reading.language}`;
    families.set(key, (families.get(key) ?? 0) + 1);
  }
  return readings.map((reading) => {
    const count = wordCount(reading);
    const facets = {
      language: [reading.language], level: [reading.level], difficulty: [reading.difficulty], length: [lengthBucket(count, reading.level)],
      theme: reading.themes, genre: [reading.genre], universe: reading.universeIds?.length ? reading.universeIds : ['no-universe'],
      family: [(families.get(`${reading.familyId}:${reading.language}`) ?? 0) > 1 ? 'with-variants' : 'no-variants'],
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

export function mountCatalog({ root, readings, onSelect, onFilterApplied, onActivity, onSaveCollection }) {
  let catalog = indexCatalog(readings);
  for (let index = catalog.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [catalog[index], catalog[other]] = [catalog[other], catalog[index]];
  }

  const search = root.querySelector('#search');
  const fields = [...root.querySelectorAll('[data-facet]')];
  const languageField = root.querySelector('#filter-language');
  const optionalFields = fields.filter(field => field !== languageField);
  const availableLanguages = new Set(readings.map(reading => reading.language));
  let languagePreference = savedPreference(catalogLanguageKey);
  if (!availableLanguages.has(languagePreference)) languagePreference = null;
  languageField.value = languagePreference ?? language();
  const levelField = root.querySelector('#filter-level');
  const grid = root.querySelector('#reading-grid');
  const resultCount = root.querySelector('#result-count');
  const heading = root.querySelector('#readings-title');
  const titleLine = root.querySelector('#catalog-title-line');
  const activeFilters = root.querySelector('#active-filters');
  const emptyState = root.querySelector('#catalog-empty');
  const reset = root.querySelector('#filters-reset');
  const more = root.querySelector('#show-more');
  const results = root.querySelector('.catalog-results-scroll');
  const compact = matchMedia('(max-width: 790px)');
  const indicator = root.querySelector('#filter-indicator');
  const extraIndicator = root.querySelector('#extra-filter-indicator');
  const collection = root.querySelector('#collection-select');
  const collectionTag = root.querySelector('#catalog-collection-label');
  const collectionContext = root.querySelector('#catalog-collection-context');
  const collectionExit = root.querySelector('#collection-exit');
  const collectionRemove = root.querySelector('#collection-remove');
  const collectionAdd = root.querySelector('#collection-add');
  const collectionHelp = root.querySelector('.collection-help');
  const collectionStatus = root.querySelector('#collection-status');
  const cardStatus = root.querySelector('#catalog-card-status');
  const selectionToggle = root.querySelector('#collection-save');
  const selectionBar = root.querySelector('#catalog-selection');
  const selectionCount = root.querySelector('#selection-count');
  const selectionAll = root.querySelector('#selection-all');
  const selectionSave = root.querySelector('#selection-save');
  const selectionCancel = root.querySelector('#selection-cancel');
  const selectedIds = new Set();
  let selecting = false;
  let addingTo;
  let collections = listCollections();
  let activeCollection = collections.find(entry => entry.id === savedPreference(activeCollectionKey));
  const template = document.querySelector('#reading-card');
  const clearButtons = new Map();
  let limit = firstBatchSize;
  let orderedMatches = [];
  let visibleIds;
  let searchTimer;
  let lastTrackedSearch = '';
  let gestures;
  let headingState;
  const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && document.activeElement !== more) loadMore();
  }) : null;

  function updateOptions(source, facets, numbers) {
    const { compare } = new Intl.Collator(language(), { numeric: true });
    const level = levelField.value;
    for (const field of fields) {
      const facet = field.dataset.facet;
      const { [facet]: selected, ...others } = facets;
      const candidates = filterCatalog(source, { search: search.value, ...others });
      const counts = new Map();
      for (const item of candidates) {
        for (const value of new Set(item.facets[facet])) counts.set(value, (counts.get(value) ?? 0) + 1);
      }
      const values = new Set(catalog.flatMap(item => item.facets[facet]));
      if (facet === 'length' && lengthLimits.has(level)) values.delete('unspecified');
      if (facet === 'length' && (!level || lengthLimits.has(level))) {
        for (const value of Object.keys(labels.length)) values.add(value);
      }
      if (facet === 'difficulty') for (const value of Object.keys(labels.difficulty)) values.add(value);
      if (selected) values.add(selected);
      const optionLabel = value => facet === 'length' ? lengthLabel(value, level, numbers) : labelFor(facet, value);
      const all = facet === 'language' ? [] : [field.options[0]];
      if (all.length) decorateOption(all[0], all[0].textContent, candidates.length, numbers);
      const options = [...values].sort((a, b) => sortFacet(facet, a, b, compare)).map(value => {
        const count = counts.get(value) ?? 0;
        const option = new Option('', value);
        decorateOption(option, optionLabel(value), count, numbers);
        option.disabled = facet !== 'language' && !count && value !== selected;
        return option;
      });
      field.replaceChildren(...all, ...options);
      field.value = selected;
    }
    updateActiveFilters(facets);
    syncSelects(root);
  }

  function decorateOption(option, label, count, numbers) {
    option.dataset.label = label;
    option.dataset.count = numbers.format(count);
    option.label = `${label} (${option.dataset.count})`;
  }

  function updateActiveFilters(facets) {
    const buttons = [];
    for (const [facet, value] of Object.entries(facets)) {
      if (facet === 'language') continue;
      const clear = clearButtons.get(facet);
      clear.hidden = !value;
      if (!value) continue;
      const label = labelFor(facet, value);
      const removeLabel = t('Treu el filtre «{label}»', { label });
      clear.setAttribute('aria-label', removeLabel);
      clear.title = removeLabel;
      const button = document.createElement('button');
      const cross = document.createElement('span');
      cross.textContent = '×';
      cross.setAttribute('aria-hidden', 'true');
      button.type = 'button';
      button.className = 'filter-chip';
      button.dataset.removeFacet = facet;
      button.setAttribute('aria-label', removeLabel);
      button.append(label, cross);
      buttons.push(button);
    }
    activeFilters.replaceChildren(...buttons);
    activeFilters.hidden = !buttons.length;
  }

  activeFilters.addEventListener('click', event => {
    const button = event.target.closest('[data-remove-facet]');
    if (!button) return;
    const chips = [...activeFilters.children];
    const index = chips.indexOf(button);
    fields.find(field => field.dataset.facet === button.dataset.removeFacet).value = '';
    onActivity?.('neteja_filtres', { filtre: button.dataset.removeFacet });
    refresh();
    const next = activeFilters.children[index] ?? activeFilters.lastElementChild ?? search;
    next.focus({ preventScroll: true });
  });

  for (const field of optionalFields) {
    const row = field.closest('.filter-field');
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'filter-clear';
    clear.textContent = '×';
    clear.hidden = true;
    clear.addEventListener('click', () => {
      field.value = '';
      onActivity?.('neteja_filtres', { filtre: field.dataset.facet });
      refresh();
      (row.querySelector('.select-trigger') ?? field).focus({ preventScroll: true });
    });
    field.addEventListener('change', () => {
      refresh();
      if (field.value) onFilterApplied?.(field.dataset.facet, field.value, levelField.value);
      else onActivity?.('neteja_filtres', { filtre: field.dataset.facet });
    });
    clearButtons.set(field.dataset.facet, clear);
    row.append(clear);
  }
  languageField.addEventListener('change', () => {
    languagePreference = languageField.value;
    savePreference(catalogLanguageKey, languagePreference);
    refresh();
    onFilterApplied?.('language', languagePreference, levelField.value);
  });

  function openFamily(reading, origin = 'cataleg') {
    const dialog = document.querySelector('#family-dialog');
    const members = familyMembers(catalog.map(item => item.reading), reading);
    const family = familyById.get(reading.familyId);
    dialog.querySelector('#family-title').textContent = `${family?.code ?? reading.code} · ${family?.name[language()] ?? reading.title}`;
    dialog.querySelector('#family-description').textContent = family?.description[language()] ?? t('Una mateixa lectura amb diferents graus d’exigència.');
    const matches = new Set(orderedMatches.map(item => item.reading.id));
    const hasOtherLevels = members.some(entry => !matches.has(entry.id));
    dialog.querySelector('#family-filter-note').hidden = !hasOtherLevels;
    dialog.querySelector('#family-options').replaceChildren(...members.map(entry => {
      const button = document.createElement('button');
      const title = document.createElement('strong');
      const meta = document.createElement('span');
      const detail = document.createElement('small');
      button.type = 'button';
      button.className = 'family-option';
      button.dataset.reading = entry.id;
      button.classList.toggle('is-match', hasOtherLevels && matches.has(entry.id));
      title.textContent = `${entry.code} · ${labelFor('level', entry.level)} · ${labelFor('difficulty', entry.difficulty)}`;
      meta.textContent = entry.summary;
      meta.lang = entry.language;
      detail.textContent = [t('{count} paraules', { count: wordCount(entry) }), t('{count} preguntes', { count: entry.questions.length }), ...(hasOtherLevels && matches.has(entry.id) ? [t('Coincideix amb els filtres')] : [])].join(' · ');
      button.append(title, meta, detail);
      button.addEventListener('click', () => closeDialog(dialog, () => onSelect(entry, origin)));
      return button;
    }));
    openDialog(dialog);
    dialog.querySelector('.dialog-scroll').scrollTop = 0;
    dialog.querySelector('#family-title').focus({ preventScroll: true });
  }

  function cardFor({ reading, count }, words) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.id = reading.id;
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
    const worlds = card.querySelector('.card-universes');
    worlds.textContent = (reading.universeIds ?? []).map(id => labelFor('universe', id)).join(' · ');
    worlds.hidden = !worlds.textContent;
    card.querySelector('.card-words').textContent = t(count === 1 ? '{count} paraula' : '{count} paraules', { count: words.format(count) });
    const countQuestions = reading.questions.length;
    card.querySelector('.card-questions').textContent = t(countQuestions === 1 ? '{count} pregunta' : '{count} preguntes', { count: words.format(countQuestions) });
    const members = familyMembers(catalog.map(item => item.reading), reading);
    const isFamily = !selecting && !activeCollection && members.length > 1;
    if (isFamily) {
      const family = familyById.get(reading.familyId);
      card.classList.add('is-family');
      card.dataset.familyId = reading.familyId;
      title.textContent = family?.name[reading.language] ?? reading.title;
      summary.textContent = family?.description[reading.language] ?? reading.summary;
      difficulty.textContent = t('{count} variants', { count: members.length });
      delete difficulty.dataset.difficulty;
      card.querySelector('.card-code').textContent = family?.code ?? reading.code;
      card.querySelector('.card-level').textContent = labelFor('language', reading.language);
      const levels = [...new Set(members.map(entry => labelFor('level', entry.level).replace(/ de (?:primària|primaria)$/, '')))];
      card.querySelector('.card-words').textContent = levels.join(' · ');
      card.querySelector('.card-questions').textContent = '';
      card.querySelector('.card-questions').hidden = true;
      open.setAttribute('aria-haspopup', 'dialog');
      open.setAttribute('aria-controls', 'family-dialog');
    }
    open.dataset.id = reading.id;
    open.firstElementChild.id = `reading-open-${reading.id}`;
    open.setAttribute('aria-labelledby', `${open.firstElementChild.id} ${title.id}`);
    open.addEventListener('click', () => {
      if (!selecting) { if (isFamily) openFamily(reading); else onSelect(reading); return; }
      if (selectedIds.has(reading.id)) selectedIds.delete(reading.id);
      else selectedIds.add(reading.id);
      syncSelection();
    });
    return card;
  }

  function render({ append = false, animated = false, translated = false, keepScroll = false } = {}) {
    const words = new Intl.NumberFormat(language());
    const facets = selectedFacets();
    const activeCount = optionalFields.filter(field => field.value).length;
    const source = collectionSource();
    orderedMatches = filterCatalog(source, { search: search.value, ...facets });
    const total = orderedMatches.length;
    if (!append) updateOptions(source, facets, words);
    selectionToggle.disabled = !source.length;
    const display = selecting || activeCollection ? orderedMatches : groupFamilyCards(orderedMatches);
    const showing = Math.min(limit, display.length);
    const visible = display.slice(0, showing);
    const ids = `${selecting}:${activeCollection?.id ?? ''}:` + visible.map(({ reading }) => reading.id).join(' ');
    if (translated || ids !== visibleIds) {
      const cards = visible.slice(append ? grid.childElementCount : 0).map(item => cardFor(item, words));
      if (append) {
        grid.append(...cards);
        for (const card of cards) animateRefresh(card);
      } else {
        grid.replaceChildren(...cards);
        if (!translated && !keepScroll) {
          const scrollPane = compact.matches ? root.closest('main') : results;
          scrollPane.scrollTop = 0;
        }
        if (animated) animateRefresh(total ? grid : emptyState);
      }
      visibleIds = ids;
    }
    const countLabel = total === 1 ? t('1 lectura') : t('{count} lectures', { count: words.format(total) });
    if (resultCount.textContent !== countLabel) resultCount.textContent = countLabel;
    emptyState.hidden = total !== 0;
    more.hidden = showing === display.length;
    more.textContent = t('Mostra més lectures ({showing} de {total})', {
      showing: words.format(showing), total: words.format(display.length),
    });
    observer?.unobserve(more);
    observer?.takeRecords();
    if (!more.hidden) observer?.observe(more);
    indicator.textContent = activeCount ? ` (${activeCount})` : '';
    const extraCount = fields.filter(field => field.closest('.catalog-extra-filters') && field.value).length;
    extraIndicator.textContent = extraCount ? ` (${extraCount})` : '';
    reset.hidden = !activeCount && !search.value.trim();
    syncSelection();
  }

  function collectionSource() {
    if (!activeCollection) return catalog;
    const byId = new Map(catalog.map(item => [item.reading.id, item]));
    return activeCollection.readingIds.map(id => byId.get(id)).filter(Boolean);
  }

  function syncSelection() {
    grid.classList.toggle('is-selecting', selecting);
    selectionBar.hidden = !selecting;
    selectionToggle.hidden = selecting;
    selectionToggle.setAttribute('aria-pressed', String(selecting));
    const count = selectedIds.size;
    const amount = new Intl.NumberFormat(language()).format(count);
    const countText = t(count === 1 ? '1 seleccionada' : '{count} seleccionades', { count: amount });
    selectionCount.textContent = addingTo ? t('Afegeix a «{name}» · {count}', { name: addingTo.name, count: countText }) : countText;
    selectionSave.textContent = t(addingTo ? 'Afegeix a la col·lecció' : 'Desa la selecció');
    selectionSave.disabled = !count;
    selectionAll.disabled = !orderedMatches.some(({ reading }) => !selectedIds.has(reading.id));
    for (const button of grid.querySelectorAll('.card-open')) {
      const card = button.closest('.reading-card');
      const selected = selecting && selectedIds.has(button.dataset.id);
      card.classList.toggle('is-selected', selected);
      card.querySelector('.card-selection').hidden = !selected;
      button.firstElementChild.textContent = t(selecting ? 'Selecciona' : card.classList.contains('is-family') ? 'Tria una variant' : 'Prepara la fitxa');
      if (selecting) button.setAttribute('aria-pressed', String(selected));
      else button.removeAttribute('aria-pressed');
      button.setAttribute('aria-describedby', selecting ? 'catalog-selection-help' : 'catalog-card-help');
    }
    if (selecting) gestures?.close();
    gestures?.sync();
  }

  function clearSelection() {
    const wasSelecting = selecting;
    selecting = false;
    addingTo = undefined;
    selectedIds.clear();
    if (wasSelecting) render({ keepScroll: true });
    else syncSelection();
  }

  function beginSelection() {
    selecting = true;
    const summary = root.querySelector('#catalog-collection-panel > summary');
    if (summary.getAttribute('aria-expanded') === 'false') summary.click();
    render({ keepScroll: true });
  }

  function selectedFacets() {
    return Object.fromEntries(fields.map(field => [field.dataset.facet, field.value]));
  }

  function refresh() {
    gestures?.close();
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
    clearTimeout(searchTimer);
    lastTrackedSearch = '';
    if (search.value.trim() || optionalFields.some(field => field.value)) onActivity?.('neteja_filtres', { filtre: 'tots' });
    search.value = '';
    for (const field of optionalFields) field.value = '';
    refresh();
    search.focus();
  }

  function syncCollections() {
    const all = collection.options[0];
    collection.replaceChildren(all, ...collections.map(entry => new Option(entry.name, entry.id)));
    collection.value = activeCollection?.id ?? '';
    const label = activeCollection?.name ?? t('Catàleg de lectures');
    const nextHeadingState = `${activeCollection?.id ?? ''}:${label}`;
    const changed = headingState !== undefined && headingState !== nextHeadingState;
    heading.textContent = label;
    collectionTag.textContent = activeCollection?.name ?? '';
    collectionContext.classList.toggle('is-collection', Boolean(activeCollection));
    collectionExit.disabled = !activeCollection;
    if (changed) animateRefresh(titleLine);
    headingState = nextHeadingState;
    collectionRemove.hidden = !activeCollection;
    collectionAdd.hidden = !activeCollection;
    collectionHelp.textContent = t(activeCollection
      ? 'Arrossega les targetes per ordenar-les. Mantén-ne una premuda per veure les opcions.'
      : 'Desa un conjunt de lectures amb el seu ordre, maquetat i codis d’aula. Mantén premuda una targeta per afegir-la.');
    syncSelects(root);
  }

  function selectCollection(id) {
    clearTimeout(searchTimer);
    lastTrackedSearch = '';
    clearSelection();
    activeCollection = collections.find(entry => entry.id === id);
    savePreference(activeCollectionKey, activeCollection?.id ?? '');
    search.value = '';
    for (const field of optionalFields) field.value = '';
    syncCollections();
    refresh();
  }

  function loadCollections(id = activeCollection?.id) {
    collections = listCollections();
    if (id !== activeCollection?.id) selectCollection(id);
    else {
      activeCollection = collections.find(entry => entry.id === id);
      syncCollections();
      refresh();
    }
  }

  collection.addEventListener('change', () => {
    collectionStatus.textContent = '';
    selectCollection(collection.value);
    if (activeCollection) onActivity?.('colleccio', { accio: 'obre', quantitat: activeCollection.readingIds.length });
  });
  collectionExit.addEventListener('click', () => {
    collectionStatus.textContent = '';
    selectCollection('');
    cardStatus.textContent = t('Has tornat al catàleg de lectures.');
    heading.focus({ preventScroll: true });
  });
  collectionAdd.addEventListener('click', () => { if (activeCollection) startAdding(activeCollection.id); });
  selectionToggle.addEventListener('click', () => {
    beginSelection();
    onActivity?.('colleccio', { accio: 'selecciona' });
  });
  selectionCancel.addEventListener('click', () => {
    clearSelection();
    selectionToggle.focus({ preventScroll: true });
  });
  selectionAll.addEventListener('click', () => {
    for (const { reading } of orderedMatches) selectedIds.add(reading.id);
    syncSelection();
  });
  selectionSave.addEventListener('click', () => {
    const entries = collectionSource().filter(({ reading }) => selectedIds.has(reading.id)).map(({ reading }) => reading);
    onSaveCollection(entries, { targetId: addingTo?.id });
  });
  collectionRemove.addEventListener('click', () => {
    if (!activeCollection || !confirm(t('Vols suprimir la col·lecció «{name}»?', { name: activeCollection.name }))) return;
    try {
      removeCollection(activeCollection.id);
      onActivity?.('colleccio', { accio: 'elimina' });
      loadCollections('');
      collectionStatus.textContent = '';
      (collection.parentElement.querySelector('.select-trigger') ?? collection).focus();
    } catch { collectionStatus.textContent = t('No s’ha pogut suprimir la col·lecció.'); }
  });
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === collectionsKey) loadCollections();
  });

  reset.setAttribute('aria-label', t('Neteja la cerca i els filtres'));
  search.addEventListener('input', () => {
    refresh();
    clearTimeout(searchTimer);
    if (!search.value.trim()) lastTrackedSearch = '';
    searchTimer = setTimeout(() => {
      const query = search.value.trim();
      if (root.hidden || query.length < 2 || query === lastTrackedSearch) return;
      lastTrackedSearch = query;
      onActivity?.('cerca_cataleg', { tipus: /^L\d+[A-Z]?$/i.test(query) ? 'codi' : 'text', resultats: orderedMatches.length });
    }, 800);
  });
  reset.addEventListener('click', clear);
  root.querySelector('#empty-reset').addEventListener('click', () => {
    if (activeCollection) selectCollection('');
    clear();
  });
  const sidebar = root.querySelector('.catalog-filters');
  for (const help of sidebar.querySelectorAll('.filter-help')) {
    const button = help.querySelector('button');
    const tip = help.querySelector('[role="tooltip"]');
    const hide = () => { if (tip.matches(':popover-open')) tip.hidePopover(); };
    const show = () => {
      for (const other of sidebar.querySelectorAll('.filter-help-tip:popover-open')) if (other !== tip) other.hidePopover();
      if (!tip.matches(':popover-open')) tip.showPopover();
      placeMenu(button, tip, 'end');
    };
    help.addEventListener('pointerenter', show);
    help.addEventListener('pointerleave', () => { if (document.activeElement !== button) hide(); });
    button.addEventListener('focus', show);
    button.addEventListener('blur', hide);
    button.addEventListener('click', show);
    button.addEventListener('keydown', event => { if (event.key === 'Escape') { hide(); event.preventDefault(); } });
    sidebar.addEventListener('scroll', hide);
    window.addEventListener('resize', hide);
  }
  mountDisclosures(sidebar, { exclusive: true, selector: ':scope > details' });
  mountDisclosures(root.querySelector('.catalog-extra-filters').parentElement);
  more.addEventListener('click', () => loadMore(true));
  function startAdding(id) {
    selectCollection('');
    addingTo = collections.find(entry => entry.id === id);
    beginSelection();
    onActivity?.('colleccio', { accio: 'selecciona' });
    search.focus();
  }

  function commitCollection(change, focusId, action, message) {
    try {
      const previous = activeCollection.readingIds.join(' ');
      const entry = change();
      collections = listCollections();
      activeCollection = entry;
      syncCollections();
      visibleIds = undefined;
      render({ keepScroll: true, animated: action === 'retira' });
      if (previous !== entry.readingIds.join(' ')) onActivity?.('colleccio', { accio: action });
      const position = orderedMatches.findIndex(({ reading }) => reading.id === focusId) + 1;
      cardStatus.textContent = message ?? t('Lectura moguda a la posició {position}.', { position });
      collectionStatus.textContent = '';
      const focus = [...grid.querySelectorAll('.card-open')].find(button => button.dataset.id === focusId);
      (focus ?? collectionAdd).focus({ preventScroll: true });
    } catch (error) {
      const message = error instanceof DOMException ? t('No s’han pogut desar els canvis de la col·lecció.') : error.message;
      cardStatus.textContent = collectionStatus.textContent = message;
      visibleIds = undefined;
      render({ keepScroll: true });
      const summary = root.querySelector('#catalog-collection-panel > summary');
      if (summary.getAttribute('aria-expanded') === 'false') summary.click();
    }
  }

  function afterReading(id, movingId) {
    const position = activeCollection.readingIds.indexOf(id);
    return activeCollection.readingIds.slice(position + 1).find(entry => entry !== movingId);
  }

  function moveReading(id, beforeId) {
    if (!activeCollection || selecting || !activeCollection.readingIds.includes(id)) return;
    // A drop at the end of the visible grid stays before any unloaded/filtered
    // tail of the collection rather than silently jumping to its absolute end.
    if (!beforeId) {
      const previous = [...grid.children].findLast(card => card.dataset.id !== id);
      beforeId = afterReading(previous?.dataset.id, id);
    }
    commitCollection(() => moveCollectionReading(activeCollection.id, id, beforeId), id, 'reordena');
  }

  gestures = mountCatalogGestures({
    root, grid, scroller: results,
    getState: () => ({ selecting, collectionId: activeCollection?.id }),
    getCollections: listCollections,
    onFamily(id) { const entry = catalog.find(item => item.reading.id === id); if (entry) openFamily(entry.reading); },
    onMove: moveReading,
    onStep(id, direction) {
      const index = orderedMatches.findIndex(({ reading }) => reading.id === id);
      const neighbor = orderedMatches[index + direction]?.reading;
      if (!neighbor) return;
      const beforeId = direction < 0 ? neighbor.id : afterReading(neighbor.id, id);
      commitCollection(() => moveCollectionReading(activeCollection.id, id, beforeId), id, 'reordena');
    },
    onAdd(id, targetId, name) {
      const reading = catalog.find(item => item.reading.id === id)?.reading;
      try {
        if (!reading) throw new Error(t('Lectura no disponible'));
        const entry = saveCollectionEntries(name, [reading], activeCollection?.id, targetId);
        collections = listCollections();
        syncCollections();
        onActivity?.('colleccio', { accio: targetId ? 'afegeix' : 'crea', quantitat: 1 });
        const message = t('Lectura afegida a «{name}».', { name: entry.name });
        cardStatus.textContent = message;
        return { ok: true, message };
      } catch (error) {
        return { ok: false, message: error instanceof DOMException ? t('No s’han pogut desar els canvis de la col·lecció.') : error.message };
      }
    },
    onRemove(id) {
      if (!activeCollection) return;
      const index = orderedMatches.findIndex(item => item.reading.id === id);
      const next = (orderedMatches[index + 1] ?? orderedMatches[index - 1])?.reading.id;
      commitCollection(() => removeCollectionReading(activeCollection.id, id), next, 'retira', t('Lectura retirada de la col·lecció.'));
    },
  });
  syncCollections();
  render();

  return {
    loadCollections,
    clearSelection,
    startAdding,
    activeCollection: () => activeCollection,
    matchingReadings() {
      return orderedMatches.map(({ reading }) => reading);
    },
    navigationReadings(current) {
      if (activeCollection) return orderedMatches.map(item => item.reading);
      return groupFamilyCards(orderedMatches).map(group => current.familyId && group.reading.familyId === current.familyId && group.reading.language === current.language ? current : group.reading);
    },
    chooseFamily(reading, origin) {
      if (activeCollection || familyMembers(catalog.map(item => item.reading), reading).length < 2) return false;
      openFamily(reading, origin);
      return true;
    },
    replaceReadings(items) {
      const positions = new Map(catalog.map(({ reading }, index) => [reading.id, index]));
      const newPosition = catalog.length;
      catalog = indexCatalog(items).sort((a, b) => (
        (positions.get(a.reading.id) ?? newPosition) - (positions.get(b.reading.id) ?? newPosition)
      ));
      refresh();
    },
    reveal(code) {
      search.value = code;
      for (const field of optionalFields) field.value = '';
      refresh();
    },
    showUniverse(id, locale) {
      selectCollection('');
      if (availableLanguages.has(locale)) {
        languagePreference = locale;
        languageField.value = locale;
        savePreference(catalogLanguageKey, locale);
      }
      root.querySelector('#filter-universe').value = id;
      refresh();
      onFilterApplied?.('universe', id);
    },
    translate() {
      reset.setAttribute('aria-label', t('Neteja la cerca i els filtres'));
      if (!languagePreference) languageField.value = language();
      syncCollections();
      render({ translated: true });
    },
    focus(readingId) {
      const family = catalog.find(item => item.reading.id === readingId)?.reading.familyId;
      const button = [...grid.querySelectorAll('button[data-id]')].find(({ dataset }) => dataset.id === readingId)
        ?? [...grid.querySelectorAll('[data-family-id]')].find(card => family && card.dataset.familyId === family)?.querySelector('.card-open');
      (button ?? root.querySelector('#readings-title')).focus();
    },
  };
}
