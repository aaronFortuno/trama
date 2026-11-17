import { worksheetLayout } from './worksheet-code.js';

const storageKey = reading => 'trama.worksheet-layout.v1:' + reading.id;

export function readWorksheetLayout(reading) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(reading)));
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? worksheetLayout(reading, saved) : null;
  } catch { return null; }
}

export function saveWorksheetLayout(reading, settings) {
  const layout = worksheetLayout(reading, settings);
  localStorage.setItem(storageKey(reading), JSON.stringify(layout));
  return layout;
}

export function removeWorksheetLayout(reading) {
  localStorage.removeItem(storageKey(reading));
}
