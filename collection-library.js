import { collectionsKey, listCollections, moveCollectionReading, removeCollectionReading } from './collections.js';
import { labelFor } from './catalog.js';
import { icon } from './icons.js';
import { t } from './i18n.js';
import { animateRefresh, closeDialog, openDialog } from './motion.js';

export function mountCollectionLibrary({ dialog, readings, onChange, onAdd }) {
  const list = dialog.querySelector('#collection-library-list');
  const title = dialog.querySelector('#collection-library-title');
  const empty = dialog.querySelector('#collection-library-empty');
  const status = dialog.querySelector('#collection-library-status');
  const index = new Map(readings.map(reading => [reading.id, reading]));
  let collectionId;
  let draggedId;

  function makeButton(action, label, symbol, disabled = false) {
    const button = document.createElement('button');
    button.className = 'button close-button';
    button.type = 'button';
    button.dataset.action = action;
    button.title = button.ariaLabel = label;
    button.disabled = disabled;
    button.innerHTML = symbol;
    return button;
  }

  function render(focusId, action) {
    const entry = listCollections().find(item => item.id === collectionId);
    title.textContent = entry?.name ?? t('Col·leccions');
    const ids = entry?.readingIds ?? [];
    empty.hidden = ids.length > 0;
    dialog.querySelector('#collection-library-add').disabled = !entry;
    list.replaceChildren(...ids.map((id, position) => {
      const reading = index.get(id);
      const row = document.createElement('li');
      row.dataset.id = id;
      const name = reading?.title ?? id;
      const handle = makeButton('drag', t('Arrossega «{title}»', { title: name }), icon('grip-vertical'));
      handle.draggable = true;
      handle.classList.add('collection-drag-handle');
      const copy = document.createElement('div');
      copy.className = 'collection-library-copy';
      const meta = document.createElement('small');
      meta.textContent = reading ? `${reading.code} · ${labelFor('language', reading.language)}` : t('Lectura no disponible');
      const label = document.createElement('span');
      label.textContent = name;
      if (reading) label.lang = reading.language;
      copy.append(meta, label);
      const controls = document.createElement('div');
      controls.className = 'collection-row-actions';
      controls.append(
        makeButton('up', t('Puja «{title}»', { title: name }), icon('arrow-up'), position === 0),
        makeButton('down', t('Baixa «{title}»', { title: name }), icon('arrow-down'), position === ids.length - 1),
        makeButton('remove', t('Treu «{title}» de la col·lecció', { title: name }), icon('x')),
      );
      row.append(handle, copy, controls);
      return row;
    }));
    if (focusId) {
      const row = [...list.children].find(row => row.dataset.id === focusId);
      const focus = row?.querySelector(`[data-action="${action}"]:not(:disabled)`) ?? row?.querySelector('button:not(:disabled)');
      focus?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: 'nearest' });
    }
  }

  function commit(change, focusId, action, message = '') {
    try {
      const entry = change();
      onChange(entry.id);
      status.textContent = message;
      render(focusId, action);
      animateRefresh(list);
    } catch (error) {
      status.textContent = error instanceof DOMException ? t('No s’han pogut desar els canvis de la col·lecció.') : error.message;
      render();
    }
  }

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.closest('li').dataset.id;
    const action = button.dataset.action;
    const entry = listCollections().find(item => item.id === collectionId);
    if (!entry) { render(); return; }
    const position = entry.readingIds.indexOf(id);
    if (position < 0) { render(); return; }
    if (action === 'remove') {
      const next = entry.readingIds[position + 1] ?? entry.readingIds[position - 1];
      commit(() => removeCollectionReading(collectionId, id), next, 'remove', t('Lectura retirada de la col·lecció.'));
    }
    if (action === 'up' && position > 0) {
      commit(() => moveCollectionReading(collectionId, id, entry.readingIds[position - 1]), id, action);
    }
    if (action === 'down' && position < entry.readingIds.length - 1) {
      commit(() => moveCollectionReading(collectionId, id, entry.readingIds[position + 2]), id, action);
    }
  });

  function clearDrag() {
    draggedId = undefined;
    for (const row of list.children) delete row.dataset.drop;
  }
  list.addEventListener('dragstart', event => {
    const handle = event.target.closest('.collection-drag-handle');
    if (!handle) return;
    draggedId = handle.closest('li').dataset.id;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedId);
  });
  list.addEventListener('dragover', event => {
    const row = event.target.closest('li');
    if (!draggedId || !row) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    for (const item of list.children) delete item.dataset.drop;
    const rect = row.getBoundingClientRect();
    row.dataset.drop = event.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
  });
  list.addEventListener('drop', event => {
    const row = event.target.closest('li');
    if (!draggedId || !row) return;
    event.preventDefault();
    const id = draggedId;
    const beforeId = row.dataset.drop === 'after' ? row.nextElementSibling?.dataset.id : row.dataset.id;
    clearDrag();
    commit(() => moveCollectionReading(collectionId, id, beforeId), id, 'drag');
  });
  list.addEventListener('dragend', clearDrag);
  dialog.addEventListener('close', clearDrag);
  dialog.querySelector('#collection-library-add').addEventListener('click', () => {
    closeDialog(dialog, () => onAdd(collectionId));
  });
  window.addEventListener('storage', event => {
    if (dialog.open && (event.key === collectionsKey || event.key === null)) render();
  });
  return {
    open(id) {
      collectionId = id;
      status.textContent = '';
      render();
      openDialog(dialog);
      title.focus();
    },
    translate() { if (dialog.open) render(); },
  };
}
