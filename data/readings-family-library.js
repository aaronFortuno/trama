import { readings1SecondaryExpansionEs } from './readings-1-secondary-expansion-es.js';
import { readings1SecondaryExpansionCa } from './readings-1-secondary-expansion-ca.js';

const original = readings1SecondaryExpansionEs.find(reading => reading.code === 'L208');
const originalCa = readings1SecondaryExpansionCa.find(reading => reading.code === 'L208');
const shared = { familyId: 'biblioteca-objectes', universeIds: ['biblioteca-de-les-coses'], language: 'es', themes: ['community', 'environment', 'everyday'], genre: 'informative' };

export const readingsFamilyEs = [
  {
    ...shared, id: 'biblioteca-objetos-a-es', code: 'L208A', workId: 'biblioteca-objetos-a', level: '4-primary', difficulty: 'intermediate',
    title: 'La biblioteca de objetos',
    summary: 'Una biblioteca presta herramientas y utensilios. Para compartirlos, hay que reservarlos y devolver todas sus piezas.',
    paragraphs: [
      'En la biblioteca del barrio no hay libros. En los estantes hay herramientas, moldes de tarta y material de acampada. No se venden. Los vecinos se los llevan unos días y después los devuelven.',
      'La asociación abrió el local porque muchas personas usan algunos objetos pocas veces. Un taladro sirve para colgar una estantería. Después puede pasar meses guardado. Compartirlo evita comprar uno para cada casa.',
      'Pero compartir también exige organizarse. Seis familias quieren el mismo proyector el sábado. Solo hay uno y no pueden usarlo todas a la vez. Por eso se anotan las reservas y el día de devolución.',
      'Cada objeto tiene una ficha con sus piezas. El taladro sale con una funda y un cargador. Cuando vuelve, hay que comprobar las tres cosas. Encontrar la caja no basta: dentro podría faltar algo.',
      'La biblioteca no acepta cualquier donación. Antes debe encontrar a alguien que revise el objeto. También entrega las instrucciones para utilizarlo. Llenar los estantes no sirve de mucho si los aparatos no pueden prestarse.',
      'A los tres meses descubrieron que el molde más prestado era pequeño y poco vistoso. Cabía en muchos hornos. Ahora lo dejan al alcance, con sus medidas bien claras. Ser el más nuevo no lo habría hecho más útil.'
    ],
    images: [{ ...original.images[0], afterParagraph: 2 }],
    questions: [
      { id: 'biblioteca-a-q1', type: 'literal', prompt: '¿Se compran los objetos de esta biblioteca? Explica qué hacen los vecinos con ellos.', answer: 'No. Se los llevan unos días y después los devuelven.', lines: 2, evidence: [{ paragraph: 1, text: 'No se venden. Los vecinos se los llevan unos días y después los devuelven.' }] },
      { id: 'biblioteca-a-q2', type: 'inference', prompt: '¿Por qué puede ser buena idea compartir un taladro que se usa pocas veces?', answer: 'Porque puede pasar meses guardado y, si se comparte, no hace falta comprar uno para cada casa.', lines: 2, evidence: [{ paragraph: 2, text: 'Después puede pasar meses guardado. Compartirlo evita comprar uno para cada casa.' }] },
      { id: 'biblioteca-a-q3', type: 'literal', prompt: 'Escribe las tres cosas que hay que comprobar cuando vuelve el taladro.', answer: 'El taladro, la funda y el cargador.', lines: 2, evidence: [{ paragraph: 4, text: 'El taladro sale con una funda y un cargador. Cuando vuelve, hay que comprobar las tres cosas.' }] },
      { id: 'biblioteca-a-q4', type: 'inference', prompt: '¿Por qué hay que reservar el proyector? Utiliza el ejemplo del sábado.', answer: 'Porque seis familias lo quieren y solo hay uno: no pueden usarlo todas a la vez.', lines: 2, evidence: [{ paragraph: 3, text: 'Seis familias quieren el mismo proyector el sábado. Solo hay uno y no pueden usarlo todas a la vez.' }] },
      { id: 'biblioteca-a-q5', type: 'vocabulary', prompt: '¿Qué significa que dejan el molde «al alcance»?', answer: 'Que lo dejan en un lugar donde se puede encontrar y coger fácilmente.', lines: 2, evidence: [{ paragraph: 6, text: 'Ahora lo dejan al alcance, con sus medidas bien claras.' }] },
      { id: 'biblioteca-a-q6', type: 'literal', prompt: '¿Qué ventaja tenía el molde pequeño para las personas que lo pedían?', answer: 'Cabía en muchos hornos.', lines: 1, evidence: [{ paragraph: 6, text: 'Cabía en muchos hornos.' }] },
      { id: 'biblioteca-a-q7', type: 'opinion', prompt: '¿Qué objeto propondrías para esta biblioteca? Explica para qué serviría y por qué se podría compartir.', answer: 'Respuesta abierta. Debe proponer un objeto, un uso y una razón para compartirlo, por ejemplo necesitarlo solo de vez en cuando.', lines: 3 }
    ],
    annotations: [{ paragraph: 6, text: 'al alcance', questionId: 'biblioteca-a-q5' }]
  },
  {
    ...shared, id: 'biblioteca-objetos-b-es', code: 'L208B', workId: 'biblioteca-objetos-b', level: '6-primary', difficulty: 'intermediate',
    title: 'La biblioteca de objetos',
    summary: 'Compartir un objeto exige algo más que guardarlo en un estante: reservas, revisiones y decisiones sobre su utilidad.',
    paragraphs: [
      'Al entrar en la biblioteca de objetos del barrio, algunas personas preguntan por los libros. Sin embargo, las estanterías contienen herramientas, moldes de tarta y material de acampada. No es una tienda: los objetos se prestan durante unos días y deben volver para que los utilice otra persona.',
      'La asociación que abrió el local había preguntado qué utensilios usaban pocas veces los vecinos. Un taladro para colgar una estantería o una escalera para pintar pueden pasar meses guardados después de usarse. Compartirlos permite resolver algunas necesidades sin comprar un ejemplar para cada casa.',
      'Eso requiere organización. Si seis familias quieren el mismo proyector el sábado, una unidad no puede atenderlas a todas a la vez. Las reservas y las fechas de devolución permiten saber cuándo estará disponible. Tener un objeto en el catálogo no significa poder entregarlo en cualquier momento.',
      'Cada préstamo incluye una ficha de piezas. El taladro sale con una funda y un cargador. Cuando regresa, se comprueba el contenido, no solo que haya vuelto la caja. Si falta algo o aparece una avería, se anota. Poner de nuevo el aparato en el estante no resuelve el problema.',
      'Tampoco se acepta cualquier donación. Antes hay que encontrar espacio y alguien que pueda revisar el objeto. Las instrucciones del fabricante acompañan los aparatos; quien no sabe usarlos debe pedir ayuda, no improvisar. Por eso el catálogo crece más despacio que el número de ofertas recibidas.',
      'Al cabo de tres meses revisaron los préstamos. El molde más solicitado no era el mayor ni el más nuevo: era pequeño y cabía en muchos hornos. Había llegado en una caja poco vistosa. Ahora lo guardan al alcance, con una fotografía y sus medidas bien claras.',
      'La asociación aprendió que un inventario largo no basta. Importa que los objetos sean útiles, vuelvan completos y estén disponibles cuando se necesitan. La biblioteca no pide renunciar a todas las pertenencias: invita a pensar cuándo necesitamos hacer una tarea y cuándo necesitamos poseer el utensilio.'
    ],
    images: original.images.map(image => ({ ...image })),
    questions: [
      { id: 'biblioteca-b-q1', type: 'literal', prompt: '¿En qué se diferencia esta biblioteca de una tienda?', answer: 'No vende los objetos: los presta durante unos días y deben volver para que los use otra persona.', lines: 2, evidence: [{ paragraph: 1, text: 'No es una tienda: los objetos se prestan durante unos días y deben volver para que los utilice otra persona.' }] },
      { id: 'biblioteca-b-q2', type: 'inference', prompt: '¿Qué relación hay entre usar un utensilio pocas veces y la idea de compartirlo?', answer: 'Si pasa mucho tiempo guardado, varias personas pueden resolver sus necesidades con un solo ejemplar en lugar de comprar uno cada una.', lines: 3, evidence: [{ paragraph: 2, text: 'pueden pasar meses guardados después de usarse. Compartirlos permite resolver algunas necesidades sin comprar un ejemplar para cada casa.' }] },
      { id: 'biblioteca-b-q3', type: 'literal', prompt: '¿Qué tres elementos deben volver en el préstamo del taladro?', answer: 'El taladro, la funda y el cargador.', lines: 2, evidence: [{ paragraph: 4, text: 'El taladro sale con una funda y un cargador.' }] },
      { id: 'biblioteca-b-q4', type: 'inference', prompt: 'Un vecino ve el proyector en el catálogo y supone que puede llevárselo el sábado. ¿Qué tendría que comprobar? Explica por qué.', answer: 'Tendría que comprobar las reservas y las fechas de devolución: que el objeto exista no significa que esté disponible en ese momento.', lines: 3, evidence: [{ paragraph: 3, text: 'Las reservas y las fechas de devolución permiten saber cuándo estará disponible. Tener un objeto en el catálogo no significa poder entregarlo en cualquier momento.' }] },
      { id: 'biblioteca-b-q5', type: 'vocabulary', prompt: '¿Qué significa «al alcance» en el caso del molde? ¿Qué relación tiene su ubicación con el uso que recibe?', answer: 'Está en un lugar fácil de encontrar y coger. Lo colocan así porque es el molde más solicitado.', lines: 3, evidence: [{ paragraph: 6, text: 'El molde más solicitado no era el mayor ni el más nuevo' }, { paragraph: 6, text: 'Ahora lo guardan al alcance' }] },
      { id: 'biblioteca-b-q6', type: 'inference', prompt: '¿Por qué una donación gratuita puede no incorporarse al catálogo? Da dos razones del texto.', answer: 'Puede faltar espacio o alguien que revise el objeto. También hay que poder utilizarlo y prestarlo en condiciones.', lines: 3, evidence: [{ paragraph: 5, text: 'Antes hay que encontrar espacio y alguien que pueda revisar el objeto.' }] },
      { id: 'biblioteca-b-q7', type: 'structure', prompt: '¿Para qué sirve el ejemplo del molde pequeño dentro de la explicación?', answer: 'Muestra que la utilidad depende de las necesidades reales y no de que el objeto sea más grande, nuevo o vistoso.', lines: 3, evidence: [{ paragraph: 6, text: 'El molde más solicitado no era el mayor ni el más nuevo: era pequeño y cabía en muchos hornos.' }] },
      { id: 'biblioteca-b-q8', type: 'inference', prompt: '¿Bastaría con contar las donaciones recibidas para saber si el servicio funciona bien? Justifica tu respuesta.', answer: 'No. Hay que comprobar si se pueden prestar, si son útiles, si vuelven completos y si están disponibles cuando se necesitan.', lines: 3, evidence: [{ paragraph: 7, text: 'un inventario largo no basta. Importa que los objetos sean útiles, vuelvan completos y estén disponibles cuando se necesitan.' }] },
      { id: 'biblioteca-b-q9', type: 'summary', prompt: 'Explica con un ejemplo del texto la diferencia entre necesitar hacer una tarea y necesitar poseer un utensilio.', answer: 'Por ejemplo, para colgar una estantería se necesita usar un taladro durante un rato, pero eso no obliga a comprarlo y tenerlo siempre en casa.', lines: 3, evidence: [{ paragraph: 2, text: 'Un taladro para colgar una estantería' }, { paragraph: 2, text: 'Compartirlos permite resolver algunas necesidades sin comprar un ejemplar para cada casa.' }] },
      { id: 'biblioteca-b-q10', type: 'opinion', prompt: 'Propón un objeto para el catálogo y justifícalo con dos criterios de la lectura. ¿Qué dificultad habría que resolver?', answer: 'Respuesta abierta con dos criterios, como uso ocasional, utilidad, espacio o revisión posible, y una dificultad relacionada con su préstamo.', lines: 4 }
    ],
    annotations: [{ paragraph: 6, text: 'al alcance', questionId: 'biblioteca-b-q5' }, { paragraph: 7, text: 'inventario', definition: 'Lista de los objetos que tiene un servicio o un lugar.' }]
  }
];

export const readingsFamilyCa = [
  {
    id: 'biblioteca-objetos-a-ca', code: 'L208A', title: 'La biblioteca d’objectes',
    summary: 'Una biblioteca deixa en préstec eines i estris. Per compartir-los, cal reservar-los i tornar-ne totes les peces.',
    paragraphs: [
      'A la biblioteca del barri no hi ha llibres. Als prestatges hi ha eines, motlles de pastís i material d’acampada. No es venen. Els veïns se’ls emporten uns dies i després els tornen.',
      'L’associació va obrir el local perquè moltes persones fan servir alguns objectes poques vegades. Un trepant serveix per penjar una prestatgeria. Després pot passar mesos desat. Compartir-lo evita comprar-ne un per a cada casa.',
      'Però compartir també exigeix organitzar-se. Sis famílies volen el mateix projector dissabte. Només n’hi ha un i no el poden fer servir totes alhora. Per això s’anoten les reserves i el dia del retorn.',
      'Cada objecte té una fitxa amb les peces. El trepant surt amb una funda i un carregador. Quan torna, cal comprovar les tres coses. Trobar la capsa no és suficient: a dins podria faltar alguna cosa.',
      'La biblioteca no accepta qualsevol donació. Abans ha de trobar algú que revisi l’objecte. També lliura les instruccions per utilitzar-lo. Omplir els prestatges no serveix de gaire si els aparells no es poden prestar.',
      'Al cap de tres mesos van descobrir que el motlle més prestat era petit i poc vistós. Cabia en molts forns. Ara el deixen a l’abast, amb les mides ben clares. Ser el més nou no l’hauria fet més útil.'
    ],
    imageAlt: originalCa.imageAlt,
    questions: [
      { id: 'biblioteca-a-q1', type: 'literal', prompt: 'Es compren els objectes d’aquesta biblioteca? Explica què en fan els veïns.', answer: 'No. Se’ls emporten uns dies i després els tornen.', lines: 2, evidence: [{ paragraph: 1, text: 'No es venen. Els veïns se’ls emporten uns dies i després els tornen.' }] },
      { id: 'biblioteca-a-q2', type: 'inference', prompt: 'Per què pot ser bona idea compartir un trepant que es fa servir poques vegades?', answer: 'Perquè pot passar mesos desat i, si es comparteix, no cal comprar-ne un per a cada casa.', lines: 2, evidence: [{ paragraph: 2, text: 'Després pot passar mesos desat. Compartir-lo evita comprar-ne un per a cada casa.' }] },
      { id: 'biblioteca-a-q3', type: 'literal', prompt: 'Escriu les tres coses que cal comprovar quan torna el trepant.', answer: 'El trepant, la funda i el carregador.', lines: 2, evidence: [{ paragraph: 4, text: 'El trepant surt amb una funda i un carregador. Quan torna, cal comprovar les tres coses.' }] },
      { id: 'biblioteca-a-q4', type: 'inference', prompt: 'Per què cal reservar el projector? Fes servir l’exemple de dissabte.', answer: 'Perquè sis famílies el volen i només n’hi ha un: no el poden fer servir totes alhora.', lines: 2, evidence: [{ paragraph: 3, text: 'Sis famílies volen el mateix projector dissabte. Només n’hi ha un i no el poden fer servir totes alhora.' }] },
      { id: 'biblioteca-a-q5', type: 'vocabulary', prompt: 'Què vol dir que deixen el motlle «a l’abast»?', answer: 'Que el deixen en un lloc on es pot trobar i agafar fàcilment.', lines: 2, evidence: [{ paragraph: 6, text: 'Ara el deixen a l’abast, amb les mides ben clares.' }] },
      { id: 'biblioteca-a-q6', type: 'literal', prompt: 'Quin avantatge tenia el motlle petit per a les persones que el demanaven?', answer: 'Cabia en molts forns.', lines: 1, evidence: [{ paragraph: 6, text: 'Cabia en molts forns.' }] },
      { id: 'biblioteca-a-q7', type: 'opinion', prompt: 'Quin objecte proposaries per a aquesta biblioteca? Explica per a què serviria i per què es podria compartir.', answer: 'Resposta oberta. Cal proposar un objecte, un ús i una raó per compartir-lo, com ara necessitar-lo només de tant en tant.', lines: 3 }
    ],
    annotations: [{ paragraph: 6, text: 'a l’abast', questionId: 'biblioteca-a-q5' }]
  },
  {
    id: 'biblioteca-objetos-b-ca', code: 'L208B', title: 'La biblioteca d’objectes',
    summary: 'Compartir un objecte exigeix més que desar-lo en un prestatge: reserves, revisions i decisions sobre la seva utilitat.',
    paragraphs: [
      'En entrar a la biblioteca d’objectes del barri, algunes persones pregunten pels llibres. Tanmateix, a les prestatgeries hi ha eines, motlles de pastís i material d’acampada. No és una botiga: els objectes es deixen en préstec durant uns dies i han de tornar perquè els utilitzi una altra persona.',
      'L’associació que va obrir el local havia preguntat quins estris feien servir poques vegades els veïns. Un trepant per penjar una prestatgeria o una escala per pintar poden passar mesos desats després d’utilitzar-se. Compartir-los permet resoldre algunes necessitats sense comprar un exemplar per a cada casa.',
      'Això requereix organització. Si sis famílies volen el mateix projector dissabte, una unitat no les pot atendre totes alhora. Les reserves i les dates de retorn permeten saber quan estarà disponible. Tenir un objecte al catàleg no vol dir poder-lo lliurar en qualsevol moment.',
      'Cada préstec inclou una fitxa de peces. El trepant surt amb una funda i un carregador. Quan torna, se’n comprova el contingut, no només que hagi tornat la capsa. Si falta alguna cosa o hi ha una avaria, s’anota. Tornar a posar l’aparell al prestatge no resol el problema.',
      'Tampoc no s’accepta qualsevol donació. Abans cal trobar espai i algú que pugui revisar l’objecte. Les instruccions del fabricant acompanyen els aparells; qui no els sap utilitzar ha de demanar ajuda, no improvisar. Per això el catàleg creix més a poc a poc que el nombre d’ofertes rebudes.',
      'Al cap de tres mesos van revisar els préstecs. El motlle més sol·licitat no era el més gran ni el més nou: era petit i cabia en molts forns. Havia arribat en una capsa poc vistosa. Ara el desen a l’abast, amb una fotografia i les mides ben clares.',
      'L’associació va aprendre que un inventari llarg no és suficient. Importa que els objectes siguin útils, tornin complets i estiguin disponibles quan es necessiten. La biblioteca no demana renunciar a totes les pertinences: convida a pensar quan necessitem fer una tasca i quan necessitem posseir l’estri.'
    ],
    imageAlt: originalCa.imageAlt,
    questions: [
      { id: 'biblioteca-b-q1', type: 'literal', prompt: 'En què es diferencia aquesta biblioteca d’una botiga?', answer: 'No ven els objectes: els deixa en préstec durant uns dies i han de tornar perquè els utilitzi una altra persona.', lines: 2, evidence: [{ paragraph: 1, text: 'No és una botiga: els objectes es deixen en préstec durant uns dies i han de tornar perquè els utilitzi una altra persona.' }] },
      { id: 'biblioteca-b-q2', type: 'inference', prompt: 'Quina relació hi ha entre fer servir un estri poques vegades i la idea de compartir-lo?', answer: 'Si passa molt de temps desat, diverses persones poden resoldre les seves necessitats amb un sol exemplar en lloc de comprar-ne un cadascuna.', lines: 3, evidence: [{ paragraph: 2, text: 'poden passar mesos desats després d’utilitzar-se. Compartir-los permet resoldre algunes necessitats sense comprar un exemplar per a cada casa.' }] },
      { id: 'biblioteca-b-q3', type: 'literal', prompt: 'Quins tres elements han de tornar en el préstec del trepant?', answer: 'El trepant, la funda i el carregador.', lines: 2, evidence: [{ paragraph: 4, text: 'El trepant surt amb una funda i un carregador.' }] },
      { id: 'biblioteca-b-q4', type: 'inference', prompt: 'Un veí veu el projector al catàleg i suposa que se’l pot emportar dissabte. Què hauria de comprovar? Explica per què.', answer: 'Hauria de comprovar les reserves i les dates de retorn: que l’objecte existeixi no vol dir que estigui disponible en aquell moment.', lines: 3, evidence: [{ paragraph: 3, text: 'Les reserves i les dates de retorn permeten saber quan estarà disponible. Tenir un objecte al catàleg no vol dir poder-lo lliurar en qualsevol moment.' }] },
      { id: 'biblioteca-b-q5', type: 'vocabulary', prompt: 'Què vol dir «a l’abast» en el cas del motlle? Quina relació té la seva ubicació amb l’ús que rep?', answer: 'És en un lloc fàcil de trobar i agafar. El col·loquen així perquè és el motlle més sol·licitat.', lines: 3, evidence: [{ paragraph: 6, text: 'El motlle més sol·licitat no era el més gran ni el més nou' }, { paragraph: 6, text: 'Ara el desen a l’abast' }] },
      { id: 'biblioteca-b-q6', type: 'inference', prompt: 'Per què una donació gratuïta pot no incorporar-se al catàleg? Dona dues raons del text.', answer: 'Pot faltar espai o algú que revisi l’objecte. També cal poder-lo utilitzar i prestar en condicions.', lines: 3, evidence: [{ paragraph: 5, text: 'Abans cal trobar espai i algú que pugui revisar l’objecte.' }] },
      { id: 'biblioteca-b-q7', type: 'structure', prompt: 'Per a què serveix l’exemple del motlle petit dins de l’explicació?', answer: 'Mostra que la utilitat depèn de les necessitats reals i no que l’objecte sigui més gran, nou o vistós.', lines: 3, evidence: [{ paragraph: 6, text: 'El motlle més sol·licitat no era el més gran ni el més nou: era petit i cabia en molts forns.' }] },
      { id: 'biblioteca-b-q8', type: 'inference', prompt: 'N’hi hauria prou de comptar les donacions rebudes per saber si el servei funciona bé? Justifica la resposta.', answer: 'No. Cal comprovar si es poden prestar, si són útils, si tornen complets i si estan disponibles quan es necessiten.', lines: 3, evidence: [{ paragraph: 7, text: 'un inventari llarg no és suficient. Importa que els objectes siguin útils, tornin complets i estiguin disponibles quan es necessiten.' }] },
      { id: 'biblioteca-b-q9', type: 'summary', prompt: 'Explica amb un exemple del text la diferència entre necessitar fer una tasca i necessitar posseir un estri.', answer: 'Per exemple, per penjar una prestatgeria cal fer servir un trepant durant una estona, però això no obliga a comprar-lo i tenir-lo sempre a casa.', lines: 3, evidence: [{ paragraph: 2, text: 'Un trepant per penjar una prestatgeria' }, { paragraph: 2, text: 'Compartir-los permet resoldre algunes necessitats sense comprar un exemplar per a cada casa.' }] },
      { id: 'biblioteca-b-q10', type: 'opinion', prompt: 'Proposa un objecte per al catàleg i justifica’l amb dos criteris de la lectura. Quina dificultat caldria resoldre?', answer: 'Resposta oberta amb dos criteris, com ús ocasional, utilitat, espai o revisió possible, i una dificultat relacionada amb el préstec.', lines: 4 }
    ],
    annotations: [{ paragraph: 6, text: 'a l’abast', questionId: 'biblioteca-b-q5' }, { paragraph: 7, text: 'inventari', definition: 'Llista dels objectes que té un servei o un lloc.' }]
  }
];
