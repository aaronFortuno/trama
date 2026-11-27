import { cycleAssignments } from './data/cycle-classification.js';

export const referenceLevelLabels = {
  '1-primary': '1r de primària', '2-primary': '2n de primària', '3-primary': '3r de primària',
  '4-primary': '4t de primària', '5-primary': '5è de primària', '6-primary': '6è de primària',
  '1-secondary': '1r d’ESO', '2-secondary': '2n d’ESO', '3-secondary': '3r d’ESO', '4-secondary': '4t d’ESO',
  '1-baccalaureate': '1r de batxillerat', '2-baccalaureate': '2n de batxillerat',
};
export const levelLabels = {
  'primary-cycle-1': 'Primer cicle · 1r–2n',
  'primary-cycle-2': 'Segon cicle · 3r–4t',
  'primary-cycle-3': 'Tercer cicle · 5è–6è',
  ...Object.fromEntries(Object.entries(referenceLevelLabels).filter(([level]) => !level.endsWith('-primary'))),
};
export const shortLevelLabels = {
  'primary-cycle-1': '1r cicle', 'primary-cycle-2': '2n cicle', 'primary-cycle-3': '3r cicle',
};
export const classificationByCode = new Map(cycleAssignments.flatMap(([level, difficulty, codes]) =>
  codes.map(code => [code, Object.freeze({ level, difficulty })])
));

export function cycleForReference(level) {
  const match = /^([1-6])-primary$/.exec(level);
  return match ? `primary-cycle-${Math.ceil(Number(match[1]) / 2)}` : level;
}

// A fallback for legacy personal imports. Published readings have an explicit
// editorial assignment, shared by their language editions, in the registry.
export function referenceClassification(level, difficulty) {
  const cycle = cycleForReference(level);
  const lower = ['3-primary', '5-primary'].includes(level);
  const upper = ['4-primary', '6-primary'].includes(level);
  return { level: cycle, difficulty: lower ? difficulty === 'advanced' ? 'intermediate' : 'initial'
    : upper ? difficulty === 'advanced' ? 'advanced' : 'intermediate' : difficulty };
}

export function classificationFor(reading) {
  const assigned = reading.personal ? undefined : classificationByCode.get(reading.code);
  return assigned ?? referenceClassification(reading.level, reading.difficulty);
}
export const readingLevel = reading => classificationFor(reading).level;
export const readingDifficulty = reading => classificationFor(reading).difficulty;
