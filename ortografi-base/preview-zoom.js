const paperWidth = 210 * 96 / 25.4;
const minZoom = .5;
const maxZoom = 3;

export function mountPreviewZoom(stage, pages, tools, { scaleProperty = '--preview-scale' } = {}) {
  const smaller = tools.querySelector('[data-zoom="out"]');
  const larger = tools.querySelector('[data-zoom="in"]');
  const fit = tools.querySelector('[data-zoom="fit"]');
  const output = tools.querySelector('output');
  let zoom = 1;

  function size({ keepScroll = false } = {}) {
    const style = getComputedStyle(stage);
    const width = stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    const top = stage.getBoundingClientRect().top;
    const anchor = keepScroll && stage.scrollTop > 0
      ? [...pages.children].find(slot => slot.getBoundingClientRect().bottom > top) : null;
    const before = anchor?.getBoundingClientRect();
    if (width > 0) pages.style.setProperty(scaleProperty, String(Math.min(1, width / paperWidth) * zoom));
    if (before?.height) {
      const after = anchor.getBoundingClientRect();
      stage.scrollTop += after.top + (top - before.top) * after.height / before.height - top;
    }
    const label = `${Math.round(100 * zoom)} %`;
    if (output.value !== label) output.value = label;
    smaller.disabled = zoom <= minZoom;
    larger.disabled = zoom >= maxZoom;
  }

  function change(value, pointer) {
    const next = Math.max(minZoom, Math.min(maxZoom, value));
    if (next === zoom) return;
    const viewport = stage.getBoundingClientRect();
    const x = pointer?.clientX ?? viewport.left + stage.clientWidth / 2;
    const y = pointer?.clientY ?? viewport.top + stage.clientHeight / 2;
    const slots = [...pages.children];
    const slot = slots.find(slot => slot.getBoundingClientRect().bottom >= y) || slots.at(-1);
    const before = slot?.getBoundingClientRect();
    zoom = next;
    size();
    if (!before?.width || !before.height) return;
    const after = slot.getBoundingClientRect();
    stage.scrollLeft += after.left + (x - before.left) * after.width / before.width - x;
    stage.scrollTop += after.top + (y - before.top) * after.height / before.height - y;
  }

  smaller.addEventListener('click', () => change(zoom / 1.2));
  larger.addEventListener('click', () => change(zoom * 1.2));
  fit.addEventListener('click', () => change(1));
  stage.addEventListener('wheel', event => {
    if (!event.ctrlKey || !event.deltaY) return;
    event.preventDefault();
    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
    const delta = Math.max(-160, Math.min(160, event.deltaY * multiplier));
    change(zoom * Math.exp(-delta * .002), event);
  }, { passive: false });
  stage.addEventListener('keydown', event => {
    if (event.target !== stage || event.ctrlKey || event.metaKey || event.altKey) return;
    if (['+', '=', '-', '0'].includes(event.key)) {
      event.preventDefault();
      change(event.key === '0' ? 1 : event.key === '-' ? zoom / 1.2 : zoom * 1.2);
    }
  });
  new ResizeObserver(() => size({ keepScroll: true })).observe(stage);
  size();
  return {
    size,
    reset() {
      zoom = 1;
      size();
      stage.scrollTo(0, 0);
    },
  };
}
