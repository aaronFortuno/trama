import { mountDialog } from './dialog.js';

const defaults = {
  copied: 'Adreça copiada.',
  manual: 'Adreça seleccionada. Copia-la amb Ctrl+C o ⌘C.',
};

export function mountV4V(dialog, trigger, { messages = () => defaults, onOpen, onCopy } = {}) {
  const copy = dialog.querySelector('[data-of-copy]');
  const address = dialog.querySelector('[data-of-address]');
  const status = dialog.querySelector('[data-of-status]');
  mountDialog(dialog, trigger, {
    onOpen() {
      status.textContent = '';
      status.hidden = false;
      onOpen?.();
    },
  });

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
