import { mountCatalog } from './catalog.js';
import { readings } from './data/readings.js';
import { mountStudio } from './studio.js';
import { animateRefresh, closeDialog, mountDialogs, openDialog } from './motion.js';
import { mountSelectMenus } from './select-menu.js';

const main = document.querySelector('#contingut');
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
mountDialogs();
mountSelectMenus();

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
  if (!recovery.open) focusStudio();
  if (wasInCatalog) animateRefresh(studioView);
}

function focusStudio() {
  const heading = studioView.querySelector('#studio-title') ?? studioView;
  heading.focus({ preventScroll: true });
  main.scrollTop = 0;
}

function showCatalog() {
  const wasInStudio = !studioView.hidden;
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

function recoverCodeFrom(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith('#fitxa=') && !/^https?:\/\//i.test(trimmed)) return trimmed;
  const hashIndex = trimmed.indexOf('#fitxa=');
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
  if (!recovery.open) openDialog(recovery);
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
recoveryInput.addEventListener('input', clearRecoveryError);
recoveryInput.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    recoveryInput.form.requestSubmit();
  }
});
document.querySelector('#recovery-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const code = recoverCodeFrom(recoveryInput.value);
  if (!code || !studio.restore(code)) {
    reportRecoveryError();
    recoveryInput.focus();
    return;
  }
  setRoute(`fitxa=${encodeURIComponent(code)}`);
  closeDialog(recovery, focusStudio);
});

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
    lightningStatus.textContent = 'Adreça Lightning copiada.';
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
    lightningStatus.textContent = 'Adreça seleccionada. Copia-la amb Ctrl+C o ⌘C.';
  }
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
