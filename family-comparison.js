import { labelFor, wordCount } from './catalog.js';
import { familyById } from './data/families.js';
import { familyMembers } from './reading-families.js';
import { language, t } from './i18n.js';
import { icon } from './icons.js';
import { animate, closeDialog, openDialog } from './motion.js';
import { exportWorksheetPages } from './worksheet.js';
import { loadWorksheetFont } from './worksheet-fonts.js';
import { trackFamilyActivity } from './analytics.js';

export const familyComparisonMarkup = `
  <dialog class="site-dialog family-comparison-dialog" id="family-comparison-dialog" aria-labelledby="family-comparison-title" aria-describedby="family-comparison-description">
    <h2 class="visually-hidden" id="family-comparison-title" tabindex="-1" data-dialog-focus>Compara les variants</h2>
    <p class="visually-hidden" id="family-comparison-description"></p>
    <div class="family-comparison-tools">
      <div class="family-comparison-jumps" role="group" aria-label="Seccions de les lectures">
        <button class="button" type="button" data-compare-jump="text">Vés al text</button>
        <button class="button" type="button" data-compare-jump="questions">Vés a les preguntes</button>
      </div>
      <label class="family-comparison-solution" title="Mou totes les variants la mateixa distància i manté alineats els salts de pàgina."><input type="checkbox" role="switch" id="family-comparison-sync" checked> Scroll sincronitzat</label>
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
  let scrollFrame;
  const expectedScroll = new WeakMap();

  function setScroll(body, top) {
    body.scrollTo({ top, behavior: 'instant' });
    expectedScroll.set(body, body.scrollTop);
  }

  function align(top, source) {
    for (const { body } of entries) {
      if (body === source) continue;
      setScroll(body, top);
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
    rail.dataset.linked = String(linked.checked);
    const headings = [...rail.querySelectorAll('.family-comparison-column-heading')];
    headings.forEach(heading => { heading.style.minHeight = ''; });
    const headerHeight = Math.max(0, ...headings.map(heading => heading.getBoundingClientRect().height));
    headings.forEach(heading => { heading.style.minHeight = `${headerHeight}px`; });
    const bodies = [...rail.querySelectorAll('.family-comparison-body')];
    const widths = bodies.map(body => {
      const style = getComputedStyle(body);
      return body.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    });
    const scale = Math.min(1, ...widths.map(width => width / (210 * 96 / 25.4)));
    for (const body of bodies) body.style.setProperty('--preview-scale', String(scale));
    const maxPages = Math.max(0, ...bodies.map(body => body.querySelectorAll('.worksheet-slot').length));
    for (const body of bodies) {
      const sheets = body.querySelector('.family-comparison-pages');
      const first = body.querySelector('.worksheet-slot');
      if (!sheets || !first) continue;
      const gap = parseFloat(getComputedStyle(sheets).rowGap) || 0;
      sheets.style.minHeight = linked.checked ? `${maxPages * first.getBoundingClientRect().height + Math.max(0, maxPages - 1) * gap}px` : '';
    }
    if (linked.checked && lastScrolled) align(lastScrolled.scrollTop, lastScrolled);
    updatePosition();
  }

  async function render() {
    const request = ++generation;
    const answerKey = solution.checked;
    const anchor = lastScrolled?.scrollTop;
    rail.setAttribute('aria-busy', 'true');
    status.textContent = t('Preparant la comparació…');
    status.hidden = false;
    try {
      await Promise.all([...new Set(entries.map(entry => entry.settings.font))].map(loadWorksheetFont));
      if (!dialog.open || request !== generation) return;
      const prepared = entries.map(entry => ({ ...entry, pages: exportWorksheetPages(entry.reading, entry.settings, answerKey) }));
      const maxPages = Math.max(...prepared.map(entry => entry.pages.length));
      for (const { pages, body } of prepared) {
        const scrollTop = body.scrollTop;
        const sheets = element('div', 'family-comparison-pages');
        sheets.append(...pages.map(page => {
          const slot = element('div', 'worksheet-slot');
          slot.append(page);
          return slot;
        }));
        if (pages.length < maxPages) sheets.append(element('p', 'family-comparison-end', t('Final de la variant')));
        body.replaceChildren(sheets);
        setScroll(body, scrollTop);
        animate(sheets, [{ opacity: .5 }, { opacity: 1 }]);
      }
      fitPages();
      if (linked.checked && anchor !== undefined) align(anchor);
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
    stopScroll();
    const start = rail.scrollLeft;
    const end = Math.max(0, Math.min(rail.scrollWidth - rail.clientWidth, start + direction * distance));
    const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--motion')) || 0;
    if (!duration) { rail.scrollTo({ left: end, behavior: 'instant' }); return; }
    const started = performance.now();
    rail.style.scrollSnapType = 'none';
    const tick = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      rail.scrollTo({ left: start + (end - start) * eased, behavior: 'instant' });
      if (progress < 1) scrollFrame = requestAnimationFrame(tick);
      else stopScroll();
    };
    scrollFrame = requestAnimationFrame(tick);
  }

  function stopScroll() {
    cancelAnimationFrame(scrollFrame);
    rail.style.scrollSnapType = '';
  }

  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  rail.addEventListener('scroll', updatePosition, { passive: true });
  rail.addEventListener('wheel', stopScroll, { passive: true });
  rail.addEventListener('pointerdown', stopScroll);
  rail.addEventListener('keydown', event => {
    if (event.target !== rail || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  dialog.querySelectorAll('[data-compare-jump]').forEach(button => button.addEventListener('click', () => {
    const viewport = rail.getBoundingClientRect();
    const visible = entries.filter(entry => {
      const box = entry.column.getBoundingClientRect();
      return box.left < viewport.right - box.width / 2 && box.right > viewport.left + box.width / 2;
    });
    const active = visible.find(entry => entry.body === lastScrolled) ?? visible[0] ?? entries[0];
    if (!active) return;
    const destination = body => {
      const target = button.dataset.compareJump === 'questions' && body.querySelector('.worksheet-question-heading, .worksheet-question');
      return target ? body.scrollTop + target.getBoundingClientRect().top - body.getBoundingClientRect().top - 12 : 0;
    };
    if (linked.checked) { align(destination(active.body)); lastScrolled = active.body; return; }
    for (const { body } of entries) {
      setScroll(body, destination(body));
    }
  }));
  solution.addEventListener('change', render);
  linked.addEventListener('change', () => {
    const source = lastScrolled ?? entries[0]?.body;
    fitPages();
    if (linked.checked && source) align(source.scrollTop, source);
  });
  new ResizeObserver(fitPages).observe(rail);
  dialog.addEventListener('close', () => { stopScroll(); generation++; rail.replaceChildren(); entries = []; lastScrolled = undefined; });

  return {
    open(reading, answerKey = false, neighborId) {
      const members = familyMembers(readings, reading);
      if (members.length < 2) return;
      trackFamilyActivity(reading, 'compara');
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
          if (linked.checked) align(body.scrollTop, body);
        }, { passive: true });
        if (member.id === reading.id) column.classList.add('is-current');
        column.append(header, body);
        return { reading: member, settings, column, body };
      });
      rail.replaceChildren(...entries.map(entry => entry.column));
      openDialog(dialog);
      fitPages();
      const current = members.findIndex(member => member.id === reading.id);
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      const columnWidth = entries[0].column.getBoundingClientRect().width;
      const visible = Math.max(1, Math.round((rail.clientWidth + gap) / (columnWidth + gap)));
      const neighbor = members.findIndex(member => member.id === neighborId);
      const first = visible > 1 && neighbor >= 0 && Math.abs(neighbor - current) === 1 ? Math.min(current, neighbor) : Math.max(0, current - visible + 1);
      rail.scrollTo({ left: first * (columnWidth + gap), behavior: 'instant' });
      lastScrolled = entries[current].body;
      updatePosition();
      dialog.querySelector('#family-comparison-title').focus({ preventScroll: true });
      render();
    },
  };
}
