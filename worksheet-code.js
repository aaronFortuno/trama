const prefix = 'TR1';
const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const imageDefaults = Object.freeze({ visible: true, width: 36, position: 'right', wrap: true });
export const marginLimits = Object.freeze({ min: 8, max: 32 });

const numberIn = (min, max, step = 1) => value => Number.isFinite(value)
  && value >= min && value <= max && Math.abs(value / step - Math.round(value / step)) < 0.00001;
const oneOf = (...options) => value => options.includes(value);
const boolean = value => typeof value === 'boolean';
const singleLine = max => value => typeof value === 'string' && value.length <= max && !/[\r\n\u0000-\u001f]/.test(value);
const margin = numberIn(marginLimits.min, marginLimits.max);

const fields = {
  font: ['f', 'serif', oneOf('serif', 'sans', 'mono')],
  fontSize: ['s', 12, numberIn(10, 20)],
  leading: ['l', 1.5, numberIn(1.1, 2.2, 0.1)],
  paragraphGap: ['p', 3, numberIn(0, 12)],
  marginTop: ['mt', 14, margin],
  marginRight: ['mr', 16, margin],
  marginBottom: ['mb', 10, margin],
  marginLeft: ['ml', 16, margin],
  questionGap: ['q', 4, numberIn(0, 14)],
  answerLines: ['a', -1, numberIn(-1, 8)],
  answerGap: ['g', 7, numberIn(5, 13)],
  header: ['h', 'standard', oneOf('standard', 'custom', 'none')],
  headerTitle: ['t', '', singleLine(80)],
  headerDetail: ['d', '', singleLine(100)],
  showImages: ['i', true, boolean],
  showCode: ['c', true, boolean],
};

export function validSetting(key, value) {
  return Object.hasOwn(fields, key) && fields[key][2](value);
}

export function defaultSettings() {
  const settings = Object.fromEntries(Object.entries(fields).map(([key, [, fallback]]) => [key, fallback]));
  return { ...settings, excluded: [], images: Object.create(null) };
}

function pack(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))
    .replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function unpack(value) {
  const bytes = Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), char => char.charCodeAt(0));
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export function makeCode(reading, settings) {
  const payload = {};
  for (const [key, [short, fallback]] of Object.entries(fields)) {
    if (settings[key] !== fallback) payload[short] = settings[key];
  }
  if (settings.excluded.length) payload.x = reading.questions.map(question => question.id).filter(id => settings.excluded.includes(id));
  const images = reading.images.flatMap(({ id }) => {
    const image = settings.images[id];
    if (!image || Object.keys(imageDefaults).every(key => image[key] === imageDefaults[key])) return [];
    return [[id, image.visible, image.width, image.position, image.wrap]];
  });
  if (images.length) payload.m = images;
  const code = `${prefix}.${reading.id}`;
  return Object.keys(payload).length ? `${code}.${pack(payload)}` : code;
}

export function readCode(code, readings) {
  if (typeof code !== 'string' || code.length > 4096) return null;
  const [version, id = '', encoded, ...extra] = code.trim().split('.');
  if (version !== prefix || !stableId.test(id) || extra.length) return null;
  const reading = readings.find(entry => entry.id === id);
  if (!reading) return null;
  const settings = defaultSettings();
  if (encoded === undefined) return { reading, settings };
  if (!/^[a-zA-Z0-9_-]+$/.test(encoded)) return null;

  try {
    const payload = unpack(encoded);
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) return null;
    for (const [key, [short, , valid]] of Object.entries(fields)) {
      if (!Object.hasOwn(payload, short)) continue;
      if (!valid(payload[short])) return null;
      settings[key] = payload[short];
    }
    if (Object.hasOwn(payload, 'x')) {
      if (!Array.isArray(payload.x) || !payload.x.every(id => typeof id === 'string' && stableId.test(id))) return null;
      settings.excluded = reading.questions.map(question => question.id).filter(id => payload.x.includes(id));
    }
    if (Object.hasOwn(payload, 'm')) {
      if (!Array.isArray(payload.m)) return null;
      for (const image of payload.m) {
        if (!Array.isArray(image) || image.length !== 5) return null;
        const [id, visible, width, position, wrap] = image;
        if (typeof id !== 'string' || !stableId.test(id) || !boolean(visible) || !numberIn(20, 75)(width)
          || !oneOf('left', 'center', 'right')(position) || !boolean(wrap)) return null;
        if (reading.images.some(image => image.id === id)) settings.images[id] = { visible, width, position, wrap };
      }
    }
  } catch {
    return null;
  }
  return { reading, settings };
}
