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
];
