import { compileLibraryFamily } from './library-expansion-model.js';
export { q, mc } from './library-expansion-model.js';

const newsroom = {
  id: 'redaccio-del-pati', imageSuffix: 'redaccio',
  description: {
    ca: 'Una història de La redacció del pati, amb suport, versió de referència i ampliació.',
    es: 'Una historia de La redacción del patio, con apoyo, versión de referencia y ampliación.',
  },
  sharedImage: { id: 'newsroom-team', src: 'assets/readings/l070-la-noticia-que-cambio-de-titulo.webp',
    alt: ['Clara y Omar preparan el periódico escolar en una mesa del patio, en una ilustración azul y naranja.', 'La Clara i l’Omar preparen el diari escolar en una taula del pati, en una il·lustració blava i taronja.'] },
};
export const compileNewsroomFamily = spec => compileLibraryFamily(spec, newsroom);
