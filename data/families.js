import { familyEditionPlan } from './family-edition-plan.js';
import { withCycleVariants } from './cycle-completion.js';
import { libraryFamilies } from './library-expansion.js';
import { newsroomFamilies } from './newsroom-expansion.js';
import { observatoryFamilies } from './observatory-expansion.js';
import { workshopFamilies } from './workshop-expansion.js';
import { riversideFamilies } from './riverside-expansion.js';
import { familyAdaptations } from './family-adaptations.js';
import { earlyFamilyPlan } from './early-family-plan.js';
import { earlyFamilyAdaptations } from './early-family-adaptations.js';
import { familyExpansionPlan } from './family-expansion-plan.js';
import { familyExpansionAdaptations } from './family-expansion-adaptations.js';
import { familyExpansionPlan as familyExpansionNov23Plan } from './family-expansion-2026-11-23-plan.js';
import { familyExpansionAdaptations as familyExpansionNov23Adaptations } from './family-expansion-2026-11-23-adaptations.js';
import { familyExpansionPlan as familyExpansionFourthPlan } from './family-expansion-2026-11-23b-plan.js';
import { familyExpansionAdaptations as familyExpansionFourthAdaptations } from './family-expansion-2026-11-23b-adaptations.js';
import { familyExpansionPlan as familyExpansionFifthPlan } from './family-expansion-2026-11-23c-plan.js';
import { familyExpansionAdaptations as familyExpansionFifthAdaptations } from './family-expansion-2026-11-23c-adaptations.js';

const plans = [...familyEditionPlan, ...earlyFamilyPlan, ...familyExpansionPlan, ...familyExpansionNov23Plan, ...familyExpansionFourthPlan, ...familyExpansionFifthPlan];
const adaptations = [...familyAdaptations, ...earlyFamilyAdaptations, ...familyExpansionAdaptations, ...familyExpansionNov23Adaptations, ...familyExpansionFourthAdaptations, ...familyExpansionFifthAdaptations];
const completedSources = new Set(plans.filter(family => ['A', 'B'].every(suffix =>
  adaptations.some(edition => edition.source === family.code && edition.suffix === suffix)
)).map(family => family.code));

export const families = [{
  id: 'biblioteca-objectes',
  code: 'L208',
  name: { ca: 'La biblioteca d’objectes', es: 'La biblioteca de objetos' },
  description: {
    ca: 'Una mateixa explicació del préstec d’objectes, amb textos i preguntes graduats.',
    es: 'Una misma explicación del préstamo de objetos, con textos y preguntas graduados.',
  },
  variantCodes: ['L208A', 'L208B', 'L208'],
}, ...plans.filter(family => completedSources.has(family.code)), ...libraryFamilies, ...newsroomFamilies, ...observatoryFamilies, ...workshopFamilies, ...riversideFamilies].map(withCycleVariants);

export const familyById = new Map(families.map(family => [family.id, family]));
