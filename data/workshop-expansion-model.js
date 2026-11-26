import { compileLibraryFamily } from './library-expansion-model.js';
export { q, mc } from './library-expansion-model.js';
const workshop = {
  id: 'taller-de-la-placa', imageSuffix: 'taller',
  description: {
    ca: 'Una història del Taller de la plaça, amb suport, versió de referència i ampliació.',
    es: 'Una historia del Taller de la plaza, con apoyo, versión de referencia y ampliación.',
  },
  sharedImage: { id: 'workshop-square', src: 'assets/readings/l039-el-taller-de-los-paraguas.webp',
    alt: ['Irene y Hugo en el taller de reparación junto a la plaza, rodeados de paraguas y materiales.', 'La Irene i l’Hugo al taller de reparació de la plaça, entre paraigües i materials.'] },
};
export const compileWorkshopFamily = spec => compileLibraryFamily(spec, workshop);
