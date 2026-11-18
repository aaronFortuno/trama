import Sortable from './assets/vendor/sortable/sortable.esm.js';
import { t } from './i18n.js';
import { setDisclosure } from './motion.js';

// Keep gestures separate from collection storage: only a completed move saves.
export function mountCatalogGestures({ root, grid, scroller, getState, getCollections, onMove, onStep, onAdd, onRemove }) {
  const menu = root.querySelector('#card-context-menu');
  const title = menu.querySelector('.card-context-title');
  const add = menu.querySelector('[data-card-option="add"]');
  const remove = menu.querySelector('[data-card-option="remove"]');
  const collectionOptions = menu.querySelector('#card-collection-options');
  const collectionList = menu.querySelector('.card-collection-list');
  const newCollection = menu.querySelector('[data-card-collection-new]');
  const newForm = menu.querySelector('.card-collection-form');
  const newName = menu.querySelector('#card-collection-name');
  const status = menu.querySelector('.card-collection-status');
  let sortable;
  let press;
  let pressTimer;
  let suppressClick = false;
  let dragging = false;
  let dragCollection;
  let paused = false;
  let anchor;
  let menuPoint;
  const opened = () => menu.matches(':popover-open');
  const choices = () => [...menu.querySelectorAll('button')].filter(button => !button.disabled && !button.closest('[hidden], [inert]'));
  const buttonFor = target => target.closest('.reading-card')?.querySelector('.card-open');
  const duration = () => Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion')) || 0;

  function cancelPress() {
    clearTimeout(pressTimer);
    press = undefined;
  }

  function sync() {
    const reorderable = Boolean(getState().collectionId) && !getState().selecting;
    grid.classList.toggle('is-reorderable', reorderable);
    if (paused) return;
    if (!sortable) sortable = new Sortable(grid, {
      draggable: '.reading-card', dataIdAttr: 'data-id',
      forceFallback: true, fallbackOnBody: true, fallbackTolerance: 7,
      delay: 220, delayOnTouchOnly: true, touchStartThreshold: 8,
      animation: duration(), ghostClass: 'card-placeholder', chosenClass: 'card-chosen', fallbackClass: 'card-drag-preview',
      scroll: scroller, scrollSensitivity: 70, scrollSpeed: 12,
      onStart() {
        cancelPress();
        dragCollection = getState().collectionId;
        suppressClick = dragging = true;
        document.body.classList.add('is-catalog-dragging');
      },
      onEnd(event) {
        dragging = false;
        document.body.classList.remove('is-catalog-dragging');
        if (dragCollection === getState().collectionId && !getState().selecting && event.oldDraggableIndex !== event.newDraggableIndex) {
          onMove(event.item.dataset.id, event.item.nextElementSibling?.dataset.id);
        }
      },
    });
    sortable.option('disabled', !reorderable);
    sortable.option('animation', duration());
  }

  function close(restoreFocus = false) {
    if (opened()) menu.hidePopover();
    if (restoreFocus && anchor?.isConnected) anchor.focus({ preventScroll: true });
    paused = false;
    sync();
  }

  function place(extraHeight = 0) {
    if (!opened()) return;
    menu.style.maxHeight = `${innerHeight - 16}px`;
    menu.style.left = `${Math.max(8, Math.min(menuPoint.x, innerWidth - menu.offsetWidth - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(menuPoint.y, innerHeight - menu.offsetHeight - extraHeight - 8))}px`;
  }

  function disclose(panel, expanded) {
    setDisclosure(panel, expanded, { settle: () => place() });
    place((expanded ? panel.scrollHeight : 0) - panel.getBoundingClientRect().height);
  }

  function renderCollections() {
    collectionList.replaceChildren(...getCollections().map(entry => {
      const button = document.createElement('button');
      const label = document.createElement('span');
      button.type = 'button';
      button.setAttribute('role', 'menuitem');
      button.dataset.collectionTarget = entry.id;
      button.disabled = entry.readingIds.includes(anchor.dataset.id);
      label.textContent = entry.name;
      button.append(label);
      if (button.disabled) {
        const check = document.createElement('span');
        check.textContent = '✓';
        check.setAttribute('aria-label', t('Ja hi és'));
        button.append(check);
      }
      return button;
    }));
  }

  function showCollections(expanded, focus = false) {
    add.setAttribute('aria-expanded', String(expanded));
    if (expanded) renderCollections();
    else {
      setDisclosure(newForm, false, { animated: false });
      newCollection.hidden = false;
    }
    disclose(collectionOptions, expanded);
    if (focus) (expanded ? collectionList.querySelector('button:enabled') ?? newCollection : add).focus({ preventScroll: true });
  }

  function showNewForm(expanded) {
    newCollection.hidden = expanded;
    disclose(newForm, expanded);
    (expanded ? newName : newCollection).focus({ preventScroll: true });
  }

  function saveToCollection(targetId, name = '') {
    const result = onAdd(anchor.dataset.id, targetId, name);
    status.hidden = false;
    status.textContent = result.message;
    status.classList.toggle('is-error', !result.ok);
    if (result.ok) {
      if (!newForm.hidden) showNewForm(false);
      newForm.reset();
      newName.removeAttribute('aria-invalid');
      renderCollections();
      newCollection.focus({ preventScroll: true });
    } else if (!newForm.hidden) {
      newName.setAttribute('aria-invalid', 'true');
      newName.focus({ preventScroll: true });
    }
    place();
  }

  function open(button, point) {
    if (getState().selecting) return;
    cancelPress();
    suppressClick = true;
    paused = true;
    // Cancel a pending touch drag before handing the press to the menu.
    sortable?.destroy();
    sortable = undefined;
    anchor = button;
    setDisclosure(collectionOptions, false, { animated: false });
    setDisclosure(newForm, false, { animated: false });
    newForm.reset();
    newName.removeAttribute('aria-invalid');
    newCollection.hidden = false;
    status.hidden = true;
    add.setAttribute('aria-expanded', 'false');
    const card = button.closest('.reading-card');
    title.textContent = `${card.querySelector('.card-code').textContent} · ${card.querySelector('.card-title').textContent}`;
    remove.hidden = !getState().collectionId;
    add.querySelector('span').textContent = t(getState().collectionId ? 'Afegeix a una altra col·lecció…' : 'Afegeix a una col·lecció…');
    remove.textContent = t('Treu de la col·lecció');
    menu.showPopover({ source: button });
    const box = button.getBoundingClientRect();
    menuPoint = point ?? { x: box.left, y: box.bottom };
    place();
    choices()[0]?.focus({ preventScroll: true });
  }

  grid.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) { cancelPress(); return; }
    const button = buttonFor(event.target);
    suppressClick = false;
    cancelPress();
    if (!button || getState().selecting) return;
    press = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
    pressTimer = setTimeout(() => open(button, { x: event.clientX, y: event.clientY }), 600);
  }, true);
  window.addEventListener('pointermove', event => {
    if (!press || press.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) {
      suppressClick = true;
      cancelPress();
    }
  }, { passive: true });
  window.addEventListener('pointerup', cancelPress);
  window.addEventListener('pointercancel', cancelPress);
  window.addEventListener('blur', cancelPress);
  // A drag or long press must never fall through into worksheet navigation.
  grid.addEventListener('click', event => {
    if (event.detail && (suppressClick || opened())) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  grid.addEventListener('contextmenu', event => {
    const button = buttonFor(event.target);
    if (!button || getState().selecting) return;
    event.preventDefault();
    open(button, { x: event.clientX, y: event.clientY });
  });
  grid.addEventListener('keydown', event => {
    const button = buttonFor(event.target);
    if (!button || getState().selecting) return;
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      open(button);
    } else if (event.altKey && getState().collectionId && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      onStep(button.dataset.id, ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1);
    }
  });
  menu.addEventListener('click', event => {
    const collection = event.target.closest('[data-collection-target]');
    if (collection && !collection.disabled) { saveToCollection(collection.dataset.collectionTarget); return; }
    if (event.target.closest('[data-card-collection-new]')) { showNewForm(true); return; }
    if (event.target.closest('[data-card-collection-cancel]')) { showNewForm(false); return; }
    const option = event.target.closest('[data-card-option]');
    if (!option || option.hidden) return;
    if (option === add) { showCollections(add.getAttribute('aria-expanded') !== 'true'); return; }
    const id = anchor?.dataset.id;
    close(true);
    onRemove(id);
  });
  newForm.addEventListener('submit', event => { event.preventDefault(); saveToCollection('', newName.value.trim()); });
  newName.addEventListener('input', () => { newName.removeAttribute('aria-invalid'); status.hidden = true; });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (!newForm.hidden) showNewForm(false);
      else if (add.getAttribute('aria-expanded') === 'true') showCollections(false, true);
      else close(true);
      return;
    }
    if (event.key === 'Tab') {
      if (!newForm.hidden && !((event.shiftKey && event.target === newName) || (!event.shiftKey && event.target.matches('[data-card-collection-cancel]')))) return;
      close(true);
    } else if (event.key === 'ArrowRight' && event.target === add) {
      event.preventDefault();
      showCollections(true, true);
    } else if (event.key === 'ArrowLeft' && newForm.hidden && add.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      showCollections(false, true);
    } else if (!event.target.matches('input') && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const buttons = choices();
      const index = buttons.indexOf(document.activeElement);
      const next = { Home: 0, End: buttons.length - 1, ArrowDown: index + 1, ArrowUp: index - 1 }[event.key];
      buttons[(next + buttons.length) % buttons.length]?.focus();
    }
  });
  menu.addEventListener('toggle', () => { if (!opened()) { paused = false; sync(); } });
  // Native auto-popover dismissal on pointerup would close a menu opened by
  // holding a pointer that originally went down outside the menu.
  document.addEventListener('pointerdown', event => {
    if (opened() && !menu.contains(event.target)) close();
  }, true);
  document.addEventListener('keydown', event => {
    if (opened() && event.key === 'Escape') { event.preventDefault(); close(true); }
  });
  window.addEventListener('resize', () => close());
  scroller.addEventListener('scroll', () => { if (opened()) close(); }, { passive: true });
  return {
    sync,
    close() { cancelPress(); close(); },
    dragging: () => dragging,
  };
}
