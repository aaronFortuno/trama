import { choiceBatch001 } from './question-choices/batch-001.js';
import { choiceBatch002 } from './question-choices/batch-002.js';
import { choiceBatch003 } from './question-choices/batch-003.js';
import { choiceBatch004 } from './question-choices/batch-004.js';
import { choiceBatch005 } from './question-choices/batch-005.js';
import { choiceBatch006 } from './question-choices/batch-006.js';
import { choiceBatch007 } from './question-choices/batch-007.js';

// Only independently reviewed, complete batches are registered here.
export const choiceBatches = [
  { ...{"id":"001","edition":"v1.57","codes":["L001A","L001B","L002A","L002B","L003A","L003B","L004A","L004B","L005A","L005B"],"review":"docs/question-choices/batch-001-review.json"}, readings: choiceBatch001 },
  { ...{"id":"002","edition":"v1.57.1","codes":["L006","L006A","L006B","L007","L008","L008A","L008B","L009","L010"],"review":"docs/question-choices/batch-002-review.json"}, readings: choiceBatch002 },
  { ...{"id":"003","edition":"v1.57.2","codes":["L011","L012","L013","L014","L015"],"review":"docs/question-choices/batch-003-review.json"}, readings: choiceBatch003 },
  { ...{"id":"004","edition":"v1.57.3","codes":["L016","L017","L018","L019","L020"],"review":"docs/question-choices/batch-004-review.json"}, readings: choiceBatch004 },
  { ...{"id":"005","edition":"v1.57.4","codes":["L021","L021A","L021B","L022","L023","L023A","L023B","L024","L025","L025A","L025B"],"review":"docs/question-choices/batch-005-review.json"}, readings: choiceBatch005 },
  { ...{"id":"006","edition":"v1.57.5","codes":["L026","L026A","L026B","L027","L027A","L027B","L028","L028A","L028B","L029","L030"],"review":"docs/question-choices/batch-006-review.json"}, readings: choiceBatch006 },
  { ...{"id":"007","edition":"v1.57.6","codes":["L031","L031A","L031B","L032","L032A","L032B","L033","L033A","L033B","L034","L035"],"review":"docs/question-choices/batch-007-review.json"}, readings: choiceBatch007 },
];
