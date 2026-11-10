import { imageDefaults } from './worksheet-code.js';

const languageCopy = {
  ca: ['Nom', 'Data', 'Curs', 'Comprensió lectora', 'Preguntes', 'Codi de la fitxa', 'Pàgina'],
  es: ['Nombre', 'Fecha', 'Curso', 'Comprensión lectora', 'Preguntas', 'Código de la ficha', 'Página'],
  en: ['Name', 'Date', 'Class', 'Reading comprehension', 'Questions', 'Worksheet code', 'Page'],
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function makeHeader(reading, settings, [name, date, group, label]) {
  const header = element('header', 'worksheet-heading');
  if (settings.header !== 'none') {
    const top = element('div', 'worksheet-header');
    if (settings.header === 'custom') {
      if (settings.headerTitle) top.append(element('strong', 'worksheet-custom-title', settings.headerTitle));
      if (settings.headerDetail) top.append(element('p', 'worksheet-custom-detail', settings.headerDetail));
    }
    const fields = element('div', 'worksheet-fields');
    for (const field of [name, date, group]) {
      const item = element('span', 'worksheet-field');
      item.append(element('span', null, field), element('span', 'worksheet-field-line'));
      fields.append(item);
    }
    top.append(fields);
    header.append(top);
  }
  header.append(element('p', 'worksheet-kind', label), element('h2', 'worksheet-title', reading.title));
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

function makeQuestion(question, index, settings, heading) {
  const block = element('div', 'worksheet-question-block');
  if (heading) block.append(element('h3', 'worksheet-question-heading', heading));
  const item = element('div', 'worksheet-question');
  const number = element('strong', 'worksheet-number', `${index + 1}.`);
  const main = element('div', 'worksheet-question-body');
  main.append(element('p', 'worksheet-prompt', question.prompt));
  const count = settings.answerLines === -1 ? question.lines : settings.answerLines;
  for (let index = 0; index < count; index++) {
    const line = element('div', 'worksheet-answer-line');
    line.setAttribute('aria-hidden', 'true');
    main.append(line);
  }
  item.append(number, main);
  block.append(item);
  return block;
}

export function renderWorksheet(container, reading, settings, code) {
  const words = languageCopy[reading.language] || languageCopy[reading.language.split('-')[0]] || languageCopy.en;
  const pages = [];
  let content;
  container.replaceChildren();

  function startPage() {
    const slot = element('div', 'worksheet-slot');
    const paper = element('article', 'worksheet-page');
    paper.lang = reading.language;
    paper.dataset.font = settings.font;
    paper.style.setProperty('--sheet-font-size', `${settings.fontSize}pt`);
    paper.style.setProperty('--sheet-leading', settings.leading);
    paper.style.setProperty('--sheet-paragraph-gap', `${settings.paragraphGap}mm`);
    paper.style.setProperty('--sheet-question-gap', `${settings.questionGap}mm`);
    paper.style.setProperty('--sheet-answer-gap', `${settings.answerGap}mm`);
    content = element('div', 'worksheet-content');
    const footer = element('footer', 'worksheet-footer');
    paper.append(content, footer);
    slot.append(paper);
    container.append(slot);
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
  placeBlock(makeHeader(reading, settings, words));
  reading.paragraphs.forEach((text, index) => placePassage(text, anchors.get(index) || []));
  const closing = anchors.get(reading.paragraphs.length);
  if (closing) placePassage('', closing);
  const questions = reading.questions.filter(question => !settings.excluded.includes(question.id));
  questions.forEach((question, index) => placeBlock(makeQuestion(question, index, settings, index === 0 ? words[4] : '')));

  pages.forEach((footer, index) => {
    const pageNumber = element('span', 'worksheet-page-number', `${words[6]} ${index + 1} / ${pages.length}`);
    footer.append(pageNumber);
    if (settings.showCode && index === pages.length - 1) {
      const line = element('div', 'worksheet-code');
      line.append(element('span', null, words[5]), element('code', null, code));
      footer.append(line);
    }
  });
  return pages.length;
}
