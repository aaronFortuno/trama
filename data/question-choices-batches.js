import { choiceBatch001 } from './question-choices/batch-001.js';
import { choiceBatch002 } from './question-choices/batch-002.js';
import { choiceBatch003 } from './question-choices/batch-003.js';

// Only independently reviewed, complete batches are registered here.
export const choiceBatches = [
  { id: '001', edition: 'v1.57', codes: ["L001A","L001B","L002A","L002B","L003A","L003B","L004A","L004B","L005A","L005B"], review: 'docs/question-choices/batch-001-review.json', readings: choiceBatch001 },
  { id: '002', edition: 'v1.57.1', codes: ["L006","L006A","L006B","L007","L008","L008A","L008B","L009","L010"], review: 'docs/question-choices/batch-002-review.json', readings: choiceBatch002 },
  { id: '003', edition: 'v1.57.2', codes: ["L011","L012","L013","L014","L015"], review: 'docs/question-choices/batch-003-review.json', readings: choiceBatch003 },
];
