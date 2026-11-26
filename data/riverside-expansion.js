import { riversidePublications } from './riverside-expansion-published.js';
export { riversidePublications };
export const riversideExpansionReadings = riversidePublications.flatMap(entry => entry.readings);
export const riversideFamilies = riversidePublications.map(entry => entry.family);
export const riversideChoiceReadings = riversidePublications.flatMap(entry => entry.choices);
