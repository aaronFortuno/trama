import { syncPrintRange } from './print-controls.js?v=0.12.0';
import { localisePreviewControls, mountDocumentModes, placePreviewPrintActions } from './print-preview-controls.js?v=0.12.0';
import { mountPreviewZoom } from './preview-zoom.js?v=0.12.0';
import { mountDialog } from './dialog.js?v=0.12.0';

const copy = {
  ca: { format: 'Format del full', text: 'Text i tipografia', margins: 'Marges del full', reset: 'Restableix', print: 'Imprimeix', back: 'Torna al catàleg', report: 'Notifica un error', reportSample: 'Obre el material al web per enviar-hi un avís.', close: 'Tanca', preview: 'Vista prèvia A4', content: 'Contingut', audio: 'Àudio', sample: 'Mostra amb un fragment de la fitxa.', open: 'Obre el material al web', listen: 'Obre la sessió d’escolta', sheetFont: 'Tipografia', sheetSize: 'Cos de lletra', sheetLeading: 'Interlineat', sheetSpacing: 'Espaiat', sheetMarginTop: 'Superior', sheetMarginRight: 'Dret', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Esquerre' },
  es: { format: 'Formato de la ficha', text: 'Texto y tipografía', margins: 'Márgenes de la ficha', reset: 'Restablecer', print: 'Imprimir', back: 'Vuelve al catálogo', report: 'Notifica un error', reportSample: 'Abre el material en la web para enviar un aviso.', close: 'Cerrar', preview: 'Vista previa A4', content: 'Contenido', audio: 'Audio', sample: 'Muestra con un fragmento de la ficha.', open: 'Abre el material en la web', listen: 'Abre la sesión de escucha', sheetFont: 'Tipografía', sheetSize: 'Tamaño de letra', sheetLeading: 'Interlineado', sheetSpacing: 'Espaciado', sheetMarginTop: 'Superior', sheetMarginRight: 'Derecho', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Izquierdo' },
  gl: { format: 'Formato da ficha', text: 'Texto e tipografía', margins: 'Marxes da ficha', reset: 'Restablecer', print: 'Imprimir', back: 'Volver ao catálogo', report: 'Notifica un erro', reportSample: 'Abre o material na web para enviar un aviso.', close: 'Pechar', preview: 'Vista previa A4', content: 'Contido', sample: 'Mostra cun fragmento da ficha.', open: 'Abre o material na web', sheetFont: 'Tipografía', sheetSize: 'Tamaño da letra', sheetLeading: 'Interliñado', sheetSpacing: 'Espazamento', sheetMarginTop: 'Superior', sheetMarginRight: 'Dereita', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Esquerda' },
  eu: { format: 'Fitxaren formatua', text: 'Testua eta tipografia', margins: 'Fitxaren marjinak', reset: 'Berrezarri', print: 'Inprimatu', back: 'Itzuli katalogora', report: 'Jakinarazi erro bat', reportSample: 'Ireki materiala webgunean abisua bidaltzeko.', close: 'Itxi', preview: 'A4 aurrebista', content: 'Edukia', sample: 'Fitxaren zati bat.', open: 'Ireki materiala webgunean', sheetFont: 'Tipografia', sheetSize: 'Letra-tamaina', sheetLeading: 'Lerroartea', sheetSpacing: 'Tartea', sheetMarginTop: 'Goikoa', sheetMarginRight: 'Eskuinekoa', sheetMarginBottom: 'Behekoa', sheetMarginLeft: 'Ezkerrekoa' },
};
const fonts = { serif: 'Georgia, serif', sans: 'Arial, sans-serif', verdana: 'Verdana, sans-serif' };
const margins = ['Top', 'Right', 'Bottom', 'Left'];

export function mountPrintStudy(root) {
  const defaults = JSON.parse(root.dataset.format);
  const form = root.querySelector('form');
  const fields = [...form.querySelectorAll('input, select')];
  const paper = root.querySelector('.study-paper');
  const stage = root.querySelector('.study-stage');
  const pages = root.querySelector('.study-pages');
  mountPreviewZoom(stage, pages, root.querySelector('.of-preview-zoom'), { scaleProperty: '--study-zoom' });
  mountDialog(root.querySelector('.study-report'), root.querySelector('[data-of-report]'));
  placePreviewPrintActions(root.querySelector('[data-of-print-actions]'), root.querySelector('.study-format'), root.querySelector('.study-layout'), matchMedia('(min-width: 1200px)'));
  let numbers = new Intl.NumberFormat('ca', { maximumFractionDigits: 2 });
  for (const field of fields) field.value = defaults[field.name];

  function apply() {
    for (const input of form.querySelectorAll('input[type="range"]')) syncPrintRange(input, numbers);
    const values = new FormData(form);
    paper.style.setProperty('--study-font', fonts[values.get('font')]);
    paper.style.setProperty('--study-size', values.get('size') + 'pt');
    paper.style.setProperty('--study-leading', values.get('leading'));
    paper.style.setProperty('--study-spacing', values.get('spacing') + 'mm');
    for (const side of margins) paper.style.setProperty('--study-margin-' + side.toLowerCase(), values.get('margin' + side) + 'mm');
  }
  form.addEventListener('input', apply);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', event => {
    event.preventDefault();
    for (const field of fields) field.value = defaults[field.name];
    apply();
  });
  mountDocumentModes(root.querySelector('.of-preview-modes'), mode => {
    const answers = mode === 'answers';
    for (const answer of root.querySelectorAll('.study-answer')) answer.hidden = !answers;
    for (const lines of root.querySelectorAll('.study-lines')) lines.hidden = answers;
  });
  root.querySelector('[data-study-print]').addEventListener('click', () => window.print());
  return locale => {
    const labels = copy[locale] ?? copy.ca;
    localisePreviewControls(root, locale);
    numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    for (const node of root.querySelectorAll('[data-t]')) node.textContent = labels[node.dataset.t] ?? copy.ca[node.dataset.t];
    for (const node of root.querySelectorAll('[data-study-label]')) node.setAttribute('aria-label', labels[node.dataset.studyLabel]);
    apply();
  };
}
