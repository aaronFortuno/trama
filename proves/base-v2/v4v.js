const defaults = {
  copied: 'Adreça copiada.',
  manual: 'Adreça seleccionada. Copia-la amb Ctrl+C o ⌘C.',
};

export function mountV4V(dialog, trigger, { messages = () => defaults, onOpen, onCopy } = {}) {
  const close = dialog.querySelector('[data-of-close]');
  const copy = dialog.querySelector('[data-of-copy]');
  const address = dialog.querySelector('[data-of-address]');
  const status = dialog.querySelector('[data-of-status]');
  const body = dialog.querySelector('.of-v4v-scroll');
  let backdropPress = false;

  function outside(event) {
    if (event.target !== dialog) return false;
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom;
  }

  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    status.textContent = '';
    status.hidden = false;
    backdropPress = false;
    dialog.showModal();
    if (body) body.scrollTop = 0;
    close.focus({ preventScroll: true });
    onOpen?.();
  });
  close.addEventListener('click', event => {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('pointerdown', event => { backdropPress = outside(event); });
  dialog.addEventListener('click', event => {
    if (backdropPress && outside(event)) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));

  copy.addEventListener('click', async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(address.textContent.trim());
      copied = true;
    } catch {
      const selection = window.getSelection();
      if (selection && dialog.open) {
        const range = document.createRange();
        range.selectNodeContents(address);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    if (dialog.open) status.textContent = copied ? messages().copied : messages().manual;
    if (copied) onCopy?.();
  });
}
