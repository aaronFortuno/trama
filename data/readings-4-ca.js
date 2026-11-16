export const readings4Ca = [
  {
    id: 'labric-del-penjador-ca',
    code: 'L021',
    title: 'L’abric del penjador',
    summary: 'Dos abrics gairebé iguals porten la Vera a esbrinar de qui és el missatge que troba en una butxaca.',
    paragraphs: [
      'Dilluns, després de gimnàstica, la Vera va veure que només quedava un abric al penjador. Era blau i tenia una estrella cosida a la màniga, igual que el seu. Se’l va posar sense mirar-s’hi més i va sortir al pati. Allà va buscar el mocador a la butxaca. En lloc del mocador, va trobar un paper doblegat.',
      'Al paper hi deia: «Recorda’t de deixar les claus a consergeria». La Vera no portava mai claus a l’escola. Es va treure l’abric i en va mirar l’etiqueta. Sota la talla algú hi havia escrit «M. Vega». L’estrella era com la seva, però estava cosida a l’altra màniga.',
      'La Vera va tornar al gimnàs. El seu abric encara era damunt del banc, mig amagat sota una màrfega. Sobre la taula hi havia la llista de qui s’havia quedat a recollir les cordes. En llegir-la, la Vera hi va reconèixer un nom que coincidia amb l’etiqueta: Mario Vega.',
      'Va trobar en Mario al costat de l’entrada. Duia les claus a la mà i acabava de preguntar pel seu abric. La Vera li va tornar l’abric que havia agafat i li va assenyalar la butxaca. Després va decidir marcar la seva etiqueta amb un retolador.',
    ],
    imageAlt: {
      'el-abrigo-del-perchero': 'La Vera sosté un paper doblegat a prop de l’entrada del gimnàs. A la màniga de l’abric es veu una estrella cosida.',
    },
    questions: [
      { id: 'el-abrigo-del-perchero-q1', type: 'literal', prompt: 'Què esperava trobar la Vera a la butxaca?', answer: 'El seu mocador.', lines: 1 },
      { id: 'el-abrigo-del-perchero-q2', type: 'literal', prompt: 'On era l’abric de la Vera?', answer: 'Damunt del banc del gimnàs, mig amagat sota una màrfega.', lines: 2 },
      { id: 'el-abrigo-del-perchero-q3', type: 'inference', prompt: 'Quines dues pistes va fer servir la Vera per esbrinar de qui era l’altre abric?', answer: 'A l’etiqueta hi deia «M. Vega» i a la llista hi figurava en Mario Vega.', lines: 2 },
      { id: 'el-abrigo-del-perchero-q4', type: 'vocabulary', prompt: 'Què vol dir «mig amagat» en aquest relat?', answer: 'Que l’abric estava tapat en part i es veia poc.', lines: 2 },
      { id: 'el-abrigo-del-perchero-q5', type: 'structure', prompt: 'Què passa primer: la Vera llegeix l’etiqueta o troba el seu abric?', answer: 'Primer llegeix l’etiqueta i després troba el seu abric.', lines: 1 },
    ],
    annotations: [
      { paragraph: 2, text: 'consergeria', definition: 'Lloc de l’escola on s’atén l’entrada i es desen claus i altres objectes.' },
      { paragraph: 3, text: 'mig amagat', questionId: 'el-abrigo-del-perchero-q4' },
    ],
  },
  {
    id: 'el-punt-que-faltava-ca',
    code: 'L036',
    title: 'El punt que faltava',
    summary: 'Una errada a les invitacions d’una exposició fa que tres companys es preguntin quina informació necessita qui hi arriba de visita.',
    paragraphs: [
      'Per inaugurar l’exposició de fotos de l’escola, l’Alma, en Víctor i la Noa van fer unes invitacions. A la portada hi van posar la data, l’hora i un dibuix de l’edifici. A dins hi van enganxar una de les fotos de l’exposició. Les van repartir dimecres a la sortida de classe.',
      'Dijous, l’avi de la Noa va trucar. Sabia arribar a l’escola, però volia saber per quina porta havia d’entrar. La Noa va llegir la seva còpia de la invitació. Enlloc no deia que l’exposició es feia a l’aula de música, a prop de l’entrada petita.',
      'En Víctor va proposar tornar a imprimir totes les invitacions. L’Alma va recordar que ja n’havien repartit gairebé la meitat i que no sabien qui tenia cada còpia. La Noa va dibuixar un plànol senzill amb un punt verd al costat de l’entrada petita. El van afegir a les invitacions que encara quedaven.',
      'Per als qui ja tenien la primera versió, van preparar un altre pla. Van penjar un cartell a la porta principal, amb una fletxa que indicava com arribar-hi des d’allà. Divendres, l’avi de la Noa va aparèixer amb un veí que s’havia aturat davant de la porta principal. Tots dos van arribar junts a l’aula de música. En sortir, la Noa va desar una de les primeres invitacions al costat del plànol per revisar-los abans de la pròxima exposició.',
    ],
    imageAlt: {
      'el-punto-que-faltaba': 'Una mà sosté una invitació amb el dibuix de l’escola. A la taula hi ha més invitacions i fotografies antigues.',
    },
    questions: [
      { id: 'el-punto-que-faltaba-q1', type: 'literal', prompt: 'Quines tres coses hi havia a la portada de la primera invitació?', answer: 'La data, l’hora i un dibuix de l’edifici.', lines: 2 },
      { id: 'el-punto-que-faltaba-q2', type: 'inference', prompt: 'Per què tornar a imprimir totes les invitacions no resolia el problema per a totes les famílies?', answer: 'Ja n’havien repartit gairebé la meitat i no sabien qui tenia aquelles còpies. Per tant, era difícil canviar-les.', lines: 3 },
      { id: 'el-punto-que-faltaba-q3', type: 'vocabulary', prompt: 'Què vol dir «inaugurar» l’exposició en aquest relat?', answer: 'Obrir-la per primera vegada perquè el públic la pugui visitar.', lines: 2 },
      { id: 'el-punto-que-faltaba-q4', type: 'structure', prompt: 'Quina solució van trobar per als qui encara no tenien invitació? I per als qui ja en tenien?', answer: 'Van afegir el plànol amb el punt verd a les invitacions que quedaven i van penjar una fletxa a la porta principal per orientar els qui tenien la primera versió.', lines: 4 },
      { id: 'el-punto-que-faltaba-q5', type: 'inference', prompt: 'Què volia recordar la Noa quan va desar la primera invitació al costat del plànol?', answer: 'Que havia de comprovar si les pròximes invitacions deien on es feia l’exposició i per on s’hi entrava.', lines: 3 },
      { id: 'el-punto-que-faltaba-q6', type: 'opinion', prompt: 'Si poguessis canviar un sol element de la portada original, quin canviaries i què hi posaries? Justifica la resposta.', answer: 'Resposta oberta. Per exemple, substituiria el dibuix de l’edifici per un plànol amb l’entrada petita i l’aula de música, perquè fos més fàcil arribar-hi.', lines: 4 },
    ],
    annotations: [
      { paragraph: 1, text: 'inaugurar', questionId: 'el-punto-que-faltaba-q3' },
    ],
  },
  {
    id: 'una-resposta-per-al-canal-ca',
    code: 'L037',
    title: 'Una resposta per al canal',
    summary: 'Un grup escriu a l’ajuntament per proposar un canvi i explica què ha observat durant les passejades.',
    paragraphs: [
      'A l’equip que té cura del passeig del canal:',
      'Som la classe de quart de l’escola del Pont. Hem anat dues vegades a dibuixar el canal. En totes dues visites hem trobat embolcalls a terra, prop de les taules on la gent berena. La paperera més pròxima és al començament del passeig, a l’altra banda del pont.',
      'No sabem qui va deixar els embolcalls. El segon dia feia vent i vam veure com un paper rodolava pel camí fins que es va enganxar en una branca. Per això creiem que convé posar una paperera amb tapa al costat de les taules. Així seria més fàcil fer-la servir i hi hauria menys possibilitats que el vent s’endugués el paper.',
      'Abans de triar el lloc, ens agradaria tornar-hi amb algú del vostre equip. Hi ha un tram per on passen cadires de rodes i cotxets. Podem trobar un lloc a prop de les taules que deixi lliure aquell pas. També podem fer un dibuix que recordi als visitants on han de llençar els embolcalls.',
      'Si proveu la idea, podríem comptar els embolcalls just abans que hi poséssiu la paperera i tornar-los a comptar al cap d’un mes. A cada visita anotaríem en una taula la data i quants embolcalls hem trobat prop de les taules. Així podríem comprovar si n’hi ha menys.',
      'Gràcies per llegir la nostra proposta.',
      'La classe de quart',
    ],
    imageAlt: {
      'una-respuesta-para-el-canal': 'El vent arrossega un embolcall pel passeig del canal cap a una branca. Al fons, dos infants dibuixen.',
    },
    questions: [
      { id: 'una-respuesta-para-el-canal-q1', type: 'literal', prompt: 'On és la paperera més pròxima a les taules?', answer: 'Al començament del passeig, a l’altra banda del pont.', lines: 2 },
      { id: 'una-respuesta-para-el-canal-q2', type: 'inference', prompt: 'Què van observar que dona suport a la idea de posar-hi una paperera amb tapa?', answer: 'Van veure com el vent arrossegava un paper pel camí fins a una branca. La tapa ajudaria a evitar que els papers sortissin de la paperera.', lines: 3 },
      { id: 'una-respuesta-para-el-canal-q3', type: 'structure', prompt: 'Què proposen comprovar al paràgraf que comença amb «Si proveu la idea»?', answer: 'Proposen tornar al cap d’un mes a comptar els embolcalls de terra i veure si n’hi ha menys.', lines: 2 },
      { id: 'una-respuesta-para-el-canal-q4', type: 'inference', prompt: 'Per què busquen un lloc per a la paperera que sigui a prop de les taules i deixi espai al voltant?', answer: 'Volen que sigui fàcil fer-la servir i que no faci nosa a les cadires de rodes ni als cotxets que passen pel passeig.', lines: 3 },
      { id: 'una-respuesta-para-el-canal-q5', type: 'opinion', prompt: 'Si durant un mes no poguessin posar-hi la paperera, quina altra idea provaries perquè hi hagués menys embolcalls a terra? Explica com hi ajudaria.', answer: 'Resposta oberta. Per exemple, hi posaria un cartell que indiqués on és la paperera i demanés que hi portin els embolcalls.', lines: 4 },
    ],
    annotations: [
      { paragraph: 2, text: 'embolcalls', definition: 'Papers o plàstics que es fan servir per cobrir una cosa, com ara un aliment.' },
    ],
  },
  {
    id: 'per-que-sura-el-gel-ca',
    code: 'L038',
    title: 'Per què sura el gel?',
    summary: 'Una prova a l’aula permet relacionar què passa quan l’aigua es congela amb el que veiem quan un glaçó sura.',
    paragraphs: [
      'Al menjador, en Darío es va posar un glaçó al got. Una part petita va quedar fora de l’aigua. El va empènyer amb una cullera per enfonsar-lo, però el glaçó va tornar a pujar tan bon punt va retirar la cullera. L’endemà, la classe va preparar una prova per entendre el que havia vist.',
      'Van omplir dos recipients de plàstic amb la mateixa quantitat d’aigua. En tots dos van deixar una mica d’espai a sobre i van marcar el nivell amb un retolador. En van deixar un a l’aula i van posar l’altre al congelador. L’endemà al matí, el gel arribava més amunt que la marca. L’aigua de l’aula encara era gairebé a la mateixa altura.',
      'Quan l’aigua es congela, les seves partícules s’ordenen d’una manera que deixa més espai entre elles. Per això la mateixa quantitat d’aigua ocupa més lloc quan es converteix en gel. Si compares dues porcions de la mateixa mida, una d’aigua líquida i una de gel, la de gel pesa menys. Això fa que el gel suri a l’aigua.',
      'En un estany tranquil, l’aigua que es refreda en contacte amb l’aire pot formar una capa de gel a la superfície. A sota d’aquesta capa hi pot continuar havent aigua líquida. Tant al got d’en Darío com a l’estany, el gel queda a dalt.',
    ],
    imageAlt: {
      'por-que-el-hielo-flota': 'Un glaçó sura en un got d’aigua i només en sobresurt una punta. Al costat del got hi ha una cullereta.',
    },
    questions: [
      { id: 'por-que-el-hielo-flota-q1', type: 'literal', prompt: 'Què li va passar al glaçó quan en Darío va retirar la cullera?', answer: 'Va tornar a pujar i va quedar surant.', lines: 1 },
      { id: 'por-que-el-hielo-flota-q2', type: 'inference', prompt: 'Per què van posar la mateixa quantitat d’aigua als dos recipients i en van marcar el nivell al començament?', answer: 'Per poder comparar els dos casos partint del mateix nivell i veure si l’aigua que s’havia congelat ocupava més espai.', lines: 3 },
      { id: 'por-que-el-hielo-flota-q3', type: 'vocabulary', prompt: 'Què vol dir «superfície» a l’últim paràgraf?', answer: 'La part de dalt de l’aigua, que està en contacte amb l’aire abans de glaçar-se.', lines: 2 },
      { id: 'por-que-el-hielo-flota-q4', type: 'structure', prompt: 'Quin paràgraf explica per què sura el gel i quin en dona un exemple de la natura?', answer: 'El tercer explica la causa. El quart dona l’exemple de l’estany.', lines: 2 },
      { id: 'por-que-el-hielo-flota-q5', type: 'inference', prompt: 'Si haguessin omplert fins a la vora el recipient del congelador, què podria passar quan es formés el gel? Explica per què.', answer: 'El gel podria sobresortir o deformar el recipient perquè l’aigua ocupa més espai quan es congela.', lines: 3 },
      { id: 'por-que-el-hielo-flota-q6', type: 'literal', prompt: 'Segons el text, si tenim dues porcions de la mateixa mida, una de gel i una d’aigua líquida, quina pesa menys?', answer: 'La de gel.', lines: 1 },
    ],
    annotations: [
      { paragraph: 3, text: 'partícules', definition: 'Parts tan petites d’una substància que no es distingeixen a ull nu.' },
      { paragraph: 4, text: 'superfície', questionId: 'por-que-el-hielo-flota-q3' },
    ],
  },
  {
    id: 'el-taller-dels-paraigues-ca',
    code: 'L039',
    title: 'El taller dels paraigües',
    summary: 'Una reparadora explica com distingeix una avaria petita d’un problema que pot tornar a espatllar el paraigua.',
    paragraphs: [
      'En una fira de reparació, la classe de quart va trobar una taula plena de paraigües oberts. La Irene, que arregla objectes del barri, va deixar que l’Hugo li fes unes preguntes mentre examinava un paraigua groc.',
      '—Què és el primer que mires quan un paraigua no es tanca?\n—L’obro només una mica i observo les barnilles. Si n’hi ha una de doblegada, en comparo la forma amb la de les altres. De vegades n’hi ha prou d’adreçar-la. Si s’ha trencat, busco una peça de la mateixa mida.',
      '—Aquest paraigua té la roba desenganxada. Per on començaràs?\n—Primer miraré si la barnilla que l’aguanta es mou bé. Si cosim la roba abans i la barnilla encara està torta, en obrir el paraigua podria tornar a estirar el fil i trencar la costura.',
      '—D’on surten les peces que fas servir?\n—D’altres paraigües que no hem pogut reparar. Els desmuntem i guardem les peces que encara serveixen. Aquest calaix és ple de barnilles. Les tenim separades per llargada per trobar més de pressa la que hi encaixa.',
      '—Quan saps que ja pots tornar un paraigua?\n—Quan l’he obert i tancat unes quantes vegades. Després miro la roba a contrallum. Si hi veig un forat, el marco amb una pinça i el tapo. Aleshores ja el puc deixar a la taula de recollida.',
    ],
    imageAlt: {
      'el-taller-de-los-paraguas': 'La Irene examina les barnilles d’un paraigua en una taula de reparació. L’Hugo se la mira amb una llibreta a la mà.',
    },
    questions: [
      { id: 'el-taller-de-los-paraguas-q1', type: 'literal', prompt: 'D’on treu la Irene algunes peces de recanvi?', answer: 'De paraigües que no han pogut reparar i que encara tenen peces aprofitables.', lines: 2 },
      { id: 'el-taller-de-los-paraguas-q2', type: 'vocabulary', prompt: 'Què vol dir mirar la roba «a contrallum»?', answer: 'Posar la roba entre la persona que mira i una font de llum per veure millor si la claror passa per algun forat.', lines: 2 },
      { id: 'el-taller-de-los-paraguas-q3', type: 'inference', prompt: 'Per què la Irene examina primer la barnilla del paraigua groc i després en cus la roba?', answer: 'Si la barnilla fos torta, podria estirar el fil i tornar a trencar la costura quan s’obrís el paraigua.', lines: 3 },
      { id: 'el-taller-de-los-paraguas-q4', type: 'structure', prompt: 'Quina pregunta de l’Hugo fa que la Irene expliqui com endreça les barnilles?', answer: '«D’on surten les peces que fas servir?»', lines: 2 },
      { id: 'el-taller-de-los-paraguas-q5', type: 'inference', prompt: 'Per què li convé a la Irene tenir les barnilles separades per llargada quan se n’ha trencat una?', answer: 'Pot trobar més de pressa una barnilla de la mateixa mida que la trencada.', lines: 2 },
      { id: 'el-taller-de-los-paraguas-q6', type: 'opinion', prompt: 'Quin objecte quotidià portaries a la fira perquè te’l revisessin? Digues quina part comprovaries abans de decidir com arreglar-lo.', answer: 'Resposta oberta. Per exemple, una motxilla amb la cremallera espatllada. Miraria si s’hi ha enganxat roba o si hi falta alguna dent.', lines: 4 },
    ],
    annotations: [
      { paragraph: 5, text: 'a contrallum', questionId: 'el-taller-de-los-paraguas-q2' },
    ],
  },
  {
    id: 'una-llum-a-la-graderia-ca',
    code: 'L040',
    title: 'Una llum a la graderia',
    summary: 'Quan falla un llum durant un assaig de música, la classe busca una altra manera de donar el senyal per començar alhora.',
    paragraphs: [
      'Dijous, la classe de quart assajava una cançó a la sala d’actes. Havien posat els cantaires darrere d’una fila de tambors. Des del fons, la Mara no veia la mà de la mestra, que els indicava quan havien de començar. Es guiava pel llum que s’encenia damunt de la primera fila.',
      'En tornar del descans, van prémer l’interruptor i el llum no es va encendre. La mestra els va dir que assagessin igualment. Els tambors van començar junts, però els cantaires van entrar en tres moments diferents. Durant un instant, la Mara va sentir només la seva veu i va deixar de cantar.',
      'L’Óscar va proposar que fessin una picada de mans per donar el senyal. Ho van provar una vegada. Des del fons, la picada de mans es confonia amb el primer cop de tambor. Aleshores la Mara es va fixar que la Noelia, la conserge, mirava l’assaig des de la graderia. Tothom la podia veure per damunt dels tambors.',
      'La Noelia va acceptar d’aixecar un mocador blanc. La mestra va donar el senyal i, alhora, la Noelia va alçar el mocador. Aquest cop els cantaires van començar alhora. Mentre recollien, l’Óscar va preguntar què farien si l’endemà el llum tornava a funcionar. La Mara va mirar cap a la graderia. Havien trobat una manera de continuar l’assaig i podien practicar tots dos senyals abans del concert.',
    ],
    imageAlt: {
      'una-luz-en-la-grada': 'La classe assaja una cançó. Davant dels cantaires hi ha tres tambors i la mestra aixeca la mà.',
    },
    questions: [
      { id: 'una-luz-en-la-grada-q1', type: 'literal', prompt: 'Quin senyal feia servir la Mara abans que fallés el llum?', answer: 'Un llum que s’encenia damunt de la primera fila.', lines: 2 },
      { id: 'una-luz-en-la-grada-q2', type: 'inference', prompt: 'Per què la picada de mans no va resoldre el problema dels cantaires del fons?', answer: 'Des d’allà es confonia amb el primer cop de tambor i costava saber quan havien de començar.', lines: 3 },
      { id: 'una-luz-en-la-grada-q3', type: 'vocabulary', prompt: 'A la frase «la picada de mans es confonia amb el primer cop de tambor», què vol dir «es confonia»?', answer: 'Que des del fons la picada de mans i el cop de tambor sonaven tan semblants o tan seguits que costava distingir-los.', lines: 2 },
      { id: 'una-luz-en-la-grada-q4', type: 'inference', prompt: 'Per què la Mara podia veure el mocador des del fons encara que no veiés la mà de la mestra?', answer: 'La Noelia era a la graderia i se la veia per damunt de la fila de tambors.', lines: 3 },
      { id: 'una-luz-en-la-grada-q5', type: 'structure', prompt: 'Ordena els senyals tal com apareixen al relat: el mocador, el llum i la picada de mans.', answer: 'El llum, la picada de mans i, al final, el mocador.', lines: 2 },
      { id: 'una-luz-en-la-grada-q6', type: 'opinion', prompt: 'Per al concert, quin senyal triaries, el llum o el mocador? Justifica la resposta pensant en els cantaires del fons.', answer: 'Resposta oberta. Es pot triar qualsevol dels dos senyals si, a partir del relat, s’explica que es veu bé des del fons. També es pot proposar d’assajar l’altre senyal per si el primer falla.', lines: 4 },
    ],
    annotations: [
      { paragraph: 3, text: 'es confonia', questionId: 'una-luz-en-la-grada-q3' },
    ],
  },
];
