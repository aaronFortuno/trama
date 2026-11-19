import { familyEditionPlan } from './family-edition-plan.js';
import { familyAdaptations } from './family-adaptations.js';

const completedSources = new Set(familyAdaptations.map(edition => edition.source));

export const families = [{
  id: 'biblioteca-objectes',
  code: 'L208',
  name: { ca: 'La biblioteca d’objectes', es: 'La biblioteca de objetos' },
  description: {
    ca: 'Una mateixa explicació del préstec d’objectes, amb textos i preguntes graduats.',
    es: 'Una misma explicación del préstamo de objetos, con textos y preguntas graduados.',
  },
  variantCodes: ['L208A', 'L208B', 'L208'],
}, ...familyEditionPlan.filter(family => completedSources.has(family.code))];

export const familyById = new Map(families.map(family => [family.id, family]));
