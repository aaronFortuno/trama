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
  {
    id: 'taller-de-la-placa',
    name: { ca: 'El taller de la plaça', es: 'El taller de la plaza' },
    description: {
      ca: 'La Irene, en Hugo i l’Asha reparen, pregunten i comparteixen oficis en un taller obert al barri. Cada encàrrec és una lectura independent.',
      es: 'Irene, Hugo y Asha reparan, preguntan y comparten oficios en un taller abierto al barrio. Cada encargo es una lectura independiente.',
    },
    seedCode: 'L039',
  },
  {
    id: 'redaccio-del-pati',
    name: { ca: 'La redacció del pati', es: 'La redacción del patio' },
    description: {
      ca: 'La Clara i l’Omar fan un diari escolar que escolta veus, contrasta informació i també deixa lloc a la creació. Cada número obre una història independent.',
      es: 'Clara y Omar hacen un periódico escolar que escucha voces, contrasta información y también deja lugar a la creación. Cada número abre una historia independiente.',
    },
    seedCode: 'L070',
  },
  {
    id: 'camins-de-la-ribera',
    name: { ca: 'Els camins de la ribera', es: 'Los caminos de la ribera' },
    description: {
      ca: 'En Neri porta encàrrecs per una vall de camins, prats i un molí de pedra. Amb l’Elna i l’Isona comparteix petits reptes i descobertes, sense ordre de lectura obligatori.',
      es: 'Neri lleva recados por un valle de caminos, prados y un molino de piedra. Con Elna e Isona comparte pequeños retos y descubrimientos, sin orden de lectura obligatorio.',
    },
    seedCode: 'L189',
  },
];

export const universeById = new Map(universes.map(universe => [universe.id, universe]));
