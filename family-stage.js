import { labelFor } from './catalog.js';
import { familyMembers } from './reading-families.js';
import { language, t } from './i18n.js';
import { icon } from './icons.js';
import { animate } from './motion.js';
import { exportWorksheetPages } from './worksheet.js';
import { loadWorksheetFont } from './worksheet-fonts.js';

const paperWidth = 210 * 96 / 25.4;

export const familyStageMarkup = `
  <div class="family-stage" id="family-stage" role="group" aria-label="Variants de la lectura" hidden>
    <div class="family-stage-siblings"></div>
    <span id="family-stage-position"></span>
    <span id="family-stage-focus-help" class="visually-hidden"></span>
    ${['previous', 'next'].map(side => `<button class="family-stage-edge" type="button" data-side="${side}" hidden inert>${icon(side === 'previous' ? 'chevron-left' : 'chevron-right')}</button>`).join('')}
    ${['previous', 'next'].map(side => `<div class="family-stage-toolbar" data-side="${side}" hidden>
      <button class="button studio-compare" type="button" aria-label="Compara les variants" aria-haspopup="dialog" aria-controls="family-comparison-dialog">${icon('columns-2')} <span>Compara</span></button>
    </div>`).join('')}
  </div>`;

export function mountFamilyStage({ root, readings, getSettings, isOutsideCollection, onSelect, onCompare }) {
  const scene = root.querySelector('#family-stage');
  const siblings = scene.querySelector('.family-stage-siblings');
  const window = root.querySelector('.studio-preview-window');
  const stage = root.querySelector('.studio-paper-stage');
  const pages = root.querySelector('#studio-pages');
  const zoomTools = root.querySelector('.studio-zoom');
  const edgeButtons = [...scene.querySelectorAll('.family-stage-edge')];
  let key;
  let activeReadingId;
  let generation = 0;
  let from;
  let enteringFrame;
  let entering;

  const insideReading = target => target instanceof Node && (stage.contains(target) || zoomTools.contains(target) || edgeButtons.some(button => button.contains(target)));
  function focusReading(expanded) {
    expanded = Boolean(expanded && stage.classList.contains('has-family'));
    window.classList.toggle('is-reading-focused', expanded);
    siblings.inert = expanded;
    scene.querySelectorAll('.family-stage-toolbar').forEach(toolbar => { toolbar.inert = expanded; });
    for (const button of edgeButtons) {
      button.inert = !expanded;
      if (!expanded) button.classList.remove('is-near');
    }
  }
  window.addEventListener('click', event => {
    if (!insideReading(event.target)) return;
    if (!zoomTools.contains(event.target) && !event.target.closest('.worksheet-page')) return;
    focusReading(true);
    if (!event.target.closest('button, a, input, select, textarea, [contenteditable]')) stage.focus({ preventScroll: true });
  });
  window.addEventListener('focusin', event => {
    if (insideReading(event.target) && (event.target === stage || event.target.matches(':focus-visible'))) focusReading(true);
  });
  window.addEventListener('focusout', event => {
    if (event.relatedTarget && !insideReading(event.relatedTarget)) focusReading(false);
  });
  document.addEventListener('pointerdown', event => {
    if (!insideReading(event.target)) focusReading(false);
  });
  globalThis.addEventListener('blur', () => focusReading(false));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && window.classList.contains('is-reading-focused')) {
      event.preventDefault();
      focusReading(false);
    } else if (event.key === 'Enter' && event.target === stage && stage.classList.contains('has-family')) {
      event.preventDefault();
      focusReading(true);
    }
  });

  function clearEdgeHover() {
    edgeButtons.forEach(button => button.classList.remove('is-near'));
  }
  function positionEdges() {
    const viewport = window.getBoundingClientRect();
    const paper = pages.firstElementChild?.getBoundingClientRect();
    if (!paper?.width) return null;
    window.style.setProperty('--family-edge-previous', `${Math.max(6, paper.left - viewport.left - 17)}px`);
    window.style.setProperty('--family-edge-next', `${Math.max(20, viewport.right - paper.right - 12)}px`);
    return { left: Math.max(viewport.left, paper.left), right: Math.min(viewport.right, paper.right) };
  }
  const edgeObserver = new ResizeObserver(positionEdges);
  edgeObserver.observe(window);
  edgeObserver.observe(pages);
  window.addEventListener('pointermove', event => {
    if (!window.classList.contains('is-reading-focused') || event.pointerType === 'touch') return;
    const edges = positionEdges();
    if (!edges) return;
    const side = Math.abs(event.clientX - edges.left) <= 60 ? 'previous' : Math.abs(event.clientX - edges.right) <= 60 ? 'next' : null;
    edgeButtons.forEach(button => button.classList.toggle('is-near', button.dataset.side === side));
  });
  window.addEventListener('pointerleave', clearEdgeHover);
  edgeButtons.forEach(button => button.addEventListener('click', () => {
    if (!button.dataset.reading || button.hidden) return;
    from = { id: button.dataset.reading, focused: true, side: button.dataset.side };
    onSelect(button.dataset.reading);
  }));

  scene.querySelectorAll('.studio-compare').forEach(button => button.addEventListener('click', () => onCompare(button.dataset.reading)));

  function fit() {
    for (const paper of siblings.querySelectorAll('.family-stage-paper')) paper.style.setProperty('--family-thumbnail-scale', String(paper.clientWidth / paperWidth));
  }
  new ResizeObserver(fit).observe(window);

  return {
    isNavigatingFocused(reading) {
      return from?.id === reading.id && Boolean(from.focused) && window.classList.contains('is-reading-focused');
    },
    update(reading, answerKey, { force = false } = {}) {
      const nextKey = `${reading.id}:${language()}:${answerKey}`;
      if (key === nextKey && !force) return;
      key = nextKey;
      const request = ++generation;
      const members = familyMembers(readings, reading);
      const enabled = members.length > 1;
      if (activeReadingId !== reading.id) focusReading(from?.id === reading.id && from.focused && window.classList.contains('is-reading-focused'));
      activeReadingId = reading.id;
      scene.hidden = !enabled;
      stage.classList.toggle('has-family', enabled);
      window.classList.toggle('has-family', enabled);
      if (from?.id === reading.id && from.focused && window.classList.contains('is-reading-focused')) stage.focus({ preventScroll: true });
      const focusHelp = t('Fes clic al full per ampliar-lo. Clica fora o prem Esc per tornar a veure les variants.');
      scene.querySelector('#family-stage-focus-help').textContent = focusHelp;
      if (enabled) {
        stage.setAttribute('aria-describedby', 'family-stage-focus-help');
        pages.title = focusHelp;
      } else {
        stage.removeAttribute('aria-describedby');
        pages.removeAttribute('title');
        focusReading(false);
      }
      siblings.replaceChildren();
      scene.querySelectorAll('.family-stage-toolbar').forEach(toolbar => { toolbar.hidden = true; });
      edgeButtons.forEach(button => { button.hidden = true; delete button.dataset.reading; });
      if (!enabled) {
        window.classList.remove('has-family-previous', 'has-family-next');
        from = undefined;
        return;
      }
      const current = members.findIndex(member => member.id === reading.id);
      const hasPrevious = current > 0;
      const hasNext = current < members.length - 1;
      window.classList.toggle('has-family-previous', enabled && hasPrevious);
      window.classList.toggle('has-family-next', enabled && hasNext);
      scene.querySelector('#family-stage-position').textContent = t('Variant {current} de {total}', { current: current + 1, total: members.length });
      for (const [side, member] of [['previous', members[current - 1]], ['next', members[current + 1]]]) {
        if (!member) continue;
        const toolbar = scene.querySelector(`.family-stage-toolbar[data-side="${side}"]`);
        const compare = toolbar.querySelector('.studio-compare');
        toolbar.hidden = false;
        compare.dataset.reading = member.id;
        compare.setAttribute('aria-label', t('Compara amb {code}, {level}', { code: member.code, level: labelFor('level', member.level) }));
        compare.title = compare.getAttribute('aria-label');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'family-stage-variant';
        button.dataset.side = side;
        button.dataset.reading = member.id;
        const level = labelFor('level', member.level).replace(/ de (?:primària|primaria)$/, '');
        button.setAttribute('aria-label', t('Obre {code}, {level}', { code: member.code, level }));
        const edge = edgeButtons.find(button => button.dataset.side === side);
        edge.hidden = false;
        edge.dataset.reading = member.id;
        edge.setAttribute('aria-label', button.getAttribute('aria-label'));
        edge.title = isOutsideCollection(member) ? `${edge.getAttribute('aria-label')}. ${t('Obre aquesta variant al catàleg, fora de la col·lecció actual.')}` : edge.getAttribute('aria-label');
        if (isOutsideCollection(member)) button.title = t('Obre aquesta variant al catàleg, fora de la col·lecció actual.');
        const paper = document.createElement('span');
        paper.className = 'family-stage-paper';
        paper.setAttribute('aria-hidden', 'true');
        paper.inert = true;
        const caption = document.createElement('span');
        caption.className = 'family-stage-caption';
        const code = document.createElement('strong'); code.textContent = member.code;
        const course = document.createElement('span'); course.textContent = level;
        caption.append(code, course);
        button.append(paper, caption);
        button.addEventListener('click', () => {
          const previousRects = new Map([...siblings.querySelectorAll('.family-stage-variant')].map(node => [node.dataset.reading, node.querySelector('.family-stage-paper').getBoundingClientRect()]));
          const currentPage = pages.firstElementChild?.getBoundingClientRect();
          if (currentPage && currentPage.bottom > window.getBoundingClientRect().top) previousRects.set(reading.id, currentPage);
          from = { id: member.id, rect: paper.getBoundingClientRect(), previousRects };
          onSelect(member.id);
        });
        siblings.append(button);
        const settings = getSettings(member);
        Promise.resolve(loadWorksheetFont(settings.font)).then(() => {
          if (request !== generation) return;
          const firstPage = exportWorksheetPages(member, settings, answerKey)[0];
          paper.replaceChildren(firstPage);
          fit();
        }).catch(() => { /* Keep the labelled page outline available for navigation. */ });
      }
      fit();
    },
    animateCurrent(reading) {
      if (from?.id !== reading.id) return;
      cancelAnimationFrame(enteringFrame);
      enteringFrame = requestAnimationFrame(() => {
        const slot = pages.firstElementChild;
        if (!slot || from?.id !== reading.id) return;
        if (from.focused) {
          const direction = from.side === 'next' ? 1 : -1;
          from = undefined;
          entering?.cancel();
          entering = animate(pages, [
            { opacity: .6, transform: `translateX(${direction * 32}px)` },
            { opacity: 1, transform: 'none' },
          ]);
          return;
        }
        const target = slot.getBoundingClientRect();
        if (!target.width || !from.rect.width) return;
        const { rect, previousRects } = from;
        from = undefined;
        entering?.cancel();
        slot.style.transformOrigin = 'top left';
        entering = animate(slot, [
          { opacity: .55, transform: `translate(${rect.left - target.left}px, ${rect.top - target.top}px) scale(${rect.width / target.width})` },
          { opacity: 1, transform: 'none' },
        ]);
        for (const button of siblings.querySelectorAll('.family-stage-variant')) {
          const paper = button.querySelector('.family-stage-paper');
          const previous = previousRects.get(button.dataset.reading);
          const target = paper.getBoundingClientRect();
          paper.style.transformOrigin = 'top left';
          const animation = animate(paper, [
            previous?.width && target.width
              ? { opacity: .65, transform: `translate(${previous.left - target.left}px, ${previous.top - target.top}px) scale(${previous.width / target.width})` }
              : { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'none' },
          ]);
          if (animation) {
            button.style.zIndex = '3';
            const settle = () => { button.style.zIndex = ''; };
            animation.finished.then(settle, settle);
          }
          animate(button.querySelector('.family-stage-caption'), [{ opacity: 0 }, { opacity: 1 }]);
        }
      });
    },
  };
}
