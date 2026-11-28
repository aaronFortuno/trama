import { mountDialog } from './dialog.js?v=0.12.0';
import { v4vCopy, v4vProjectCopy } from './v4v-copy.js?v=0.12.0';

export function mountV4V(dialog, trigger, { onOpen, onCopy } = {}) {
  const copy = dialog.querySelector('[data-of-copy]');
  const address = dialog.querySelector('[data-of-address]');
  const status = dialog.querySelector('[data-of-status]');
  const project = v4vProjectCopy[dialog.dataset.ofV4v];
  const locale = () => document.documentElement.lang.split('-')[0];
  const messages = () => v4vCopy[locale()] ?? v4vCopy.ca;
  mountDialog(dialog, trigger, {
    onOpen() {
      const labels = { ...messages(), ...(project[locale()] ?? project.ca) };
      for (const node of dialog.querySelectorAll('[data-of-v4v-text]')) node.textContent = labels[node.dataset.ofV4vText];
      for (const control of dialog.querySelectorAll('[data-of-v4v-label]')) {
        const label = labels[control.dataset.ofV4vLabel];
        control.setAttribute('aria-label', label);
        control.title = label;
      }
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
