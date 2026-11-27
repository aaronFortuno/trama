import { cyclePublications } from './cycle-completion-published.js';
import { completionChoices } from './cycle-completion-model.js';

export { cyclePublications };
export const cycleCompletionAdaptations = cyclePublications.flatMap(publication => publication.adaptations);
export const cycleCompletionChoices = completionChoices(cycleCompletionAdaptations);
export const cycleCompletionAssignments = cycleCompletionAdaptations.map(edition =>
  [edition.cycleLevel, edition.cycleDifficulty, [edition.source + edition.suffix]]);

export function withCycleVariants(family) {
  const additions = cycleCompletionAdaptations.filter(edition => edition.source === family.code);
  if (!additions.length) return family;
  const variantCodes = [...family.variantCodes];
  for (const edition of additions) {
    const position = variantCodes.indexOf(edition.before);
    if (position < 0) throw Error(`Missing family anchor ${edition.before}`);
    variantCodes.splice(position, 0, edition.source + edition.suffix);
  }
  return { ...family, variantCodes, description: {
    ca: 'Versions de la mateixa lectura amb diferents graus d’exigència.',
    es: 'Versiones de la misma lectura con distintos grados de exigencia.',
  } };
}
