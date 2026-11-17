import { rasterImagePattern } from './local-images.js';
import { validSetting, worksheetLayout } from './worksheet-code.js';

const layoutPrefix = 'trama.worksheet-layout.v1:';
const collectionPrefix = 'trama.collection-layout.v1:';
const legacyPrefix = 'trama.classroom-code.v1:';
const logoPrefix = 'trama.worksheet-logo.v1:';
const logoFields = ['headerLogo', 'footerLogo'];
export const classroomKeys = ['showClassroomCode', 'classroomCode', 'classroomCodeSize', 'classroomCodeStyle'];
const pendingLayouts = new Map();
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const layoutKey = (id, collectionId) => collectionId ? collectionPrefix + collectionId + ':' + id : layoutPrefix + id;

function storeLogo(storage, source) {
  if (!rasterImagePattern.test(source)) return source;
  // Reuse the same school logo across layouts to save space in localStorage.
  let hash = 2166136261;
  for (let i = 0; i < source.length; i++) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
  const base = logoPrefix + (hash >>> 0).toString(36);
  for (let i = 0; ; i++) {
    const key = i ? base + '-' + i : base;
    const saved = storage.getItem(key);
    if (saved === source) return key;
    if (saved === null) {
      storage.setItem(key, source);
      return key;
    }
  }
}

export function readWorksheetLayout(reading, collectionId) {
  const key = layoutKey(reading.id, collectionId);
  if (pendingLayouts.has(key)) return worksheetLayout(reading, pendingLayouts.get(key));
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (object(saved)) {
      for (const field of logoFields) {
        if (typeof saved[field] === 'string' && saved[field].startsWith(logoPrefix)) {
          saved[field] = localStorage.getItem(saved[field]) ?? '';
        }
      }
      return worksheetLayout(reading, saved);
    }
  } catch { return null; }
  if (collectionId) return null;
  try {
    const legacy = JSON.parse(localStorage.getItem(legacyPrefix + reading.id));
    if (!object(legacy)) return null;
    const settings = Object.fromEntries(classroomKeys.filter(key => validSetting(key, legacy[key])).map(key => [key, legacy[key]]));
    return Object.keys(settings).length ? worksheetLayout(reading, settings) : null;
  } catch { return null; }
}

export function saveWorksheetLayout(reading, settings, collectionId) {
  const layout = worksheetLayout(reading, settings);
  try {
    writeWorksheetLayout(localStorage, reading.id, layout, collectionId);
    clearPendingWorksheetLayout(reading.id, collectionId);
    return true;
  } catch {
    pendingLayouts.set(layoutKey(reading.id, collectionId), layout);
    return false;
  }
}

export function writeWorksheetLayout(storage, id, layout, collectionId) {
  const stored = { ...layout };
  for (const field of logoFields) stored[field] = storeLogo(storage, layout[field]);
  storage.setItem(layoutKey(id, collectionId), JSON.stringify(stored));
}

export function clearPendingWorksheetLayout(id, collectionId) {
  pendingLayouts.delete(layoutKey(id, collectionId));
}

export function hasPendingWorksheetLayout(reading, collectionId) {
  return pendingLayouts.has(layoutKey(reading.id, collectionId));
}

export function removeWorksheetLayout(reading, collectionId) {
  return eraseLayouts(() => {
    localStorage.removeItem(layoutKey(reading.id, collectionId));
    if (!collectionId) localStorage.removeItem(legacyPrefix + reading.id);
  }, () => clearPendingWorksheetLayout(reading.id, collectionId));
}

export function collectionLayoutIds(collectionId) {
  const prefix = collectionPrefix + collectionId + ':';
  return [...new Set([...Object.keys(localStorage), ...pendingLayouts.keys()]
    .filter(key => key.startsWith(prefix)).map(key => key.slice(prefix.length)))];
}

export function clearCollectionLayouts(collectionId) {
  for (const id of collectionLayoutIds(collectionId)) {
    localStorage.removeItem(layoutKey(id, collectionId));
    clearPendingWorksheetLayout(id, collectionId);
  }
}

export function clearWorksheetLayouts() {
  return eraseLayouts(() => {
    const prefixes = [layoutPrefix, collectionPrefix, legacyPrefix, logoPrefix];
    for (const key of Object.keys(localStorage)) {
      if (prefixes.some(prefix => key.startsWith(prefix))) localStorage.removeItem(key);
    }
  }, () => pendingLayouts.clear());
}

function eraseLayouts(eraseStored, erasePending) {
  try {
    eraseStored();
    erasePending();
    return true;
  } catch { return false; }
}
