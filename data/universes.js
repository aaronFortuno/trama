// Editorial worlds are independent of language, grade and user collections.
export const universes = [
  {
    id: 'biblioteca-de-les-coses',
    name: { ca: 'La biblioteca de les coses', es: 'La biblioteca de las cosas' },
    description: {
      ca: 'Un local del barri on es presten objectes i es resolen petits reptes compartits. Cada lectura s’entén per si sola.',
      es: 'Un local del barrio donde se prestan objetos y se resuelven pequeños retos compartidos. Cada lectura se entiende por sí sola.',
    },
    seedCode: 'L208',
  },
  {
    id: 'observatori-del-turo',
    name: { ca: 'L’observatori del turó', es: 'El observatorio de la colina' },
    description: {
      ca: 'En Dani, la Mira i la guia Joana comparteixen descobertes en un petit observatori entre pins. Cada visita és una història independent.',
      es: 'Dani, Mira y la guía Joana comparten descubrimientos en un pequeño observatorio entre pinos. Cada visita es una historia independiente.',
    },
    seedCode: 'L175',
  },
];

export const universeById = new Map(universes.map(universe => [universe.id, universe]));
