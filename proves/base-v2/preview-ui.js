import { mountV4V } from './v4v.js';
import { changelogCopy, projectCopy } from './preview-copy.js';

const ca = {
  title: 'Prova de la base comuna',
  summary: 'Comprova la capçalera, el peu i el diàleg V4V d’aquesta versió. Els ajustos de la mostra duren fins que tanques o recarregues la pàgina.',
  website: 'Obre el web actual', changes: 'Historial de versions', close: 'Tanca',
  support: 'Els recursos són gratuïts. Si et resulten útils, pots fer una aportació voluntària. Compartir-los o suggerir millores també ajuda.',
  language: 'Idioma de la interfície', dark: 'Tema fosc', light: 'Tema clar', copy: 'Copia l’adreça Lightning',
  copied: 'Adreça copiada.', manual: 'Adreça seleccionada. Copia-la amb Ctrl+C o ⌘C.',
};
const strings = {
  ca,
  es: {
    title: 'Prueba de la base común', summary: 'Comprueba la cabecera, el pie y el diálogo V4V. Los ajustes de la prueba duran hasta que cierras o recargas la página.',
    website: 'Abre la web actual', changes: 'Historial de versiones', close: 'Cierra',
    support: 'Los recursos son gratuitos. Si te resultan útiles, puedes hacer una aportación voluntaria. Compartirlos o sugerir mejoras también ayuda.',
    language: 'Idioma de la interfaz', dark: 'Tema oscuro', light: 'Tema claro', copy: 'Copia la dirección Lightning',
    copied: 'Dirección copiada.', manual: 'Dirección seleccionada. Cópiala con Ctrl+C o ⌘C.',
  },
  gl: {
    title: 'Proba da base común', summary: 'Comproba a cabeceira, o pé e o diálogo V4V. Os axustes da proba duran ata que pechas ou recargas a páxina.',
    website: 'Abre a web actual', changes: 'Historial de versións', close: 'Pecha',
    support: 'Os recursos son gratuítos. Se che resultan útiles, podes facer unha achega voluntaria. Compartilos ou suxerir melloras tamén axuda.',
    language: 'Idioma da interface', dark: 'Tema escuro', light: 'Tema claro', copy: 'Copia o enderezo Lightning',
    copied: 'Enderezo copiado.', manual: 'Enderezo seleccionado. Cópiao con Ctrl+C ou ⌘C.',
  },
  eu: {
    title: 'Oinarri komunaren proba', summary: 'Begiratu goiburua, orri-oina eta V4V elkarrizketa-koadroa. Probako ezarpenek orria itxi edo berriro kargatu arte irauten dute.',
    website: 'Ireki oraingo webgunea', changes: 'Bertsioen historia', close: 'Itxi',
    support: 'Baliabideak doakoak dira. Erabilgarriak badira, borondatezko ekarpena egin dezakezu. Partekatzeak edo hobekuntzak proposatzeak ere laguntzen du.',
    language: 'Interfazearen hizkuntza', dark: 'Gai iluna', light: 'Gai argia', copy: 'Kopiatu Lightning helbidea',
    copied: 'Helbidea kopiatu da.', manual: 'Helbidea hautatu da. Kopiatu Ctrl+C edo ⌘C erabiliz.',
  },
};
const theme = document.getElementById('theme');
const language = document.getElementById('language');
const menu = document.getElementById('language-menu');
const options = [...menu.querySelectorAll('[data-language]')];
const support = document.getElementById('support');
const changes = document.getElementById('changes');
const changesOpen = document.getElementById('changes-open');
const root = document.documentElement;
const copy = projectCopy[document.body.dataset.project];
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
  document.getElementById('project-description').textContent = text.description;
  document.getElementById('motto').textContent = text.mottos[motto];
  document.getElementById('footer-motto').textContent = text.footer;
  for (const node of document.querySelectorAll('[data-message]')) node.textContent = messages[node.dataset.message] ?? changelogCopy[locale][node.dataset.message];
  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
  for (const date of changes.querySelectorAll('time')) date.textContent = formatter.format(new Date(date.dateTime));
  for (const option of options) option.setAttribute('aria-checked', String(option.dataset.language === locale));
  labelled(language, messages.language);
  labelled(changesOpen, messages.changes);
  labelled(changes.querySelector('[data-of-close]'), messages.close);
  labelled(support.querySelector('[data-of-close]'), messages.close);
  labelled(support.querySelector('[data-of-copy]'), messages.copy);
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
  if (duration > 0) for (const node of document.querySelectorAll('#contingut article, #motto, #footer-motto')) {
    node.getAnimations().find(animation => animation.id === 'preview-language')?.cancel();
    const animation = node.animate([{ opacity: 0.45 }, { opacity: 1 }], { duration, easing: 'ease' });
    animation.id = 'preview-language';
  }
});
changesOpen.addEventListener('click', () => {
  changes.showModal();
  changes.querySelector('.release-list').scrollTop = 0;
});
changes.addEventListener('close', () => changesOpen.focus());
mountV4V(support, document.getElementById('support-open'), { messages: () => strings[locale] });
root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
render();
