import { animate } from './motion.js';

const widgets = new WeakMap();
let activeMenu;
let nextId = 0;

const chevrons = '<svg class="ui-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 8 3-3 3 3m-6 4 3 3 3-3"/></svg>';
const check = '<svg class="ui-icon" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8"/></svg>';

export function placeMenu(trigger, menu, align = 'start') {
  const anchor = trigger.getBoundingClientRect();
  const edge = 8;
  const gap = 4;
  if (align === 'start') menu.style.minWidth = `${anchor.width}px`;
  const below = innerHeight - edge - anchor.bottom - gap;
  const above = anchor.top - gap - edge;
  const opensDown = menu.scrollHeight <= below || below >= above;
  menu.style.maxHeight = `${Math.max(0, Math.min(310, opensDown ? below : above))}px`;
  const { width, height } = menu.getBoundingClientRect();
  const left = align === 'end' ? anchor.right - width : anchor.left;
  menu.style.left = `${Math.max(edge, Math.min(left, innerWidth - width - edge))}px`;
  menu.style.top = `${opensDown ? anchor.bottom + gap : Math.max(edge, anchor.top - height - gap)}px`;
}

function enhance(select) {
  const label = select.labels[0];
  const accessibleName = () => select.getAttribute('aria-label') || [...(label?.childNodes || [])]
    .filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).filter(Boolean).join(' ');
  const trigger = document.createElement('div');
  const menu = document.createElement('div');
  const value = document.createElement('span');
  const id = `select-menu-${++nextId}`;
  trigger.className = 'select-trigger';
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-controls', id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = chevrons;
  trigger.prepend(value);
  menu.className = 'select-menu';
  menu.id = id;
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('popover', 'manual');
  menu.inert = true;
  select.after(trigger, menu);
  select.hidden = true;

  let animation;
  let options = [];
  let index = -1;
  let typed = '';
  let lastKey = 0;
  const expanded = () => trigger.getAttribute('aria-expanded') === 'true';

  function sync() {
    const name = accessibleName();
    value.textContent = select.selectedOptions[0]?.label || '';
    trigger.setAttribute('aria-label', `${name}, ${value.textContent}`);
    menu.setAttribute('aria-label', name);
    trigger.setAttribute('aria-disabled', String(select.disabled));
    trigger.tabIndex = select.disabled ? -1 : 0;
  }

  function highlight(next) {
    const option = options[next];
    if (!option) return;
    if (options[index]) delete options[index].node.dataset.active;
    index = next;
    option.node.dataset.active = '';
    trigger.setAttribute('aria-activedescendant', option.node.id);
    const top = option.node.offsetTop;
    const bottom = top + option.node.offsetHeight;
    if (top < menu.scrollTop) menu.scrollTop = top;
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  }

  function close() {
    if (!expanded()) return;
    if (activeMenu?.menu === menu) activeMenu = undefined;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    menu.inert = true;
    animation?.cancel();
    menu.classList.add('is-closing');
    const hide = () => { if (menu.matches(':popover-open')) menu.hidePopover(); };
    animation = animate(menu, [{ opacity: 1 }, { opacity: 0, transform: 'translateY(-3px)' }]);
    if (animation) animation.onfinish = hide;
    else hide();
  }

  function open() {
    if (select.disabled) return false;
    options = [...select.options].filter(option => !option.hidden && !option.disabled).map(option => {
      const node = document.createElement('div');
      node.className = 'select-option';
      node.id = `${id}-option-${option.index}`;
      node.setAttribute('role', 'option');
      node.setAttribute('aria-selected', String(option.selected));
      node.textContent = option.label;
      if (option.selected) node.insertAdjacentHTML('beforeend', check);
      return { option, node };
    });
    if (!options.length) return false;
    activeMenu?.close();
    activeMenu = { trigger, menu, close };
    animation?.cancel();
    menu.classList.remove('is-closing');
    menu.inert = false;
    menu.replaceChildren(...options.map(({ node }) => node));
    if (!menu.matches(':popover-open')) menu.showPopover();
    trigger.setAttribute('aria-expanded', 'true');
    placeMenu(trigger, menu);
    menu.scrollTop = 0;
    index = -1;
    typed = '';
    highlight(Math.max(0, options.findIndex(({ option }) => option.selected)));
    animation = animate(menu, [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'none' }]);
    return true;
  }

  function choose(next) {
    const option = options[next]?.option;
    close();
    if (!option || option.selected) return;
    select.selectedIndex = option.index;
    sync();
    select.dispatchEvent(new Event('input', { bubbles: true }));
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  trigger.addEventListener('click', event => {
    event.preventDefault();
    if (expanded()) close();
    else if (open()) trigger.focus({ preventScroll: true });
  });
  label?.addEventListener('click', event => {
    if (event.target !== label) return;
    event.preventDefault();
    trigger.click();
  });
  trigger.addEventListener('blur', close);
  menu.addEventListener('mousedown', event => {
    if (event.target.closest('.select-option')) event.preventDefault();
  });
  menu.addEventListener('click', event => {
    event.preventDefault();
    const node = event.target.closest('.select-option');
    if (node) choose(options.findIndex(option => option.node === node));
  });
  trigger.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey) return;
    const { key } = event;
    if (key === 'Tab') return close();
    if (key === 'Escape' && expanded()) {
      event.preventDefault();
      close();
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (expanded()) choose(index);
      else open();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      if (!expanded()) { open(); return; }
      const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: options.length - 1 }[key];
      highlight(Math.max(0, Math.min(options.length - 1, next)));
    } else if (key.length === 1 && !event.altKey) {
      if (!expanded() && !open()) return;
      event.preventDefault();
      typed = (performance.now() - lastKey < 650 ? typed : '') + key.toLocaleLowerCase();
      lastKey = performance.now();
      highlight(options.findIndex(({ option }) => option.label.toLocaleLowerCase().startsWith(typed)));
    }
  });
  select.addEventListener('input', sync);
  select.addEventListener('change', sync);
  return sync;
}

export function syncSelects(root) {
  if (!('showPopover' in HTMLElement.prototype)) return;
  for (const select of root.querySelectorAll('select')) {
    if (!widgets.has(select)) widgets.set(select, enhance(select));
    widgets.get(select)();
  }
}

export function mountSelectMenus() {
  document.addEventListener('pointerdown', event => {
    if (activeMenu && !activeMenu.trigger.contains(event.target) && !activeMenu.menu.contains(event.target)) activeMenu.close();
  });
  window.addEventListener('scroll', event => {
    if (!activeMenu || event.target === activeMenu.menu || !event.target.contains?.(activeMenu.trigger)) return;
    const { trigger, menu, close } = activeMenu;
    const anchor = trigger.getBoundingClientRect();
    const container = event.target instanceof HTMLElement ? event.target.getBoundingClientRect() : null;
    if (!anchor.height || anchor.bottom <= (container?.top ?? 0) || anchor.top >= (container?.bottom ?? innerHeight)) close();
    else placeMenu(trigger, menu);
  }, { capture: true, passive: true });
  window.addEventListener('resize', () => {
    if (activeMenu) placeMenu(activeMenu.trigger, activeMenu.menu);
  });
}
