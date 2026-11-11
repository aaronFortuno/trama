import { animateRefresh, closeDialog, openDialog, setDisclosure } from './motion.js';
import { defaultTemplate, listTemplates, moveTemplate, removeTemplate, saveTemplate, templateGroups, templateKey, templateOrderKey, templateSettings } from './worksheet-templates.js';
import { icon } from './icons.js';
import { language, t } from './i18n.js';

export const templateLibraryMarkup = `
  <dialog class="site-dialog template-dialog" id="template-dialog" aria-labelledby="template-library-title">
    <div class="dialog-heading">
      <h2 id="template-library-title" tabindex="-1">Plantilles de format</h2>
      <button class="button close-button" type="button" data-close-dialog aria-label="Tanca les plantilles"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
    </div>
    <div class="dialog-scroll">
      <p class="template-intro">Desa un format al navegador i aplica’l a qualsevol lectura.</p>
      <div class="template-library">
        <section class="template-browser" aria-label="Plantilles desades">
          <div class="template-toolbar">
            <input type="search" id="template-search" aria-label="Cerca plantilles" placeholder="Cerca plantilles" autocomplete="off">
            <button class="button" type="button" id="template-new">Nova plantilla</button>
          </div>
          <ul class="template-list" id="template-list"></ul>
          <p class="template-empty" id="template-empty"></p>
          <p class="template-message" id="template-message" role="status"></p>
        </section>
        <div class="template-editor-panel" hidden>
          <form class="template-editor">
            <h3 id="template-editor-title"></h3>
            <label>Nom de la plantilla<input name="name" maxlength="60" type="text" autocomplete="off" required></label>
            <fieldset>
              <legend>Blocs de format</legend>
              ${templateGroups.map(({ id, label }) => `<label class="template-check"><input type="checkbox" name="group" value="${id}"> ${label}</label>`).join('')}
            </fieldset>
            <label class="template-check" id="template-recapture" hidden><input type="checkbox" name="recapture"> Actualitza els valors amb els ajustos actuals de la fitxa</label>
            <div class="template-edit-actions">
              <button type="submit" class="button primary">Desa la plantilla</button>
              <button type="button" class="button" id="template-cancel">Cancel·la</button>
              <button type="button" class="template-delete" id="template-delete" hidden>Suprimeix</button>
            </div>
            <div class="template-remove-confirm" hidden>
              <p>Vols suprimir aquesta plantilla del navegador?</p>
              <button class="button" type="button" id="template-confirm-delete">Sí, suprimeix-la</button>
              <button class="button" type="button" id="template-keep">Conserva-la</button>
            </div>
            <p id="template-editor-error" class="template-message" role="alert"></p>
          </form>
        </div>
      </div>
    </div>
  </dialog>`;

const fold = value => value.toLocaleLowerCase(language()).normalize('NFD').replace(/\p{M}/gu, '');
const fonts = { serif: 'Georgia', sans: 'Arial', mono: 'Courier New' };
const templateName = entry => entry.builtin ? t(entry.name) : entry.name;

function describe(entry) {
  const { text, margins, answers, header, footer, images } = entry.format;
  const font = text && `${fonts[text.font]} · ${text.fontSize} pt · ${new Intl.NumberFormat(language()).format(text.leading / 2)}×`;
  if (entry.builtin) return font;
  return [
    font,
    margins && 'Marges', answers && 'Espai de resposta', header && 'Encapçalament', footer && 'Peu', images && 'Il·lustracions',
  ].filter(Boolean).map(label => t(label)).join(' / ');
}

function makeRow(entry, index, last, filtered) {
  const row = document.createElement('li');
  row.dataset.template = entry.id;
  row.innerHTML = `<div class="template-row-copy"><strong></strong><p></p></div><div class="template-row-actions">
    ${entry.builtin || filtered ? '' : `<button class="button template-move" type="button" data-template-move="-1" ${index <= 1 ? 'disabled' : ''}>${icon('arrow-up')}</button><button class="button template-move" type="button" data-template-move="1" ${index === last ? 'disabled' : ''}>${icon('arrow-down')}</button>`}
    ${entry.builtin ? '' : '<button class="button" type="button" data-template-edit>Edita</button>'}
    <button class="button" type="button" data-template-apply>Aplica</button></div>`;
  const name = templateName(entry);
  row.querySelector('strong').textContent = name;
  row.querySelector('p').textContent = entry.builtin ? `${t('Plantilla per defecte')} · ${describe(entry)}` : describe(entry);
  const edit = row.querySelector('[data-template-edit]');
  if (edit) {
    edit.textContent = t('Edita');
    edit.setAttribute('aria-label', t('Edita {name}', { name }));
  }
  const apply = row.querySelector('[data-template-apply]');
  apply.textContent = t('Aplica');
  apply.setAttribute('aria-label', t('Aplica {name}', { name }));
  for (const [offset, label] of [[-1, 'Puja {name}'], [1, 'Baixa {name}']]) {
    const button = row.querySelector(`[data-template-move="${offset}"]`);
    if (!button) continue;
    button.title = t(label, { name });
    button.setAttribute('aria-label', button.title);
  }
  return row;
}

function makeChoice(entry) {
  const row = document.createElement('li');
  row.dataset.template = entry.id;
  row.className = 'studio-template-choice';
  row.innerHTML = '<div class="studio-template-corner"></div><button type="button" aria-pressed="false"><strong></strong><small></small></button>';
  row.querySelector('strong').textContent = templateName(entry);
  row.querySelector('small').textContent = describe(entry);
  return row;
}

export function mountTemplateLibrary({ dialog, picker, getSettings, getThumbnail, onApply }) {
  const find = selector => dialog.querySelector(selector);
  const search = find('#template-search');
  const list = find('#template-list');
  const choices = picker.querySelector('ul');
  const summary = picker.querySelector('summary');
  const empty = find('#template-empty');
  const form = find('form');
  const panel = find('.template-editor-panel');
  const confirmation = find('.template-remove-confirm');
  const error = find('#template-editor-error');
  const message = find('#template-message');
  const name = form.elements.namedItem('name');
  const checkboxes = [...form.querySelectorAll('[name="group"]')];
  let entries = [defaultTemplate];
  let editing = null;
  let editorOrigin;
  let appliedId = defaultTemplate.id;

  function render() {
    const query = fold(search.value.trim());
    const shown = entries.filter(entry => fold(templateName(entry)).includes(query));
    list.replaceChildren(...shown.map((entry, index) => makeRow(entry, index, shown.length - 1, Boolean(query))));
    empty.hidden = shown.length > 0;
    empty.textContent = t('No hi ha cap plantilla que coincideixi amb la cerca.');
  }

  function syncPicker() {
    const settings = getSettings();
    if (!settings) return;
    for (const [index, row] of [...choices.children].entries()) {
      const entry = entries[index];
      const format = templateSettings(entry);
      const active = entry.id === appliedId && Object.entries(format).every(([key, value]) => settings[key] === value);
      row.querySelector('button').setAttribute('aria-pressed', String(active));
      row.querySelector('.studio-template-corner').replaceChildren(getThumbnail(format));
    }
  }

  function apply(entry) {
    appliedId = entry.id;
    onApply(templateSettings(entry), templateName(entry));
  }

  function reload() {
    try {
      entries = [defaultTemplate, ...listTemplates(window.localStorage)];
    } catch {
      message.textContent = t('Aquest navegador no ha permès accedir a les plantilles desades.');
    }
    choices.replaceChildren(...entries.map(makeChoice));
    if (summary.getAttribute('aria-expanded') === 'true') syncPicker();
    render();
  }

  function startEdit(entry, origin) {
    editing = entry;
    editorOrigin = origin;
    form.reset();
    name.value = entry?.name || '';
    const current = getSettings();
    for (const [index, field] of checkboxes.entries()) {
      const hasLogo = (field.value === 'header' && current.headerLogo) || (field.value === 'footer' && current.footerLogo);
      field.checked = entry ? Object.hasOwn(entry.format, field.value) : Boolean(templateGroups[index].selected || hasLogo);
    }
    find('#template-editor-title').textContent = t(entry ? 'Edita la plantilla' : 'Nova plantilla');
    find('#template-recapture').hidden = !entry;
    find('#template-delete').hidden = !entry;
    confirmation.hidden = true;
    error.textContent = '';
    setDisclosure(panel, true);
    name.focus();
  }

  function finishEdit({ animated = true, focus = true } = {}) {
    if (focus) (editorOrigin?.isConnected ? editorOrigin : find('#template-new')).focus();
    setDisclosure(panel, false, { animated });
    editing = null;
  }

  function save(event) {
    event.preventDefault();
    try {
      saveTemplate(window.localStorage, {
        name: name.value.trim(), groups: checkboxes.filter(input => input.checked).map(input => input.value),
        settings: getSettings(), previous: editing, recapture: form.elements.recapture.checked,
      });
    } catch (failure) {
      error.textContent = failure instanceof DOMException ? t('El navegador no ha pogut desar la plantilla.') : failure.message;
      return;
    }
    reload();
    message.textContent = t('Plantilla «{name}» desada.', { name: name.value.trim() });
    finishEdit();
    animateRefresh(list);
  }

  list.addEventListener('click', event => {
    const action = event.target.closest('button');
    const id = action?.closest('[data-template]')?.dataset.template;
    const entry = entries.find(template => template.id === id);
    if (!entry) return;
    if (action.hasAttribute('data-template-edit')) startEdit(entry, action);
    else if (action.dataset.templateMove) {
      try {
        moveTemplate(window.localStorage, id, Number(action.dataset.templateMove));
        reload();
        const row = list.querySelector(`[data-template="${CSS.escape(id)}"]`);
        (row?.querySelector(`[data-template-move="${action.dataset.templateMove}"]:enabled`) ?? row?.querySelector('[data-template-edit]'))?.focus();
        message.textContent = t('S’ha mogut «{name}».', { name: entry.name });
        animateRefresh(list);
      } catch {
        message.textContent = t('No s’ha pogut desar l’ordre de les plantilles.');
      }
    }
    else {
      apply(entry);
      closeDialog(dialog);
    }
  });
  summary.addEventListener('click', syncPicker);
  choices.addEventListener('click', event => {
    const button = event.target.closest('button');
    const entry = entries.find(template => template.id === button?.closest('[data-template]')?.dataset.template);
    if (entry) apply(entry);
  });
  search.addEventListener('input', () => { render(); animateRefresh(empty.hidden ? list : empty); });
  find('#template-new').addEventListener('click', event => startEdit(null, event.currentTarget));
  find('#template-cancel').addEventListener('click', () => finishEdit());
  form.addEventListener('submit', save);
  find('#template-delete').addEventListener('click', () => {
    setDisclosure(confirmation, true);
    find('#template-keep').focus();
  });
  find('#template-keep').addEventListener('click', () => {
    find('#template-delete').focus();
    setDisclosure(confirmation, false);
  });
  find('#template-confirm-delete').addEventListener('click', () => {
    if (!editing) return;
    const { name } = editing;
    try {
      removeTemplate(window.localStorage, editing);
    } catch (failure) {
      error.textContent = failure instanceof DOMException ? t('El navegador no ha pogut suprimir la plantilla.') : failure.message;
      return;
    }
    reload();
    message.textContent = t('Plantilla «{name}» suprimida.', { name });
    finishEdit();
    animateRefresh(empty.hidden ? list : empty);
  });
  window.addEventListener('storage', event => {
    if (event.key === null || event.key === templateOrderKey || event.key.startsWith(templateKey)) reload();
  });
  reload();

  return {
    translate() { reload(); },
    syncPicker() {
      if (summary.getAttribute('aria-expanded') === 'true') syncPicker();
    },
    resetSelection() { appliedId = defaultTemplate.id; },
    open() {
      message.textContent = '';
      search.value = '';
      reload();
      finishEdit({ animated: false, focus: false });
      openDialog(dialog);
      dialog.querySelector('.dialog-scroll').scrollTop = 0;
      find('#template-library-title').focus({ preventScroll: true });
    },
  };
}
