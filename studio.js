import { labelFor, wordCount } from './catalog.js';
import { defaultQuestionLines, defaultSettings, imageDefaults, makeCode, marginLimits, maxAnswerLines, questionLines, readCode } from './worksheet-code.js';
import { renderWorksheet } from './worksheet.js';
import { animateRefresh, mountDisclosures, setDisclosure } from './motion.js';
import { mountPreviewZoom } from './preview-zoom.js';
import { syncSelects } from './select-menu.js';
import { mountTemplateLibrary, templateLibraryMarkup } from './template-library.js';

const arrow = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
const printer = '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6m0 8h3V9H3v8h3m0-4h12v8H6z"/></svg>';
const numberFormat = new Intl.NumberFormat('ca', { maximumFractionDigits: 2 });

const range = (key, label, min, max, step, unit) => `
  <label class="studio-range">
    <span>${label}<output data-value="${key}"></output></span>
    <input type="range" name="${key}" min="${min}" max="${max}" step="${step}" data-unit="${unit}">
  </label>`;
const check = (key, label) => `<label class="studio-check"><input type="checkbox" name="${key}"> ${label}</label>`;
const answerStyleOptions = { blank: 'En blanc', lines: 'Línies', dots: 'Punts', grid: 'Quadrícula' };

const template = `
  <header class="studio-heading">
    <div>
      <button class="studio-back" type="button" data-action="catalog">${arrow} Torna al catàleg</button>
      <p class="studio-kicker" id="studio-meta"></p>
      <div class="studio-title-line"><h1 id="studio-title" tabindex="-1"></h1><span id="studio-reading-code" class="studio-reading-code"></span></div>
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
      <form class="studio-form scroll-pane">
        <div class="studio-template-tools">
          <div class="studio-template-actions">
            <button class="button" type="button" data-action="templates" aria-haspopup="dialog" aria-controls="template-dialog">Plantilles <span class="studio-template-count" aria-hidden="true"></span></button>
            <button class="studio-text-button" type="button" data-action="save-template" aria-haspopup="dialog" aria-controls="template-dialog">Desa el format</button>
          </div>
          <p class="studio-template-status" role="status"></p>
        </div>
        <details open>
          <summary>Text i tipografia</summary>
          <div class="studio-controls">
            <label>Tipografia
              <select name="font"><option value="serif">Georgia · amb serifa</option><option value="sans">Arial · sense serifa</option><option value="mono">Courier New · monoespaiada</option></select>
            </label>
            ${range('fontSize', 'Cos de lletra', 10, 20, 1, 'pt')}
            ${range('leading', 'Interlineat', .5, 3, .05, '×')}
            ${range('paragraphGap', 'Espai entre paràgrafs', 0, 12, 1, 'mm')}
          </div>
        </details>
        <details>
          <summary>Marges del full</summary>
          <div class="studio-controls">
            ${range('marginTop', 'Superior', marginLimits.min, marginLimits.max, 1, 'mm')}
            ${range('marginRight', 'Dret', marginLimits.min, marginLimits.max, 1, 'mm')}
            ${range('marginBottom', 'Inferior', marginLimits.min, marginLimits.max, 1, 'mm')}
            ${range('marginLeft', 'Esquerre', marginLimits.min, marginLimits.max, 1, 'mm')}
          </div>
        </details>
        <details>
          <summary>Preguntes i respostes <span class="studio-detail-count" id="studio-question-count"></span></summary>
          <div class="studio-controls">
            <fieldset class="studio-answer-styles"><legend>Pauta de resposta</legend>
              ${Object.entries(answerStyleOptions).map(([style, label]) => `<label class="studio-check"><input type="radio" name="answerStyle" value="${style}"> ${label}</label>`).join('')}
            </fieldset>
            <label>Espai per defecte
              <select name="answerLines"><option value="-1">Segons la pregunta</option><option value="0">Cap espai</option>${Array.from({ length: maxAnswerLines }, (_, i) => `<option value="${i + 1}">${i + 1} ${i === 0 ? 'línia' : 'línies'}</option>`).join('')}</select>
            </label>
            ${range('questionGap', 'Espai entre preguntes', 0, 14, 1, 'mm')}
            ${range('answerGap', 'Alçada de cada línia', 5, 13, 1, 'mm')}
            <div id="studio-answer-weight">${range('answerWeight', 'Gruix de la pauta', .1, .5, .05, 'mm')}</div>
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
            ${check('headerName', 'Camp de nom')}
            ${check('headerDate', 'Camp de data')}
            ${check('headerGroup', 'Camp de curs')}
            ${check('headerLabel', 'Etiqueta de comprensió lectora')}
            ${check('headerCustom', 'Text personalitzat')}
            <div class="studio-controls studio-custom" hidden>
              <label>Títol de l’encapçalament<input type="text" name="headerTitle" maxlength="80" placeholder="Nom de l’escola o de l’activitat"></label>
              <label>Segona línia<input type="text" name="headerDetail" maxlength="100" placeholder="Grup, unitat o instruccions breus"></label>
            </div>
          </div>
        </details>
        <details>
          <summary>Peu de pàgina</summary>
          <div class="studio-controls">
            ${check('showOrigin', 'Origen de la fitxa · trama.ortogra.fi')}
            ${check('showCode', 'Codi de recuperació')}
            ${check('showPage', 'Número de pàgina')}
          </div>
        </details>
        <details class="studio-share">
          <summary>Codi de la fitxa</summary>
          <div class="studio-controls">
            <p>El codi indica la lectura, la llengua i els ajustos que has canviat.</p>
            <textarea id="studio-code" aria-label="Codi de la fitxa" rows="2" readonly spellcheck="false"></textarea>
            <div class="studio-copy-buttons">
              <button class="button" type="button" data-action="code">Copia el codi</button>
              <button class="button" type="button" data-action="link">Copia l’enllaç</button>
            </div>
            <p class="studio-status" id="studio-status" role="status" hidden></p>
          </div>
        </details>
      </form>
    </aside>
    <section class="studio-preview" aria-labelledby="studio-preview-title">
      <div class="studio-preview-header"><div class="studio-panel-heading studio-preview-heading">
        <div class="studio-preview-label"><h2 id="studio-preview-title" tabindex="-1">Previsualització</h2><p class="studio-page-count" id="studio-page-count" aria-live="polite"></p></div>
        <div class="studio-zoom" role="group" aria-label="Zoom de la previsualització">
          <span class="studio-zoom-hint">Ctrl + roda</span>
          <button class="button" type="button" data-zoom="out" aria-label="Redueix el zoom" title="Redueix el zoom"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button>
          <output aria-label="Nivell de zoom">100 %</output>
          <button class="button" type="button" data-zoom="in" aria-label="Amplia el zoom" title="Amplia el zoom"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7v14"/></svg></button>
          <button class="button" type="button" data-zoom="fit" aria-label="Ajusta a l’amplada" title="Ajusta a l’amplada"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5m0 6v5h-5m-6 0H4v-5"/></svg></button>
        </div>
      </div><div class="studio-question-feedback" hidden><span role="status">Pregunta amagada.</span><button class="studio-text-button" type="button" data-action="question-undo">Desfés</button></div></div>
      <div class="studio-paper-stage scroll-pane" tabindex="0" role="region" aria-label="Pàgines de la fitxa">
        <div id="studio-pages"></div>
        <details class="studio-key" id="studio-key"><summary>Solucionari</summary><ol id="studio-answers"></ol></details>
      </div>
    </section>
  </div>
  ${templateLibraryMarkup}`;

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
  const preview = mountPreviewZoom(stage, pages, find('.studio-zoom'));
  mountDisclosures(form, { exclusive: true });
  mountDisclosures(find('.studio-preview'));
  const main = root.closest('main');
  const settingsHeading = find('.studio-settings > .studio-panel-heading');
  const fixedParts = [find('.studio-template-tools'), ...form.querySelectorAll('summary')];
  const splitView = matchMedia('(min-width: 791px) and (min-height: 480px)');
  let sidebarFrame = 0;
  const resizeSidebar = new ResizeObserver(() => {
    if (sidebarFrame) return;
    sidebarFrame = requestAnimationFrame(() => {
      sidebarFrame = 0;
      const fixedHeight = fixedParts.reduce((sum, part) => sum + part.offsetHeight, fixedParts.length - 1);
      const available = splitView.matches ? form.clientHeight : main.clientHeight - settingsHeading.offsetHeight;
      form.style.setProperty('--studio-panel-height', `${Math.max(64, available - fixedHeight)}px`);
    });
  });
  resizeSidebar.observe(form);
  resizeSidebar.observe(main);
  resizeSidebar.observe(settingsHeading);
  for (const part of fixedParts) resizeSidebar.observe(part);
  const codeInput = find('#studio-code');
  const status = find('#studio-status');
  const variant = find('#studio-variant');
  const printOutlet = create('div', 'worksheet-print-outlet');
  document.body.append(printOutlet);

  let reading;
  let settings;
  let code;
  let frame = 0;
  let hiddenQuestion;
  const questionFeedback = find('.studio-question-feedback');
  const templateStatus = find('.studio-template-status');
  const templates = mountTemplateLibrary({
    dialog: find('#template-dialog'),
    count: find('.studio-template-count'),
    getSettings: () => settings,
    onApply(format, name) {
      Object.assign(settings, format);
      syncControls();
      refresh();
      templateStatus.textContent = `Plantilla «${name}» aplicada.`;
      animateRefresh(pages);
    },
  });

  function populateReading() {
    find('#studio-title').textContent = reading.title;
    find('#studio-title').lang = reading.language;
    find('#studio-reading-code').textContent = reading.code;
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
    templateStatus.textContent = '';
    hiddenQuestion = undefined;
    questionFeedback.hidden = true;
  }

  function syncControls(animated = true) {
    for (const input of form.querySelectorAll('[name]')) {
      const value = input.name === 'leading' ? Math.round(settings.leading * 50) / 100 : settings[input.name];
      if (input.type === 'checkbox') input.checked = settings[input.name];
      else if (input.type === 'radio') input.checked = input.value === value;
      else if (input.value !== String(value)) input.value = value;
      if (input.type === 'range') {
        const formatted = `${numberFormat.format(value)} ${input.dataset.unit}`;
        find(`[data-value="${input.name}"]`).value = formatted;
        input.setAttribute('aria-valuetext', formatted);
      }
    }
    setDisclosure(find('.studio-custom'), settings.headerCustom, { animated });
    setDisclosure(find('#studio-answer-weight'), settings.answerStyle !== 'blank', { animated });
    setDisclosure(find('#studio-images'), settings.showImages, { animated });
    const included = reading.questions.filter(question => !settings.excluded.includes(question.id));
    find('#studio-question-count').textContent = `${included.length}/${reading.questions.length}`;
    const visible = settings.showImages ? reading.images.filter(image => settings.images[image.id]?.visible !== false).length : 0;
    find('#studio-image-count').textContent = `${visible}/${reading.images.length}`;
    for (const input of form.querySelectorAll('[data-question]')) input.checked = !settings.excluded.includes(input.dataset.question);
    for (const card of form.querySelectorAll('[data-image]')) {
      const config = settings.images[card.dataset.image] || imageDefaults;
      setDisclosure(card.querySelector('.studio-image-options'), config.visible, { animated });
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
    find('#studio-answers').replaceChildren(...withAnswers.map(({ question, index }) => {
      const item = create('li', null, question.answer);
      item.value = index + 1;
      item.lang = reading.language;
      return item;
    }));
    setDisclosure(find('#studio-key'), Boolean(withAnswers.length), { animated });
    syncSelects(root);
  }

  function refresh() {
    const animated = Boolean(frame);
    cancelAnimationFrame(frame);
    frame = 0;
    if (!reading || root.hidden) return;
    code = makeCode(reading, settings);
    codeInput.value = code;
    const { scrollLeft, scrollTop } = stage;
    const count = renderWorksheet(pages, reading, settings, code);
    const label = `A4 · ${count} ${count === 1 ? 'pàgina' : 'pàgines'}`;
    const countNode = find('#studio-page-count');
    if (countNode.textContent !== label) countNode.textContent = label;
    preview.size();
    stage.scrollTo(scrollLeft, scrollTop);
    if (animated) animateRefresh(pages);
  }

  function select(entry, config) {
    reading = entry;
    settings = config;
    populateReading();
    syncControls(false);
    onOpen(reading);
    refresh();
    form.scrollTop = 0;
    preview.reset();
  }

  function update(event) {
    const input = event.target;
    if (input.readOnly) return;
    const value = input.type === 'checkbox' ? input.checked : input.type === 'range' || input.name === 'answerLines' ? Number(input.value) : input.value;
    if (input.dataset.question) {
      const id = input.dataset.question;
      settings.excluded = input.checked ? settings.excluded.filter(entry => entry !== id) : [...settings.excluded, id];
      if (input.checked && id === hiddenQuestion) {
        hiddenQuestion = undefined;
        questionFeedback.hidden = true;
      }
    } else if (input.dataset.imageKey) {
      const id = input.closest('[data-image]').dataset.image;
      settings.images[id] = { ...imageDefaults, ...settings.images[id], [input.dataset.imageKey]: value };
    } else if (Object.hasOwn(settings, input.name)) {
      settings[input.name] = input.name === 'leading' ? Math.round(value * 20) / 10 : value;
    } else {
      return;
    }
    status.hidden = true;
    templateStatus.textContent = '';
    syncControls();
    if (!frame) frame = requestAnimationFrame(refresh);
  }

  function editQuestion(action, button) {
    if (action === 'question-undo') {
      if (!hiddenQuestion) return;
      settings.excluded = settings.excluded.filter(id => id !== hiddenQuestion);
      hiddenQuestion = undefined;
      questionFeedback.hidden = true;
      syncControls();
      refresh();
      find('#studio-preview-title').focus({ preventScroll: true });
      return;
    }
    const block = button.closest('[data-question-id]');
    const question = reading.questions.find(entry => entry.id === block?.dataset.questionId);
    if (!question) return;
    if (action === 'question-tools') {
      button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'));
      return;
    }
    const top = block.getBoundingClientRect().top;
    if (action === 'question-hide') {
      settings.excluded = [...settings.excluded, question.id];
      hiddenQuestion = question.id;
      questionFeedback.hidden = false;
      animateRefresh(questionFeedback);
    } else {
      const count = Math.min(maxAnswerLines, Math.max(0, questionLines(question, settings) + (action === 'question-more' ? 1 : -1)));
      if (count === defaultQuestionLines(question, settings)) delete settings.questionLines[question.id];
      else settings.questionLines[question.id] = count;
    }
    templateStatus.textContent = '';
    syncControls();
    refresh();
    if (action === 'question-hide') {
      questionFeedback.querySelector('button').focus({ preventScroll: true });
      return;
    }
    const current = pages.querySelector(`[data-question-id="${CSS.escape(question.id)}"]`);
    stage.scrollTop += current.getBoundingClientRect().top - top;
    current.querySelector('[data-action="question-tools"]').setAttribute('aria-expanded', 'true');
    const focus = current.querySelector(`[data-action="${action}"]:not(:disabled)`) || current.querySelector('.worksheet-question-actions button:not(:disabled)');
    focus?.focus({ preventScroll: true });
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
    const button = event.target.closest('[data-action]');
    const action = button?.dataset.action;
    if (action?.startsWith('question-')) editQuestion(action, button);
    if (action === 'catalog') onCatalog();
    if (action === 'templates' || action === 'save-template') templates.open(action === 'save-template');
    if (action === 'preview') {
      find('#studio-preview-title').focus({ preventScroll: true });
      find('.studio-preview').scrollIntoView({ block: 'start' });
    }
    if (action === 'reset') {
      settings = defaultSettings();
      status.hidden = true;
      templateStatus.textContent = '';
      hiddenQuestion = undefined;
      questionFeedback.hidden = true;
      syncControls();
      refresh();
    }
    if (action === 'code' || action === 'link') {
      if (frame) refresh();
      const url = new URL(location.href);
      url.hash = `fitxa=${encodeURIComponent(code)}`;
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
    printOutlet.replaceChildren(...Array.from(pages.querySelectorAll('.worksheet-page'), page => {
      const printed = page.cloneNode(true);
      printed.querySelectorAll('.worksheet-question-tools').forEach(tools => tools.remove());
      return printed;
    }));
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
