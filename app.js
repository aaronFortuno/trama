import { mountCatalog } from './catalog.js';
import { readings } from './data/readings.js';
import { mountStudio } from './studio.js';

const catalogView = document.querySelector('#catalog-view');
const studioView = document.querySelector('#studio');
const recovery = document.querySelector('#recovery-dialog');
const recoveryInput = document.querySelector('#recovery-input');
const recoveryStatus = document.querySelector('#recovery-status');
const readingIds = new Set(readings.map(({ id }) => id));
let currentReadingId;

const catalog = mountCatalog({ root: catalogView, readings, onSelect: openReading });
const studio = mountStudio({
  root: studioView,
  readings,
  onOpen: showStudio,
  onCatalog: goToCatalog,
  onVariant: openReading,
});

function openReading(readingId) {
  const hash = `lectura=${encodeURIComponent(readingId)}`;
  if (location.hash.slice(1) === hash) studio.open(readingId);
  else location.hash = hash;
}

function showStudio(reading) {
  currentReadingId = reading.id;
  catalogView.hidden = true;
  studioView.hidden = false;
  document.body.classList.add('is-studio');
  if (!recovery.open) focusStudio();
}

function focusStudio() {
  const heading = studioView.querySelector('#studio-title') ?? studioView;
  heading.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function showCatalog() {
  const wasInStudio = !studioView.hidden;
  catalogView.hidden = false;
  studioView.hidden = true;
  document.body.classList.remove('is-studio');
  if (wasInStudio) catalog.focus(currentReadingId);
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

function recoverCodeFrom(value) {
  const trimmed = value.trim();
  const hashIndex = trimmed.indexOf('#');
  if (hashIndex < 0) return trimmed;
  return new URLSearchParams(trimmed.slice(hashIndex + 1)).get('fitxa') ?? '';
}

function reportRecoveryError() {
  recoveryInput.setAttribute('aria-invalid', 'true');
  recoveryStatus.textContent = 'El codi és incorrecte o correspon a una lectura que no és al catàleg.';
}

function clearRecoveryError() {
  recoveryInput.removeAttribute('aria-invalid');
  recoveryStatus.textContent = '';
}

function openRecovery(value = '') {
  clearRecoveryError();
  recoveryInput.value = value;
  if (!recovery.open) recovery.showModal();
  recoveryInput.focus();
}

function route() {
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.has('fitxa')) {
    const code = params.get('fitxa');
    if (!studio.restore(code)) {
      showCatalog();
      openRecovery(code);
      reportRecoveryError();
    }
    return;
  }
  const readingId = params.get('lectura');
  if (readingIds.has(readingId)) studio.open(readingId);
  else showCatalog();
}

document.querySelector('#open-recovery').addEventListener('click', () => openRecovery());
document.querySelector('#close-recovery').addEventListener('click', () => recovery.close());
recoveryInput.addEventListener('input', clearRecoveryError);
document.querySelector('#recovery-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const code = recoverCodeFrom(recoveryInput.value);
  if (!code || !studio.restore(code)) {
    reportRecoveryError();
    recoveryInput.focus();
    return;
  }
  setRoute(`fitxa=${encodeURIComponent(code)}`);
  recovery.close();
  focusStudio();
});

document.querySelector('#home-link').addEventListener('click', (event) => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  goToCatalog();
  window.scrollTo(0, 0);
});
document.querySelector('.skip-link').addEventListener('click', (event) => {
  event.preventDefault();
  document.querySelector('#contingut').focus();
});

const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const themeToggle = document.querySelector('#theme-toggle');
let preferredTheme;

function applyTheme() {
  const isDark = preferredTheme ? preferredTheme === 'dark' : systemTheme.matches;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-label', isDark ? 'Activa el tema clar' : 'Activa el tema fosc');
}

themeToggle.addEventListener('click', () => {
  preferredTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
});
systemTheme.addEventListener('change', applyTheme);
applyTheme();
window.addEventListener('hashchange', route);
route();
