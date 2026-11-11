const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const imageDefaults = Object.freeze({ visible: true, width: 36, position: 'right', wrap: true });
export const marginLimits = Object.freeze({ min: 8, max: 32 });
export const maxAnswerLines = 8;
export const answerStyles = Object.freeze({ blank: 'BLANC', lines: 'LINIES', dots: 'PUNTS', grid: 'QUADRICULA' });
export const formatVersion = 2;
const legacyAnswerDefaults = { questionGap: 4, answerGap: 7, answerWeight: .2 };

const numberIn = (min, max, step = 1) => value => Number.isFinite(value) && value >= min && value <= max
  && Math.abs(value / step - Math.round(value / step)) < .00001;
const oneOf = (...options) => value => options.includes(value);
const boolean = value => typeof value === 'boolean';
const singleLine = max => value => typeof value === 'string' && value.length <= max && !/[\r\n\u0000-\u001f]/.test(value);
const margin = numberIn(marginLimits.min, marginLimits.max);
const lineCount = numberIn(0, maxAnswerLines);
const imageWidth = numberIn(20, 75);
const fonts = { serif: 'GEORGIA', sans: 'ARIAL', mono: 'COURIER' };
const positions = { left: 'ESQUERRA', center: 'CENTRE', right: 'DRETA' };

const fields = {
  font: ['serif', oneOf(...Object.keys(fonts))],
  fontSize: [12, numberIn(10, 20)],
  leading: [2, numberIn(1, 6, .1)],
  paragraphGap: [3, numberIn(0, 12)],
  marginTop: [16, margin],
  marginRight: [20, margin],
  marginBottom: [16, margin],
  marginLeft: [20, margin],
  questionGap: [2, numberIn(0, 14)],
  answerLines: [-1, numberIn(-1, maxAnswerLines)],
  answerGap: [10, numberIn(5, 13)],
  answerStyle: ['lines', oneOf(...Object.keys(answerStyles))],
  answerWeight: [.15, numberIn(.1, .5, .05)],
  headerName: [true, boolean],
  headerDate: [true, boolean],
  headerGroup: [true, boolean],
  headerLabel: [true, boolean],
  headerCustom: [false, boolean],
  headerTitle: ['', singleLine(80)],
  headerDetail: ['', singleLine(100)],
  showImages: [true, boolean],
  showCode: [true, boolean],
  showOrigin: [true, boolean],
  showPage: [true, boolean],
};

const marginKeys = ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'];
// Shared links created before the margin change omit these values.
const sharedMarginDefaults = { marginTop: 14, marginRight: 16, marginBottom: 10, marginLeft: 16 };
const headerFlags = { headerName: 'NOM', headerDate: 'DATA', headerGroup: 'CURS', headerLabel: 'ETIQUETA', headerCustom: 'TEXT' };
const footerFlags = { showCode: 'CODI', showOrigin: 'ORIGEN', showPage: 'PAGINA' };
const legacyKeys = {
  f: 'font', s: 'fontSize', l: 'leading', p: 'paragraphGap', mt: 'marginTop', mr: 'marginRight',
  mb: 'marginBottom', ml: 'marginLeft', q: 'questionGap', a: 'answerLines', g: 'answerGap',
  t: 'headerTitle', d: 'headerDetail', i: 'showImages', c: 'showCode',
};

export function validSetting(key, value) {
  return Object.hasOwn(fields, key) && fields[key][1](value);
}

export function defaultSettings() {
  const settings = Object.fromEntries(Object.entries(fields).map(([key, [fallback]]) => [key, fallback]));
  return { ...settings, excluded: [], questionLines: Object.create(null), images: Object.create(null) };
}

export function migrateAnswerFormat(answers, paragraphGap) {
  return { ...answers, questionGap: Math.max(0, answers.questionGap - paragraphGap) };
}

export function legacyHeader(mode) {
  const studentFields = mode !== 'none';
  return { headerName: studentFields, headerDate: studentFields, headerGroup: studentFields, headerLabel: true, headerCustom: mode === 'custom' };
}

export function defaultQuestionLines(question, settings) {
  return settings.answerLines === -1 ? question.lines : settings.answerLines;
}

export function questionLines(question, settings) {
  return settings.questionLines[question.id] ?? defaultQuestionLines(question, settings);
}

const upper = value => value.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase();
const numeric = value => /^-?\d+(?:[.,]\d+)?$/.test(value) ? Number(value.replace(',', '.')) : NaN;
const quotedText = value => JSON.parse(value.replace(/\r\n?|\n/g, ' '));
const enumValue = (values, value) => Object.keys(values).find(key => values[key] === upper(value));
const questionCode = question => question.id.match(/-q(\d+)$/)?.[1] ?? question.id;
const baseCode = reading => `${reading.code}-${reading.language.toUpperCase()}`;
const oneZero = value => value === 'SI' ? true : value === 'NO' ? false : undefined;

const scalarCodes = [
  ['TIP', 'font', value => fonts[value], value => enumValue(fonts, value)],
  ['COS', 'fontSize'],
  ['INT', 'leading', value => Math.round(value * 50) / 100, value => numeric(value.replace(/[x×]$/i, '')) * 2],
  ['PAR', 'paragraphGap'],
  ['SEP', 'questionGap'],
  ['LIN', 'answerLines', value => value < 0 ? 'AUTO' : value, value => upper(value) === 'AUTO' ? -1 : numeric(value)],
  ['PAUTA', 'answerStyle', value => answerStyles[value], value => enumValue(answerStyles, value)],
  ['PAS', 'answerGap'],
  ['GRUIX', 'answerWeight'],
  ['TITOL', 'headerTitle', JSON.stringify, quotedText],
  ['DETALL', 'headerDetail', JSON.stringify, quotedText],
  ['IMG', 'showImages', value => value ? 'SI' : 'NO', value => oneZero(upper(value))],
];

export function makeCode(reading, settings) {
  const excluded = reading.questions.filter(question => settings.excluded.includes(question.id)).map(questionCode);
  return excluded.length ? `${baseCode(reading)}-X${excluded.join('.')}` : baseCode(reading);
}

export function makeLinkCode(reading, settings) {
  const tokens = [makeCode(reading, settings), `V=${formatVersion}`];
  const changed = key => settings[key] !== fields[key][0];
  for (const [label, key, encode = String] of scalarCodes) {
    if (changed(key)) tokens.push(`${label}=${encode(settings[key])}`);
  }
  if (marginKeys.some(key => settings[key] !== sharedMarginDefaults[key])) {
    tokens.push(`MARGES=${marginKeys.map(key => settings[key]).join('/')}`);
  }
  for (const [name, flags] of [['CAP', headerFlags], ['PEU', footerFlags]]) {
    if (Object.keys(flags).some(changed)) {
      const enabled = Object.keys(flags).filter(key => settings[key]).map(key => flags[key]);
      tokens.push(`${name}=${enabled.join(',') || 'NO'}`);
    }
  }
  const lines = reading.questions.filter(question => Object.hasOwn(settings.questionLines, question.id))
    .map(question => `${questionCode(question)}:${settings.questionLines[question.id]}`);
  if (lines.length) tokens.push(`RES=${lines.join(',')}`);
  for (const { id } of reading.images) {
    const image = settings.images[id];
    if (image && Object.keys(imageDefaults).some(key => image[key] !== imageDefaults[key])) {
      tokens.push(`I-${id.toUpperCase()}=${image.visible ? '' : 'NO/'}${positions[image.position]}/${image.width}/${image.wrap ? 'TEXT' : 'BLOC'}`);
    }
  }
  return tokens.join(' ');
}

function applyFlags(settings, flags, raw) {
  const values = raw === 'NO' ? [] : raw.split(',');
  if (values.some(value => !Object.values(flags).includes(value))) return false;
  for (const [key, label] of Object.entries(flags)) settings[key] = values.includes(label);
  return true;
}

function parseImage(raw) {
  const parts = raw.split('/');
  const visible = parts[0] !== 'NO';
  if (!visible) parts.shift();
  const [placement, size, flow] = parts;
  const position = placement && enumValue(positions, placement);
  const width = numeric(size ?? '');
  if (parts.length !== 3 || !position || !imageWidth(width) || !['TEXT', 'BLOC'].includes(flow)) return null;
  return { visible, width, position, wrap: flow === 'TEXT' };
}

function readReadable(code, readings) {
  const pieces = code.match(/(?:[^\s"]+|"(?:[^"\\]|\\.)*")+/gu);
  if (!pieces?.length || code.replace(/(?:[^\s"]+|"(?:[^"\\]|\\.)*")+/gu, '').trim()) return null;
  const [reference, ...tokens] = pieces;
  const identifier = reference.toUpperCase();
  const reading = readings.find(entry => baseCode(entry) === identifier)
    ?? readings.filter(entry => identifier.startsWith(`${baseCode(entry)}-X`))
      .sort((a, b) => b.language.length - a.language.length)[0];
  if (!reading) return null;
  const settings = Object.assign(defaultSettings(), sharedMarginDefaults);
  const versionToken = tokens[0]?.toUpperCase();
  const legacyFormat = tokens.length > 0 && versionToken !== `V=${formatVersion}`;
  if (versionToken === `V=${formatVersion}`) tokens.shift();
  if (legacyFormat) Object.assign(settings, legacyAnswerDefaults);
  const questionIds = new Map(reading.questions.map(question => [upper(questionCode(question)), question.id]));
  const suffix = identifier.slice(baseCode(reading).length);
  if (suffix) {
    const excluded = suffix.slice(2).split('.').map(value => questionIds.get(value));
    if (excluded.some(id => !id)) return null;
    settings.excluded = [...new Set(excluded)];
  }
  const scalars = new Map(scalarCodes.map(([label, key, , decode = numeric]) => [label, [key, decode]]));
  const used = new Set();
  for (const token of tokens) {
    const match = /^([A-Z][A-Z0-9-]*)=(.+)$/isu.exec(token);
    if (!match) return null;
    const label = upper(match[1]);
    const raw = match[2];
    if (used.has(label)) return null;
    used.add(label);
    if (scalars.has(label)) {
      const [key, decode] = scalars.get(label);
      const value = decode(raw);
      if (!validSetting(key, value)) return null;
      settings[key] = value;
    } else if (label === 'MARGES') {
      const margins = raw.split('/').map(numeric);
      if (margins.length !== 4 || !margins.every(margin)) return null;
      marginKeys.forEach((key, index) => { settings[key] = margins[index]; });
    } else if (label === 'CAP' || label === 'PEU') {
      if (!applyFlags(settings, label === 'CAP' ? headerFlags : footerFlags, upper(raw))) return null;
    } else if (label === 'AMAGA' || label === 'RES') {
      for (const entry of upper(raw).split(',')) {
        const [reference, value, extra] = entry.split(':');
        const id = questionIds.get(reference);
        if (!id || extra !== undefined) return null;
        if (label === 'AMAGA') {
          if (value !== undefined) return null;
          if (!settings.excluded.includes(id)) settings.excluded.push(id);
        } else {
          const count = numeric(value ?? '');
          if (!lineCount(count)) return null;
          settings.questionLines[id] = count;
        }
      }
    } else if (label.startsWith('I-')) {
      const id = reading.images.find(image => image.id.toUpperCase() === label.slice(2))?.id;
      const image = parseImage(upper(raw));
      if (!id || !image) return null;
      settings.images[id] = image;
    } else return null;
  }
  return { reading, settings: legacyFormat ? migrateAnswerFormat(settings, settings.paragraphGap) : settings };
}

function readLegacy(code, readings) {
  const [version, id = '', encoded, ...extra] = code.split('.');
  if (version !== 'TR1' || !stableId.test(id) || extra.length) return null;
  const reading = readings.find(entry => entry.id === id);
  if (!reading) return null;
  const settings = defaultSettings();
  Object.assign(settings, sharedMarginDefaults, legacyAnswerDefaults);
  settings.leading = 1.5;
  if (encoded === undefined) return { reading, settings: migrateAnswerFormat(settings, settings.paragraphGap) };
  if (!/^[a-zA-Z0-9_-]+$/.test(encoded)) return null;
  const bytes = Uint8Array.from(atob(encoded.replaceAll('-', '+').replaceAll('_', '/')), char => char.charCodeAt(0));
  const payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  for (const [short, key] of Object.entries(legacyKeys)) {
    if (!Object.hasOwn(payload, short)) continue;
    if (!validSetting(key, payload[short])) return null;
    settings[key] = payload[short];
  }
  if (Object.hasOwn(payload, 'h')) {
    if (!['standard', 'custom', 'none'].includes(payload.h)) return null;
    Object.assign(settings, legacyHeader(payload.h));
  }
  if (Object.hasOwn(payload, 'x')) {
    if (!Array.isArray(payload.x) || !payload.x.every(id => typeof id === 'string' && stableId.test(id))) return null;
    settings.excluded = reading.questions.map(question => question.id).filter(id => payload.x.includes(id));
  }
  if (Object.hasOwn(payload, 'm')) {
    if (!Array.isArray(payload.m)) return null;
    for (const entry of payload.m) {
      if (!Array.isArray(entry) || entry.length !== 5) return null;
      const [id, visible, width, position, wrap] = entry;
      if (typeof id !== 'string' || !stableId.test(id) || !boolean(visible) || !imageWidth(width)
        || !Object.hasOwn(positions, position) || !boolean(wrap)) return null;
      if (reading.images.some(image => image.id === id)) settings.images[id] = { visible, width, position, wrap };
    }
  }
  return { reading, settings: migrateAnswerFormat(settings, settings.paragraphGap) };
}

export function readCode(code, readings) {
  if (typeof code !== 'string' || code.length > 4096) return null;
  const value = code.trim();
  try {
    return value.startsWith('TR1.') ? readLegacy(value, readings) : readReadable(value, readings);
  } catch {
    return null;
  }
}
