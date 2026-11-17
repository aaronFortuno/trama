import { t } from './i18n.js';
import { clearCollectionLayouts, readWorksheetLayout, removeWorksheetLayout, writeWorksheetLayout } from './worksheet-layouts.js';

export const collectionsKey = 'trama.collections.v1';
export const validEntryId = id => typeof id === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && id.length <= 160;

export function validCollection(entry) {
  return entry && validEntryId(entry.id) && typeof entry.name === 'string' && entry.name.trim()
    && entry.name.length <= 60 && Array.isArray(entry.readingIds) && entry.readingIds.length > 0
    && entry.readingIds.every(validEntryId) && new Set(entry.readingIds).size === entry.readingIds.length;
}

export function listCollections() {
  try {
    const saved = JSON.parse(localStorage.getItem(collectionsKey));
    return Array.isArray(saved) ? saved.filter(validCollection) : [];
  } catch { return []; }
}

export function saveCollectionEntries(name, readings, sourceId, targetId) {
  const collections = listCollections();
  const readingIds = [...new Set(readings.map(reading => reading.id))];
  const target = collections.find(entry => entry.id === targetId);
  if (targetId && !target) throw new Error(t('Aquesta col·lecció ja no és disponible.'));
  const entry = target ? { ...target, readingIds: [...new Set([...target.readingIds, ...readingIds])] }
    : { id: crypto.randomUUID(), name: name.trim(), readingIds };
  if (!validCollection(entry)) throw new Error(t('Escriu un nom de fins a 60 caràcters.'));
  if (!target && collections.some(other => other.name.localeCompare(entry.name, undefined, { sensitivity: 'base' }) === 0)) {
    throw new Error(t('Ja tens una col·lecció amb aquest nom.'));
  }
  const staged = [];
  try {
    for (const reading of readings) {
      if (target?.readingIds.includes(reading.id) || readWorksheetLayout(reading, entry.id)) continue;
      const layout = readWorksheetLayout(reading, sourceId);
      if (layout) {
        writeWorksheetLayout(localStorage, reading.id, layout, entry.id);
        staged.push(reading);
      }
    }
    localStorage.setItem(collectionsKey, JSON.stringify(target ? collections.map(item => item.id === target.id ? entry : item) : [...collections, entry]));
  } catch (error) {
    for (const reading of staged) removeWorksheetLayout(reading, entry.id);
    throw error;
  }
  return entry;
}

export function removeCollection(id) {
  localStorage.setItem(collectionsKey, JSON.stringify(listCollections().filter(entry => entry.id !== id)));
  clearCollectionLayouts(id);
}
