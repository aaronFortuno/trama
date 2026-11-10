import { labelFor, wordCount } from './catalog.js';
import { defaultSettings, imageDefaults, makeCode, readCode } from './worksheet-code.js';
import { renderWorksheet } from './worksheet.js';

const arrow = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
const printer = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6m0 8h3V9H3v8h3m0-4h12v8H6z"/></svg>';

const range = (key, label, min, max, step, unit) => `
  <label class="studio-range">
    <span>${label}<output data-value="${key}"></output></span>
    <input type="range" name="${key}" min="${min}" max="${max}" step="${step}" data-unit="${unit}">
  </label>`;

const template = `
  <header class="studio-heading">
    <div>
      <button class="studio-back" type="button" data-action="catalog">${arrow} Torna al catàleg</button>
      <p class="studio-kicker" id="studio-meta"></p>
      <h1 id="studio-title" tabindex="-1"></h1>
      <label class="studio-variants" hidden>Altres versions <select id="studio-variant"></select></label>
    </div>
    <div class="studio-actions">
      <button class="button studio-jump" type="button" data-action="preview">Ves a la previsualització</button>
      <button class="button primary" type="button" data-action="print">${printer} Imprimeix / PDF</button>
    </div>
  </header>
  <div class="studio-layout">
    <aside class="studio-settings" aria-labelledby="studio-settings-title">
      <div class="studio-panel-heading">
        <h2 id="studio-settings-title">Ajustos de la fitxa</h2>
        <button class="studio-text-button" type="button" data-action="reset">Restableix</button>
      </div>
      <form class="studio-form">
        <details open>
          <summary>Text i tipografia</summary>
          <div class="studio-controls">
            <label>Tipografia
              <select name="font"><option value="serif">Georgia · amb serifa</option><option value="sans">Arial · sense serifa</option><option value="mono">Courier New · monoespaiada</option></select>
            </label>
            ${range('fontSize', 'Cos de lletra', 10, 20, 1, 'pt')}
            ${range('leading', 'Interlineat', 1.1, 2.2, 0.1, '×')}
            ${range('paragraphGap', 'Espai entre paràgrafs', 0, 12, 1, 'mm')}
          </div>
        </details>
        <details>
          <summary>Preguntes i respostes <span class="studio-detail-count" id="studio-question-count"></span></summary>
          <div class="studio-controls">
            <label>Línies per respondre
              <select name="answerLines"><option value="-1">Segons la pregunta</option><option value="0">Cap línia</option>${Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}">${i + 1} ${i === 0 ? 'línia' : 'línies'}</option>`).join('')}</select>
            </label>
            ${range('questionGap', 'Espai entre preguntes', 0, 14, 1, 'mm')}
            ${range('answerGap', 'Separació de les línies', 5, 13, 1, 'mm')}
            <fieldset><legend>Preguntes que apareixeran</legend><div id="studio-questions"></div></fieldset>
          </div>
        </details>
        <details>
          <summary>Il·lustracions <span class="studio-detail-count" id="studio-image-count"></span></summary>
          <div class="studio-controls">
            <label class="studio-check"><input type="checkbox" name="showImages"> Inclou il·lustracions</label>
            <div id="studio-images"></div>
          </div>
        </details>
        <details>
          <summary>Encapçalament</summary>
          <div class="studio-controls">
            <label>Model d’encapçalament
              <select name="header"><option value="standard">Nom, data i curs</option><option value="custom">Personalitzat</option><option value="none">Sense encapçalament</option></select>
            </label>
            <div class="studio-controls studio-custom" hidden>
              <label>Títol de l’encapçalament<input type="text" name="headerTitle" maxlength="80" placeholder="Nom de l’escola o de l’activitat"></label>
              <label>Segona línia<input type="text" name="headerDetail" maxlength="100" placeholder="Grup, unitat o instruccions breus"></label>
            </div>
          </div>
        </details>
        <details class="studio-share" open>
          <summary>Codi de la fitxa</summary>
          <div class="studio-controls">
            <p>Guarda el codi o copia l’enllaç per recuperar la lectura amb aquests ajustos.</p>
            <input id="studio-code" aria-label="Codi de la fitxa" type="text" readonly spellcheck="false">
            <div class="studio-copy-buttons">
              <button class="button" type="button" data-action="code">Copia el codi</button>
              <button class="button" type="button" data-action="link">Copia l’enllaç</button>
            </div>
            <p class="studio-status" id="studio-status" role="status" hidden></p>
            <label class="studio-check"><input type="checkbox" name="showCode"> Imprimeix el codi al peu</label>
          </div>
        </details>
      </form>
    </aside>
    <section class="studio-preview" aria-labelledby="studio-preview-title">
      <div class="studio-panel-heading">
        <h2 id="studio-preview-title" tabindex="-1">Previsualització</h2>
        <p class="studio-page-count" id="studio-page-count" aria-live="polite"></p>
      </div>
      <div class="studio-paper-stage"><div id="studio-pages"></div></div>
      <details class="studio-key" id="studio-key"><summary>Solucionari</summary><ol id="studio-answers"></ol></details>
    </section>
  </div>`;

function create(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function imageControls(image, index) {
  const card = create('fieldset', 'studio-image');
  card.dataset.image = image.id;
  card.innerHTML = `
    <legend>Imatge ${index + 1}</legend>
    <div class="studio-image-title"><img alt="" width="48" height="34"><span></span></div>
    <label class="studio-check"><input type="checkbox" data-image-key="visible"> Mostra-la</label>
    <div class="studio-controls studio-image-options">
      <label class="studio-range"><span>Amplada <output data-image-width></output></span><input type="range" min="20" max="75" data-image-key="width"></label>
      <label>Posició <select data-image-key="position"><option value="left">Esquerra</option><option value="center">Centre</option><option value="right">Dreta</option></select></label>
      <label class="studio-check"><input type="checkbox" data-image-key="wrap"> Text al voltant</label>
    </div>`;
  card.querySelector('img').src = image.src;
  const caption = card.querySelector('.studio-image-title span');
  caption.textContent = image.alt;
  return card;
}

export function mountStudio({ root, readings, onOpen, onCatalog, onVariant }) {
  root.innerHTML = template;
  const find = selector => root.querySelector(selector);
  const form = find('form');
  const pages = find('#studio-pages');
  const stage = find('.studio-paper-stage');
  const codeInput = find('#studio-code');
  const status = find('#studio-status');
  const variant = find('#studio-variant');
  const printOutlet = create('div', 'worksheet-print-outlet');
  document.body.append(printOutlet);

  let reading;
  let settings;
  let code;
  let frame = 0;

  function sizePreview() {
    const scale = Math.min(1, pages.clientWidth / (210 * 96 / 25.4));
    if (scale > 0) pages.style.setProperty('--preview-scale', String(scale));
  }

  new ResizeObserver(sizePreview).observe(stage);

  function populateReading() {
    find('#studio-title').textContent = reading.title;
    find('#studio-title').lang = reading.language;
    find('#studio-meta').textContent = `${labelFor('language', reading.language)} · ${labelFor('level', reading.level)} · ${wordCount(reading)} paraules`;
    const variants = readings.filter(entry => entry.workId && entry.workId === reading.workId);
    variant.replaceChildren(...variants.map(entry => new Option(labelFor('language', entry.language), entry.id)));
    variant.value = reading.id;
    variant.parentElement.hidden = variants.length < 2;
    find('#studio-questions').replaceChildren(...reading.questions.map(question => {
      const label = create('label', 'studio-question-option studio-check');
      const input = create('input');
      input.type = 'checkbox';
      input.dataset.question = question.id;
      const copy = create('span');
      const prompt = create('span', null, question.prompt);
      prompt.lang = reading.language;
      copy.append(create('small', null, labelFor('question', question.type)), prompt);
      label.append(input, copy);
      return label;
    }));
    find('#studio-images').replaceChildren(...reading.images.map(imageControls));
    form.elements.showImages.disabled = !reading.images.length;
    status.hidden = true;
  }

  function syncControls() {
    for (const input of form.querySelectorAll('[name]')) {
      if (input.type === 'checkbox') input.checked = settings[input.name];
      else if (input.value !== String(settings[input.name])) input.value = settings[input.name];
      if (input.type === 'range') {
        const formatted = new Intl.NumberFormat('ca').format(settings[input.name]);
        find(`[data-value="${input.name}"]`).value = `${formatted} ${input.dataset.unit}`;
      }
    }
    find('.studio-custom').hidden = settings.header !== 'custom';
    find('#studio-images').hidden = !settings.showImages;
    const included = reading.questions.filter(question => !settings.excluded.includes(question.id));
    find('#studio-question-count').textContent = `${included.length}/${reading.questions.length}`;
    const visible = settings.showImages ? reading.images.filter(image => settings.images[image.id]?.visible !== false).length : 0;
    find('#studio-image-count').textContent = `${visible}/${reading.images.length}`;
    for (const input of form.querySelectorAll('[data-question]')) input.checked = !settings.excluded.includes(input.dataset.question);
    for (const card of form.querySelectorAll('[data-image]')) {
      const config = settings.images[card.dataset.image] || imageDefaults;
      card.querySelector('.studio-image-options').hidden = !config.visible;
      card.querySelector('[data-image-width]').value = `${config.width}%`;
      for (const input of card.querySelectorAll('[data-image-key]')) {
        const key = input.dataset.imageKey;
        if (input.type === 'checkbox') input.checked = config[key];
        else input.value = config[key];
        if (key === 'wrap') {
          input.disabled = config.position === 'center';
          input.checked = config.wrap && !input.disabled;
        }
      }
    }
    const withAnswers = included.map((question, index) => ({ question, index })).filter(({ question }) => question.answer);
    find('#studio-key').hidden = !withAnswers.length;
    find('#studio-answers').replaceChildren(...withAnswers.map(({ question, index }) => {
      const item = create('li', null, question.answer);
      item.value = index + 1;
      item.lang = reading.language;
      return item;
    }));
  }

  function refresh() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!reading || root.hidden) return;
    code = makeCode(reading, settings);
    codeInput.value = code;
    const count = renderWorksheet(pages, reading, settings, code);
    const label = `A4 · ${count} ${count === 1 ? 'pàgina' : 'pàgines'}`;
    const countNode = find('#studio-page-count');
    if (countNode.textContent !== label) countNode.textContent = label;
    sizePreview();
  }

  function select(entry, config) {
    reading = entry;
    settings = config;
    populateReading();
    syncControls();
    onOpen(reading);
    refresh();
  }

  function update(event) {
    const input = event.target;
    if (input.readOnly) return;
    const value = input.type === 'checkbox' ? input.checked : input.type === 'range' || input.name === 'answerLines' ? Number(input.value) : input.value;
    if (input.dataset.question) {
      const id = input.dataset.question;
      settings.excluded = input.checked ? settings.excluded.filter(entry => entry !== id) : [...settings.excluded, id];
    } else if (input.dataset.imageKey) {
      const id = input.closest('[data-image]').dataset.image;
      settings.images[id] = { ...imageDefaults, ...settings.images[id], [input.dataset.imageKey]: value };
    } else if (Object.hasOwn(settings, input.name)) {
      settings[input.name] = value;
    } else {
      return;
    }
    status.hidden = true;
    syncControls();
    if (!frame) frame = requestAnimationFrame(refresh);
  }

  async function copy(value, message) {
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = message;
    } catch {
      const input = create('input');
      input.value = value;
      input.readOnly = true;
      input.className = 'studio-copy-fallback';
      status.replaceChildren(document.createTextNode('Selecciona i copia el text manualment.'), input);
      status.hidden = false;
      input.select();
    }
    status.hidden = false;
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  variant.addEventListener('change', () => onVariant?.(variant.value));
  root.addEventListener('click', async event => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'catalog') onCatalog();
    if (action === 'preview') {
      find('#studio-preview-title').focus();
      find('#studio-preview-title').scrollIntoView({ block: 'start' });
    }
    if (action === 'reset') {
      settings = defaultSettings();
      status.hidden = true;
      syncControls();
      refresh();
    }
    if (action === 'code' || action === 'link') {
      if (frame) refresh();
      const url = new URL(location.href);
      url.hash = `fitxa=${code}`;
      await copy(action === 'code' ? code : url.href, action === 'code' ? 'Codi copiat.' : 'Enllaç copiat.');
    }
    if (action === 'print') {
      if (frame) refresh();
      await Promise.all(Array.from(pages.querySelectorAll('img'), image => image.decode().catch(() => {})));
      if (!root.hidden) window.print();
    }
  });

  window.addEventListener('beforeprint', () => {
    if (root.hidden || !reading) return;
    if (frame) refresh();
    printOutlet.replaceChildren(...Array.from(pages.querySelectorAll('.worksheet-page'), page => page.cloneNode(true)));
    document.body.dataset.tramaPrint = '';
  });
  window.addEventListener('afterprint', () => {
    delete document.body.dataset.tramaPrint;
    printOutlet.replaceChildren();
  });

  return {
    open(id) {
      const entry = readings.find(item => item.id === id);
      if (!entry) return false;
      select(entry, defaultSettings());
      return true;
    },
    restore(value) {
      const decoded = readCode(value, readings);
      if (!decoded) return false;
      select(decoded.reading, decoded.settings);
      return true;
    },
  };
}
