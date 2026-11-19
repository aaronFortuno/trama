export const families = [{
  id: 'biblioteca-objectes',
  code: 'L208',
  name: { ca: 'La biblioteca d’objectes', es: 'La biblioteca de objetos' },
  description: {
    ca: 'Una mateixa explicació del préstec d’objectes, amb textos i preguntes graduats.',
    es: 'Una misma explicación del préstamo de objetos, con textos y preguntas graduados.',
  },
  variantCodes: ['L208A', 'L208B', 'L208'],
}];

export const familyById = new Map(families.map(family => [family.id, family]));
