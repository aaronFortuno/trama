import { mountV4V } from './v4v.js';

const ca = {
  title: 'Prova de la base comuna',
  summary: 'Comprova la capçalera, el peu i el diàleg V4V d’aquesta versió. Els ajustos de la mostra duren fins que tanques o recarregues la pàgina.',
  website: 'Obre el web actual', changes: 'Historial de la prova', close: 'Tanca',
  release: 'v0.1.0 · Mides comunes de la capçalera i el peu. Diàleg V4V compartit.',
  support: 'Els recursos són gratuïts. Si et resulten útils, pots fer una aportació voluntària. Compartir-los o suggerir millores també ajuda.',
  language: 'Idioma de la interfície', dark: 'Tema fosc', light: 'Tema clar', copy: 'Copia l’adreça Lightning',
  copied: 'Adreça copiada.', manual: 'Adreça seleccionada. Copia-la amb Ctrl+C o ⌘C.',
};
const strings = {
  ca,
  es: {
    title: 'Prueba de la base común', summary: 'Comprueba la cabecera, el pie y el diálogo V4V. Los ajustes de la prueba duran hasta que cierras o recargas la página.',
    website: 'Abre la web actual', changes: 'Historial de la prueba', close: 'Cierra',
    release: 'v0.1.0 · Medidas comunes de la cabecera y el pie. Diálogo V4V compartido.',
    support: 'Los recursos son gratuitos. Si te resultan útiles, puedes hacer una aportación voluntaria. Compartirlos o sugerir mejoras también ayuda.',
    language: 'Idioma de la interfaz', dark: 'Tema oscuro', light: 'Tema claro', copy: 'Copia la dirección Lightning',
    copied: 'Dirección copiada.', manual: 'Dirección seleccionada. Cópiala con Ctrl+C o ⌘C.',
  },
  gl: {
    title: 'Proba da base común', summary: 'Comproba a cabeceira, o pé e o diálogo V4V. Os axustes da proba duran ata que pechas ou recargas a páxina.',
    website: 'Abre a web actual', changes: 'Historial da proba', close: 'Pecha',
    release: 'v0.1.0 · Medidas comúns da cabeceira e do pé. Diálogo V4V compartido.',
    support: 'Os recursos son gratuítos. Se che resultan útiles, podes facer unha achega voluntaria. Compartilos ou suxerir melloras tamén axuda.',
    language: 'Idioma da interface', dark: 'Tema escuro', light: 'Tema claro', copy: 'Copia o enderezo Lightning',
    copied: 'Enderezo copiado.', manual: 'Enderezo seleccionado. Cópiao con Ctrl+C ou ⌘C.',
  },
  eu: {
    title: 'Oinarri komunaren proba', summary: 'Begiratu goiburua, orri-oina eta V4V elkarrizketa-koadroa. Probako ezarpenek orria itxi edo berriro kargatu arte irauten dute.',
    website: 'Ireki oraingo webgunea', changes: 'Probaren historia', close: 'Itxi',
    release: 'v0.1.0 · Goiburuaren eta orri-oinaren neurri komunak. V4V elkarrizketa-koadro partekatua.',
    support: 'Baliabideak doakoak dira. Erabilgarriak badira, borondatezko ekarpena egin dezakezu. Partekatzeak edo hobekuntzak proposatzeak ere laguntzen du.',
    language: 'Interfazearen hizkuntza', dark: 'Gai iluna', light: 'Gai argia', copy: 'Kopiatu Lightning helbidea',
    copied: 'Helbidea kopiatu da.', manual: 'Helbidea hautatu da. Kopiatu Ctrl+C edo ⌘C erabiliz.',
  },
};
const theme = document.getElementById('theme');
const language = document.getElementById('language');
const support = document.getElementById('support');
const changes = document.getElementById('changes');
const changesOpen = document.getElementById('changes-open');
const root = document.documentElement;
let messages = ca;

function labelled(element, text) {
  element.setAttribute('aria-label', text);
  element.title = text;
}

function render() {
  const dark = root.dataset.theme === 'dark';
  theme.setAttribute('aria-pressed', String(dark));
  labelled(theme, dark ? messages.light : messages.dark);
  for (const node of document.querySelectorAll('[data-message]')) node.textContent = messages[node.dataset.message];
  labelled(language, messages.language);
  labelled(changesOpen, messages.changes);
  labelled(support.querySelector('[data-of-close]'), messages.close);
  labelled(support.querySelector('[data-of-copy]'), messages.copy);
}

theme.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  render();
});
language.addEventListener('change', () => {
  messages = strings[language.value] ?? ca;
  root.lang = language.value;
  render();
});
changesOpen.addEventListener('click', () => changes.showModal());
changes.addEventListener('close', () => changesOpen.focus());
mountV4V(support, document.getElementById('support-open'), { messages: () => messages });
root.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
render();
