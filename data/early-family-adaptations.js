import { q } from './family-adaptation-model.js';

export const earlyFamilyAdaptations = [
  {
    source: 'L104', suffix: 'A', level: '2-primary', difficulty: 'initial',
    summary: ['Julia y Omar buscan un sitio seco para leer un cómic.', 'La Júlia i l’Omar busquen un lloc sec per llegir un còmic.'],
    paragraphs: [
      ['Julia y Omar salen al patio. Llevan un cómic. Quieren leer juntos.', 'La Júlia i l’Omar surten al pati. Porten un còmic. Volen llegir junts.'],
      ['Ha llovido. El banco verde está mojado. Julia cierra el cómic. No quiere mojar el papel.', 'Ha plogut. El banc verd és moll. La Júlia tanca el còmic. No vol mullar el paper.'],
      ['Junto a la puerta hay un muro bajo. Tiene un techo encima. El muro está seco.', 'Al costat de la porta hi ha un mur baix. Té un sostre a sobre. El mur és sec.'],
      ['Julia y Omar se sientan en el muro. Abren el cómic y leen.', 'La Júlia i l’Omar seuen al mur. Obren el còmic i llegeixen.'],
    ],
    imageAfter: [2],
    questions: [
      q('literal', 1, '¿Qué llevan al patio?', 'Què porten al pati?', 'Un cómic.', 'Un còmic.', [1, 'Llevan un cómic.', 'Porten un còmic.']),
      q('literal', 1, '¿Cómo está el banco: mojado o seco?', 'Com és el banc: moll o sec?', 'Mojado.', 'Moll.', [2, 'El banco verde está mojado.', 'El banc verd és moll.']),
      q('literal', 1, '¿Qué hay encima del muro?', 'Què hi ha a sobre del mur?', 'Un techo.', 'Un sostre.', [3, 'Tiene un techo encima.', 'Té un sostre a sobre.']),
      q('literal', 1, '¿Dónde se sientan para leer?', 'On seuen per llegir?', 'En el muro.', 'Al mur.', [4, 'se sientan en el muro', 'seuen al mur']),
    ],
  },
  {
    source: 'L104', suffix: 'B', level: '4-primary', difficulty: 'initial',
    summary: ['Julia y Omar cambian de lugar para proteger un cómic después de la lluvia.', 'La Júlia i l’Omar canvien de lloc per protegir un còmic després de la pluja.'],
    paragraphs: [
      ['Cuando sonó el timbre, la lluvia acababa de parar. Julia y Omar salieron al patio con un cómic de la biblioteca de clase. Habían dejado una historia a medias y querían terminarla juntos. Se dirigieron al banco verde, al lado del arenero, donde se sentaban casi todos los días.', 'Quan va sonar el timbre, la pluja acabava de parar. La Júlia i l’Omar van sortir al pati amb un còmic de la biblioteca de classe. Havien deixat una història a mitges i la volien acabar junts. Es van dirigir al banc verd, al costat del sorral, on seien gairebé cada dia.'],
      ['El asiento tenía pequeñas gotas. Omar pasó un dedo por la madera y lo levantó mojado. Julia cerró enseguida el libro y lo sujetó contra su chaqueta. Aunque ya no caía agua del cielo, apoyar allí el cómic podía mojar sus páginas.', 'El seient tenia gotes petites. L’Omar va passar un dit per la fusta i el va aixecar mullat. La Júlia va tancar de seguida el llibre i el va subjectar contra la jaqueta. Tot i que ja no queia aigua del cel, recolzar-hi el còmic podia mullar els fulls.'],
      ['Cerca de la puerta había un muro bajo de piedra. El techo de la entrada cubría aquella parte del patio. Julia se acercó y pasó la mano por la superficie: estaba seca. No le bastó con mirarla desde lejos antes de decidir dónde poner el libro.', 'A prop de la porta hi havia un mur baix de pedra. El sostre de l’entrada cobria aquella part del pati. La Júlia s’hi va acostar i va passar la mà per la superfície: era seca. No en va tenir prou de mirar-la de lluny abans de decidir on posar el llibre.'],
      ['—Aquí cabemos los dos —dijo.\nSe sentaron en el muro, lejos del borde. Omar abrió el cómic por la página señalada con un papel. Desde allí también veían el arenero y podían oír el timbre. Leyeron por turnos hasta llegar al final de la historia.', '—Aquí hi cabem tots dos —va dir.\nVan seure al mur, lluny de la vora. L’Omar va obrir el còmic per la pàgina assenyalada amb un paper. Des d’allà també veien el sorral i podien sentir el timbre. Van llegir per torns fins a arribar al final de la història.'],
      ['Al volver a clase, Julia miró el banco. Aún brillaban algunas gotas sobre la madera. Guardó el cómic seco en la estantería de la biblioteca.', 'En tornar a classe, la Júlia va mirar el banc. Encara brillaven algunes gotes damunt la fusta. Va desar el còmic sec al prestatge de la biblioteca.'],
    ],
    imageAfter: [2],
    questions: [
      q('literal', 1, '¿De dónde habían cogido el cómic?', 'D’on havien agafat el còmic?', 'De la biblioteca de clase.', 'De la biblioteca de classe.', [1, 'un cómic de la biblioteca de clase', 'un còmic de la biblioteca de classe']),
      q('literal', 1, '¿Dónde estaba el banco verde?', 'On era el banc verd?', 'Al lado del arenero.', 'Al costat del sorral.', [1, 'al lado del arenero', 'al costat del sorral']),
      q('inference', 2, '¿Por qué Julia cierra el cómic aunque ya no llueve?', 'Per què la Júlia tanca el còmic tot i que ja no plou?', 'Porque el banco sigue mojado y las páginas podrían mojarse al apoyarlo.', 'Perquè el banc continua moll i els fulls es podrien mullar en recolzar-hi el còmic.', [2, 'apoyar allí el cómic podía mojar sus páginas', 'recolzar-hi el còmic podia mullar els fulls']),
      q('literal', 1, '¿Qué hace Julia para comprobar cómo está la piedra?', 'Què fa la Júlia per comprovar com és la pedra?', 'Pasa la mano por la superficie.', 'Passa la mà per la superfície.', [3, 'pasó la mano por la superficie', 'va passar la mà per la superfície']),
      q('inference', 2, '¿Qué protegía el muro de la lluvia?', 'Què protegia el mur de la pluja?', 'El techo de la entrada, que cubría aquella parte del patio.', 'El sostre de l’entrada, que cobria aquella part del pati.', [3, 'El techo de la entrada cubría aquella parte del patio.', 'El sostre de l’entrada cobria aquella part del pati.']),
      q('literal', 1, '¿Cómo encuentran la página por la que querían continuar?', 'Com troben la pàgina per on volien continuar?', 'Con el papel que la señalaba.', 'Amb el paper que l’assenyalava.', [4, 'la página señalada con un papel', 'la pàgina assenyalada amb un paper']),
      q('opinion', 3, 'Propón otro lugar para leer después de llover. Explica qué comprobarías antes de dejar allí un libro.', 'Proposa un altre lloc per llegir després de ploure. Explica què comprovaries abans de deixar-hi un llibre.', 'Respuesta abierta que proponga un sitio plausible y compruebe que la superficie está seca y permite leer.', 'Resposta oberta que proposi un lloc plausible i comprovi que la superfície és seca i permet llegir.'),
    ],
  },
  {
    source: 'L107', suffix: 'A', level: '2-primary', difficulty: 'initial',
    summary: ['Une aros de papel para hacer una cadena de colores.', 'Uneix anelles de paper per fer una cadena de colors.'],
    paragraphs: [
      ['Vamos a hacer una cadena de papel para decorar. Prepara seis tiras de papel y cinta adhesiva.', 'Farem una cadena de paper per decorar. Prepara sis tires de paper i cinta adhesiva.'],
      ['1. Coge una tira. Junta las puntas. Pégalas con cinta. Ya tienes un aro.', '1. Agafa una tira. Ajunta les puntes. Enganxa-les amb cinta. Ja tens una anella.'],
      ['2. Pasa la segunda tira por dentro del aro. Pega las puntas de la tira. Los dos aros están unidos.', '2. Passa la segona tira per dins de l’anella. Enganxa les puntes de la tira. Les dues anelles estan unides.'],
      ['3. Haz lo mismo con las otras tiras. Pide ayuda para colgar la cadena.', '3. Fes el mateix amb les altres tires. Demana ajuda per penjar la cadena.'],
    ],
    imageAfter: [2],
    questions: [
      q('literal', 1, '¿Cuántas tiras necesitas?', 'Quantes tires et calen?', 'Seis.', 'Sis.', [1, 'Prepara seis tiras de papel', 'Prepara sis tires de paper']),
      q('literal', 1, '¿Con qué pegas las puntas?', 'Amb què enganxes les puntes?', 'Con cinta adhesiva.', 'Amb cinta adhesiva.', [1, 'cinta adhesiva', 'cinta adhesiva']),
      q('literal', 1, '¿Por dónde pasas la segunda tira?', 'Per on passes la segona tira?', 'Por dentro del aro.', 'Per dins de l’anella.', [3, 'por dentro del aro', 'per dins de l’anella']),
      q('literal', 1, '¿Para qué sirve la cadena?', 'Per a què serveix la cadena?', 'Para decorar.', 'Per decorar.', [1, 'para decorar', 'per decorar']),
    ],
  },
  {
    source: 'L107', suffix: 'B', level: '4-primary', difficulty: 'initial',
    summary: ['Construye una guirnalda de seis aros y comprueba cada unión antes de continuar.', 'Construeix una garlanda de sis anelles i comprova cada unió abans de continuar.'],
    paragraphs: [
      ['Una guirnalda es una cadena que sirve para decorar. Puedes hacerla con hojas usadas y darle color antes de montar los aros. Prepara papel, tijeras de punta redonda y cinta adhesiva. Trabaja sobre una mesa con espacio para extender las tiras.', 'Una garlanda és una cadena que serveix per decorar. La pots fer amb fulls usats i donar-hi color abans de muntar les anelles. Prepara paper, tisores de punta rodona i cinta adhesiva. Treballa damunt d’una taula amb espai per estendre les tires.'],
      ['1. Corta seis tiras del mismo tamaño. Ponlas una junto a otra para compararlas. Si decides pintarlas, deja que se sequen antes de pegarlas. Así no mancharás las partes que ya estén terminadas.', '1. Talla sis tires de la mateixa mida. Posa-les l’una al costat de l’altra per comparar-les. Si decideixes pintar-les, deixa que s’assequin abans d’enganxar-les. Així no tacaràs les parts que ja estiguin acabades.'],
      ['2. Coge la primera tira y acerca sus puntas hasta formar un aro. Haz que se monten un poco y únelas con cinta. Comprueba que la unión no se abre cuando sueltas el papel.', '2. Agafa la primera tira i acosta’n les puntes fins a formar una anella. Fes que se sobreposin una mica i uneix-les amb cinta. Comprova que la unió no s’obre quan deixes anar el paper.'],
      ['3. Pasa la segunda tira, todavía abierta, por dentro del primer aro. Después pega sus puntas. Levanta suavemente el primer aro: el segundo debe quedar colgado de él. Si has cerrado los dos por separado, tendrás dos aros, pero aún no una cadena.', '3. Passa la segona tira, encara oberta, per dins de la primera anella. Després enganxa’n les puntes. Aixeca suaument la primera anella: la segona n’ha de quedar penjada. Si les has tancades totes dues per separat, tindràs dues anelles, però encara no una cadena.'],
      ['4. Añade las otras tiras del mismo modo, siempre pasando la nueva por el último aro antes de cerrarla. Al terminar, cuenta los seis aros y revisa las uniones. Pide ayuda para colgar la guirnalda por sus dos extremos, sin estirarla con fuerza.', '4. Afegeix les altres tires de la mateixa manera, passant sempre la nova per l’última anella abans de tancar-la. Quan acabis, compta les sis anelles i revisa les unions. Demana ajuda per penjar la garlanda per les dues puntes, sense estirar-la amb força.'],
    ],
    imageAfter: [3],
    questions: [
      q('literal', 1, '¿Qué puedes aprovechar para hacer la guirnalda?', 'Què pots aprofitar per fer la garlanda?', 'Hojas usadas.', 'Fulls usats.', [1, 'con hojas usadas', 'amb fulls usats']),
      q('literal', 1, '¿Cómo compruebas que las tiras tienen el mismo tamaño?', 'Com comproves que les tires tenen la mateixa mida?', 'Poniéndolas una junto a otra para compararlas.', 'Posant-les l’una al costat de l’altra per comparar-les.', [2, 'Ponlas una junto a otra para compararlas.', 'Posa-les l’una al costat de l’altra per comparar-les.']),
      q('inference', 2, '¿Por qué debes esperar después de pintar y antes de pegar?', 'Per què t’has d’esperar després de pintar i abans d’enganxar?', 'Para que la pintura se seque y no manche otras partes terminadas.', 'Perquè la pintura s’assequi i no taqui altres parts acabades.', [2, 'deja que se sequen antes de pegarlas', 'deixa que s’assequin abans d’enganxar-les']),
      q('literal', 1, '¿Qué usas para unir las puntas?', 'Què fas servir per unir les puntes?', 'Cinta adhesiva.', 'Cinta adhesiva.', [3, 'únelas con cinta', 'uneix-les amb cinta']),
      q('structure', 2, 'Explica el orden de estas dos acciones: pasar la segunda tira y cerrar sus puntas.', 'Explica l’ordre d’aquestes dues accions: passar la segona tira i tancar-ne les puntes.', 'Primero se pasa la tira abierta por el primer aro; después se pegan sus puntas.', 'Primer es passa la tira oberta per la primera anella; després se n’enganxen les puntes.', [4, 'todavía abierta, por dentro del primer aro. Después pega sus puntas.', 'encara oberta, per dins de la primera anella. Després enganxa’n les puntes.']),
      q('inference', 2, '¿Por qué dos aros cerrados por separado todavía no forman una cadena?', 'Per què dues anelles tancades per separat encara no formen una cadena?', 'Porque no están enlazados; hay que pasar una tira por el aro anterior antes de cerrarla.', 'Perquè no estan enllaçades; cal passar una tira per l’anella anterior abans de tancar-la.', [4, 'dos aros, pero aún no una cadena', 'dues anelles, però encara no una cadena']),
      q('opinion', 3, 'Propón una combinación de colores para tu guirnalda y explica cómo los repartirías entre los seis aros.', 'Proposa una combinació de colors per a la garlanda i explica com els repartiries entre les sis anelles.', 'Respuesta abierta con una distribución coherente para seis aros; puede repetir colores o alternarlos.', 'Resposta oberta amb una distribució coherent per a sis anelles; pot repetir colors o alternar-los.'),
    ],
  },
];
