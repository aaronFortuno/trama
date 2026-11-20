import { bilingualReading } from './bilingual-reading-model.js';
import { observatoryReadings } from './readings-universe-observatory.js';
import { workshopReadings } from './readings-universe-workshop.js';
import { newsroomReadings } from './readings-universe-newsroom.js';
import { riversideReadings } from './readings-universe-riverside.js';

export const newUniverseEntries = [...observatoryReadings, ...workshopReadings, ...newsroomReadings, ...riversideReadings];
export const newUniverseReadings = newUniverseEntries.flatMap(bilingualReading);
