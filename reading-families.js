import { familyById } from './data/families.js';

// A translation is never counted as another degree of reading demand.
export function familyMembers(readings, reading) {
  if (!reading.familyId) return [];
  const order = familyById.get(reading.familyId)?.variantCodes ?? [];
  return readings.filter(entry => entry.familyId === reading.familyId && entry.language === reading.language)
    .sort((a, b) => {
      const rank = code => { const index = order.indexOf(code); return index < 0 ? order.length : index; };
      return rank(a.code) - rank(b.code) || a.code.localeCompare(b.code, 'en', { numeric: true });
    });
}

export function groupFamilyCards(matches) {
  const groups = new Map();
  const cards = [];
  for (const item of matches) {
    const { reading } = item;
    const key = reading.familyId && `${reading.familyId}:${reading.language}`;
    if (key && groups.has(key)) { groups.get(key).familyMatches.push(item); continue; }
    const card = { ...item, familyMatches: [item] };
    cards.push(card);
    if (key) groups.set(key, card);
  }
  return cards;
}
