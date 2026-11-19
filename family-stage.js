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
    <div class="family-stage-toolbar">
      <span id="family-stage-position"></span>
      <button class="button" id="studio-compare" type="button" aria-label="Compara les variants" aria-haspopup="dialog" aria-controls="family-comparison-dialog">${icon('columns-2')} <span>Compara</span></button>
    </div>
  </div>`;

export function mountFamilyStage({ root, readings, getSettings, isOutsideCollection, onSelect, onCompare }) {
  const scene = root.querySelector('#family-stage');
  const siblings = scene.querySelector('.family-stage-siblings');
  const window = root.querySelector('.studio-preview-window');
  const stage = root.querySelector('.studio-paper-stage');
  const pages = root.querySelector('#studio-pages');
  let key;
  let generation = 0;
  let from;
  let enteringFrame;
  let entering;

  scene.querySelector('#studio-compare').addEventListener('click', onCompare);

  function fit() {
    for (const paper of siblings.querySelectorAll('.family-stage-paper')) paper.style.setProperty('--family-thumbnail-scale', String(paper.clientWidth / paperWidth));
  }
  new ResizeObserver(fit).observe(window);

  return {
    update(reading, answerKey, { force = false } = {}) {
      const nextKey = `${reading.id}:${language()}:${answerKey}`;
      if (key === nextKey && !force) return;
      key = nextKey;
      const request = ++generation;
      const members = familyMembers(readings, reading);
      const enabled = members.length > 1;
      scene.hidden = !enabled;
      stage.classList.toggle('has-family', enabled);
      window.classList.toggle('has-family', enabled);
      siblings.replaceChildren();
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
      scene.dataset.compareSide = hasPrevious ? 'previous' : 'next';
      scene.querySelector('#family-stage-position').textContent = t('Variant {current} de {total}', { current: current + 1, total: members.length });
      for (const [side, member] of [['previous', members[current - 1]], ['next', members[current + 1]]]) {
        if (!member) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'family-stage-variant';
        button.dataset.side = side;
        button.dataset.reading = member.id;
        const level = labelFor('level', member.level).replace(/ de (?:primària|primaria)$/, '');
        button.setAttribute('aria-label', t('Obre {code}, {level}', { code: member.code, level }));
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
          from = { id: member.id, rect: paper.getBoundingClientRect() };
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
        const target = slot.getBoundingClientRect();
        if (!target.width || !from.rect.width) return;
        const { rect } = from;
        from = undefined;
        entering?.cancel();
        slot.style.transformOrigin = 'top left';
        entering = animate(slot, [
          { opacity: .55, transform: `translate(${rect.left - target.left}px, ${rect.top - target.top}px) scale(${rect.width / target.width})` },
          { opacity: 1, transform: 'none' },
        ]);
      });
    },
  };
}
