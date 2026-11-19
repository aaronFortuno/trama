import { labelFor, wordCount } from './catalog.js';
import { familyById } from './data/families.js';
import { familyMembers } from './reading-families.js';
import { language, t } from './i18n.js';
import { icon } from './icons.js';
import { closeDialog, openDialog } from './motion.js';
import { exportWorksheetPages } from './worksheet.js';
import { loadWorksheetFont } from './worksheet-fonts.js';

export const familyComparisonMarkup = `
  <dialog class="site-dialog family-comparison-dialog" id="family-comparison-dialog" aria-labelledby="family-comparison-title" aria-describedby="family-comparison-description">
    <h2 class="visually-hidden" id="family-comparison-title" tabindex="-1" data-dialog-focus>Compara les variants</h2>
    <p class="visually-hidden" id="family-comparison-description"></p>
    <div class="family-comparison-tools">
      <div class="family-comparison-jumps" role="group" aria-label="Seccions de les lectures">
        <button class="button" type="button" data-compare-jump="text">Vés al text</button>
        <button class="button" type="button" data-compare-jump="questions">Vés a les preguntes</button>
      </div>
      <label class="family-comparison-solution" title="Manté el text i les preguntes al mateix punt aproximat en totes les variants."><input type="checkbox" role="switch" id="family-comparison-sync" checked> Scroll sincronitzat</label>
      <label class="family-comparison-solution"><input type="checkbox" role="switch" id="family-comparison-solution"> Solucionari</label>
      <div class="family-comparison-navigation" role="group" aria-label="Navegació entre variants">
        <button class="button" type="button" data-compare-step="previous" aria-label="Variants anteriors">${icon('chevron-left')}</button>
        <output id="family-comparison-position" aria-live="polite"></output>
        <button class="button" type="button" data-compare-step="next" aria-label="Variants següents">${icon('chevron-right')}</button>
      </div>
      <button class="button close-button" type="button" data-close-dialog aria-label="Tanca la comparació">${icon('x')}</button>
    </div>
    <p class="family-comparison-status" id="family-comparison-status" role="status" hidden></p>
    <div class="family-comparison-rail" id="family-comparison-rail" tabindex="0" role="region" aria-label="Fitxes ordenades per gradació"></div>
  </dialog>`;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function mountFamilyComparison({ root, readings, getSettings, isOutsideCollection, onOpen }) {
  const dialog = root.querySelector('#family-comparison-dialog');
  const rail = dialog.querySelector('#family-comparison-rail');
  const solution = dialog.querySelector('#family-comparison-solution');
  const linked = dialog.querySelector('#family-comparison-sync');
  const position = dialog.querySelector('#family-comparison-position');
  const status = dialog.querySelector('#family-comparison-status');
  const previous = dialog.querySelector('[data-compare-step="previous"]');
  const next = dialog.querySelector('[data-compare-step="next"]');
  let entries = [];
  let generation = 0;
  let lastScrolled;
  const expectedScroll = new WeakMap();

  function extent(body) {
    const max = Math.max(0, body.scrollHeight - body.clientHeight);
    const questions = body.querySelector('.worksheet-question-heading, .worksheet-question');
    const boundary = questions ? Math.max(0, Math.min(max, body.scrollTop + questions.getBoundingClientRect().top - body.getBoundingClientRect().top - 12)) : max;
    return { max, boundary };
  }

  function progress(body) {
    const { max, boundary } = extent(body);
    const questions = boundary < max && body.scrollTop >= boundary;
    const start = questions ? boundary : 0;
    const length = questions ? max - boundary : boundary;
    return { questions, fraction: length > 0 ? Math.max(0, Math.min(1, (body.scrollTop - start) / length)) : 0 };
  }

  function setScroll(body, top) {
    body.scrollTo({ top, behavior: 'instant' });
    expectedScroll.set(body, body.scrollTop);
  }

  function align(position, source) {
    for (const { body } of entries) {
      if (body === source) continue;
      const { max, boundary } = extent(body);
      setScroll(body, position.questions ? boundary + position.fraction * (max - boundary) : position.fraction * boundary);
    }
  }

  function updatePosition() {
    const firstColumn = rail.firstElementChild;
    if (!firstColumn) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    const step = firstColumn.getBoundingClientRect().width + gap;
    const first = Math.round(rail.scrollLeft / step) + 1;
    const visible = Math.max(1, Math.round((rail.clientWidth + gap) / step));
    const last = Math.min(entries.length, first + visible - 1);
    position.value = t(first === last ? '{first} de {total}' : '{first}–{last} de {total}', { first, last, total: entries.length });
    previous.disabled = rail.scrollLeft < 1;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
  }

  function fitPages() {
    for (const body of rail.querySelectorAll('.family-comparison-body')) {
      const style = getComputedStyle(body);
      const width = body.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      body.style.setProperty('--preview-scale', String(Math.min(1, width / (210 * 96 / 25.4))));
    }
    updatePosition();
  }

  async function render() {
    const request = ++generation;
    const answerKey = solution.checked;
    const anchor = lastScrolled && progress(lastScrolled);
    rail.setAttribute('aria-busy', 'true');
    status.textContent = t('Preparant la comparació…');
    status.hidden = false;
    try {
      await Promise.all([...new Set(entries.map(entry => entry.settings.font))].map(loadWorksheetFont));
      if (!dialog.open || request !== generation) return;
      for (const { reading, settings, body } of entries) {
        const scrollTop = body.scrollTop;
        const pages = exportWorksheetPages(reading, settings, answerKey);
        body.replaceChildren(...pages.map(page => {
          const slot = element('div', 'worksheet-slot');
          slot.append(page);
          return slot;
        }));
        setScroll(body, scrollTop);
      }
      fitPages();
      if (linked.checked && anchor) align(anchor);
      status.hidden = true;
    } catch {
      if (request === generation) status.textContent = t('No s’ha pogut preparar la comparació. Torna-ho a provar.');
    } finally {
      if (request === generation) rail.setAttribute('aria-busy', 'false');
    }
  }

  function step(direction) {
    const column = rail.firstElementChild;
    if (!column) return;
    const distance = column.getBoundingClientRect().width + (parseFloat(getComputedStyle(rail).columnGap) || 0);
    rail.scrollBy({ left: direction * distance, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  rail.addEventListener('scroll', updatePosition, { passive: true });
  rail.addEventListener('keydown', event => {
    if (event.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  dialog.querySelectorAll('[data-compare-jump]').forEach(button => button.addEventListener('click', () => {
    for (const { body } of entries) {
      const target = button.dataset.compareJump === 'questions' && body.querySelector('.worksheet-question-heading, .worksheet-question');
      const top = target ? body.scrollTop + target.getBoundingClientRect().top - body.getBoundingClientRect().top - 12 : 0;
      setScroll(body, top);
    }
  }));
  solution.addEventListener('change', render);
  linked.addEventListener('change', () => {
    const source = lastScrolled ?? entries[0]?.body;
    if (linked.checked && source) align(progress(source), source);
  });
  new ResizeObserver(fitPages).observe(rail);
  dialog.addEventListener('close', () => { generation++; rail.replaceChildren(); entries = []; lastScrolled = undefined; });

  return {
    open(reading, answerKey = false) {
      const members = familyMembers(readings, reading);
      if (members.length < 2) return;
      const family = familyById.get(reading.familyId);
      dialog.querySelector('#family-comparison-description').textContent = [family?.name[language()] ?? reading.title, labelFor('language', reading.language)].join(' · ');
      solution.checked = answerKey;
      linked.checked = true;
      lastScrolled = undefined;
      entries = members.map(member => {
        const settings = getSettings(member);
        const column = element('section', 'family-comparison-column');
        column.dataset.reading = member.id;
        const header = element('header', 'family-comparison-column-heading');
        const title = element('h3', null, `${member.code} · ${labelFor('level', member.level)}`);
        const count = member.questions.filter(question => !settings.excluded.includes(question.id)).length;
        const meta = element('p', null, [labelFor('difficulty', member.difficulty), t('{count} paraules', { count: wordCount(member) }), t('{count} preguntes', { count })].join(' · '));
        const open = element('button', 'button family-comparison-open', t(member.id === reading.id ? 'Lectura oberta' : isOutsideCollection?.(member) ? 'Obre fora de la col·lecció' : 'Obre aquesta variant'));
        open.type = 'button';
        open.disabled = member.id === reading.id;
        open.addEventListener('click', () => closeDialog(dialog, () => onOpen(member.id)));
        header.append(title, meta, open);
        const body = element('div', 'family-comparison-body');
        body.tabIndex = 0;
        body.setAttribute('role', 'region');
        body.setAttribute('aria-label', `${member.code} · ${labelFor('level', member.level)}`);
        body.addEventListener('scroll', () => {
          const expected = expectedScroll.get(body);
          expectedScroll.delete(body);
          if (expected !== undefined && Math.abs(body.scrollTop - expected) < 1) return;
          lastScrolled = body;
          if (linked.checked) align(progress(body), body);
        }, { passive: true });
        if (member.id === reading.id) column.classList.add('is-current');
        column.append(header, body);
        return { reading: member, settings, column, body };
      });
      rail.replaceChildren(...entries.map(entry => entry.column));
      openDialog(dialog);
      rail.scrollLeft = 0;
      fitPages();
      dialog.querySelector('#family-comparison-title').focus({ preventScroll: true });
      render();
    },
  };
}
