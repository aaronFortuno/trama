import { defaultSettings, formatVersion, legacyHeader, migrateAnswerFormat, validSetting } from './worksheet-code.js';
import { t } from './i18n.js';

export const templateKey = 'trama.template.v1:';
export const templateOrderKey = 'trama.templates.order.v1';
export const templateGroups = [
  { id: 'text', label: 'Text i tipografia', keys: ['font', 'fontSize', 'leading', 'textAlignment', 'hyphenate', 'paragraphGap', 'sectionGap'], selected: true },
  { id: 'margins', label: 'Marges del full', keys: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft'], selected: true },
  { id: 'answers', label: 'Espai de resposta', keys: ['questionGap', 'answerLines', 'answerGap', 'answerStyle', 'answerWeight'], selected: true },
  { id: 'header', label: 'Encapçalament', keys: ['headerName', 'headerDate', 'headerGroup', 'headerLabel', 'headerCustom', 'headerTitle', 'headerDetail', 'headerLogo'] },
  { id: 'footer', label: 'Peu de pàgina', keys: ['showOrigin', 'showLicense', 'showPage', 'footerLogo'] },
  { id: 'images', label: 'Visibilitat d’il·lustracions', keys: ['showImages'] },
];

const alphabetical = new Intl.Collator('ca', { sensitivity: 'base', numeric: true });
const capture = (group, settings) => Object.fromEntries(group.keys.map(key => [key, settings[key]]));
const defaults = defaultSettings();
const savedDefaults = { ...defaults, headerLogo: '' };
export const defaultTemplate = {
  id: 'standard', name: 'Clàssica', builtin: true,
  format: Object.fromEntries(templateGroups.map(group => [group.id, capture(group, defaults)])),
};

function readTemplate(id, raw) {
  try {
    const data = JSON.parse(raw);
    if (typeof data?.name !== 'string' || !data.name.trim() || data.name.length > 60 || !data.format) return null;
    const stored = data.format;
    if (['standard', 'custom', 'none'].includes(stored.header?.header)) {
      stored.footer ??= { showCode: stored.header.showCode };
      stored.header = { ...legacyHeader(stored.header.header), ...stored.header };
    }
    const format = {};
    for (const group of templateGroups) {
      const saved = stored[group.id];
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) continue;
      const entries = group.keys.map(key => [key, Object.hasOwn(saved, key) ? saved[key] : savedDefaults[key]]);
      if (entries.every(([key, value]) => validSetting(key, value))) format[group.id] = Object.fromEntries(entries);
    }
    if (!data.version && format.answers) {
      format.answers = migrateAnswerFormat(format.answers, format.text?.paragraphGap ?? defaults.paragraphGap);
    }
    return Object.keys(format).length ? { id, name: data.name, format, raw } : null;
  } catch {
    return null;
  }
}

export function listTemplates(storage) {
  const result = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith(templateKey)) continue;
    const entry = readTemplate(key.slice(templateKey.length), storage.getItem(key));
    if (entry) result.push(entry);
  }
  let order;
  try { order = JSON.parse(storage.getItem(templateOrderKey)); } catch { /* Use alphabetical order. */ }
  const ranks = new Map(Array.isArray(order) ? order.map((id, index) => [id, index]) : []);
  const rank = entry => ranks.get(entry.id) ?? Infinity;
  return result.sort((a, b) => rank(a) - rank(b) || alphabetical.compare(a.name, b.name));
}

function checkedKey(storage, previous) {
  const key = templateKey + previous.id;
  if (storage.getItem(key) !== previous.raw) throw new Error(t('Aquesta plantilla ha canviat en una altra pestanya. Torna-la a obrir abans de desar.'));
  return key;
}

export function saveTemplate(storage, { name, groups, settings, previous, recapture }) {
  if (!name || name.length > 60) throw new Error(t('Escriu un nom de fins a 60 caràcters.'));
  const others = listTemplates(storage).filter(entry => entry.id !== previous?.id);
  if (others.some(entry => alphabetical.compare(entry.name, name) === 0)) throw new Error(t('Ja tens una plantilla amb aquest nom.'));
  const format = {};
  for (const group of templateGroups) {
    if (!groups.includes(group.id)) continue;
    const saved = previous?.format[group.id];
    format[group.id] = saved && !recapture ? saved : capture(group, settings);
    if (!Object.entries(format[group.id]).every(([key, value]) => validSetting(key, value))) {
      throw new Error(t('Revisa els ajustos de «{group}» abans de desar.', { group: t(group.label) }));
    }
  }
  if (!Object.keys(format).length) throw new Error(t('Tria almenys un bloc de format.'));
  const key = previous ? checkedKey(storage, previous) : templateKey + crypto.randomUUID();
  storage.setItem(key, JSON.stringify({ version: formatVersion, name, format }));
}

export function moveTemplate(storage, id, offset) {
  const order = listTemplates(storage).map(entry => entry.id);
  const index = order.indexOf(id);
  const destination = index + offset;
  if (index === -1 || destination < 0 || destination >= order.length) return;
  order.splice(index, 1);
  order.splice(destination, 0, id);
  storage.setItem(templateOrderKey, JSON.stringify(order));
}

export function removeTemplate(storage, previous) {
  storage.removeItem(checkedKey(storage, previous));
}

export function templateSettings(entry) {
  return Object.assign({}, ...Object.values(entry.format));
}
