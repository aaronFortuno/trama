const disclosures = new WeakMap();
const refreshes = new WeakMap();
const dialogs = new WeakMap();

function animate(element, frames) {
  const style = getComputedStyle(document.documentElement);
  const duration = Number.parseFloat(style.getPropertyValue('--motion'));
  if (!duration || !element.animate) return null;
  return element.animate(frames, { duration, easing: style.getPropertyValue('--motion-ease').trim() });
}

export function animateRefresh(element) {
  refreshes.get(element)?.cancel();
  const animation = animate(element, [{ opacity: .72, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }]);
  if (animation) refreshes.set(element, animation);
}

export function setDisclosure(panel, open, { animated = true, settle } = {}) {
  const current = disclosures.get(panel);
  if (animated && current?.open === open) return;
  if (!current && panel.hidden === !open) return;

  const height = panel.hidden ? 0 : panel.getBoundingClientRect().height;
  const opacity = panel.hidden ? 0 : getComputedStyle(panel).opacity;
  current?.animation.cancel();
  panel.hidden = false;
  panel.inert = !open;
  panel.dataset.disclosing = '';
  const target = open ? panel.getBoundingClientRect().height : 0;
  const finish = () => {
    panel.hidden = !open;
    delete panel.dataset.disclosing;
    disclosures.delete(panel);
    settle?.();
  };
  const animation = animated && height !== target && animate(panel, [
    { height: `${height}px`, opacity }, { height: `${target}px`, opacity: open ? 1 : 0 },
  ]);
  if (animation) {
    disclosures.set(panel, { open, animation });
    animation.onfinish = finish;
  } else finish();
}

export function mountDisclosures(root) {
  for (const details of root.querySelectorAll('details')) {
    const summary = details.querySelector(':scope > summary');
    const panel = document.createElement('div');
    panel.className = 'details-panel';
    for (const child of [...details.children]) {
      if (child !== summary) panel.append(child);
    }
    let open = details.open;
    panel.hidden = !open;
    details.append(panel);
    summary.addEventListener('click', event => {
      event.preventDefault();
      open = !open;
      details.open = true;
      summary.setAttribute('aria-expanded', String(open));
      setDisclosure(panel, open, { settle: () => { details.open = open; } });
    });
  }
}

export function openDialog(dialog) {
  const wasOpen = dialog.open;
  const opacity = wasOpen ? getComputedStyle(dialog).opacity : 0;
  const transform = wasOpen ? getComputedStyle(dialog).transform : 'translateY(8px)';
  dialogs.get(dialog)?.cancel();
  dialog.classList.remove('is-closing');
  if (!wasOpen) dialog.showModal();
  const animation = animate(dialog, [{ opacity, transform }, { opacity: 1, transform: 'none' }]);
  if (animation) dialogs.set(dialog, animation);
}

export function closeDialog(dialog, afterClose) {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  const style = getComputedStyle(dialog);
  const start = { opacity: style.opacity, transform: style.transform };
  dialogs.get(dialog)?.cancel();
  dialog.classList.add('is-closing');
  const finish = () => {
    dialog.close();
    dialog.classList.remove('is-closing');
    dialogs.delete(dialog);
    afterClose?.();
  };
  const animation = animate(dialog, [start, { opacity: 0, transform: 'translateY(8px)' }]);
  if (animation) {
    dialogs.set(dialog, animation);
    animation.onfinish = finish;
  } else finish();
}

export function mountDialogs() {
  for (const dialog of document.querySelectorAll('.site-dialog')) {
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('click', event => {
      if (event.target.closest('[data-close-dialog]')) closeDialog(dialog);
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog(dialog);
    });
  }
  for (const button of document.querySelectorAll('[data-open-dialog]')) {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      openDialog(dialog);
      dialog.querySelector('.dialog-scroll').scrollTop = 0;
      dialog.querySelector('[data-dialog-focus]').focus({ preventScroll: true });
    });
  }
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', event => {
    if (event.matches) {
      for (const animation of document.getAnimations()) {
        if (Number.isFinite(animation.effect?.getComputedTiming().endTime)) animation.finish();
      }
    }
  });
}
