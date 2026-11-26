import { compileLibraryFamily } from './library-expansion-model.js';
export { q, mc } from './library-expansion-model.js';
const riverside = {
  id: 'camins-de-la-ribera', imageSuffix: 'ribera',
  description: {
    ca: 'Una història dels Camins de la ribera, amb suport, versió de referència i ampliació.',
    es: 'Una historia de Los caminos de la ribera, con apoyo, versión de referencia y ampliación.',
  },
  sharedImage: { id: 'riverside-valley', src: 'assets/readings/l189-el-camino-del-mensajero.webp',
    alt: ['Neri contempla los caminos de la ribera y el molino de piedra en un valle de otoño.', 'En Neri contempla els camins de la ribera i el molí de pedra en una vall de tardor.'] },
};
export const compileRiversideFamily = spec => compileLibraryFamily(spec, riverside);
