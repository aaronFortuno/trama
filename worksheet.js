import { imageDefaults, maxAnswerLines, questionLines } from './worksheet-code.js';
import { language, t } from './i18n.js';
import { logoSource, tramaLogo } from './local-images.js';
import { loadWorksheetFont, worksheetFonts } from './worksheet-fonts.js';
import { supportsHyphenation, withHyphenation } from './worksheet-hyphenation.js';

const languageCopy = {
  ca: ['Nom', 'Data', 'Curs', 'Comprensió lectora', 'Preguntes', 'Pàgina', 'Solucionari', 'Resposta orientativa', 'Sense resposta orientativa.', 'Textos de Trama'],
  es: ['Nombre', 'Fecha', 'Curso', 'Comprensión lectora', 'Preguntas', 'Página', 'Solucionario', 'Respuesta orientativa', 'Sin respuesta orientativa.', 'Textos de Trama'],
  en: ['Name', 'Date', 'Class', 'Reading comprehension', 'Questions', 'Page', 'Answer key', 'Suggested answer', 'No suggested answer.', 'Texts by Trama'],
};
const wordsFor = language => languageCopy[language] || languageCopy[language.split('-')[0]] || languageCopy.en;
const textLicense = 'creativecommons.org/licenses/by/4.0';

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function makeLogo(source) {
  const logo = element('img', 'worksheet-logo');
  logo.src = logoSource(source);
  logo.alt = source === tramaLogo ? 'trama.' : '';
  return logo;
}

function makeHeader(reading, settings, [name, date, group, label, , , keyLabel], answerKey = false) {
  const header = element('header', 'worksheet-heading');
  const fields = [settings.headerName && name, settings.headerDate && date, settings.headerGroup && group].filter(Boolean);
  const hasCustom = settings.headerCustom && (settings.headerTitle || settings.headerDetail);
  if (fields.length || hasCustom || settings.headerLogo) {
    const top = element('div', 'worksheet-header');
    if (settings.headerLogo) top.append(makeLogo(settings.headerLogo));
    const details = element('div', 'worksheet-header-details');
    if (hasCustom) {
      if (settings.headerTitle) details.append(element('strong', 'worksheet-custom-title', settings.headerTitle));
      if (settings.headerDetail) details.append(element('p', 'worksheet-custom-detail', settings.headerDetail));
    }
    const row = element('div', 'worksheet-fields');
    for (const field of fields) {
      const item = element('span', 'worksheet-field');
      if (field === name) item.classList.add('worksheet-field-name');
      item.append(element('span', null, field), element('span', 'worksheet-field-line'));
      row.append(item);
    }
    if (fields.length) details.append(row);
    if (details.childElementCount) top.append(details);
    header.append(top);
  }
  if (settings.headerLabel) header.append(element('p', 'worksheet-kind', label));
  if (answerKey) header.append(element('p', 'worksheet-kind worksheet-solution-kind', keyLabel));
  const title = element('h2', 'worksheet-title');
  title.append(element('span', null, reading.title), element('small', 'worksheet-reading-code', reading.code));
  header.append(title);
  return header;
}

function makePassage(text, images, formatText) {
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
  if (text) section.append(element('p', 'worksheet-paragraph', formatText(text)));
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

function makeSolution(text, label) {
  const solution = element('div', 'worksheet-solution');
  if (label) solution.append(element('strong', null, label));
  solution.append(element('p', null, text));
  return solution;
}

function makeQuestion(question, index, settings, heading, words, { answerKey, interactive }) {
  const block = element('div', 'worksheet-question-block');
  block.dataset.questionId = question.id;
  if (heading) {
    block.classList.add('worksheet-questions-start');
    block.append(element('h3', 'worksheet-question-heading', heading));
  }
  const item = element('div', 'worksheet-question');
  const number = element('strong', 'worksheet-number', `${index + 1}.`);
  const main = element('div', 'worksheet-question-body');
  const count = questionLines(question, settings);
  const prompt = element('div', 'worksheet-prompt-wrap');
  prompt.append(element('p', 'worksheet-prompt', question.prompt));
  if (interactive) prompt.append(questionTools(index + 1, count, answerKey));
  main.append(prompt);
  if (answerKey) {
    main.append(makeSolution(question.answer || words[8], question.answer && words[7]));
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
  const font = worksheetFonts[settings.font];
  paper.lang = reading.language;
  paper.dataset.font = settings.font;
  paper.dataset.textAlignment = settings.textAlignment;
  paper.dataset.hyphenation = settings.hyphenate && supportsHyphenation(reading.language);
  paper.style.setProperty('--sheet-font', font.stack);
  if (font.group === 'sans') paper.style.setProperty('--sheet-solution-font', worksheetFonts.serif.stack);
  paper.style.padding = `${settings.marginTop}mm ${settings.marginRight}mm ${settings.marginBottom}mm ${settings.marginLeft}mm`;
  paper.style.setProperty('--sheet-font-size', `${settings.fontSize}pt`);
  paper.style.setProperty('--sheet-leading', settings.leading);
  paper.style.setProperty('--sheet-paragraph-gap', `${settings.paragraphGap}mm`);
  paper.style.setProperty('--sheet-section-gap', `${settings.sectionGap}mm`);
  return paper;
}

function passageText(reading, settings) {
  return settings.hyphenate ? text => withHyphenation(text, reading.language) : text => text;
}

export function worksheetThumbnail(reading, settings) {
  loadWorksheetFont(settings.font)?.catch(() => {});
  const corner = element('div', 'worksheet-thumbnail');
  corner.setAttribute('aria-hidden', 'true');
  const paper = makePaper(reading, settings, 'div');
  const content = element('div', 'worksheet-content');
  content.append(makeHeader(reading, settings, wordsFor(reading.language)),
    makePassage(reading.paragraphs[0], [], passageText(reading, settings)));
  paper.append(content);
  corner.append(paper);
  return corner;
}

export function renderWorksheet(container, reading, settings, { answerKey = false, interactive = true } = {}) {
  const words = wordsFor(reading.language);
  const formatText = passageText(reading, settings);
  const showLicense = settings.showLicense && !reading.personal;
  const pages = [];
  let content;
  let footerHeight;
  container.replaceChildren();

  function fillFooter(footer, label) {
    if (settings.showOrigin || showLicense || settings.footerLogo) {
      const brand = element('div', 'worksheet-footer-brand');
      if (settings.footerLogo) brand.append(makeLogo(settings.footerLogo));
      if (settings.showOrigin) {
        const origin = element('a', 'worksheet-origin', 'trama.ortogra.fi');
        origin.href = 'https://trama.ortogra.fi/';
        brand.append(origin);
      }
      if (showLicense) {
        const credit = element('span', 'worksheet-license', `${words[9]} · `);
        const license = element('a', 'worksheet-origin', `CC BY 4.0 (${textLicense})`);
        license.href = `https://${textLicense}/`;
        credit.append(license);
        brand.append(credit);
      }
      footer.append(brand);
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
    if (pages.length === 0 && (settings.showOrigin || showLicense || settings.showPage || settings.footerLogo || answerKey)) {
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
    if (fitBlock(makePassage(text, images, formatText))) return;
    for (const image of images) placeBlock(makePassage('', [image], formatText));
    if (!text || fitBlock(makePassage(text, [], formatText))) return;

    placeTextChunks(text, part => makePassage(part, [], formatText), /\S{1,80}\s*|\s+/gu);
  }

  function placeTextChunks(text, makeBlock, chunks = /\S{1,24}\s*|\s+/gu) {
    const words = text.match(chunks) || [text];
    let start = 0;
    while (start < words.length) {
      let lower = start + 1;
      let upper = words.length;
      let end = start;
      while (lower <= upper) {
        const middle = Math.floor((lower + upper) / 2);
        const candidate = makeBlock(words.slice(start, middle).join(''), start === 0);
        if (tryBlock(candidate)) {
          candidate.remove();
          end = middle;
          lower = middle + 1;
        } else {
          upper = middle - 1;
        }
      }
      if (end === start && content.childElementCount) {
        startPage();
        continue;
      }
      end = Math.max(start + 1, end);
      content.append(makeBlock(words.slice(start, end).join(''), start === 0));
      start = end;
      if (start < words.length) startPage();
    }
  }

  function placeQuestion(question, index) {
    const block = makeQuestion(question, index, settings, index === 0 ? words[4] : '', words, { answerKey, interactive });
    if (fitBlock(block)) return;

    // Split questions that are taller than a page without changing the chosen font or answer spacing.
    const item = block.querySelector('.worksheet-question');
    const body = item.querySelector('.worksheet-question-body');
    const [prompt, ...response] = [...body.children];
    response.forEach(node => node.remove());
    block.style.paddingBottom = '0';

    function continuation(nodes) {
      const fragment = element('div', 'worksheet-question-continuation');
      const row = item.cloneNode(false);
      const number = item.firstElementChild.cloneNode(true);
      number.setAttribute('aria-hidden', 'true');
      const wrapper = body.cloneNode(false);
      wrapper.append(...nodes);
      row.append(number, wrapper);
      fragment.append(row);
      return fragment;
    }

    if (!tryBlock(block)) {
      placeTextChunks(question.prompt, (text, first) => {
        if (!first) return continuation([element('p', 'worksheet-prompt', text)]);
        prompt.querySelector('.worksheet-prompt').textContent = text;
        return block;
      });
    }
    if (answerKey) {
      placeTextChunks(question.answer || words[8], (text, first) =>
        continuation([makeSolution(text, first && question.answer && words[7])]));
      return;
    }
    let remaining = response;
    while (remaining.length) {
      let count = remaining.length;
      while (count && !tryBlock(continuation(remaining.slice(0, count)))) count--;
      remaining = remaining.slice(count);
      if (remaining.length) startPage();
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
  questions.forEach(placeQuestion);

  pages.forEach((footer, index) => {
    fillFooter(footer, `${words[5]} ${index + 1} / ${pages.length}`);
  });
  return pages.length;
}
