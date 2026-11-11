import { imageDefaults, maxAnswerLines, questionLines } from './worksheet-code.js';
import { language, t } from './i18n.js';

const languageCopy = {
  ca: ['Nom', 'Data', 'Curs', 'Comprensió lectora', 'Preguntes', 'Pàgina', 'Solucionari', 'Resposta orientativa', 'Sense resposta orientativa.'],
  es: ['Nombre', 'Fecha', 'Curso', 'Comprensión lectora', 'Preguntas', 'Página', 'Solucionario', 'Respuesta orientativa', 'Sin respuesta orientativa.'],
  en: ['Name', 'Date', 'Class', 'Reading comprehension', 'Questions', 'Page', 'Answer key', 'Suggested answer', 'No suggested answer.'],
};
const wordsFor = language => languageCopy[language] || languageCopy[language.split('-')[0]] || languageCopy.en;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function makeHeader(reading, settings, [name, date, group, label, , , keyLabel], answerKey = false) {
  const header = element('header', 'worksheet-heading');
  const fields = [settings.headerName && name, settings.headerDate && date, settings.headerGroup && group].filter(Boolean);
  const hasCustom = settings.headerCustom && (settings.headerTitle || settings.headerDetail);
  if (fields.length || hasCustom) {
    const top = element('div', 'worksheet-header');
    if (hasCustom) {
      if (settings.headerTitle) top.append(element('strong', 'worksheet-custom-title', settings.headerTitle));
      if (settings.headerDetail) top.append(element('p', 'worksheet-custom-detail', settings.headerDetail));
    }
    const row = element('div', 'worksheet-fields');
    for (const field of fields) {
      const item = element('span', 'worksheet-field');
      if (field === name) item.classList.add('worksheet-field-name');
      item.append(element('span', null, field), element('span', 'worksheet-field-line'));
      row.append(item);
    }
    if (fields.length) top.append(row);
    header.append(top);
  }
  if (settings.headerLabel) header.append(element('p', 'worksheet-kind', label));
  if (answerKey) header.append(element('p', 'worksheet-kind worksheet-solution-kind', keyLabel));
  const title = element('h2', 'worksheet-title');
  title.append(element('span', null, reading.title), element('small', 'worksheet-reading-code', reading.code));
  header.append(title);
  return header;
}

function makePassage(text, images) {
  const section = element('div', 'worksheet-passage');
  for (const { image, config } of images) {
    const figure = element('figure', 'worksheet-figure');
    figure.dataset.position = config.position;
    figure.dataset.wrap = config.wrap && Boolean(text) && images.length === 1 && config.position !== 'center';
    figure.style.width = `${config.width}%`;
    const img = element('img');
    img.src = image.src;
    img.alt = image.alt;
    img.width = image.width || 480;
    img.height = image.height || 280;
    figure.append(img);
    section.append(figure);
  }
  if (text) section.append(element('p', 'worksheet-paragraph', text));
  return section;
}

function questionTools(number, count, answerKey) {
  const tools = element('div', 'worksheet-question-tools');
  tools.lang = language();
  const button = (action, symbol, label) => {
    const control = element('button', 'worksheet-question-tool', symbol);
    control.type = 'button';
    control.dataset.action = action;
    control.setAttribute('aria-label', label);
    control.title = label;
    return control;
  };
  const toggle = button('question-tools', '⋯', t('Opcions de la pregunta {number}', { number }));
  toggle.setAttribute('aria-expanded', 'false');
  const actions = element('div', 'worksheet-question-actions');
  if (!answerKey) {
    const less = button('question-less', '−', t('Redueix l’espai de resposta de la pregunta {number}', { number }));
    const more = button('question-more', '+', t('Amplia l’espai de resposta de la pregunta {number}', { number }));
    less.disabled = count === 0;
    more.disabled = count >= maxAnswerLines;
    actions.append(less, element('span', 'worksheet-question-units', String(count)), more);
  }
  actions.append(button('question-hide', '×', t('Amaga la pregunta {number}', { number })));
  tools.append(toggle, actions);
  return tools;
}

function makeQuestion(question, index, settings, heading, words, { answerKey, interactive }) {
  const block = element('div', 'worksheet-question-block');
  block.dataset.questionId = question.id;
  if (heading) block.append(element('h3', 'worksheet-question-heading', heading));
  const item = element('div', 'worksheet-question');
  const number = element('strong', 'worksheet-number', `${index + 1}.`);
  const main = element('div', 'worksheet-question-body');
  const count = questionLines(question, settings);
  const prompt = element('div', 'worksheet-prompt-wrap');
  prompt.append(element('p', 'worksheet-prompt', question.prompt));
  if (interactive) prompt.append(questionTools(index + 1, count, answerKey));
  main.append(prompt);
  if (answerKey) {
    const solution = element('div', 'worksheet-solution');
    if (question.answer) solution.append(element('strong', null, words[7]));
    solution.append(element('p', null, question.answer || words[8]));
    main.append(solution);
  } else {
    for (let index = 0; index < count; index++) {
      const line = element('div', 'worksheet-answer-line');
      line.setAttribute('aria-hidden', 'true');
      main.append(line);
    }
  }
  item.append(number, main);
  block.append(item);
  return block;
}

function makePaper(reading, settings, tag) {
  const paper = element(tag, 'worksheet-page');
  paper.lang = reading.language;
  paper.dataset.font = settings.font;
  paper.style.padding = `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`;
  paper.style.setProperty('--sheet-font-size', `${settings.fontSize}pt`);
  paper.style.setProperty('--sheet-leading', settings.leading);
  paper.style.setProperty('--sheet-paragraph-gap', `${settings.paragraphGap}mm`);
  return paper;
}

export function worksheetThumbnail(reading, settings) {
  const corner = element('div', 'worksheet-thumbnail');
  corner.setAttribute('aria-hidden', 'true');
  const paper = makePaper(reading, settings, 'div');
  const content = element('div', 'worksheet-content');
  content.append(makeHeader(reading, settings, wordsFor(reading.language)), makePassage(reading.paragraphs[0], []));
  paper.append(content);
  corner.append(paper);
  return corner;
}

export function renderWorksheet(container, reading, settings, { answerKey = false, interactive = true } = {}) {
  const words = wordsFor(reading.language);
  const pages = [];
  let content;
  let footerHeight;
  container.replaceChildren();

  function fillFooter(footer, label) {
    if (settings.showOrigin) {
      const origin = element('a', 'worksheet-origin', 'trama.ortogra.fi');
      origin.href = 'https://trama.ortogra.fi/';
      footer.append(origin);
    }
    if (settings.showPage || answerKey) {
      const note = [answerKey && words[6], settings.showPage && label].filter(Boolean).join(' · ');
      footer.append(element('span', 'worksheet-page-number', note));
    }
  }

  function startPage() {
    const slot = element('div', 'worksheet-slot');
    const paper = makePaper(reading, settings, 'article');
    paper.dataset.answerStyle = settings.answerStyle;
    paper.style.setProperty('--sheet-question-gap', `${settings.paragraphGap + settings.questionGap}mm`);
    paper.style.setProperty('--sheet-answer-gap', `${settings.answerGap}mm`);
    paper.style.setProperty('--sheet-answer-weight', `${settings.answerWeight}mm`);
    content = element('div', 'worksheet-content');
    const footer = element('footer', 'worksheet-footer');
    paper.append(content, footer);
    slot.append(paper);
    container.append(slot);
    if (pages.length === 0 && (settings.showOrigin || settings.showPage || answerKey)) {
      fillFooter(footer, `${words[5]} 999 / 999`);
      footerHeight = footer.scrollHeight + 1;
      footer.replaceChildren();
    }
    if (footerHeight) paper.style.setProperty('--sheet-footer-height', `${footerHeight}px`);
    pages.push(footer);
  }

  function tryBlock(block) {
    content.append(block);
    if (content.scrollHeight <= content.clientHeight) return true;
    block.remove();
    return false;
  }

  function fitBlock(block) {
    if (tryBlock(block)) return true;
    if (!content.childElementCount) return false;
    startPage();
    return tryBlock(block);
  }

  function placeBlock(block) {
    if (!fitBlock(block)) content.append(block);
  }

  function placePassage(text, images) {
    if (fitBlock(makePassage(text, images))) return;
    for (const image of images) placeBlock(makePassage('', [image]));
    if (!text || fitBlock(makePassage(text, []))) return;

    // Very long paragraphs can fill more than one page at large print sizes.
    const words = text.match(/\S+\s*/gu) || [text];
    let start = 0;
    while (start < words.length) {
      let lower = start + 1;
      let upper = words.length;
      let end = start + 1;
      while (lower <= upper) {
        const middle = Math.floor((lower + upper) / 2);
        const candidate = makePassage(words.slice(start, middle).join(''), []);
        if (tryBlock(candidate)) {
          candidate.remove();
          end = middle;
          lower = middle + 1;
        } else {
          upper = middle - 1;
        }
      }
      content.append(makePassage(words.slice(start, end).join(''), []));
      start = end;
      if (start < words.length) startPage();
    }
  }

  const anchors = new Map();
  if (settings.showImages) {
    for (const image of reading.images) {
      const config = settings.images[image.id] || imageDefaults;
      if (!config.visible) continue;
      const group = anchors.get(image.afterParagraph) || [];
      group.push({ image, config });
      anchors.set(image.afterParagraph, group);
    }
  }

  startPage();
  placeBlock(makeHeader(reading, settings, words, answerKey));
  reading.paragraphs.forEach((text, index) => placePassage(text, anchors.get(index) || []));
  const closing = anchors.get(reading.paragraphs.length);
  if (closing) placePassage('', closing);
  const questions = reading.questions.filter(question => !settings.excluded.includes(question.id));
  questions.forEach((question, index) => placeBlock(makeQuestion(question, index, settings, index === 0 ? words[4] : '', words, { answerKey, interactive })));

  pages.forEach((footer, index) => {
    fillFooter(footer, `${words[5]} ${index + 1} / ${pages.length}`);
  });
  return pages.length;
}
