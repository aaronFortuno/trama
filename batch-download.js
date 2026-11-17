import { mountActionMenu } from './action-menu.js';
import { labelFor } from './catalog.js';
import { language, t } from './i18n.js';
import { decodeWorksheetImages, exportWorksheetPages } from './worksheet.js';
import { loadWorksheetFont } from './worksheet-fonts.js';
import { readWorksheetLayout } from './worksheet-layouts.js';
import { downloadBackup, prepareBackup, restoreBackup } from './settings-backup.js';

function batchName(readings) {
  const common = key => readings.every(reading => reading[key] === readings[0][key]) && readings[0][key];
  const level = common('level');
  const difficulty = common('difficulty');
  const lang = common('language');
  return ['trama', level && labelFor('level', level), difficulty && labelFor('difficulty', difficulty), lang]
    .filter(Boolean).join(' ').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
}

export function mountBatchDownload({ dialog, trigger, getReadings, getAllReadings, getCollectionId, getSettings, printPages, resetLayouts, saveCollection, onRestore }) {
  const list = dialog.querySelector('#batch-list');
  const none = dialog.querySelector('#batch-empty');
  const all = dialog.querySelector('#batch-select-all');
  const onlySaved = dialog.querySelector('#batch-only-saved');
  const resetAll = dialog.querySelector('#batch-reset-layouts');
  const layoutTools = dialog.querySelector('.batch-layout-tools');
  const count = dialog.querySelector('#batch-count');
  const printButton = dialog.querySelector('#batch-print');
  const menuTrigger = dialog.querySelector('#batch-print-trigger');
  const menu = mountActionMenu(menuTrigger, dialog.querySelector('#batch-print-menu'), outputBatch);
  const status = dialog.querySelector('#batch-status');
  const save = dialog.querySelector('#batch-save-collection');
  const backupFile = dialog.querySelector('#batch-backup-file');
  const download = dialog.querySelector('#batch-export-backup');
  const upload = dialog.querySelector('#batch-import-backup');
  const backupStatus = dialog.querySelector('#batch-backup-status');
  const confirmation = dialog.querySelector('#batch-backup-confirm');
  const restore = dialog.querySelector('#batch-restore-backup');
  const cancel = dialog.querySelector('#batch-cancel-backup');
  let rows = [];
  let job;
  let backupRequest = 0;
  let pendingBackup;
  const visibleRows = () => onlySaved.checked ? rows.filter(row => row.layout) : rows;

  function updateControls() {
    const visible = visibleRows();
    const selected = visible.filter(({ input }) => input.checked).length;
    const format = new Intl.NumberFormat(language());
    all.disabled = Boolean(job) || !visible.length;
    onlySaved.disabled = Boolean(job);
    resetAll.disabled = download.disabled = upload.disabled = restore.disabled = Boolean(job);
    all.checked = visible.length > 0 && selected === visible.length;
    all.indeterminate = selected > 0 && selected < visible.length;
    printButton.disabled = menuTrigger.disabled = save.disabled = Boolean(job) || !selected;
    for (const { input, item, layout } of rows) {
      input.disabled = Boolean(job);
      item.hidden = onlySaved.checked && !layout;
    }
    none.hidden = visible.length > 0;
    none.textContent = t(onlySaved.checked && rows.length
      ? 'No hi ha cap maquetat desat per a les lectures d’aquesta llista.'
      : 'No hi ha lectures amb aquesta cerca i aquests filtres.');
    count.textContent = t('{selected} de {total} seleccionades', {
      selected: format.format(selected), total: format.format(visible.length),
    });
  }

  function setStatus(message, error = false) {
    status.textContent = message;
    status.classList.toggle('batch-error', error);
    status.hidden = !message;
  }

  function populateRows() {
    const { compare } = new Intl.Collator(language(), { numeric: true });
    const readings = getReadings();
    const collectionId = getCollectionId();
    if (!collectionId) readings.sort((a, b) => compare(a.code, b.code) || compare(a.title, b.title) || compare(a.language, b.language));
    const codes = new Map();
    for (const { code } of readings) codes.set(code, (codes.get(code) ?? 0) + 1);
    rows = readings.map(reading => {
      const item = document.createElement('li');
      const label = document.createElement('label');
      const input = document.createElement('input');
      const code = document.createElement('code');
      const description = document.createElement('span');
      const title = document.createElement('span');
      const layout = readWorksheetLayout(reading, collectionId);
      input.type = 'checkbox';
      input.checked = true;
      code.textContent = codes.get(reading.code) > 1 ? `${reading.code}-${reading.language.toUpperCase()}` : reading.code;
      title.textContent = reading.title;
      title.lang = reading.language;
      description.className = 'batch-reading-description';
      description.append(title);
      label.append(input, code, description);
      if (layout) {
        const badge = document.createElement('span');
        badge.className = 'batch-saved';
        badge.textContent = layout.showClassroomCode && layout.classroomCode.trim()
          ? t('Maquetada · {code}', { code: layout.classroomCode.trim() })
          : t('Maquetada');
        description.append(badge);
      }
      item.append(label);
      return { reading, input, item, layout };
    });
    list.replaceChildren(...rows.map(row => row.item));
    updateControls();
  }

  trigger.addEventListener('click', () => {
    job?.abort();
    job = undefined;
    layoutTools.open = false;
    clearBackup();
    setStatus('');
    populateRows();
  });
  dialog.addEventListener('close', () => {
    if (dialog.open) return;
    menu.close();
    job?.abort();
    clearBackup();
  });
  list.addEventListener('change', () => { setStatus(''); updateControls(); });
  onlySaved.addEventListener('change', () => { setStatus(''); updateControls(); });
  resetAll.addEventListener('click', () => {
    if (job || !confirm(t('Vols esborrar els ajustos desats de totes les lectures d’aquest navegador?'))) return;
    const reset = resetLayouts();
    populateRows();
    setStatus(reset ? t('S’han restablert els ajustos de totes les lectures.') : t('No s’han pogut restablir els ajustos de totes les lectures.'), !reset);
  });
  all.addEventListener('change', () => {
    for (const { input } of visibleRows()) input.checked = all.checked;
    setStatus('');
    updateControls();
  });
  printButton.addEventListener('click', () => outputBatch('print'));
  save.addEventListener('click', () => {
    const selected = new Set(visibleRows().filter(row => row.input.checked).map(({ reading }) => reading.id));
    saveCollection(getReadings().filter(reading => selected.has(reading.id)));
  });

  function showBackupStatus(message, error = false) {
    backupStatus.textContent = message;
    backupStatus.hidden = !message;
    backupStatus.classList.toggle('batch-error', error);
  }

  function clearBackup() {
    backupRequest++;
    pendingBackup = undefined;
    confirmation.hidden = true;
    backupFile.value = '';
    showBackupStatus('');
  }

  download.addEventListener('click', () => {
    clearBackup();
    try {
      downloadBackup(getAllReadings());
      showBackupStatus(t('Còpia de seguretat preparada.'));
    } catch {
      showBackupStatus(t('No s’ha pogut crear la còpia de seguretat.'), true);
    }
  });
  upload.addEventListener('click', () => backupFile.click());
  backupFile.addEventListener('change', async () => {
    const file = backupFile.files[0];
    clearBackup();
    if (!file) return;
    const request = backupRequest;
    try {
      const backup = await prepareBackup(file, getAllReadings());
      if (request !== backupRequest) return;
      pendingBackup = backup;
      const { layouts, collectionLayouts, templates, collections, missing } = backup;
      const counts = t('Maquetats: {layouts} · Plantilles: {templates} · Col·leccions: {collections}', {
        layouts: layouts.length + collectionLayouts.length, templates: templates.length, collections: collections.length,
      });
      showBackupStatus(missing ? counts + '. ' + t('Maquetats sense lectura disponible: {count}.', { count: missing }) : counts);
      confirmation.hidden = false;
    } catch {
      if (request === backupRequest) showBackupStatus(t('El fitxer no és una còpia de seguretat compatible amb Trama.'), true);
    }
  });
  cancel.addEventListener('click', () => { clearBackup(); upload.focus(); });
  restore.addEventListener('click', () => {
    if (job || !pendingBackup) return;
    try {
      restoreBackup(pendingBackup);
    } catch {
      showBackupStatus(t('No s’ha pogut recuperar la còpia. Comprova que el navegador tingui espai lliure.'), true);
      return;
    }
    clearBackup();
    onRestore();
    populateRows();
    showBackupStatus(t('S’ha recuperat la còpia de seguretat.'));
    upload.focus();
  });

  async function* renderSelection(selected, answerKey, signal) {
    const collectionId = getCollectionId();
    for (const [index, { reading, layout }] of selected.entries()) {
      signal.throwIfAborted();
      setStatus(t('Preparant la fitxa {current} de {total}…', { current: index + 1, total: selected.length }));
      const settings = layout ?? getSettings(reading, collectionId);
      await loadWorksheetFont(settings.font);
      signal.throwIfAborted();
      yield { reading, pages: exportWorksheetPages(reading, settings, answerKey) };
    }
  }

  async function outputBatch(action) {
    const selected = visibleRows().filter(({ input }) => input.checked);
    if (job || !selected.length) return;
    const controller = job = new AbortController();
    const { signal } = controller;
    const answerKey = action.endsWith('-key');
    const canFinish = () => !signal.aborted && dialog.open && !dialog.classList.contains('is-closing');
    updateControls();
    setStatus(t('Preparant el lot…'));
    try {
      const selection = renderSelection(selected, answerKey, signal);
      if (action.startsWith('print')) {
        const sheets = [];
        for await (const { pages } of selection) sheets.push(...pages);
        await decodeWorksheetImages(sheets);
        if (!canFinish()) return;
        printPages(sheets);
      } else {
        const zipFormat = action.startsWith('zip');
        const suffix = answerKey ? '-' + t('solucionari') : '';
        const name = batchName(selected.map(({ reading }) => reading)) + suffix;
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
