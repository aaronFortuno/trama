import { labelFor, wordCount } from './catalog.js';
import { classroomCodeSize, defaultImageConfig, defaultQuestionLines, defaultSettings, marginLimits, maxAnswerLines, maxClassroomCodeLength, questionLines, readCode, validSetting, worksheetLayout } from './worksheet-code.js';
import { classroomKeys, clearWorksheetLayouts, hasPendingWorksheetLayout, readWorksheetLayout, removeWorksheetLayout, saveWorksheetLayout } from './worksheet-layouts.js';
import { decodeWorksheetImages, exportWorksheetPages, renderWorksheet, worksheetThumbnail } from './worksheet.js';
import { supportsHyphenation } from './worksheet-hyphenation.js';
import { animateRefresh, mountDisclosures, setDisclosure } from './motion.js';
import { mountPreviewZoom } from './preview-zoom.js';
import { syncSelects } from './select-menu.js';
import { mountTemplateLibrary, templateLibraryMarkup } from './template-library.js';
import { templateGroups } from './worksheet-templates.js';
import { icon } from './icons.js';
import { bindTranslations, language, t } from './i18n.js';
import { mountActionMenu } from './action-menu.js';
import { mountReadingReport, readingReportMarkup } from './reading-report.js';
import { encodeImage, logoSource, tramaLogo } from './local-images.js';
import { fontGroups, loadWorksheetFont, worksheetFonts } from './worksheet-fonts.js';
import { prepareAnswerEvidence } from './answer-evidence.js';
import { trackFeature, trackReadingFeature } from './analytics.js';
import { universeById } from './data/universes.js';
import { familyComparisonMarkup, mountFamilyComparison } from './family-comparison.js';
import { familyStageMarkup, mountFamilyStage } from './family-stage.js';

const formatKeys = new Set(templateGroups.filter(group => group.id !== 'images').flatMap(group => group.keys));
const pageFormat = settings => Object.fromEntries([...formatKeys].map(key => [key, settings[key]]));
const classroomFormat = settings => Object.fromEntries(classroomKeys.map(key => [key, settings[key]]));
const analyticsBlocks = { text: 'text', margins: 'marges', answers: 'resposta', header: 'encapcalament', footer: 'peu', images: 'imatges' };
const controlBlocks = new Map(templateGroups.flatMap(group => group.keys.map(key => [key, analyticsBlocks[group.id]])));

const range = (key, label, min, max, step, unit) => `
  <label class="studio-range">
    <span>${label}<output data-value="${key}"></output></span>
    <input type="range" name="${key}" min="${min}" max="${max}" step="${step}" data-unit="${unit}">
  </label>`;
const check = (key, label) => `<label class="studio-check"><input type="checkbox" name="${key}"> ${label}</label>`;
const logoControls = (key, label) => `
  <div class="studio-logo-control" role="group" aria-label="${label}" data-logo-control="${key}">
    <div class="studio-logo-preview" hidden><img alt=""></div>
    <input type="file" data-logo-file="${key}" accept="image/png,image/jpeg,image/webp" hidden>
    <div class="studio-logo-actions">
      <button type="button" class="button" data-logo-choose>Carrega un logotip</button>
      <button type="button" class="studio-text-button" data-logo-default hidden>Fes servir Trama</button>
      <button type="button" class="studio-text-button" data-logo-clear hidden>Treu-lo</button>
    </div>
    <p data-logo-status role="status" hidden></p>
  </div>`;
const answerStyleOptions = { blank: 'En blanc', lines: 'Línies', dots: 'Punts', grid: 'Quadrícula' };
const fontOptions = Object.entries(fontGroups).map(([group, label]) => `
  <optgroup label="${label}">
    ${Object.entries(worksheetFonts).filter(([, font]) => font.group === group)
      .map(([id, font]) => `<option value="${id}">${font.name}</option>`).join('')}
  </optgroup>`).join('');

const template = `
  <div class="studio-layout scroll-pane">
    <section class="studio-preview" aria-labelledby="studio-title">
      <header class="studio-preview-header">
        <div class="studio-heading">
          <button class="button studio-back" type="button" data-action="catalog" aria-label="Torna al catàleg" title="Torna al catàleg">${icon('arrow-left')}</button>
          <div class="studio-title-line">
            <div class="studio-title-copy"><h1 id="studio-title" tabindex="-1"></h1><span id="studio-reading-code" class="studio-reading-code"></span><span id="studio-collection-name" class="catalog-collection-label" hidden></span></div>
            <p class="studio-kicker" id="studio-meta"></p>
            <label class="studio-variants" hidden>Llengua de la lectura <select id="studio-variant"></select></label>
          </div>
          <div class="studio-heading-actions">
            <div class="studio-reading-nav" role="group" aria-label="Navegació entre lectures">
              <button class="button" type="button" data-action="reading-previous" aria-label="Lectura anterior" disabled>${icon('chevron-left')}</button>
              <button class="button" type="button" data-action="reading-next" aria-label="Lectura següent" disabled>${icon('chevron-right')}</button>
            </div>
            <button class="button studio-report-trigger" type="button" data-report-part="" aria-label="Notifica un error" title="Notifica un error" aria-haspopup="dialog" aria-controls="reading-report-dialog">${icon('flag')}</button>
            <button class="button studio-reading-trigger" type="button" id="studio-reading-trigger" aria-label="Opcions de la lectura" title="Opcions de la lectura" aria-haspopup="menu" aria-expanded="false" aria-controls="studio-reading-menu" popovertarget="studio-reading-menu" hidden>${icon('ellipsis')}</button>
            <div class="select-menu action-menu" id="studio-reading-menu" role="menu" aria-labelledby="studio-reading-trigger" popover>
              <button type="button" role="menuitem" tabindex="-1" data-option="remove">Suprimeix la lectura importada</button>
            </div>
          </div>
        </div>
        <p class="studio-file-status" id="studio-file-status" role="status" hidden></p>
        <div class="studio-question-feedback" hidden><span role="status">Pregunta amagada.</span><button class="studio-text-button" type="button" data-action="question-undo">Desfés</button></div>
      </header>
      <div class="studio-preview-window">
        ${familyStageMarkup}
        <div class="studio-paper-stage scroll-pane" tabindex="0" role="region" aria-label="Pàgines de la fitxa">
          <div id="studio-pages"></div>
        </div>
        <div class="studio-zoom" role="group" aria-label="Zoom de la previsualització">
          <button class="button" type="button" data-zoom="out" aria-label="Redueix el zoom" title="Redueix el zoom">${icon('minus')}</button>
          <button class="button" type="button" data-zoom="in" aria-label="Amplia el zoom" title="Amplia el zoom">${icon('plus')}</button>
          <button class="button" type="button" data-zoom="fit" aria-label="Ajusta a l’amplada" title="Ajusta a l’amplada">${icon('maximize')}</button>
          <output class="visually-hidden" aria-label="Nivell de zoom">100 %</output>
        </div>
      </div>
    </section>
    <aside class="studio-settings studio-format" aria-labelledby="studio-settings-title">
      <div class="studio-panel-heading">
        <h2 id="studio-settings-title">Format del full</h2>
        <button class="studio-text-button" type="button" data-action="reset" aria-label="Restableix aquesta lectura" title="Restableix aquesta lectura">Restableix</button>
      </div>
      <form class="studio-form scroll-pane">
        <details class="studio-template-picker">
          <summary>Plantilles</summary>
          <div class="studio-controls">
            <ul class="studio-template-list" aria-label="Tria una plantilla"></ul>
            <button class="button" type="button" data-action="templates" aria-haspopup="dialog" aria-controls="template-dialog">Gestiona les plantilles</button>
            <p class="studio-template-status" role="status"></p>
          </div>
        </details>
        <details open>
          <summary>Text i tipografia</summary>
          <div class="studio-controls">
            <label>Tipografia
              <select name="font">${fontOptions}<option value="mono" hidden>${worksheetFonts.mono.name}</option></select>
            </label>
            ${range('fontSize', 'Cos de lletra', 10, 20, 1, 'pt')}
            ${range('leading', 'Interlineat', .5, 3, .05, '×')}
            <label>Alineació del text
              <select name="textAlignment"><option value="left">Esquerra</option><option value="justify">Justificat</option></select>
            </label>
            ${check('hyphenate', 'Guionets a final de línia')}
            <p class="studio-hyphenation-note" hidden>Disponible per a lectures en català i castellà.</p>
            ${range('paragraphGap', 'Espai entre paràgrafs', 0, 12, 1, 'mm')}
            ${range('sectionGap', 'Espai abans de les preguntes', 0, 20, 1, 'mm')}
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
            ${check('showClassroomCode', 'Codi d’aula')}
            <div class="studio-controls studio-classroom-code" hidden>
              <label>Text del codi d’aula<input type="text" name="classroomCode" maxlength="${maxClassroomCodeLength}"></label>
              <div class="studio-classroom-size">
                <span aria-hidden="true">−</span>
                <input type="range" name="classroomCodeSize" min="${classroomCodeSize.min}" max="${classroomCodeSize.max}" step="${classroomCodeSize.step}" data-unit="pt" aria-label="Mida del codi d’aula">
                <span aria-hidden="true">+</span>
              </div>
              <label>Contrast del codi d’aula
                <select name="classroomCodeStyle">
                  <option value="solid">Blanc sobre negre</option>
                  <option value="outline">Negre sobre blanc amb vora</option>
                </select>
              </label>
              <p class="studio-control-note">El codi es desa automàticament amb els altres ajustos d’aquesta lectura.</p>
            </div>
            ${logoControls('headerLogo', 'Logotip de l’encapçalament')}
          </div>
        </details>
        <details>
          <summary>Peu de pàgina</summary>
          <div class="studio-controls">
            ${check('showOrigin', 'Origen de la fitxa · trama.ortogra.fi')}
            ${check('showLicense', 'Llicència dels textos · CC BY 4.0')}
            ${check('showPage', 'Número de pàgina')}
            ${logoControls('footerLogo', 'Logotip del peu de pàgina')}
          </div>
        </details>
      </form>
    </aside>
    <aside class="studio-settings studio-content" aria-labelledby="studio-content-title">
      <div class="studio-panel-heading">
        <h2 id="studio-content-title">Contingut</h2>
        <label class="studio-solution-toggle"><input id="studio-solution" class="studio-switch" type="checkbox" role="switch" aria-label="Mostra el solucionari"> Solucionari</label>
      </div>
      <form class="studio-form scroll-pane">
        <details class="studio-universes" hidden>
          <summary>Universos</summary>
          <div class="studio-controls" id="studio-universes"></div>
        </details>
        <details open>
          <summary>Preguntes eliminades <span class="studio-detail-count" id="studio-question-count" hidden></span></summary>
          <div class="studio-controls" id="studio-questions"></div>
        </details>
        <details class="studio-evidence-controls">
          <summary>Pistes al text</summary>
          <div class="studio-controls">
            ${check('showEvidence', 'Ressalta els fragments al solucionari')}
            <p>El color i el número relacionen cada fragment amb la seva pregunta. Les marques només surten al solucionari.</p>
            <p class="studio-control-note" id="studio-evidence-empty" hidden>Aquesta lectura no té fragments vinculats.</p>
          </div>
        </details>
        <details>
          <summary>Espai de resposta</summary>
          <div class="studio-controls">
            <fieldset class="studio-answer-styles"><legend>Pauta de resposta</legend>
              ${Object.entries(answerStyleOptions).map(([style, label]) => `<label class="studio-check"><input type="radio" name="answerStyle" value="${style}"> ${label}</label>`).join('')}
            </fieldset>
            <label>Espai per defecte
              <select name="answerLines"><option value="-1">Segons la pregunta</option><option value="0">Cap espai</option>${Array.from({ length: maxAnswerLines }, (_, i) => `<option value="${i + 1}">${i + 1} ${i === 0 ? 'línia' : 'línies'}</option>`).join('')}</select>
            </label>
            ${range('questionGap', 'Espai entre preguntes', 0, 14, 1, 'mm')}
            <p>L’espai indicat se suma a la separació entre paràgrafs.</p>
            ${range('answerGap', 'Alçada de cada línia', 5, 13, 1, 'mm')}
            <div id="studio-answer-weight">${range('answerWeight', 'Gruix de la pauta', .1, .5, .05, 'mm')}</div>
          </div>
        </details>
        <details>
          <summary>Il·lustracions <span class="studio-detail-count" id="studio-image-count"></span></summary>
          <div class="studio-controls">
            ${check('showImages', 'Inclou il·lustracions')}
            <div id="studio-images"></div>
          </div>
        </details>
        <label class="studio-vocabulary-control">
          <span class="studio-vocabulary-copy">
            <span id="studio-vocabulary-label">Notes de vocabulari</span>
            <small id="studio-vocabulary-empty" hidden>Cap nota</small>
          </span>
          <input class="studio-switch" name="showVocabulary" type="checkbox" role="switch" aria-labelledby="studio-vocabulary-label" disabled>
        </label>
      </form>
      <div class="studio-print">
        <p id="studio-layout-feedback" role="status" hidden></p>
        <p id="studio-export-status" role="status" hidden></p>
        <div class="worksheet-print-buttons">
          <button class="button primary" type="button" data-action="print">${icon('printer')} <span>Imprimeix</span></button>
          <button class="button primary menu-trigger" id="studio-print-trigger" type="button" aria-label="Opcions d’impressió i PDF" aria-haspopup="menu" aria-expanded="false" aria-controls="studio-print-menu" popovertarget="studio-print-menu">${icon('chevron-down')}</button>
        </div>
        <div class="select-menu action-menu" id="studio-print-menu" role="menu" aria-labelledby="studio-print-trigger" popover>
          <button type="button" role="menuitem" tabindex="-1" data-option="pdf">Descarrega el PDF</button>
          <button type="button" role="menuitem" tabindex="-1" data-option="print-key">Imprimeix el solucionari</button>
          <button type="button" role="menuitem" tabindex="-1" data-option="print-sheet" hidden>Imprimeix la fitxa</button>
          <button type="button" role="menuitem" tabindex="-1" data-option="pdf-key">Descarrega el solucionari en PDF</button>
        </div>
      </div>
    </aside>
  </div>
  ${templateLibraryMarkup}
  ${familyComparisonMarkup}
  ${readingReportMarkup}`;

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
    <legend></legend>
    <div class="studio-image-title"><img alt="" width="48" height="34"><span></span></div>
    <label class="studio-check"><input type="checkbox" data-image-key="visible"> Mostra-la</label>
    <div class="studio-controls studio-image-options">
      <label class="studio-range"><span>Amplada <output data-image-width></output></span><input type="range" min="20" max="75" data-image-key="width"></label>
      <label>Posició <select data-image-key="position"><option value="left">Esquerra</option><option value="center">Centre</option><option value="right">Dreta</option></select></label>
      <label class="studio-check"><input type="checkbox" data-image-key="wrap"> Text al voltant</label>
    </div>`;
  bindTranslations(card);
  card.querySelector('img').src = image.src;
  card.querySelector('legend').textContent = t('Imatge {number}', { number: index + 1 });
  const caption = card.querySelector('.studio-image-title span');
  caption.textContent = image.alt;
  return card;
}

export function mountStudio({ root, readings, onOpen, onCatalog, onVariant, onFamilyVariant, onUniverse, getNeighbors, onNavigate, onRemove }) {
  root.innerHTML = template;
  const translateMarkup = bindTranslations(root);
  const find = selector => root.querySelector(selector);
  const forms = [...root.querySelectorAll('.studio-form')];
  const licenseControl = find('[name="showLicense"]').closest('label');
  const contentForm = find('.studio-content .studio-form');
  const vocabulary = contentForm.elements.showVocabulary;
  const vocabularyEmpty = find('#studio-vocabulary-empty');
  const pages = find('#studio-pages');
  const stage = find('.studio-paper-stage');
  const preview = mountPreviewZoom(stage, pages, find('.studio-zoom'));
  forms.forEach(form => mountDisclosures(form, { exclusive: true }));
  const main = root.closest('main');
  const layout = find('.studio-layout');
  const printBar = find('.studio-print');
  const content = find('.studio-content');
  const splitView = matchMedia('(min-width: 960px) and (min-height: 480px)');
  function placePrint() {
    const button = document.activeElement;
    (splitView.matches ? content : root).append(printBar);
    if (printBar.contains(button)) button.focus({ preventScroll: true });
  }
  placePrint();
  splitView.addEventListener('change', placePrint);
  const panels = forms.map(form => ({
    form,
    heading: form.previousElementSibling,
    fixedParts: [...form.querySelectorAll('summary, .studio-vocabulary-control')],
    borders: form.querySelectorAll('summary').length,
  }));
  let sidebarFrame = 0;
  const resizeSidebar = new ResizeObserver(() => {
    if (sidebarFrame) return;
    sidebarFrame = requestAnimationFrame(() => {
      sidebarFrame = 0;
      for (const { form, heading, fixedParts, borders } of panels) {
        const fixedHeight = fixedParts.reduce((sum, part) => sum + part.offsetHeight, borders);
        const available = splitView.matches ? form.clientHeight : layout.clientHeight - heading.offsetHeight;
        form.style.setProperty('--studio-panel-height', `${Math.max(64, available - fixedHeight)}px`);
      }
    });
  });
  resizeSidebar.observe(main);
  resizeSidebar.observe(layout);
  for (const { form, heading, fixedParts } of panels) {
    resizeSidebar.observe(form);
    resizeSidebar.observe(heading);
    fixedParts.forEach(part => resizeSidebar.observe(part));
  }
  const variant = find('#studio-variant');
  const legacyFontOption = find('select[name="font"] option[value="mono"]');
  const solution = find('#studio-solution');
  const exportStatus = find('#studio-export-status');
  const printTrigger = find('#studio-print-trigger');
  const printButton = find('[data-action="print"]');
  const layoutFeedback = find('#studio-layout-feedback');
  const printLabel = printButton.querySelector('span');
  const printKeyOption = find('#studio-print-menu [data-option="print-key"]');
  const printSheetOption = find('#studio-print-menu [data-option="print-sheet"]');
  const printMenu = mountActionMenu(printTrigger, find('#studio-print-menu'), exportWorksheet);
  const fileTrigger = find('#studio-reading-trigger');
  const reportTrigger = find('.studio-report-trigger');
  const report = mountReadingReport(find('#reading-report-dialog'));
  const fileStatus = find('#studio-file-status');
  const fileMenu = mountActionMenu(fileTrigger, find('#studio-reading-menu'), manageReading);
  const printOutlet = create('div', 'worksheet-print-outlet');
  document.body.append(printOutlet);

  let reading;
  let readingCollection;
  let neighbors;
  const readingNav = [
    { direction: 'previous', label: 'Lectura anterior', button: find('[data-action="reading-previous"]') },
    { direction: 'next', label: 'Lectura següent', button: find('[data-action="reading-next"]') },
  ];
  let settings;
  let hasSavedLayout = false;
  let layoutError = '';
  let sessionFormat;
  let sessionClassroomCode;
  const resetReadings = new Set();
  const usedFeatures = new Set();
  function trackEdit(bloc, accio = 'ajusta', estat) {
    const key = `${bloc}:${accio}:${estat ?? ''}`;
    if (!bloc || usedFeatures.has(key)) return;
    usedFeatures.add(key);
    trackFeature('personalitza_fitxa', { bloc, accio, ...(typeof estat === 'boolean' ? { estat } : {}) });
  }
  function settingsForReading(entry, collectionId) {
    const defaults = defaultSettings(entry.level);
    return collectionId || resetReadings.has(entry.id) ? defaults : { ...defaults, ...sessionFormat };
  }
  function settingsForVariant(entry) {
    if (entry.id === reading?.id) return worksheetLayout(entry, settings);
    const collectionId = readingCollection?.readingIds.includes(entry.id) ? readingCollection.id : undefined;
    return readWorksheetLayout(entry, collectionId) ?? (collectionId || resetReadings.has(entry.id)
      ? defaultSettings(entry.level) : { ...settingsForReading(entry), ...sessionClassroomCode });
  }
  const outsideCollection = entry => readingCollection && !readingCollection.readingIds.includes(entry.id);
  let requestedFont;
  const comparison = mountFamilyComparison({
    root, readings,
    getSettings: settingsForVariant,
    isOutsideCollection: outsideCollection,
    onOpen: id => onFamilyVariant?.(id),
  });
  const familyStage = mountFamilyStage({
    root, readings, getSettings: settingsForVariant, isOutsideCollection: outsideCollection,
    onSelect: id => onFamilyVariant?.(id),
    onCompare: neighborId => comparison.open(reading, solution.checked, neighborId),
  });
  let pendingPrint;
  let frame = 0;
  let hiddenQuestion;
  const questionFeedback = find('.studio-question-feedback');
  const templateStatus = find('.studio-template-status');
  const templates = mountTemplateLibrary({
    dialog: find('#template-dialog'),
    picker: find('.studio-template-picker'),
    getSettings: () => settings,
    getThumbnail: format => worksheetThumbnail(reading, { ...settings, ...format }),
    onApply(format, name) {
      Object.assign(settings, format);
      if (!readingCollection && Object.keys(format).some(key => formatKeys.has(key))) sessionFormat = pageFormat(settings);
      persistLayout();
      syncControls();
      refresh();
      templateStatus.textContent = t('Plantilla «{name}» aplicada.', { name });
      animateRefresh(pages);
    },
  });

  function populateReading() {
    neighbors = getNeighbors(reading);
    for (const { direction, label, button } of readingNav) {
      const neighbor = neighbors[direction];
      button.disabled = !neighbor;
      button.title = neighbor ? `${t(label)}: ${neighbor.title}` : t(label);
    }
    fileTrigger.hidden = !reading.personal;
    licenseControl.hidden = Boolean(reading.personal);
    reportTrigger.hidden = Boolean(reading.personal);
    const hyphenationAvailable = supportsHyphenation(reading.language);
    find('[name="hyphenate"]').disabled = !hyphenationAvailable;
    find('.studio-hyphenation-note').hidden = hyphenationAvailable;
    find('#studio-title').textContent = reading.title;
    find('#studio-title').lang = reading.language;
    find('#studio-reading-code').textContent = reading.code;
    const collectionLabel = find('#studio-collection-name');
    collectionLabel.hidden = !readingCollection;
    collectionLabel.textContent = readingCollection?.name ?? '';
    const level = labelFor('level', reading.level).replace(/ de (?:primària|primaria)$/, '');
    const count = wordCount(reading);
    const words = t(count === 1 ? '{count} paraula' : '{count} paraules', { count: new Intl.NumberFormat(language()).format(count) });
    const variants = readings.filter(entry => entry.workId && entry.workId === reading.workId);
    const meta = variants.length > 1 ? [level, words] : [labelFor('language', reading.language), level, words];
    find('#studio-meta').textContent = meta.join(' · ');
    variant.replaceChildren(...variants.map(entry => new Option(labelFor('language', entry.language), entry.id)));
    variant.value = reading.id;
    variant.parentElement.hidden = variants.length < 2;
    familyStage.update(reading, solution.checked, { force: true });
    const worlds = (reading.universeIds ?? []).map(id => universeById.get(id)).filter(Boolean);
    find('.studio-universes').hidden = !worlds.length;
    find('#studio-universes').replaceChildren(...worlds.map(world => {
      const section = document.createElement('div');
      const title = document.createElement('strong');
      const description = document.createElement('p');
      const button = document.createElement('button');
      title.textContent = world.name[language()] ?? world.name.ca;
      description.textContent = world.description[language()] ?? world.description.ca;
      button.type = 'button';
      button.className = 'button';
      button.textContent = t('Veure les lectures d’aquest univers');
      button.addEventListener('click', () => onUniverse?.(world.id, reading.language));
      section.className = 'studio-universe';
      section.append(title, description, button);
      return section;
    }));
    find('#studio-images').replaceChildren(...reading.images.map(imageControls));
    for (const caption of find('#studio-images').querySelectorAll('.studio-image-title span')) caption.lang = reading.language;
    contentForm.elements.showImages.disabled = !reading.images.length;
    vocabulary.disabled = !reading.annotations?.some(annotation => annotation.definition);
    vocabularyEmpty.hidden = !vocabulary.disabled;
    if (vocabulary.disabled) vocabulary.setAttribute('aria-describedby', vocabularyEmpty.id);
    else vocabulary.removeAttribute('aria-describedby');
    const hasEvidence = prepareAnswerEvidence(reading, reading.questions).byQuestion.size > 0;
    contentForm.elements.showEvidence.disabled = !hasEvidence;
    find('#studio-evidence-empty').hidden = hasEvidence;
  }

  function syncLayoutStatus() {
    const pending = hasPendingWorksheetLayout(reading, readingCollection?.id);
    const note = layoutError || (pending ? 'No s’han pogut desar els canvis. Es mantindran mentre aquesta pàgina sigui oberta.'
      : hasSavedLayout ? 'Canvis desats en aquest navegador.' : '');
    const message = note ? t(note) : '';
    if (layoutFeedback.textContent !== message) layoutFeedback.textContent = message;
    layoutFeedback.hidden = !note;
    layoutFeedback.classList.toggle('is-error', Boolean(layoutError || pending));
  }

  function persistLayout() {
    saveWorksheetLayout(reading, settings, readingCollection?.id);
    if (!readingCollection) resetReadings.delete(reading.id);
    hasSavedLayout = true;
    layoutError = '';
  }

  function resetStudioLayout() {
    settings = defaultSettings(reading.level);
    hasSavedLayout = false;
    layoutError = '';
    hiddenQuestion = undefined;
    questionFeedback.hidden = true;
    for (const message of root.querySelectorAll('[data-logo-status]')) message.hidden = true;
    templates.resetSelection();
    templateStatus.textContent = '';
    exportStatus.hidden = true;
    syncControls();
    refresh();
  }

  function syncControls(animated = true) {
    syncLayoutStatus();
    printLabel.textContent = t(solution.checked ? 'Imprimeix el solucionari' : 'Imprimeix');
    printKeyOption.hidden = solution.checked;
    printSheetOption.hidden = !solution.checked;
    const numberFormat = new Intl.NumberFormat(language(), { maximumFractionDigits: 2 });
    for (const input of root.querySelectorAll('.studio-form [name]')) {
      const value = input.name === 'leading' ? Math.round(settings.leading * 50) / 100 : settings[input.name];
      if (input.type === 'checkbox') {
        input.checked = value && (!input.disabled || !['hyphenate', 'showVocabulary', 'showEvidence'].includes(input.name));
      }
      else if (input.type === 'radio') input.checked = input.value === value;
      else if (input.value !== String(value)) input.value = value;
      if (input.type === 'range') {
        const formatted = `${numberFormat.format(value)} ${input.dataset.unit}`;
        const output = find(`[data-value="${input.name}"]`);
        if (output) output.value = formatted;
        input.setAttribute('aria-valuetext', formatted);
      }
    }
    setDisclosure(find('.studio-custom'), settings.headerCustom, { animated });
    setDisclosure(find('.studio-classroom-code'), settings.showClassroomCode, { animated });
    setDisclosure(find('#studio-answer-weight'), settings.answerStyle !== 'blank', { animated });
    setDisclosure(find('#studio-images'), settings.showImages, { animated });
    for (const control of root.querySelectorAll('[data-logo-control]')) {
      const source = settings[control.dataset.logoControl];
      const url = logoSource(source);
      const image = control.querySelector('img');
      if (source && image.getAttribute('src') !== url) image.src = url;
      if (!source) image.removeAttribute('src');
      image.alt = source === tramaLogo ? 'trama.' : '';
      control.querySelector('.studio-logo-preview').hidden = !source;
      control.querySelector('[data-logo-choose]').textContent = t(source ? 'Canvia el logotip' : 'Carrega un logotip');
      control.querySelector('[data-logo-default]').hidden = source === tramaLogo;
      control.querySelector('[data-logo-clear]').hidden = !source;
    }
    const removed = reading.questions.flatMap((question, index) => settings.excluded.includes(question.id) ? [{ question, number: index + 1 }] : []);
    const questionCount = find('#studio-question-count');
    questionCount.textContent = numberFormat.format(removed.length);
    questionCount.hidden = !removed.length;
    find('#studio-questions').replaceChildren(...removed.map(({ question, number }) => {
      const row = create('div', 'studio-question-setting');
      const copy = create('div', 'studio-question-copy');
      const prompt = create('span', null, question.prompt);
      prompt.lang = reading.language;
      copy.append(create('small', null, `${number} · ${labelFor('question', question.type)}`), prompt);
      const restore = create('button', 'button studio-question-restore', t('Recupera'));
      restore.type = 'button';
      restore.dataset.action = 'question-restore';
      restore.dataset.questionId = question.id;
      restore.setAttribute('aria-label', t('Recupera la pregunta {number}', { number }));
      row.append(copy, restore);
      return row;
    }));
    const visible = settings.showImages ? reading.images.filter(image => settings.images[image.id]?.visible !== false).length : 0;
    find('#studio-image-count').textContent = `${visible}/${reading.images.length}`;
    const imageRows = find('#studio-images').children;
    reading.images.forEach(({ id }, index) => {
      const card = imageRows[index];
      const config = settings.images[id] ?? defaultImageConfig(reading, index);
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
    });
    legacyFontOption.hidden = settings.font !== 'mono';
    syncSelects(root);
    templates.syncPicker();
  }

  function refresh() {
    const animated = Boolean(frame);
    cancelAnimationFrame(frame);
    frame = 0;
    if (!reading || root.hidden) return;
    familyStage.update(reading, solution.checked);
    const font = settings.font;
    if (font !== requestedFont) {
      requestedFont = font;
      loadWorksheetFont(font)?.then(() => {
        if (settings.font === font) refresh();
      }).catch(() => {
        if (requestedFont === font) requestedFont = undefined;
      });
    }
    const { scrollLeft, scrollTop } = stage;
    renderWorksheet(pages, reading, settings, { answerKey: solution.checked });
    preview.size();
    stage.scrollTo(scrollLeft, scrollTop);
    familyStage.animateCurrent(reading);
    if (animated) animateRefresh(pages);
  }

  function visiblePassage() {
    if (!stage.scrollTop) return null;
    const viewport = stage.getBoundingClientRect();
    for (const paragraph of pages.querySelectorAll('[data-paragraph]')) {
      const { top, bottom } = paragraph.getBoundingClientRect();
      if (bottom > viewport.top && top < viewport.bottom) {
        return { index: paragraph.dataset.paragraph, offset: top - viewport.top };
      }
    }
    return null;
  }

  function select(entry, config, { keepLayout = false, keepSolution = false, saved = null } = {}) {
    const passage = keepLayout && visiblePassage();
    report.close();
    reading = entry;
    usedFeatures.clear();
    settings = config;
    hasSavedLayout = Boolean(saved);
    layoutError = '';
    fileStatus.hidden = true;
    for (const message of root.querySelectorAll('[data-logo-status]')) message.hidden = true;
    if (!keepLayout && !keepSolution) solution.checked = false;
    exportStatus.hidden = true;
    hiddenQuestion = undefined;
    questionFeedback.hidden = true;
    if (!keepLayout) {
      templateStatus.textContent = '';
      templates.resetSelection();
    }
    populateReading();
    syncControls(false);
    onOpen(reading, { keepLayout, saved, collection: Boolean(readingCollection), focusPreview: familyStage.isNavigatingFocused(reading) });
    refresh();
    if (keepLayout) {
      const paragraph = passage && pages.querySelector(`[data-paragraph="${passage.index}"]`);
      if (paragraph) stage.scrollTop += paragraph.getBoundingClientRect().top - stage.getBoundingClientRect().top - passage.offset;
      return;
    }
    layout.scrollTo(0, 0);
    for (const form of forms) {
      form.scrollTop = 0;
      form.querySelectorAll('.details-panel').forEach(panel => { panel.scrollTop = 0; });
    }
    preview.reset();
  }

  function update(event) {
    const input = event.target;
    if (input.readOnly) return;
    const value = input.type === 'checkbox' ? input.checked : input.type === 'range' || input.name === 'answerLines' ? Number(input.value) : input.value;
    if (input.dataset.imageKey) {
      const id = input.closest('[data-image]').dataset.image;
      const index = reading.images.findIndex(image => image.id === id);
      const config = settings.images[id] ?? defaultImageConfig(reading, index);
      if (config[input.dataset.imageKey] === value) return;
      settings.images[id] = { ...config, [input.dataset.imageKey]: value };
    } else if (Object.hasOwn(settings, input.name)) {
      const next = input.name === 'leading' ? Math.round(value * 20) / 10 : value;
      if (settings[input.name] === next || !validSetting(input.name, next)) return;
      settings[input.name] = next;
      if (!readingCollection && formatKeys.has(input.name)) sessionFormat = pageFormat(settings);
      if (!readingCollection && classroomKeys.includes(input.name)) sessionClassroomCode = classroomFormat(settings);
    } else {
      return;
    }
    const bloc = input.dataset.imageKey ? 'imatges' : classroomKeys.includes(input.name) ? 'codi_aula'
      : input.name === 'showVocabulary' ? 'vocabulari' : input.name === 'showEvidence' ? 'pistes' : controlBlocks.get(input.name);
    trackEdit(bloc, 'ajusta', ['showImages', 'showVocabulary', 'showEvidence', 'showClassroomCode'].includes(input.name) ? value : undefined);
    persistLayout();
    templateStatus.textContent = '';
    syncControls();
    if (!frame) frame = requestAnimationFrame(refresh);
  }

  function setQuestionSpace(question, count) {
    if (count === defaultQuestionLines(question, settings)) delete settings.questionLines[question.id];
    else settings.questionLines[question.id] = count;
  }

  function editQuestion(action, button) {
    if (action === 'question-undo' || action === 'question-restore') {
      const id = action === 'question-undo' ? hiddenQuestion : button.dataset.questionId;
      if (!settings.excluded.includes(id)) return;
      const questionList = find('#studio-questions');
      const rowIndex = [...questionList.children].indexOf(button.closest('.studio-question-setting'));
      settings.excluded = settings.excluded.filter(entry => entry !== id);
      trackEdit('preguntes', 'recupera');
      if (id === hiddenQuestion) {
        hiddenQuestion = undefined;
        questionFeedback.hidden = true;
      }
      persistLayout();
      syncControls();
      refresh();
      if (action === 'question-undo') find('#studio-title').focus({ preventScroll: true });
      else {
        const row = questionList.children[Math.min(rowIndex, questionList.children.length - 1)];
        const focus = row?.querySelector('button') ?? questionList.closest('details').querySelector('summary');
        focus.focus({ preventScroll: true });
        if (questionList.children.length) animateRefresh(questionList);
      }
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
      trackEdit('preguntes', 'amaga');
      settings.excluded = [...settings.excluded, question.id];
      hiddenQuestion = question.id;
      questionFeedback.hidden = false;
      animateRefresh(questionFeedback);
    } else {
      trackEdit('resposta', 'linies');
      const count = Math.min(maxAnswerLines, Math.max(0, questionLines(question, settings) + (action === 'question-more' ? 1 : -1)));
      setQuestionSpace(question, count);
    }
    persistLayout();
    templateStatus.textContent = '';
    syncControls();
    refresh();
    if (action === 'question-hide') {
      animateRefresh(find('#studio-questions'));
      questionFeedback.querySelector('button').focus({ preventScroll: true });
      return;
    }
    const current = pages.querySelector(`[data-question-id="${CSS.escape(question.id)}"]`);
    stage.scrollTop += current.getBoundingClientRect().top - top;
    current.querySelector('[data-action="question-tools"]').setAttribute('aria-expanded', 'true');
    const focus = current.querySelector(`[data-action="${action}"]:not(:disabled)`) || current.querySelector('.worksheet-question-actions button:not(:disabled)');
    focus?.focus({ preventScroll: true });
  }

  function printPages(pages) {
    pendingPrint = pages;
    try { window.print(); } finally { pendingPrint = undefined; }
  }

  async function exportWorksheet(action) {
    if (printButton.disabled || root.hidden) return;
    const current = reading;
    const answerKey = action === 'print' ? solution.checked : action.endsWith('-key');
    const documentData = { abast: 'individual', format: action.startsWith('pdf') ? 'pdf' : 'impressio',
      contingut: answerKey ? 'solucionari' : 'alumnat', quantitat: '1', colleccio: Boolean(readingCollection), maquetats: hasSavedLayout };
    const config = {
      ...settings, excluded: [...settings.excluded],
      questionLines: { __proto__: null, ...settings.questionLines },
      images: { __proto__: null, ...settings.images },
    };
    printButton.disabled = printTrigger.disabled = true;
    exportStatus.hidden = true;
    try {
      await loadWorksheetFont(config.font);
      if (reading !== current || root.hidden) return;
      const exportPages = exportWorksheetPages(current, config, answerKey);
      if (action.startsWith('pdf')) {
        const { downloadPdf } = await import('./worksheet-pdf.js');
        const filename = `${current.code}-${current.language.toUpperCase()}${answerKey ? '-' + t('solucionari') : ''}.pdf`;
        await downloadPdf(exportPages, { title: current.title, filename });
        trackReadingFeature('genera_document', current, documentData);
      } else {
        await decodeWorksheetImages(exportPages);
        if (reading === current && !root.hidden) {
          trackReadingFeature('genera_document', current, documentData);
          printPages(exportPages);
        }
      }
    } catch {
      pendingPrint = undefined;
      if (reading === current && !root.hidden) {
        exportStatus.textContent = t('No s’ha pogut preparar el document. Torna-ho a provar.');
        exportStatus.hidden = false;
      }
    } finally {
      printButton.disabled = printTrigger.disabled = false;
    }
  }

  function manageReading(action) {
    const current = reading;
    if (action !== 'remove' || !current?.personal) return;
    fileStatus.hidden = true;
    try {
      if (confirm(t('Vols suprimir aquesta lectura del navegador?'))) onRemove(current);
    } catch {
      if (reading === current && !root.hidden) {
        fileStatus.textContent = t('No s’ha pogut suprimir la lectura.');
        fileStatus.hidden = false;
      }
    }
  }

  for (const control of root.querySelectorAll('[data-logo-control]')) {
    const key = control.dataset.logoControl;
    const input = control.querySelector('[data-logo-file]');
    const choose = control.querySelector('[data-logo-choose]');
    const restore = control.querySelector('[data-logo-default]');
    const message = control.querySelector('[data-logo-status]');
    const remove = control.querySelector('[data-logo-clear]');
    function updateLogo(source) {
      trackEdit(key === 'headerLogo' ? 'encapcalament' : 'peu');
      settings[key] = source;
      if (!readingCollection) sessionFormat = pageFormat(settings);
      persistLayout();
      message.hidden = true;
      templateStatus.textContent = '';
      syncControls();
      refresh();
    }
    choose.addEventListener('click', () => input.click());
    restore.addEventListener('click', () => {
      updateLogo(tramaLogo);
      choose.focus({ preventScroll: true });
    });
    remove.addEventListener('click', () => {
      updateLogo('');
      choose.focus({ preventScroll: true });
    });
    input.addEventListener('change', async () => {
      const file = input.files[0];
      input.value = '';
      if (!file || !settings) return;
      const config = settings;
      const previous = settings[key];
      message.hidden = true;
      choose.disabled = remove.disabled = restore.disabled = true;
      let url;
      try {
        if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) throw new Error();
        url = URL.createObjectURL(file);
        const source = await encodeImage(url, 480);
        if (!validSetting(key, source)) throw new Error();
        if (settings === config && settings[key] === previous) updateLogo(source);
      } catch {
        if (settings === config) {
          message.textContent = t('Tria un logotip PNG, JPEG o WebP de fins a 5 MB.');
          message.hidden = false;
        }
      } finally {
        if (url) URL.revokeObjectURL(url);
        choose.disabled = remove.disabled = restore.disabled = false;
      }
    });
  }

  for (const form of forms) {
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('input', update);
  }
  variant.addEventListener('change', () => onVariant?.(variant.value));
  for (const { direction, button } of readingNav) {
    button.addEventListener('click', () => {
      const neighbor = neighbors[direction];
      if (neighbor) onNavigate(neighbor, direction);
    });
  }
  solution.addEventListener('change', () => {
    trackReadingFeature('canvia_vista', reading, { vista: solution.checked ? 'solucionari' : 'alumnat' });
    syncControls();
    refresh();
    animateRefresh(pages);
  });
  root.addEventListener('click', event => {
    const reference = event.target.closest('[data-evidence-question]');
    if (reference) {
      const target = [...pages.querySelectorAll('mark[data-evidence-questions]')]
        .find(mark => mark.dataset.evidenceQuestions.split(' ').includes(reference.dataset.evidenceQuestion));
      if (target) {
        trackEdit('pistes', 'consulta');
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }
      return;
    }
    const reportButton = event.target.closest('[data-report-part]');
    if (reportButton && reading && !reading.personal) {
      const questions = reading.questions.filter(question => !settings.excluded.includes(question.id));
      report.open(reading, questions, { part: reportButton.dataset.reportPart, element: reportButton.dataset.reportElement });
      return;
    }
    const button = event.target.closest('[data-action]');
    const action = button?.dataset.action;
    if (action?.startsWith('question-')) editQuestion(action, button);
    if (action === 'catalog') onCatalog();
    if (action === 'templates') templates.open();
    if (action === 'reset') {
      if (removeWorksheetLayout(reading, readingCollection?.id)) {
        trackFeature('restableix_maquetat', { abast: 'fitxa' });
        if (!readingCollection) resetReadings.add(reading.id);
        resetStudioLayout();
      } else {
        layoutError = 'No s’han pogut restablir els ajustos d’aquesta lectura.';
        syncLayoutStatus();
      }
    }
    if (action === 'print') exportWorksheet(action);
  });

  window.addEventListener('beforeprint', () => {
    if (!pendingPrint && (root.hidden || !reading)) return;
    if (!pendingPrint) trackReadingFeature('genera_document', reading, { abast: 'individual', format: 'impressio',
      contingut: solution.checked ? 'solucionari' : 'alumnat', quantitat: '1', colleccio: Boolean(readingCollection), maquetats: hasSavedLayout });
    printOutlet.replaceChildren(...(pendingPrint ?? exportWorksheetPages(reading, settings, solution.checked)));
    document.body.dataset.tramaPrint = '';
  });
  window.addEventListener('afterprint', () => {
    delete document.body.dataset.tramaPrint;
    printOutlet.replaceChildren();
  });

  return {
    dismissMenu() { printMenu.close(); fileMenu.close(); },
    exportSettings: settingsForReading,
    previewSettings(entry, collectionId) {
      if (entry.id === reading?.id && collectionId === readingCollection?.id) return worksheetLayout(entry, settings);
      return readWorksheetLayout(entry, collectionId) ?? (collectionId || resetReadings.has(entry.id)
        ? defaultSettings(entry.level) : { ...settingsForReading(entry), ...sessionClassroomCode });
    },
    printPages,
    reloadTemplates() { templates.translate(); },
    resetAllLayouts() {
      if (!clearWorksheetLayouts()) return false;
      sessionFormat = sessionClassroomCode = undefined;
      resetReadings.clear();
      if (reading) resetStudioLayout();
      return true;
    },
    translate() {
      translateMarkup();
      templateStatus.textContent = '';
      exportStatus.hidden = true;
      fileStatus.hidden = true;
      for (const message of root.querySelectorAll('[data-logo-status]')) message.hidden = true;
      templates.translate();
      if (!reading) return;
      populateReading();
      syncControls(false);
      refresh();
    },
    open(id, scope) {
      const entry = readings.find(item => item.id === id);
      if (!entry) return false;
      const keepLayout = !root.hidden && readingCollection?.id === scope?.id && reading?.id !== entry.id && reading?.workId === entry.workId && Boolean(entry.workId);
      readingCollection = scope;
      const saved = readWorksheetLayout(entry, scope?.id);
      const config = saved ?? (scope || resetReadings.has(entry.id) ? defaultSettings(entry.level)
        : { ...(keepLayout ? worksheetLayout(entry, settings) : settingsForReading(entry)), ...sessionClassroomCode });
      select(entry, config, { keepLayout, keepSolution: !root.hidden, saved });
      return true;
    },
    restore(value) {
      const decoded = readCode(value, readings);
      if (!decoded) return false;
      readingCollection = undefined;
      const saved = readWorksheetLayout(decoded.reading);
      select(decoded.reading, saved ?? { ...decoded.settings, ...sessionClassroomCode }, { saved });
      return true;
    },
  };
}
