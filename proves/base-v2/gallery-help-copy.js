import { galleryLabels } from './gallery-controls.js?v=0.11.0';

export const projectNames = {
  trama: 'Trama',
  sentit: 'Sentit',
  'mon-a-ma': 'Món a mà',
  'fil-i-compte': 'Fil i compte',
};

const help = {
  trama: {
    ca: [
      'Tria una lectura, adapta la fitxa al grup i imprimeix-la amb el solucionari.',
      ['Troba una lectura', 'Cerca per títol, codi o tema. Fes servir els filtres de curs, nivell i tipus de text.'],
      ['Compara les variants', 'Les targetes apilades indiquen que una mateixa lectura té versions amb diferents nivells de dificultat.'],
      ['Prepara la fitxa i el solucionari', 'Al maquetador pots ajustar lletres, marges, imatges i preguntes. El solucionari relaciona les respostes amb fragments del text.'],
      ['Agrupa i imprimeix', 'Desa lectures en col·leccions per reutilitzar-les. Pots imprimir la fitxa d’una lectura o preparar un lot.'],
    ],
    es: [
      'Elige una lectura, adapta la ficha al grupo e imprímela con el solucionario.',
      ['Encuentra una lectura', 'Busca por título, código o tema. Usa los filtros de curso, nivel y tipo de texto.'],
      ['Compara las variantes', 'Las tarjetas apiladas indican que una misma lectura tiene versiones con distintos niveles de dificultad.'],
      ['Prepara la ficha y el solucionario', 'En el maquetador puedes ajustar letra, márgenes, imágenes y preguntas. El solucionario relaciona las respuestas con fragmentos del texto.'],
      ['Agrupa e imprime', 'Guarda lecturas en colecciones para reutilizarlas. Puedes imprimir una ficha o preparar un lote.'],
    ],
    gl: [
      'Escolle unha lectura, adapta a ficha ao grupo e imprímea co solucionario.',
      ['Atopa unha lectura', 'Busca por título, código ou tema e usa os filtros de curso, nivel e tipo de texto.'],
      ['Compara as variantes', 'As tarxetas amoreadas indican que hai versións da mesma lectura con distintos niveis de dificultade.'],
      ['Prepara a ficha e o solucionario', 'Axusta a letra, as marxes, as imaxes e as preguntas. O solucionario vincula as respostas a fragmentos do texto.'],
      ['Agrupa e imprime', 'Garda lecturas en coleccións. Podes imprimir unha ficha ou preparar un lote.'],
    ],
    eu: [
      'Aukeratu irakurgai bat, egokitu fitxa taldeari eta inprimatu erantzun-gidarekin.',
      ['Bilatu irakurgai bat', 'Bilatu izenburuaren, kodearen edo gaiaren arabera. Erabili mailaren eta testu motaren iragazkiak.'],
      ['Alderatu aldaerak', 'Pilatutako txartelek irakurgai beraren zailtasun-maila desberdinak adierazten dituzte.'],
      ['Prestatu fitxa eta erantzun-gida', 'Doitu letra, marjinak, irudiak eta galderak. Gidak erantzunak testuko pasarteekin lotzen ditu.'],
      ['Taldekatu eta inprimatu', 'Gorde irakurgaiak bildumetan. Fitxa bat inprima dezakezu, edo fitxa sorta bat prestatu.'],
    ],
  },
  sentit: {
    ca: [
      'Prepara una comprensió oral amb àudio, fitxa i solucionari. L’alumnat pot respondre en paper.',
      ['Tria què escoltareu', 'Cerca per títol o codi. Filtra per curs, dificultat, durada o tipologia textual. El color i la icona de cada targeta identifiquen el tipus de text.'],
      ['Organitza l’escolta', 'Escolta l’àudio abans de classe i ajusta la velocitat, el nombre d’escoltes i les pauses de la sessió.'],
      ['Adapta i imprimeix la fitxa', 'Ajusta la maquetació, les imatges i les preguntes. Consulta el solucionari i la transcripció des del mateix visor.'],
      ['Recupera les teves propostes', 'Desa comprensions en col·leccions amb el teu ordre i els teus ajustos.'],
    ],
    es: [
      'Prepara una comprensión oral con audio, ficha y solucionario. El alumnado puede responder en papel.',
      ['Elige qué escucharéis', 'Busca por título o código. Filtra por curso, dificultad, duración o tipo de texto. El color y el icono de cada tarjeta identifican el tipo de texto.'],
      ['Organiza la escucha', 'Escucha el audio antes de clase y ajusta la velocidad, el número de escuchas y las pausas de la sesión.'],
      ['Adapta e imprime la ficha', 'Ajusta la maquetación, las imágenes y las preguntas. Consulta el solucionario y la transcripción desde el mismo visor.'],
      ['Recupera tus propuestas', 'Guarda comprensiones en colecciones con tu orden y tus ajustes.'],
    ],
  },
  'mon-a-ma': {
    ca: [
      'Explora un tema de medi i prepara els materials que necessitis per treballar-lo a l’aula.',
      ['Obre un tema', 'Tria un tema de la galeria i navega pels capítols, les il·lustracions i les fonts.'],
      ['Prepara materials per imprimir', 'Obre el maquetador per ajustar els apunts, la fitxa o el solucionari del capítol.'],
    ],
  },
  'fil-i-compte': {
    ca: [
      'Explora problemes de càlcul contextualitzats i consulta una possible resolució.',
      ['Troba un problema', 'Cerca per títol o codi i filtra per cicle o estructura.'],
      ['Consulta el solucionari', 'Cada targeta de mostra presenta una operació que forma part de la resolució.'],
    ],
  },
};

export const helpTopics = (project, locale) => help[project][locale] ?? help[project].ca;

export function localiseGalleryHelp(dialog, project, locale) {
  const labels = galleryLabels(locale);
  const [intro, ...topics] = helpTopics(project, locale);
  dialog.querySelector('[data-of-help-title]').textContent = labels.help(projectNames[project]);
  dialog.querySelector('[data-of-help-intro]').textContent = intro;
  const close = dialog.querySelector('[data-of-close]');
  close.setAttribute('aria-label', labels.close);
  close.title = labels.close;
  for (const [index, section] of [...dialog.querySelectorAll('.of-help-topics section')].entries()) {
    const [name, description] = topics[index];
    section.querySelector('h3').textContent = name;
    section.querySelector('p').textContent = description;
  }
}
