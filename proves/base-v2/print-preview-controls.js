const controls = {
  ca: { document: 'Document', worksheet: 'Fitxa', answers: 'Solucionari', zoom: 'Zoom de la previsualització', out: 'Redueix el zoom', in: 'Amplia el zoom', fit: 'Ajusta a l’amplada', zoomValue: 'Nivell de zoom', report: 'Notifica un error' },
  es: { document: 'Documento', worksheet: 'Ficha', answers: 'Solucionario', zoom: 'Zoom de la vista previa', out: 'Reduce el zoom', in: 'Amplía el zoom', fit: 'Ajusta a la anchura', zoomValue: 'Nivel de zoom', report: 'Notifica un error' },
  gl: { document: 'Documento', worksheet: 'Ficha', answers: 'Solucionario', zoom: 'Zoom da vista previa', out: 'Reduce o zoom', in: 'Amplía o zoom', fit: 'Axusta á largura', zoomValue: 'Nivel de zoom', report: 'Notifica un erro' },
  eu: { document: 'Dokumentua', worksheet: 'Fitxa', answers: 'Erantzun-gida', zoom: 'Aurrebistaren zooma', out: 'Txikitu zooma', in: 'Handitu zooma', fit: 'Doitu zabalerara', zoomValue: 'Zoom-maila', report: 'Jakinarazi erro bat' },
};
const icon = paths => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const zoomIcons = {
  out: icon('<path d="M5 12h14"/>'),
  in: icon('<path d="M5 12h14m-7-7v14"/>'),
  fit: icon('<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/>'),
};

export function documentModes({ worksheetId, answersId } = {}) {
  return `<div class="of-preview-modes" data-of-preview-label="document" role="group" aria-label="Document">
    <button type="button"${worksheetId ? ` id="${worksheetId}"` : ''} data-of-preview-mode="worksheet" aria-pressed="true">Fitxa</button>
    <button type="button"${answersId ? ` id="${answersId}"` : ''} data-of-preview-mode="answers" aria-pressed="false">Solucionari</button>
  </div>`;
}

export function reportFlag(dialog, { id } = {}) {
  const flag = icon('<path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/>');
  return `<button type="button" class="of-preview-icon" data-of-report data-of-preview-label="report" aria-label="Notifica un error" title="Notifica un error" aria-haspopup="dialog" aria-controls="${dialog}"${id ? ` id="${id}"` : ''}>${flag}</button>`;
}

export function zoomTools(classes = '') {
  return `<div class="of-preview-zoom${classes ? ` ${classes}` : ''}" data-of-preview-label="zoom" role="group" aria-label="${controls.ca.zoom}">
    ${Object.entries(zoomIcons).map(([key, symbol]) => `<button type="button" class="of-preview-icon" data-zoom="${key}" data-of-preview-label="${key}" aria-label="${controls.ca[key]}" title="${controls.ca[key]}">${symbol}</button>`).join('\n')}
    <output class="of-sr-only" data-of-preview-label="zoomValue" aria-label="${controls.ca.zoomValue}">100 %</output>
  </div>`;
}

export function localisePreviewControls(root, locale) {
  const copy = controls[locale] ?? controls.ca;
  for (const control of root.querySelectorAll('[data-of-preview-mode]')) control.textContent = copy[control.dataset.ofPreviewMode];
  for (const control of root.querySelectorAll('[data-of-preview-label]')) {
    const label = copy[control.dataset.ofPreviewLabel];
    control.setAttribute('aria-label', label);
    if (control.matches('button')) control.title = label;
  }
}

export function mountDocumentModes(group, onChange) {
  const buttons = [...group.querySelectorAll('[data-of-preview-mode]')];
  let value = 'worksheet';
  function set(mode) {
    value = mode;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.ofPreviewMode === value));
  }
  for (const button of buttons) button.addEventListener('click', () => {
    const mode = button.dataset.ofPreviewMode;
    if (mode === value) return;
    set(mode);
    onChange(mode);
  });
  return { get answers() { return value === 'answers'; }, set };
}

export function mountPreviewReport(trigger, dialog, { isAnswerKey, open }) {
  let openedFromFlag = false;
  trigger.addEventListener('click', () => {
    open({ part: isAnswerKey() ? 'solution' : '', element: '' });
    openedFromFlag = dialog.open;
  });
  dialog.addEventListener('close', () => {
    if (!openedFromFlag) return;
    openedFromFlag = false;
    trigger.focus({ preventScroll: true });
  });
}

export function placePreviewPrintActions(action, side, compact, wideScreen) {
  function place() {
    const focus = document.activeElement;
    (wideScreen.matches ? side : compact).append(action);
    if (action.contains(focus)) focus.focus({ preventScroll: true });
  }
  place();
  wideScreen.addEventListener('change', place);
}
