import { rasterImagePattern } from './local-images.js';
import { validSetting, worksheetLayout } from './worksheet-code.js';

const layoutPrefix = 'trama.worksheet-layout.v1:';
const legacyPrefix = 'trama.classroom-code.v1:';
const logoPrefix = 'trama.worksheet-logo.v1:';
const logoFields = ['headerLogo', 'footerLogo'];
export const classroomKeys = ['showClassroomCode', 'classroomCode', 'classroomCodeSize', 'classroomCodeStyle'];
const pendingLayouts = new Map();
const object = value => value && typeof value === 'object' && !Array.isArray(value);

function storeLogo(source) {
  if (!rasterImagePattern.test(source)) return source;
  // Reuse the same school logo across layouts to save space in localStorage.
  let hash = 2166136261;
  for (let i = 0; i < source.length; i++) hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
  const base = logoPrefix + (hash >>> 0).toString(36);
  for (let i = 0; ; i++) {
    const key = i ? base + '-' + i : base;
    const saved = localStorage.getItem(key);
    if (saved === source) return key;
    if (saved === null) {
      localStorage.setItem(key, source);
      return key;
    }
  }
}

export function readWorksheetLayout(reading) {
  if (pendingLayouts.has(reading.id)) return worksheetLayout(reading, pendingLayouts.get(reading.id));
  try {
    const saved = JSON.parse(localStorage.getItem(layoutPrefix + reading.id));
    if (object(saved)) {
      for (const field of logoFields) {
        if (typeof saved[field] === 'string' && saved[field].startsWith(logoPrefix)) {
          saved[field] = localStorage.getItem(saved[field]) ?? '';
        }
      }
      return worksheetLayout(reading, saved);
    }
  } catch { return null; }
  try {
    const legacy = JSON.parse(localStorage.getItem(legacyPrefix + reading.id));
    if (!object(legacy)) return null;
    const settings = Object.fromEntries(classroomKeys.filter(key => validSetting(key, legacy[key])).map(key => [key, legacy[key]]));
    return Object.keys(settings).length ? worksheetLayout(reading, settings) : null;
  } catch { return null; }
}

export function saveWorksheetLayout(reading, settings) {
  const layout = worksheetLayout(reading, settings);
  try {
    const stored = { ...layout };
    for (const field of logoFields) stored[field] = storeLogo(layout[field]);
    localStorage.setItem(layoutPrefix + reading.id, JSON.stringify(stored));
    pendingLayouts.delete(reading.id);
    return true;
  } catch {
    pendingLayouts.set(reading.id, layout);
    return false;
  }
}

export function hasPendingWorksheetLayout(reading) {
  return pendingLayouts.has(reading.id);
}

export function removeWorksheetLayout(reading) {
  return eraseLayouts(() => {
    localStorage.removeItem(layoutPrefix + reading.id);
    localStorage.removeItem(legacyPrefix + reading.id);
  }, () => pendingLayouts.delete(reading.id));
}

export function clearWorksheetLayouts() {
  return eraseLayouts(() => {
    const prefixes = [layoutPrefix, legacyPrefix, logoPrefix];
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
