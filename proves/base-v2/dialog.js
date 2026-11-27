export function mountDialog(dialog, trigger, { onOpen } = {}) {
  const closeButton = dialog.querySelector('[data-of-close]');
  const body = dialog.querySelector('.of-v4v-scroll');
  let backdropPress = false;

  function outside(event) {
    if (event.target !== dialog) return false;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom;
  }

  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    backdropPress = false;
    onOpen?.();
    dialog.showModal();
    if (body) body.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  });
  closeButton.addEventListener('click', event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('pointerdown', event => { backdropPress = outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPress && outside(event)) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
}
