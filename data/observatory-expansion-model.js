import { compileLibraryFamily } from './library-expansion-model.js';
export { q, mc } from './library-expansion-model.js';
const observatory = {
  id: 'observatori-del-turo', imageSuffix: 'observatori',
  description: {
    ca: 'Una història de L’observatori del turó, amb suport, versió de referència i ampliació.',
    es: 'Una historia de El observatorio de la colina, con apoyo, versión de referencia y ampliación.',
  },
  sharedImage: { id: 'observatory-hill', src: 'assets/readings/l175-una-noche-sin-estrellas.webp',
    alt: ['El pequeño observatorio de piedra clara y cúpula gris en una colina con pinos, bajo un cielo lavanda.', 'El petit observatori de pedra clara i cúpula grisa en un turó amb pins, sota un cel lavanda.'] },
};
export const compileObservatoryFamily = spec => compileLibraryFamily(spec, observatory);
