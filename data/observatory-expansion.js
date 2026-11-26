import { observatoryPublications } from './observatory-expansion-published.js';
export { observatoryPublications };
export const observatoryReadings = observatoryPublications.flatMap(entry => entry.readings);
export const observatoryFamilies = observatoryPublications.map(entry => entry.family);
export const observatoryChoiceReadings = observatoryPublications.flatMap(entry => entry.choices);
