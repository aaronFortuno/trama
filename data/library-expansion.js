import { libraryPublications } from './library-expansion-published.js';

export { libraryPublications };
export const libraryReadings = libraryPublications.flatMap(entry => entry.readings);
export const libraryFamilies = libraryPublications.map(entry => entry.family);
export const libraryChoiceReadings = libraryPublications.flatMap(entry => entry.choices);
