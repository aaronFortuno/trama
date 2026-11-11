import { mountCatalog } from './catalog.js';
import { readings as publicReadings } from './data/readings.js';
import { mountStudio } from './studio.js';
import { animateRefresh, mountDialogs } from './motion.js';
import { mountSelectMenus } from './select-menu.js';
import { bindTranslations, language, setLanguage, t } from './i18n.js';
import { mountActionMenu } from './action-menu.js';
import { importReading, listPersonalReadings, readingStorageKey, saveReading } from './reading-files.js';

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

const catalog = mountCatalog({ root: catalogView, readings, onSelect: openReading });
const studio = mountStudio({
  root: studioView,
  readings,
  onOpen: showStudio,
  onCatalog: goToCatalog,
  onVariant: openReading,
  onRemove: removeReading,
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
  markLanguage();
  applyTheme(document.documentElement.dataset.theme);
  catalog.translate();
  studio.translate();
  lightningStatus.textContent = '';
  importStatus.hidden = true;
});

function openReading(readingId) {
  const hash = `lectura=${encodeURIComponent(readingId)}`;
  if (location.hash.slice(1) === hash) studio.open(readingId);
  else location.hash = hash;
}

function showStudio(reading) {
  const wasInCatalog = studioView.hidden;
  currentReadingId = reading.id;
  catalogView.hidden = true;
  studioView.hidden = false;
  document.body.classList.add('is-studio');
  focusStudio();
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

const importButton = document.querySelector('#import-reading');
const readingFile = document.querySelector('#reading-file');
const importStatus = document.querySelector('#reading-import-status');
importButton.addEventListener('click', () => readingFile.click());
readingFile.addEventListener('change', async () => {
  const file = readingFile.files[0];
  readingFile.value = '';
  if (!file || importButton.disabled) return;
  importButton.disabled = true;
  importStatus.hidden = true;
  try {
    const reading = await importReading(file);
    saveReading(localStorage, reading, publicReadings);
    refreshReadings();
    catalog.reveal(reading.code);
    openReading(reading.id);
  } catch (failure) {
    importStatus.textContent = failure instanceof DOMException
      ? t('El navegador no ha pogut desar la lectura.') : failure.message;
    importStatus.hidden = false;
  } finally {
    importButton.disabled = false;
  }
});
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
  if (!studio.open(readingId)) showCatalog();
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
