import { syncPrintRange } from './print-controls.js?v=0.14.0';
import { localisePreviewControls, mountDocumentModes, placePreviewPrintActions } from './print-preview-controls.js?v=0.14.0';
import { mountPreviewZoom } from './preview-zoom.js?v=0.14.0';
import { mountDialog } from './dialog.js?v=0.14.0';
import { getStudyMaterial, studyLink } from './study-materials.js?v=0.14.0';

const copy = {
  ca: { format: 'Format del full', text: 'Text i tipografia', margins: 'Marges del full', reset: 'Restableix', print: 'Imprimeix', back: 'Torna al catàleg', report: 'Notifica un error', close: 'Tanca', preview: 'Vista prèvia A4', content: 'Contingut', audio: 'Àudio', sample: 'Material de prova de la v2.', listen: 'Obre la sessió d’escolta', audioStudy: 'Prova els controls d’àudio', sheetFont: 'Tipografia', sheetSize: 'Cos de lletra', sheetLeading: 'Interlineat', sheetSpacing: 'Espaiat', sheetMarginTop: 'Superior', sheetMarginRight: 'Dret', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Esquerre' },
  es: { format: 'Formato de la ficha', text: 'Texto y tipografía', margins: 'Márgenes de la ficha', reset: 'Restablecer', print: 'Imprimir', back: 'Vuelve al catálogo', report: 'Notifica un error', close: 'Cerrar', preview: 'Vista previa A4', content: 'Contenido', audio: 'Audio', sample: 'Material de prueba de la v2.', listen: 'Abre la sesión de escucha', audioStudy: 'Prueba los controles de audio', sheetFont: 'Tipografía', sheetSize: 'Tamaño de letra', sheetLeading: 'Interlineado', sheetSpacing: 'Espaciado', sheetMarginTop: 'Superior', sheetMarginRight: 'Derecho', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Izquierdo' },
  gl: { format: 'Formato da ficha', text: 'Texto e tipografía', margins: 'Marxes da ficha', reset: 'Restablecer', print: 'Imprimir', back: 'Volver ao catálogo', report: 'Notifica un erro', close: 'Pechar', preview: 'Vista previa A4', content: 'Contido', sample: 'Material de proba da v2.', sheetFont: 'Tipografía', sheetSize: 'Tamaño da letra', sheetLeading: 'Interliñado', sheetSpacing: 'Espazamento', sheetMarginTop: 'Superior', sheetMarginRight: 'Dereita', sheetMarginBottom: 'Inferior', sheetMarginLeft: 'Esquerda' },
  eu: { format: 'Fitxaren formatua', text: 'Testua eta tipografia', margins: 'Fitxaren marjinak', reset: 'Berrezarri', print: 'Inprimatu', back: 'Itzuli katalogora', report: 'Jakinarazi erro bat', close: 'Itxi', preview: 'A4 aurrebista', content: 'Edukia', sample: 'v2ko probako materiala.', sheetFont: 'Tipografia', sheetSize: 'Letra-tamaina', sheetLeading: 'Lerroartea', sheetSpacing: 'Tartea', sheetMarginTop: 'Goikoa', sheetMarginRight: 'Eskuinekoa', sheetMarginBottom: 'Behekoa', sheetMarginLeft: 'Ezkerrekoa' },
};
const fonts = { serif: 'Georgia, serif', sans: 'Arial, sans-serif', verdana: 'Verdana, sans-serif' };
const margins = ['Top', 'Right', 'Bottom', 'Left'];
const reportCopy = {
  ca: ['Part afectada', 'Tria una part', 'Pregunta', 'Solucionari', 'Envia l’avís de prova', 'Avís de prova registrat.'],
  es: ['Parte afectada', 'Elige una parte', 'Pregunta', 'Solucionario', 'Envía el aviso de prueba', 'Aviso de prueba registrado.'],
  gl: ['Parte afectada', 'Escolle unha parte', 'Pregunta', 'Solucionario', 'Envía o aviso de proba', 'Aviso de proba rexistrado.'],
  eu: ['Atalaren izena', 'Aukeratu atala', 'Galdera', 'Erantzun-gida', 'Bidali probako jakinarazpena', 'Probako jakinarazpena erregistratu da.'],
};

export function mountPrintStudy(root) {
  const sample = getStudyMaterial(document.body.dataset.project, new URLSearchParams(location.search).get('material'));
  for (const node of root.querySelectorAll('[data-material-field]')) node.textContent = sample[node.dataset.materialField];
  for (const link of root.querySelectorAll('[data-material-link]')) link.href = studyLink(link.dataset.materialLink, sample.code);
  const questions = root.querySelector('[data-material-questions]');
  for (const { prompt, answer } of sample.questions) {
    const item = document.createElement('li');
    item.innerHTML = '<p></p><p class="study-answer" hidden></p><div class="study-lines" aria-hidden="true"></div>';
    item.firstElementChild.textContent = prompt;
    item.children[1].textContent = answer;
    questions.append(item);
  }
  const defaults = JSON.parse(root.dataset.format);
  const form = root.querySelector('form');
  const fields = [...form.querySelectorAll('input, select')];
  const paper = root.querySelector('.study-paper');
  const stage = root.querySelector('.study-stage');
  const pages = root.querySelector('.study-pages');
  mountPreviewZoom(stage, pages, root.querySelector('.of-preview-zoom'), { scaleProperty: '--study-zoom' });
  const report = root.querySelector('.study-report');
  const reportForm = report.querySelector('form');
  const reportStatus = reportForm.querySelector('[data-study-report-status]');
  mountDialog(report, root.querySelector('[data-of-report]'), { onOpen() {
    reportForm.elements.part.value = documentView.answers ? 'solution' : '';
    reportStatus.hidden = true;
  } });
  reportForm.addEventListener('submit', event => {
    event.preventDefault();
    reportStatus.hidden = false;
  });
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
  const documentView = mountDocumentModes(root.querySelector('.of-preview-modes'), mode => {
    const answers = mode === 'answers';
    for (const answer of root.querySelectorAll('.study-answer')) answer.hidden = !answers;
    for (const lines of root.querySelectorAll('.study-lines')) lines.hidden = answers;
  });
  root.querySelector('[data-study-print]').addEventListener('click', () => window.print());
  return locale => {
    const [reportPart, reportChoose, reportQuestion, reportSolution, reportSubmit, reportDone] = reportCopy[locale] ?? reportCopy.ca;
    const labels = { ...(copy[locale] ?? copy.ca), reportPart, reportChoose, reportQuestion, reportSolution, reportSubmit, reportDone };
    localisePreviewControls(root, locale);
    numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    for (const node of root.querySelectorAll('[data-t]')) node.textContent = labels[node.dataset.t] ?? copy.ca[node.dataset.t];
    for (const node of root.querySelectorAll('[data-study-label]')) node.setAttribute('aria-label', labels[node.dataset.studyLabel]);
    apply();
  };
}
