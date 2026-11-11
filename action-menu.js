import { placeMenu } from './select-menu.js';

export function mountActionMenu(trigger, menu, onAction) {
  const isOpen = () => menu.matches(':popover-open');
  const items = [...menu.querySelectorAll('button')];
  const available = () => items.filter(item => !item.disabled);

  function close(restoreFocus = false) {
    if (!isOpen()) return;
    menu.hidePopover();
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  function open(last = false) {
    menu.showPopover({ source: trigger });
    placeMenu(trigger, menu, 'end');
    const choices = available();
    const first = choices.find(item => item.getAttribute('aria-checked') === 'true') ?? choices[0];
    (last ? choices.at(-1) : first)?.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', event => {
    event.preventDefault();
    if (isOpen()) close(true);
    else open();
  });
  trigger.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    if (!isOpen()) open(event.key === 'ArrowUp');
  });
  menu.addEventListener('beforetoggle', event => {
    trigger.setAttribute('aria-expanded', String(event.newState === 'open'));
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      if (event.key === 'Escape') event.preventDefault();
      close(true);
      return;
    }
    if (!['Home', 'End', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const choices = available();
    const index = choices.indexOf(document.activeElement);
    const next = { Home: 0, End: choices.length - 1, ArrowUp: index - 1, ArrowDown: index + 1 }[event.key];
    choices[(next + choices.length) % choices.length]?.focus();
  });
  menu.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    close(true);
    onAction(button.dataset.option);
  });
  window.addEventListener('resize', () => { if (isOpen()) placeMenu(trigger, menu, 'end'); });
  return { close };
}
