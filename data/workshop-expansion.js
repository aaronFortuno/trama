import { workshopPublications } from './workshop-expansion-published.js';
export { workshopPublications };
export const workshopReadings = workshopPublications.flatMap(entry => entry.readings);
export const workshopFamilies = workshopPublications.map(entry => entry.family);
export const workshopChoiceReadings = workshopPublications.flatMap(entry => entry.choices);
