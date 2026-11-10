import { animateRefresh, closeDialog, openDialog, setDisclosure } from './motion.js';
import { listTemplates, removeTemplate, saveTemplate, templateGroups, templateKey, templateSettings } from './worksheet-templates.js';

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

const fold = value => value.toLocaleLowerCase('ca').normalize('NFD').replace(/\p{M}/gu, '');
const fonts = { serif: 'Georgia', sans: 'Arial', mono: 'Courier New' };
const formatNumber = new Intl.NumberFormat('ca');

function describe(entry) {
  const { text, margins, answers, header, images } = entry.format;
  return [
    text && `${fonts[text.font]} · ${text.fontSize} pt · ${formatNumber.format(text.leading)}×`,
    margins && 'Marges', answers && 'Espai de resposta', header && 'Encapçalament i peu', images && 'Il·lustracions',
  ].filter(Boolean).join(' / ');
}

function makeRow(entry) {
  const row = document.createElement('li');
  row.dataset.template = entry.id;
  row.innerHTML = `<div class="template-row-copy"><strong></strong><p></p></div><div class="template-row-actions"><button class="button" type="button" data-template-edit>Edita</button><button class="button" type="button" data-template-apply>Aplica</button></div>`;
  row.querySelector('strong').textContent = entry.name;
  row.querySelector('p').textContent = describe(entry);
  row.querySelector('[data-template-edit]').setAttribute('aria-label', `Edita ${entry.name}`);
  row.querySelector('[data-template-apply]').setAttribute('aria-label', `Aplica ${entry.name}`);
  return row;
}

export function mountTemplateLibrary({ dialog, count, getSettings, onApply }) {
  const find = selector => dialog.querySelector(selector);
  const search = find('#template-search');
  const list = find('#template-list');
  const empty = find('#template-empty');
  const form = find('form');
  const panel = find('.template-editor-panel');
  const confirmation = find('.template-remove-confirm');
  const error = find('#template-editor-error');
  const message = find('#template-message');
  const name = form.elements.namedItem('name');
  const checkboxes = [...form.querySelectorAll('[name="group"]')];
  let entries = [];
  let editing = null;
  let editorOrigin;

  function render() {
    const query = fold(search.value.trim());
    const shown = entries.filter(entry => fold(entry.name).includes(query));
    list.replaceChildren(...shown.map(makeRow));
    empty.hidden = shown.length > 0;
    empty.textContent = entries.length ? 'No hi ha cap plantilla que coincideixi amb la cerca.' : 'Encara no tens cap plantilla. Crea’n una amb els ajustos actuals de la fitxa.';
  }

  function reload() {
    try {
      entries = listTemplates(window.localStorage);
      count.textContent = entries.length ? String(entries.length) : '';
      render();
      return true;
    } catch {
      message.textContent = 'Aquest navegador no ha permès accedir a les plantilles desades.';
      return false;
    }
  }

  function startEdit(entry, origin) {
    editing = entry;
    editorOrigin = origin;
    form.reset();
    name.value = entry?.name || '';
    for (const [index, field] of checkboxes.entries()) {
      field.checked = entry ? Object.hasOwn(entry.format, field.value) : Boolean(templateGroups[index].selected);
    }
    find('#template-editor-title').textContent = entry ? 'Edita la plantilla' : 'Nova plantilla';
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
      error.textContent = failure instanceof DOMException ? 'El navegador no ha pogut desar la plantilla.' : failure.message;
      return;
    }
    reload();
    message.textContent = `Plantilla «${name.value.trim()}» desada.`;
    finishEdit();
    animateRefresh(list);
  }

  list.addEventListener('click', event => {
    const action = event.target.closest('button');
    const id = action?.closest('[data-template]')?.dataset.template;
    const entry = entries.find(template => template.id === id);
    if (!entry) return;
    if (action.hasAttribute('data-template-edit')) startEdit(entry, action);
    else {
      onApply(templateSettings(entry), entry.name);
      closeDialog(dialog);
    }
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
      error.textContent = failure instanceof DOMException ? 'El navegador no ha pogut suprimir la plantilla.' : failure.message;
      return;
    }
    reload();
    message.textContent = `Plantilla «${name}» suprimida.`;
    finishEdit();
    animateRefresh(empty.hidden ? list : empty);
  });
  window.addEventListener('storage', event => {
    if (event.key === null || event.key.startsWith(templateKey)) reload();
  });
  reload();

  return {
    open(create) {
      message.textContent = '';
      search.value = '';
      reload();
      finishEdit({ animated: false, focus: false });
      openDialog(dialog);
      dialog.querySelector('.dialog-scroll').scrollTop = 0;
      if (create) startEdit(null, find('#template-new'));
      else find('#template-library-title').focus({ preventScroll: true });
    },
  };
}
