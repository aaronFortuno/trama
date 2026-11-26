import { newsroomPublications } from './newsroom-expansion-published.js';
export { newsroomPublications };
export const newsroomReadings = newsroomPublications.flatMap(entry => entry.readings);
export const newsroomFamilies = newsroomPublications.map(entry => entry.family);
export const newsroomChoiceReadings = newsroomPublications.flatMap(entry => entry.choices);
