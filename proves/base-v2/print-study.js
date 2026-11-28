import { syncPrintRange } from './print-controls.js?v=0.11.0';

const copy = {
  ca: { format: 'Format del full', text: 'Text i tipografia', margins: 'Marges del full', reset: 'Restableix', print: 'Imprimeix', back: 'Torna al catàleg', document: 'Document', worksheet: 'Fitxa', answers: 'Solucionari', preview: 'Vista prèvia A4', content: 'Contingut', audio: 'Àudio', sample: 'Mostra amb un fragment de la fitxa.', open: 'Obre el material al web', listen: 'Obre la sessió d’escolta', sheetFont: 'Tipografia', sheetSize: 'Cos de lletra', sheetLeading: 'Interlineat', sheetSpacing: 'Espaiat', sheetMarginTop: 'Superior', sheetMarginRight: 'Dret', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Esquerre' },
  es: { format: 'Formato de la ficha', text: 'Texto y tipografía', margins: 'Márgenes de la ficha', reset: 'Restablecer', print: 'Imprimir', back: 'Vuelve al catálogo', document: 'Documento', worksheet: 'Ficha', answers: 'Solucionario', preview: 'Vista previa A4', content: 'Contenido', audio: 'Audio', sample: 'Muestra con un fragmento de la ficha.', open: 'Abre el material en la web', listen: 'Abre la sesión de escucha', sheetFont: 'Tipografía', sheetSize: 'Tamaño de letra', sheetLeading: 'Interlineado', sheetSpacing: 'Espaciado', sheetMarginTop: 'Superior', sheetMarginRight: 'Derecho', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Izquierdo' },
  gl: { format: 'Formato da ficha', text: 'Texto e tipografía', margins: 'Marxes da ficha', reset: 'Restablecer', print: 'Imprimir', back: 'Volver ao catálogo', document: 'Documento', worksheet: 'Ficha', answers: 'Solucionario', preview: 'Vista previa A4', content: 'Contido', sample: 'Mostra cun fragmento da ficha.', open: 'Abre o material na web', sheetFont: 'Tipografía', sheetSize: 'Tamaño da letra', sheetLeading: 'Interliñado', sheetSpacing: 'Espazamento', sheetMarginTop: 'Superior', sheetMarginRight: 'Dereita', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Esquerda' },
  eu: { format: 'Fitxaren formatua', text: 'Testua eta tipografia', margins: 'Fitxaren marjinak', reset: 'Berrezarri', print: 'Inprimatu', back: 'Itzuli katalogora', document: 'Dokumentua', worksheet: 'Fitxa', answers: 'Erantzun-gida', preview: 'A4 aurrebista', content: 'Edukia', sample: 'Fitxaren zati bat.', open: 'Ireki materiala webgunean', sheetFont: 'Tipografia', sheetSize: 'Letra-tamaina', sheetLeading: 'Lerroartea', sheetSpacing: 'Tartea', sheetMarginTop: 'Goikoa', sheetMarginRight: 'Eskuinekoa', sheetMarginBottom: 'Behekoa', sheetMarginLeft: 'Ezkerrekoa' },
};
const fonts = { serif: 'Georgia, serif', sans: 'Arial, sans-serif', verdana: 'Verdana, sans-serif' };
const margins = ['Top', 'Right', 'Bottom', 'Left'];

export function mountPrintStudy(root) {
  const defaults = JSON.parse(root.dataset.format);
  const form = root.querySelector('form');
  const fields = [...form.querySelectorAll('input, select')];
  const paper = root.querySelector('.study-paper');
  const stage = root.querySelector('.study-stage');
  const modes = [...root.querySelectorAll('[data-study-mode]')];
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
  for (const mode of modes) mode.addEventListener('click', () => {
    const answers = mode.dataset.studyMode === 'answers';
    for (const tab of modes) tab.setAttribute('aria-pressed', String(mode === tab));
    for (const answer of root.querySelectorAll('.study-answer')) answer.hidden = !answers;
    for (const lines of root.querySelectorAll('.study-lines')) lines.hidden = answers;
  });
  root.querySelector('[data-study-print]').addEventListener('click', () => window.print());
  new ResizeObserver(() => {
    const padding = getComputedStyle(stage);
    const width = stage.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight);
    paper.style.setProperty('--study-zoom', String(Math.min(1, Math.max(.1, width / (210 * 96 / 25.4)))));
  }).observe(stage);
  return locale => {
    const labels = copy[locale] ?? copy.ca;
    numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    for (const node of root.querySelectorAll('[data-t]')) node.textContent = labels[node.dataset.t] ?? copy.ca[node.dataset.t];
    for (const node of root.querySelectorAll('[data-study-label]')) node.setAttribute('aria-label', labels[node.dataset.studyLabel]);
    apply();
  };
}
