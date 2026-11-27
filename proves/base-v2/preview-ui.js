import { mountV4V } from './v4v.js?v=0.8.0';
import { mountChangelog } from './changelog.js?v=0.8.0';
import { mountLicense } from './license.js?v=0.8.0';
import { changelogCopy, projectCopy } from './preview-copy.js?v=0.8.0';
import { mountGalleryPreview } from './gallery-preview.js?v=0.8.0';
import { formatCatalogCount, galleryLabels, mountGalleryHelp, mountGallerySearch } from './gallery-controls.js?v=0.8.0';
import { localiseGalleryHelp, projectNames } from './gallery-help-copy.js?v=0.8.0';

const ca = {
  website: 'Obre el web actual', changes: 'Historial de versions', close: 'Tanca',
  language: 'Idioma de la interfície', dark: 'Tema fosc', light: 'Tema clar',
};
const strings = {
  ca,
  es: {
    website: 'Abre la web actual', changes: 'Historial de versiones', close: 'Cierra',
    language: 'Idioma de la interfaz', dark: 'Tema oscuro', light: 'Tema claro',
  },
  gl: {
    website: 'Abre a web actual', changes: 'Historial de versións', close: 'Pecha',
    language: 'Idioma da interface', dark: 'Tema escuro', light: 'Tema claro',
  },
  eu: {
    website: 'Ireki oraingo webgunea', changes: 'Bertsioen historia', close: 'Itxi',
    language: 'Interfazearen hizkuntza', dark: 'Gai iluna', light: 'Gai argia',
  },
};
const theme = document.getElementById('theme');
const language = document.getElementById('language');
const menu = document.getElementById('language-menu');
const options = [...menu.querySelectorAll('[data-language]')];
const support = document.getElementById('support');
const changes = document.getElementById('changes');
const changesOpen = document.getElementById('changes-open');
const licenseOpen = document.getElementById('license-open');
const repoLink = document.querySelector('.of-footer-tools a');
const root = document.documentElement;
const project = document.body.dataset.project;
const copy = projectCopy[project];
const head = document.querySelector('.of-gallery-head');
const count = head.querySelector('[data-total]');
const helpOpen = head.querySelector('[data-of-help-open]');
const helpDialog = document.getElementById('help-dialog');
const updateGallery = mountGalleryPreview(document.querySelector('[data-gallery-preview]'));
let locale = 'ca';
const previousMotto = history.state?.ortografiPreviewMotto;
const mottoOptions = copy.ca.mottos.map((_, index) => index).filter(index => index !== previousMotto);
const motto = mottoOptions[Math.floor(Math.random() * mottoOptions.length)];
history.replaceState({ ...history.state, ortografiPreviewMotto: motto }, '');

function labelled(element, text) {
  element.setAttribute('aria-label', text);
  element.title = text;
}

function render() {
  const messages = strings[locale];
  const text = copy[locale];
  const dark = root.dataset.theme === 'dark';
  theme.setAttribute('aria-pressed', String(dark));
  labelled(theme, dark ? messages.light : messages.dark);
  updateGallery(locale);
  document.getElementById('motto').textContent = text.mottos[motto];
  count.textContent = formatCatalogCount(project, Number(count.dataset.total), locale);
  labelled(head.querySelector('[data-of-search-toggle]'), galleryLabels(locale).search);
  labelled(helpOpen, galleryLabels(locale).help(projectNames[project]));
  document.getElementById('footer-motto').textContent = text.footer;
  for (const node of document.querySelectorAll('[data-message]')) node.textContent = messages[node.dataset.message] ?? changelogCopy[locale][node.dataset.message];
  for (const option of options) option.setAttribute('aria-checked', String(option.dataset.language === locale));
  labelled(language, messages.language);
  labelled(changesOpen, `${changesOpen.textContent} · ${messages.changes}`);
  labelled(licenseOpen, changelogCopy[locale].license);
  labelled(repoLink, changelogCopy[locale].repo);
}

theme.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  render();
});
menu.addEventListener('toggle', () => {
  const open = menu.matches(':popover-open');
  language.setAttribute('aria-expanded', String(open));
  if (open) options.find(option => option.dataset.language === locale).focus({ preventScroll: true });
});
menu.addEventListener('keydown', event => {
  const position = options.indexOf(document.activeElement);
  let destination;
  if (event.key === 'ArrowDown') destination = (position + 1) % options.length;
  if (event.key === 'ArrowUp') destination = (position - 1 + options.length) % options.length;
  if (event.key === 'Home') destination = 0;
  if (event.key === 'End') destination = options.length - 1;
  if (destination === undefined) return;
  event.preventDefault();
  options[destination].focus({ preventScroll: true });
});
menu.addEventListener('click', event => {
  const option = event.target.closest('[data-language]');
  if (!option) return;
  menu.hidePopover();
  language.focus({ preventScroll: true });
  if (locale === option.dataset.language) return;
  locale = option.dataset.language;
  root.lang = locale;
  render();
  const duration = Number.parseFloat(getComputedStyle(root).getPropertyValue('--of-motion'));
  if (duration > 0) for (const node of document.querySelectorAll('.of-gallery-context, #footer-motto')) {
    node.getAnimations().find(animation => animation.id === 'preview-language')?.cancel();
    const animation = node.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration, easing: 'ease' });
    animation.id = 'preview-language';
  }
});
mountChangelog(changes, changesOpen);
mountGallerySearch(head);
mountGalleryHelp(helpDialog, helpOpen, () => localiseGalleryHelp(helpDialog, project, locale));
mountLicense(document.getElementById('project-license'), licenseOpen);
mountV4V(support, document.getElementById('support-open'));
root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
render();
