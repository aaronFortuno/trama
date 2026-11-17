import { mountCatalog } from './catalog.js';
import { readings as publicReadings } from './data/readings.js';
import { mountStudio } from './studio.js';
import { animateRefresh, closeDialog, mountDialogs, openDialog } from './motion.js';
import { mountSelectMenus, syncSelects } from './select-menu.js';
import { bindTranslations, language, setLanguage, t } from './i18n.js';
import { mountActionMenu } from './action-menu.js';
import { startAnalytics, trackFilterApplied, trackReadingOpened } from './analytics.js';
import { listPersonalReadings, readingStorageKey } from './reading-files.js';
import { mountBatchDownload } from './batch-download.js';
import { listCollections, saveCollectionEntries } from './collections.js';

const main = document.querySelector('#contingut');
const catalogView = document.querySelector('#catalog-view');
const studioView = document.querySelector('#studio');
function personalReadings() {
  try { return listPersonalReadings(localStorage); } catch { return []; }
}
const readings = [...publicReadings, ...personalReadings()];
const translateStatic = bindTranslations(document.documentElement);
const translateCard = bindTranslations(document.querySelector('#reading-card').content);
document.documentElement.lang = language();
let currentReadingId;

const mottos = [
  'Llegir és lligar caps.',
  'Llegir és seguir el fil.',
  'Llegir és fer-se amic d’una pregunta.',
  'Llegir és trobar pistes.',
  'Llegir és canviar d’idea a mig paràgraf.',
  'Llegir és dir «una pàgina més».',
  'Llegir és posar veu al silenci.',
  'Llegir és fer lloc a altres mirades.',
  'Llegir és tornar a un lloc que no existeix.',
  'Llegir és veure què s’amaga entre línies.',
  'Llegir és fer parlar els detalls.',
  'Llegir és deixar-se sorprendre.',
];
const motto = mottos[Math.floor(Math.random() * mottos.length)];
const headerMotto = document.querySelector('.site-label');
headerMotto.textContent = t(motto);

const themeKey = 'trama.theme';
const themeToggle = document.querySelector('#theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

function savedTheme() {
  try { return localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  themeToggle.setAttribute('aria-label', t(theme === 'dark' ? 'Activa el tema clar' : 'Activa el tema fosc'));
  themeColor.content = getComputedStyle(root).getPropertyValue('--paper').trim();
}

applyTheme(savedTheme());
themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
  try { localStorage.setItem(themeKey, theme); } catch { /* The current page can still use either theme. */ }
});

startAnalytics();
const catalog = mountCatalog({
  root: catalogView,
  readings,
  onSelect: openCatalogReading,
  onFilterApplied: trackFilterApplied,
  onSaveCollection: saveCollection,
});
const studio = mountStudio({
  root: studioView,
  readings,
  onOpen: showStudio,
  onCatalog: goToCatalog,
  onVariant: openReading,
  getNeighbors: readingNeighbors,
  onNavigate: openCatalogReading,
  onRemove: removeReading,
});
const batchDialog = document.querySelector('#batch-dialog');
const collectionDialog = document.querySelector('#collection-dialog');
const collectionName = collectionDialog.querySelector('#collection-name');
const collectionTarget = collectionDialog.querySelector('#collection-target');
const collectionError = collectionDialog.querySelector('#collection-error');
let collectionReadings;
let sourceCollectionId;

function updateCollectionEditor() {
  const append = Boolean(collectionTarget.value);
  collectionDialog.querySelector('#collection-name-row').hidden = append;
  collectionName.disabled = append;
  collectionDialog.querySelector('#collection-submit').textContent = t(append ? 'Afegeix les lectures' : 'Desa la col·lecció');
}
collectionTarget.addEventListener('change', updateCollectionEditor);

function saveCollection(entries) {
  if (!entries.length) return;
  collectionReadings = entries;
  sourceCollectionId = catalog.activeCollection()?.id;
  const targets = listCollections().filter(entry => entry.id !== sourceCollectionId);
  collectionTarget.replaceChildren(collectionTarget.options[0], ...targets.map(entry => new Option(entry.name, entry.id)));
  collectionTarget.value = '';
  collectionDialog.querySelector('#collection-target-row').hidden = !targets.length;
  syncSelects(collectionDialog);
  updateCollectionEditor();
  collectionName.value = '';
  collectionError.textContent = '';
  collectionDialog.querySelector('#collection-count').textContent = entries.length === 1
    ? t('Es desarà una lectura.') : t('Es desaran {count} lectures en l’ordre actual.', { count: entries.length });
  openDialog(collectionDialog);
  collectionName.focus();
}

collectionDialog.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();
  let entry;
  try {
    entry = saveCollectionEntries(collectionName.value, collectionReadings, sourceCollectionId, collectionTarget.value);
  } catch (error) {
    collectionError.textContent = error instanceof DOMException
      ? t('No s’ha pogut desar la col·lecció.') : error.message;
    return;
  }
  catalog.loadCollections(entry.id);
  closeDialog(collectionDialog, () => {
    if (batchDialog.open) closeDialog(batchDialog);
  });
});

mountBatchDownload({
  trigger: document.querySelector('#batch-open'),
  dialog: batchDialog,
  getReadings: catalog.matchingReadings,
  getAllReadings: () => readings,
  getCollectionId: () => catalog.activeCollection()?.id,
  getSettings: studio.exportSettings,
  printPages: studio.printPages,
  resetLayouts: studio.resetAllLayouts,
  saveCollection,
  onRestore: () => {
    catalog.loadCollections();
    studio.reloadTemplates();
  },
});
mountDialogs();
mountSelectMenus();

const languageMenu = document.querySelector('#language-menu');
function markLanguage() {
  for (const item of languageMenu.querySelectorAll('[data-option]')) {
    item.setAttribute('aria-checked', String(item.dataset.option === language()));
  }
}
markLanguage();
mountActionMenu(document.querySelector('#language-button'), languageMenu, value => {
  if (value === language()) return;
  setLanguage(value);
  translateStatic();
  translateCard();
  headerMotto.textContent = t(motto);
  markLanguage();
  applyTheme(document.documentElement.dataset.theme);
  catalog.translate();
  studio.translate();
  lightningStatus.textContent = '';
});

function openReading(readingId) {
  const scope = catalog.activeCollection();
  const hash = `lectura=${encodeURIComponent(readingId)}${scope ? '&col=' + scope.id : ''}`;
  if (location.hash.slice(1) === hash) studio.open(readingId, scope);
  else location.hash = hash;
}

function openCatalogReading(reading) {
  openReading(reading.id);
  trackReadingOpened(reading);
}

function readingNeighbors(reading) {
  const matches = catalog.matchingReadings();
  let index = matches.findIndex(entry => entry.id === reading.id);
  if (index < 0 && reading.workId) index = matches.findIndex(entry => entry.workId === reading.workId);
  return index < 0 ? {} : { previous: matches[index - 1], next: matches[index + 1] };
}

function showStudio(reading, { keepLayout }) {
  const wasInCatalog = studioView.hidden;
  currentReadingId = reading.id;
  catalogView.hidden = true;
  studioView.hidden = false;
  document.body.classList.add('is-studio');
  if (!keepLayout) focusStudio();
  if (wasInCatalog) animateRefresh(studioView);
}

function focusStudio() {
  const heading = studioView.querySelector('#studio-title') ?? studioView;
  heading.focus({ preventScroll: true });
  main.scrollTop = 0;
}

function showCatalog() {
  const wasInStudio = !studioView.hidden;
  studio.dismissMenu();
  studioView.querySelector('dialog[open]')?.close();
  catalogView.hidden = false;
  studioView.hidden = true;
  document.body.classList.remove('is-studio');
  if (wasInStudio) {
    catalog.focus(currentReadingId);
    animateRefresh(catalogView);
  }
}

function setRoute(hash) {
  const url = new URL(location.href);
  url.hash = hash;
  if (url.href !== location.href) history.pushState(null, '', url);
}

function goToCatalog() {
  setRoute('');
  showCatalog();
}

function refreshReadings() {
  readings.splice(publicReadings.length, readings.length, ...personalReadings());
  catalog.replaceReadings(readings);
}

function removeReading(reading) {
  localStorage.removeItem(readingStorageKey + reading.id);
  refreshReadings();
  catalog.reveal('');
  goToCatalog();
}

window.addEventListener('storage', event => {
  if (event.key === null || event.key.startsWith(readingStorageKey)) refreshReadings();
});

function route() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.has('fitxa')) {
    if (!studio.restore(params.get('fitxa'))) showCatalog();
    return;
  }
  const readingId = params.get('lectura');
  const id = params.get('col');
  const scope = id ? listCollections().find(entry => entry.id === id) : undefined;
  if (readingId && (scope?.id ?? '') !== (catalog.activeCollection()?.id ?? '')) catalog.loadCollections(scope?.id ?? '');
  if (!studio.open(readingId, scope)) showCatalog();
}

document.querySelector('#home-link').addEventListener('click', (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  goToCatalog();
  main.scrollTop = 0;
  catalogView.querySelector('.catalog-results-scroll').scrollTop = 0;
});
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
});

const copyLightning = document.querySelector('#copy-lightning');
const lightningAddress = document.querySelector('#lightning-address');
const lightningStatus = document.querySelector('#lightning-copy-status');
let lightningTimer;

copyLightning.addEventListener('click', async () => {
  clearTimeout(lightningTimer);
  try {
    await navigator.clipboard.writeText(lightningAddress.textContent.trim());
    copyLightning.classList.add('is-copied');
    lightningStatus.textContent = t('Adreça Lightning copiada.');
    lightningTimer = setTimeout(() => {
      copyLightning.classList.remove('is-copied');
      lightningStatus.textContent = '';
    }, 3500);
  } catch {
    copyLightning.classList.remove('is-copied');
    const range = document.createRange();
    range.selectNodeContents(lightningAddress);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    lightningStatus.textContent = t('Adreça seleccionada. Copia-la amb Ctrl+C o ⌘C.');
  }
});

window.addEventListener('hashchange', route);
route();
