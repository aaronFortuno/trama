import { mountActionMenu } from './action-menu.js';
import { labelFor } from './catalog.js';
import { language, t } from './i18n.js';
import { decodeWorksheetImages, exportWorksheetPages } from './worksheet.js';
import { loadWorksheetFont } from './worksheet-fonts.js';

function batchName(readings) {
  const common = key => readings.every(reading => reading[key] === readings[0][key]) && readings[0][key];
  const level = common('level');
  const difficulty = common('difficulty');
  const lang = common('language');
  return ['trama', level && labelFor('level', level), difficulty && labelFor('difficulty', difficulty), lang]
    .filter(Boolean).join(' ').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
}

export function mountBatchDownload({ dialog, trigger, getReadings, getSettings, printPages }) {
  const list = dialog.querySelector('#batch-list');
  const none = dialog.querySelector('#batch-empty');
  const all = dialog.querySelector('#batch-select-all');
  const count = dialog.querySelector('#batch-count');
  const printButton = dialog.querySelector('#batch-print');
  const menuTrigger = dialog.querySelector('#batch-print-trigger');
  const menu = mountActionMenu(menuTrigger, dialog.querySelector('#batch-print-menu'), outputBatch);
  const status = dialog.querySelector('#batch-status');
  let rows = [];
  let job;

  function updateControls() {
    const selected = rows.filter(({ input }) => input.checked).length;
    const format = new Intl.NumberFormat(language());
    all.disabled = Boolean(job) || !rows.length;
    all.checked = rows.length > 0 && selected === rows.length;
    all.indeterminate = selected > 0 && selected < rows.length;
    printButton.disabled = menuTrigger.disabled = Boolean(job) || !selected;
    for (const { input } of rows) input.disabled = Boolean(job);
    count.textContent = t('{selected} de {total} seleccionades', {
      selected: format.format(selected), total: format.format(rows.length),
    });
  }

  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('batch-error', error);
    status.hidden = !message;
  }

  trigger.addEventListener('click', () => {
    job?.abort();
    job = undefined;
    const { compare } = new Intl.Collator(language(), { numeric: true });
    const readings = getReadings().sort((a, b) => compare(a.code, b.code) || compare(a.title, b.title) || compare(a.language, b.language));
    const codes = new Map();
    for (const { code } of readings) codes.set(code, (codes.get(code) ?? 0) + 1);
    rows = readings.map(reading => {
      const item = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      const code = document.createElement('code');
      const title = document.createElement('span');
      input.type = 'checkbox';
      input.checked = true;
      code.textContent = codes.get(reading.code) > 1 ? `${reading.code}-${reading.language.toUpperCase()}` : reading.code;
      title.textContent = reading.title;
      title.lang = reading.language;
      label.append(input, code, title);
      item.append(label);
      return { reading, input, item };
    });
    list.replaceChildren(...rows.map(row => row.item));
    none.hidden = rows.length > 0;
    setStatus('');
    updateControls();
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    menu.close();
    job?.abort();
  });
  list.addEventListener('change', () => { setStatus(''); updateControls(); });
  all.addEventListener('change', () => {
    for (const { input } of rows) input.checked = all.checked;
    setStatus('');
    updateControls();
  });
  printButton.addEventListener('click', () => outputBatch('print'));

  async function* renderSelection(readings, answerKey, signal) {
    for (const [index, reading] of readings.entries()) {
      signal.throwIfAborted();
      setStatus(t('Preparant la fitxa {current} de {total}…', { current: index + 1, total: readings.length }));
      const settings = getSettings(reading);
      await loadWorksheetFont(settings.font);
      signal.throwIfAborted();
      yield { reading, pages: exportWorksheetPages(reading, settings, answerKey) };
    }
  }

  async function outputBatch(action) {
    const readings = rows.filter(({ input }) => input.checked).map(({ reading }) => reading);
    if (job || !readings.length) return;
    const controller = job = new AbortController();
    const { signal } = controller;
    const answerKey = action.endsWith('-key');
    const canFinish = () => !signal.aborted && dialog.open && !dialog.classList.contains('is-closing');
    updateControls();
    setStatus(t('Preparant el lot…'));
    try {
      const selection = renderSelection(readings, answerKey, signal);
      if (action.startsWith('print')) {
        const sheets = [];
        for await (const { pages } of selection) sheets.push(...pages);
        await decodeWorksheetImages(sheets);
        if (!canFinish()) return;
        printPages(sheets);
      } else {
        const zipFormat = action.startsWith('zip');
        const suffix = answerKey ? '-' + t('solucionari') : '';
        const name = batchName(readings) + suffix;
        const [{ createPdfSession, saveDownload }, zipModule] = await Promise.all([
          import('./worksheet-pdf.js'),
          zipFormat ? import('./worksheet-zip.js') : null,
        ]);
        const session = await createPdfSession();
        const zip = zipModule?.createZip();
        const combined = zip ? null : await session.create(t(answerKey ? 'Solucionaris de Trama' : 'Fitxes de Trama'));
        for await (const { reading, pages } of selection) {
          const title = answerKey ? `${reading.title} · ${t('Solucionari', {}, reading.language)}` : reading.title;
          const pdf = combined ?? await session.create(title);
          await session.append(pdf, pages, signal);
          if (zip) zip.add(`${reading.code}-${reading.language.toUpperCase()}${suffix}.pdf`, await pdf.save());
        }
        if (!canFinish()) return;
        setStatus(t('Finalitzant el fitxer…'));
        const blob = zip?.blob() ?? new Blob([await combined.save()], { type: 'application/pdf' });
        if (!canFinish()) return;
        saveDownload(blob, `${name}.${zipFormat ? 'zip' : 'pdf'}`);
      }
      setStatus(t('Lot preparat.'));
    } catch {
      if (canFinish()) setStatus(t('No s’ha pogut preparar el document. Torna-ho a provar.'), true);
    } finally {
      if (job === controller) {
        job = undefined;
        updateControls();
      }
    }
  }
}
