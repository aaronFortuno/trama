import { language, t } from './i18n.js';
import { encodeImage, imageFrom, rasterImagePattern } from './local-images.js';
import { maxAnswerLines } from './worksheet-code.js';

export const readingStorageKey = 'trama.reading.v1:';
const maxFileSize = 2 * 1024 * 1024;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const codePattern = /^[A-Z][A-Z0-9]{0,15}$/;

function requireField(valid, field) {
  if (!valid) throw new Error(t('Revisa el camp «{field}» del fitxer JSON.', { field }));
}

function string(value, field, max, fallback) {
  const text = value ?? fallback;
  requireField(typeof text === 'string' && text.length <= max && (fallback === '' || text.trim()), field);
  return text.trim();
}

function array(value, field, max, min = 0) {
  requireField(Array.isArray(value) && value.length >= min && value.length <= max, field);
  return value;
}

function identifier(value, field, fallback) {
  const id = string(value, field, 80, fallback);
  requireField(idPattern.test(id), field);
  return id;
}

function integer(value, field, max) {
  requireField(Number.isInteger(value) && value >= 0 && value <= max, field);
  return value;
}

function normalize(source) {
  requireField(source && typeof source === 'object' && !Array.isArray(source) && (source.version === undefined || source.version === 1), 'version');
  const language = string(source.language, 'language', 40);
  let tag;
  try { [tag] = Intl.getCanonicalLocales(language); } catch { /* Invalid language tag. */ }
  requireField(tag, 'language');
  const paragraphs = array(source.paragraphs, 'paragraphs', 120, 1)
    .map(text => string(text, 'paragraphs', 6000));
  const questions = array(source.questions ?? [], 'questions', 60).map((question, index) => {
    requireField(question && typeof question === 'object' && !Array.isArray(question), 'questions');
    return {
      id: identifier(question.id, 'questions.id', `pregunta-q${index + 1}`),
      type: identifier(question.type, 'questions.type', 'unspecified'),
      prompt: string(question.prompt, 'questions.prompt', 400),
      answer: string(question.answer, 'questions.answer', 600, ''),
      lines: integer(question.lines ?? 2, 'questions.lines', maxAnswerLines),
    };
  });
  const images = array(source.images ?? [], 'images', 12).map((image, index) => {
    requireField(image && typeof image === 'object' && !Array.isArray(image), 'images');
    requireField(typeof image.src === 'string' && image.src.length <= maxFileSize && rasterImagePattern.test(image.src), 'images.src');
    return {
      id: identifier(image.id, 'images.id', `imatge-${index + 1}`), src: image.src,
      alt: string(image.alt, 'images.alt', 400, ''),
      afterParagraph: integer(image.afterParagraph ?? 1, 'images.afterParagraph', paragraphs.length),
    };
  });
  for (const [field, list] of [['questions.id', questions], ['images.id', images]]) {
    requireField(new Set(list.map(item => item.id)).size === list.length, field);
  }
  const code = string(source.code, 'code', 16, '').toUpperCase();
  requireField(!code || codePattern.test(code), 'code');
  return {
    code, language: tag.toLowerCase(), title: string(source.title, 'title', 160),
    level: identifier(source.level, 'level', 'unspecified'),
    difficulty: identifier(source.difficulty, 'difficulty', 'unspecified'),
    themes: array(source.themes ?? [], 'themes', 12).map(theme => identifier(theme, 'themes')),
    genre: identifier(source.genre, 'genre', 'unspecified'),
    summary: string(source.summary, 'summary', 500, '') || (paragraphs[0].length <= 160 ? paragraphs[0] : `${paragraphs[0].slice(0, 159).trimEnd()}…`),
    paragraphs, questions, images,
  };
}

export function listPersonalReadings(storage) {
  const items = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(readingStorageKey)) continue;
    try {
      const data = JSON.parse(storage.getItem(key));
      const id = key.slice(readingStorageKey.length);
      const reading = normalize(data);
      reading.images.forEach((image, index) => {
        image.width = integer(data.images[index].width, 'images.width', 10000) || 480;
        image.height = integer(data.images[index].height, 'images.height', 10000) || 280;
      });
      items.push({ ...reading, id, personal: true });
    } catch { /* Skip invalid entries. */ }
  }
  return items;
}

export async function importReading(file) {
  if (file.size > maxFileSize) throw new Error(t('El fitxer JSON ha de pesar com a màxim 2 MB.'));
  let data;
  try { data = JSON.parse((await file.text()).replace(/^\uFEFF/, '')); }
  catch { throw new Error(t('El fitxer no conté un JSON vàlid.')); }
  const reading = normalize(data);
  await Promise.all(reading.images.map(async image => {
    try {
      const bitmap = await imageFrom(image.src);
      image.width = bitmap.naturalWidth;
      image.height = bitmap.naturalHeight;
      requireField(image.width <= 10000 && image.height <= 10000, 'images.src');
    } catch { requireField(false, 'images.src'); }
  }));
  const entry = { ...reading, id: `personal-${crypto.randomUUID()}`, personal: true };
  if (new Blob([JSON.stringify(entry)]).size > maxFileSize) throw new Error(t('El fitxer JSON ha de pesar com a màxim 2 MB.'));
  return entry;
}

export function saveReading(storage, reading, publicReadings) {
  const all = [...publicReadings, ...listPersonalReadings(storage)];
  if (!reading.code || all.some(item => item.code === reading.code && item.language === reading.language)) {
    const codes = new Set(all.map(item => item.code));
    let number = 1;
    do { reading.code = `P${String(number++).padStart(3, '0')}`; } while (codes.has(reading.code));
  }
  storage.setItem(readingStorageKey + reading.id, JSON.stringify(reading));
}

export function readingExample() {
  const example = {
    title: t('El riu després de la pluja'),
    language: language(),
    paragraphs: [t('L’endemà de la pluja, l’Aina va trobar branques al camí del riu.')],
    questions: [{
      type: 'literal',
      prompt: t('Què va trobar l’Aina?'),
      answer: t('Va trobar branques al camí.'),
      lines: 2,
    }],
  };
  return JSON.stringify(example, null, 2) + '\n';
}

function downloadJson(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function downloadReadingExample() {
  downloadJson(new Blob([readingExample()], { type: 'application/json' }), `trama-${language()}.json`);
}

export async function downloadReading(reading) {
  const { id, workId, personal, ...data } = reading;
  const images = await Promise.all(data.images.map(async image => ({
    ...image,
    src: rasterImagePattern.test(image.src) ? image.src : await encodeImage(image.src, 1000),
  })));
  const portable = { version: 1, ...data, images };
  let blob = new Blob([JSON.stringify(portable, null, 2) + '\n'], { type: 'application/json' });
  if (blob.size > maxFileSize) blob = new Blob([JSON.stringify(portable)], { type: 'application/json' });
  downloadJson(blob, `${reading.code}-${reading.language.toUpperCase()}.json`);
}
