import { labelFor } from './catalog.js';
import { language, t } from './i18n.js';
import { exportWorksheetPages } from './worksheet.js';
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

export function mountBatchDownload({ dialog, trigger, getReadings, getSettings }) {
  const list = dialog.querySelector('#batch-list');
  const none = dialog.querySelector('#batch-empty');
  const all = dialog.querySelector('#batch-select-all');
  const count = dialog.querySelector('#batch-count');
  const options = dialog.querySelector('#batch-options');
  const optionGroups = options.querySelectorAll('fieldset');
  const download = dialog.querySelector('#batch-download');
  const status = dialog.querySelector('#batch-status');
  let rows = [];
  let job;

  function updateControls() {
    const selected = rows.filter(({ input }) => input.checked).length;
    const format = new Intl.NumberFormat(language());
    all.disabled = Boolean(job) || !rows.length;
    all.checked = rows.length > 0 && selected === rows.length;
    all.indeterminate = selected > 0 && selected < rows.length;
    for (const group of optionGroups) group.disabled = Boolean(job);
    download.disabled = Boolean(job) || !selected;
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
    for (const input of options.querySelectorAll('input')) input.checked = input.defaultChecked;
    setStatus('');
    updateControls();
  });
  dialog.addEventListener('close', () => { if (!dialog.open) job?.abort(); });
  list.addEventListener('change', () => { setStatus(''); updateControls(); });
  options.addEventListener('change', () => setStatus(''));
  all.addEventListener('change', () => {
    for (const { input } of rows) input.checked = all.checked;
    setStatus('');
    updateControls();
  });
  download.addEventListener('click', async () => {
    const readings = rows.filter(({ input }) => input.checked).map(({ reading }) => reading);
    if (job || !readings.length) return;
    const controller = job = new AbortController();
    const { signal } = controller;
    const zipFormat = options.querySelector('[value="zip"]').checked;
    const answerKey = options.querySelector('[value="answer-key"]').checked;
    const suffix = answerKey ? '-' + t('solucionari') : '';
    const name = batchName(readings) + suffix;
    updateControls();
    setStatus(t('Preparant el lot…'));
    try {
      const [{ createPdfSession, saveDownload }, zipModule] = await Promise.all([
        import('./worksheet-pdf.js'),
        zipFormat ? import('./worksheet-zip.js') : null,
      ]);
      const session = await createPdfSession();
      const zip = zipModule?.createZip();
      const combined = zip ? null : await session.create(t(answerKey ? 'Solucionaris de Trama' : 'Fitxes de Trama'));
      for (const [index, reading] of readings.entries()) {
        signal.throwIfAborted();
        setStatus(t('Preparant la fitxa {current} de {total}…', { current: index + 1, total: readings.length }));
        const settings = getSettings(reading);
        await loadWorksheetFont(settings.font);
        signal.throwIfAborted();
        const title = answerKey ? `${reading.title} · ${t('Solucionari', {}, reading.language)}` : reading.title;
        const pdf = combined ?? await session.create(title);
        await session.append(pdf, exportWorksheetPages(reading, settings, answerKey), signal);
        if (zip) zip.add(`${reading.code}-${reading.language.toUpperCase()}${suffix}.pdf`, await pdf.save());
      }
      signal.throwIfAborted();
      setStatus(t('Finalitzant el fitxer…'));
      const blob = zip?.blob() ?? new Blob([await combined.save()], { type: 'application/pdf' });
      signal.throwIfAborted();
      if (!dialog.open || dialog.classList.contains('is-closing')) return;
      saveDownload(blob, `${name}.${zipFormat ? 'zip' : 'pdf'}`);
      setStatus(t('Lot preparat.'));
    } catch {
      if (!signal.aborted) setStatus(t('No s’ha pogut descarregar el lot. Torna-ho a provar.'), true);
    } finally {
      if (job === controller) {
        job = undefined;
        updateControls();
      }
    }
  });
}
