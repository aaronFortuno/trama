import { collectionsKey, listCollections, validCollection, validEntryId } from './collections.js';
import { rasterImagePattern } from './local-images.js';
import { formatVersion, worksheetLayout } from './worksheet-code.js';
import { clearPendingWorksheetLayout, collectionLayoutIds, readWorksheetLayout, writeWorksheetLayout } from './worksheet-layouts.js';
import { listTemplates, readTemplate, templateKey, templateOrderKey } from './worksheet-templates.js';

const backupFormat = 'trama-configuracio';
const logoFields = ['headerLogo', 'footerLogo'];
const maxBytes = 12 * 1024 * 1024;
const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
const uniqueIds = list => list.every(item => validEntryId(item?.id)) && new Set(list.map(item => item.id)).size === list.length;
const invalid = () => new Error('Invalid backup');

function mapLogos(settings, transform) {
  if (!isRecord(settings)) throw invalid();
  const copy = { ...settings };
  for (const field of logoFields) {
    if (Object.hasOwn(copy, field)) copy[field] = transform(copy[field]);
  }
  return copy;
}

function mapTemplateLogos(format, transform) {
  if (!isRecord(format)) throw invalid();
  return Object.fromEntries(Object.entries(format).map(([group, settings]) => [group, mapLogos(settings, transform)]));
}

export function downloadBackup(readings) {
  const images = [];
  const imageRefs = new Map();
  const embed = logo => {
    if (!rasterImagePattern.test(logo)) return logo;
    if (!imageRefs.has(logo)) {
      imageRefs.set(logo, images.length);
      images.push(logo);
    }
    return { image: imageRefs.get(logo) };
  };
  const layouts = readings.flatMap(reading => {
    const layout = readWorksheetLayout(reading);
    return layout ? [{ id: reading.id, settings: mapLogos(layout, embed) }] : [];
  });
  const templates = listTemplates(localStorage).map(({ id, name, format }) => ({ id, name, format: mapTemplateLogos(format, embed) }));
  const collections = listCollections();
  const index = new Map(readings.map(reading => [reading.id, reading]));
  const collectionLayouts = collections.flatMap(({ id: collectionId }) => collectionLayoutIds(collectionId).flatMap(id => {
    const reading = index.get(id);
    const layout = reading && readWorksheetLayout(reading, collectionId);
    return layout ? [{ collectionId, id, settings: mapLogos(layout, embed) }] : [];
  }));
  const backup = { format: backupFormat, version: 1, layouts, collectionLayouts, templates, collections, images };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: 'application/json' }));
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `trama-configuracio-${date}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function prepareBackup(file, readings) {
  if (file.size > maxBytes) throw invalid();
  const data = JSON.parse(await file.text());
  if (data?.format !== backupFormat || data.version !== 1) throw invalid();
  if (!Array.isArray(data.images) || !data.images.every(logo => typeof logo === 'string' && logo.length <= 320000 && rasterImagePattern.test(logo))) throw invalid();
  for (const list of [data.layouts, data.templates, data.collections]) {
    if (!Array.isArray(list) || !uniqueIds(list)) throw invalid();
  }
  const resolve = value => {
    if (typeof value === 'string') return value;
    if (!Number.isSafeInteger(value?.image) || !data.images[value.image]) throw invalid();
    return data.images[value.image];
  };
  const index = new Map(readings.map(reading => [reading.id, reading]));
  function prepareLayouts(entries) { return entries.flatMap(({ id, collectionId, settings }) => {
    const config = mapLogos(settings, resolve);
    const reading = index.get(id);
    return reading ? [{ id, collectionId, settings: worksheetLayout(reading, config) }] : [];
  }); }
  const layouts = prepareLayouts(data.layouts.map(({ id, settings }) => ({ id, settings })));
  const templates = data.templates.map(({ id, name, format }) => {
    if (id === 'standard') throw invalid();
    const entry = readTemplate(id, JSON.stringify({ version: formatVersion, name, format: mapTemplateLogos(format, resolve) }));
    if (!entry) throw invalid();
    return entry;
  });
  if (!data.collections.every(validCollection)) throw invalid();
  const collectionIds = new Set(data.collections.map(({ id }) => id));
  const scoped = data.collectionLayouts ?? [];
  if (!Array.isArray(scoped) || !scoped.every(entry => validEntryId(entry?.id) && collectionIds.has(entry.collectionId))
    || new Set(scoped.map(entry => entry.collectionId + ':' + entry.id)).size !== scoped.length) throw invalid();
  const collectionLayouts = prepareLayouts(scoped);
  return { layouts, collectionLayouts, templates, collections: data.collections.map(({ id, name, readingIds }) => ({ id, name, readingIds })),
    missing: data.layouts.length - layouts.length + scoped.length - collectionLayouts.length };
}

function mergeById(current, imported) {
  const received = new Set(imported.map(entry => entry.id));
  return [...imported, ...current.filter(entry => !received.has(entry.id))];
}

export function restoreBackup(backup) {
  const storage = localStorage;
  const writes = new Map();
  const stage = {
    getItem(key) { return writes.has(key) ? writes.get(key) : storage.getItem(key); },
    setItem(key, value) { writes.set(key, value); },
  };
  const layouts = [...backup.layouts, ...backup.collectionLayouts];
  for (const { id, collectionId, settings } of layouts) writeWorksheetLayout(stage, id, settings, collectionId);
  if (backup.templates.length) {
    const order = mergeById(listTemplates(storage), backup.templates).map(({ id }) => id);
    for (const { id, raw } of backup.templates) stage.setItem(templateKey + id, raw);
    stage.setItem(templateOrderKey, JSON.stringify(order));
  }
  if (backup.collections.length) stage.setItem(collectionsKey, JSON.stringify(mergeById(listCollections(), backup.collections)));
  const previous = new Map();
  try {
    for (const [key, value] of writes) {
      const old = storage.getItem(key);
      if (old === value) continue;
      storage.setItem(key, value);
      previous.set(key, old);
    }
  } catch (error) {
    for (const key of previous.keys()) storage.removeItem(key);
    for (const [key, old] of previous) if (old !== null) storage.setItem(key, old);
    throw error;
  }
  for (const { id, collectionId } of layouts) clearPendingWorksheetLayout(id, collectionId);
}
