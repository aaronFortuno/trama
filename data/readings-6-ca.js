export const readings6Ca = [
  {
    id: 'la-noticia-que-va-canviar-de-titular-ca',
    code: 'L070',
    title: 'La notícia que va canviar de titular',
    summary: 'La redacció d’un diari escolar corregeix un titular quan comprova què havia mesurat i durant quant de temps.',
    paragraphs: [
      'Aquest cas és fictici i passa a la redacció d’un diari escolar. Dilluns, en el primer esborrany, la Clara va escriure: «El pati nou duplica els jocs durant l’esbarjo». A l’escola havien pintat un tauler a terra i hi havien posat un cistell amb materials. A la llibreta d’un equip de sisè hi havia dotze marques en una pàgina i vint-i-quatre a la següent.',
      'Abans de publicar-ho, l’Omar va preguntar què representava cada marca. Els qui havien fet l’observació van explicar que feien una marca cada vegada que començava una partida a la zona del tauler. Si les mateixes quatre persones acabaven una partida i en començaven una altra, hi posaven dues marques. Els jocs de pilota i les converses en altres racons quedaven fora del recompte.',
      'També hi havia una diferència entre els dos dies. Abans de pintar el tauler, havien fet l’observació durant els vint minuts d’un esbarjo que s’havia escurçat per un simulacre. Aquell dia van jugar al mateix racó amb un tauler de cartró. Després de pintar-lo, van observar els quaranta minuts de l’esbarjo sencer. La Clara va afegir els temps a la taula i es va adonar que tots dos recomptes donaven sis partides cada deu minuts. Tot i així, l’observació era massa breu per descriure tots els esbarjos.',
      'Al diari van publicar dues coses: la dada que el ritme de joc havia estat el mateix en els trams observats i el testimoni d’una alumna que havia jugat allà per primera vegada després que pintessin el tauler. La seva experiència mostrava una cosa que no es veia en el recompte de partides. La Clara va substituir el titular per «Un tauler nou i una pregunta oberta sobre com juguem».',
      'A l’edició següent volien incloure la veu dels qui preferien descansar en aquell racó. Van penjar una pregunta al tauler d’anuncis: «En quin moment i per a què fas servir aquest espai?». Recollirien els comentaris en un full a part de la taula de partides.',
    ],
    imageAlt: {
      'la-noticia-que-cambio-de-titulo': 'La Clara i l’Omar comenten un full al pati. Sobre la taula hi ha una quadrícula i un llapis.',
    },
    questions: [
      { id: 'la-noticia-que-cambio-de-titulo-q1', type: 'literal', prompt: 'Quina acció representava exactament cada marca de la llibreta?', answer: 'L’inici d’una partida a la zona del tauler.', lines: 2 },
      { id: 'la-noticia-que-cambio-de-titulo-q2', type: 'inference', prompt: 'Per què vint-i-quatre marques després de pintar el tauler no demostren que es dupliqués el ritme de joc?', answer: 'El segon dia van observar el doble de temps. En tots dos casos hi va haver sis partides cada deu minuts.', lines: 4 },
      { id: 'la-noticia-que-cambio-de-titulo-q3', type: 'vocabulary', prompt: 'Què vol dir «testimoni» al quart paràgraf?', answer: 'És el relat de l’experiència de l’alumna que hi va jugar per primera vegada.', lines: 2 },
      { id: 'la-noticia-que-cambio-de-titulo-q4', type: 'structure', prompt: 'Com ajuda el primer titular a entendre la revisió que fa la Clara al llarg del text?', answer: 'El primer titular fa una afirmació molt àmplia. Quan la Clara revisa què havien comptat i durant quant de temps, s’entén per què en tria un de més precís.', lines: 4 },
      { id: 'la-noticia-que-cambio-de-titulo-q5', type: 'inference', prompt: 'Quina pregunta sobre el pati pot respondre millor l’alumna que la taula? I quina pot respondre millor la taula?', answer: 'L’alumna pot explicar com ha viscut el canvi. La taula permet comparar el nombre de partides en els temps observats.', lines: 4 },
      { id: 'la-noticia-que-cambio-de-titulo-q6', type: 'summary', prompt: 'Escriu un titular de dotze paraules com a màxim i una frase que expliqui un límit del recompte.', answer: 'Per exemple: «El mateix ritme de partides en dos recomptes al tauler». Límit: només es va observar aquella zona i durant dos esbarjos.', lines: 4 },
      { id: 'la-noticia-que-cambio-de-titulo-q7', type: 'inference', prompt: 'Si demà tornen a observar durant quaranta minuts i compten vint-i-quatre partides, podran dir quantes persones diferents hi han jugat? Què haurien d’anotar d’una altra manera?', answer: 'No. Una mateixa persona pot participar en diverses partides. Haurien de registrar qui hi juga tenint cura de comptar una sola vegada els qui repeteixen.', lines: 3 },
    ],
    annotations: [
      { paragraph: 4, text: 'testimoni', questionId: 'la-noticia-que-cambio-de-titulo-q3' },
    ],
  },
  {
    id: 'la-llibreta-de-les-marees-ca',
    code: 'L071',
    title: 'La llibreta de les marees',
    summary: 'Dos dibuixos fets al mateix lloc ajuden a distingir què canvia a la costa i què depèn del moment de l’observació.',
    paragraphs: [
      'Quan van arribar al passeig, l’Olívia va obrir la llibreta del seu avi. En una pàgina hi havia una roca amb forma de pa. Al costat hi apareixia un bassal petit. A la pàgina següent, la mateixa roca sobresortia de l’aigua com si fos una illa. Les dates eren iguals, però sota un dibuix hi deia «10:20» i sota l’altre, «13:40». L’Olívia es va pensar que un dels dibuixos era a la pàgina equivocada.',
      'L’avi va assenyalar una ratlla horitzontal a la roca del dibuix. Per damunt de la ratlla, el llapis havia deixat el paper gairebé blanc. Per sota, hi havia fet traços més foscos. Li va proposar que busqués una marca semblant a la roca de debò. Des del passeig, l’Olívia va veure una zona fosca i humida que s’acabava força més amunt que la vora de l’aigua.',
      'Al centre de visitants van consultar la taula de marees del port. Aquell dia indicava que el nivell del mar pujaria durant una part del matí. La taula donava les hores del port. L’avi li va explicar que, allà on eren, les onades podien tapar la roca un moment i deixar-la a la vista en retirar-se. Van decidir observar-la des del passeig i fer uns quants dibuixos durant el matí.',
      'Al primer dibuix, l’Olívia va traçar la vora de l’aigua tot just quan arribava una onada. Al segon la va dibuixar quan l’onada es retirava. Tots dos eren gairebé de la mateixa hora. Aleshores va decidir marcar dues línies en cada dibuix nou: fins on arribava una onada i on quedava la vora de l’aigua quan retrocedia.',
      'Al final, l’Olívia hi va afegir la data, l’hora i el lloc des d’on mirava. Va deixar una pàgina en blanc per comparar els seus dibuixos amb els d’una altra visita. Havia entès per què l’avi havia dibuixat dues vegades la mateixa roca.',
    ],
    imageAlt: {
      'el-cuaderno-de-las-mareas': 'L’Olívia obre una llibreta amb dibuixos d’una roca vora el mar.',
    },
    questions: [
      { id: 'el-cuaderno-de-las-mareas-q1', type: 'literal', prompt: 'A quines hores havia fet els dibuixos l’avi?', answer: 'A les 10:20 i a les 13:40.', lines: 1 },
      { id: 'el-cuaderno-de-las-mareas-q2', type: 'inference', prompt: 'Quines dues explicacions dona el relat perquè la vora de l’aigua canviï en un dibuix?', answer: 'El nivell del mar canvia amb la marea. A més, una onada pot tapar part de la roca durant uns instants.', lines: 3 },
      { id: 'el-cuaderno-de-las-mareas-q3', type: 'vocabulary', prompt: 'Al segon paràgraf, què són els «traços» i què indiquen en el dibuix?', answer: 'Són marques de llapis. Les més fosques marquen la part de sota de la roca.', lines: 2 },
      { id: 'el-cuaderno-de-las-mareas-q4', type: 'structure', prompt: 'Per què el text presenta els dos dibuixos antics abans d’explicar què passa amb l’aigua?', answer: 'Els dibuixos plantegen un dubte que el lector comparteix amb l’Olívia. Les observacions següents ajuden a resoldre’l.', lines: 3 },
      { id: 'el-cuaderno-de-las-mareas-q5', type: 'inference', prompt: 'Quines dades hauria de conservar l’Olívia per comparar una visita futura amb la d’aquell dia? Explica per a què serveixen dues d’aquestes dades.', answer: 'La data i l’hora li permeten consultar la marea que hi correspon. Si apunta des d’on mirava, podrà tornar a dibuixar des d’un punt de vista comparable.', lines: 4 },
      { id: 'el-cuaderno-de-las-mareas-q6', type: 'summary', prompt: 'Explica què va aprendre l’Olívia quan va fer dos dibuixos gairebé a la mateixa hora.', answer: 'Va aprendre que la vora de l’aigua també canvia segons el moment de l’onada. Per això va començar a distingir fins on arribava i on quedava la vora quan es retirava.', lines: 4 },
      { id: 'el-cuaderno-de-las-mareas-q7', type: 'inference', prompt: 'Si dos dibuixos fets amb hores de diferència mostren la mateixa vora de l’aigua quan l’onada es retira, per què no n’hi ha prou per dir que no hi ha hagut marea?', answer: 'Dos dibuixos només mostren instants concrets. Caldrien més observacions des del mateix lloc per saber com va canviar el nivell durant aquell temps.', lines: 3 },
    ],
    annotations: [
      { paragraph: 2, text: 'traços', questionId: 'el-cuaderno-de-las-mareas-q3' },
    ],
  },
  {
    id: 'lultima-foto-de-lalbum-ca',
    code: 'L073',
    title: 'L’última foto de l’àlbum',
    summary: 'Dues anotacions diferents fan que la Nora investigui qui va fer una fotografia i per què es va guardar allà.',
    paragraphs: [
      'Per a l’aniversari de l’escola, la Nora ajudava a preparar un àlbum amb fotos antigues. A l’última pàgina hi va trobar una imatge del pati. Davant d’un arbre acabat de plantar hi apareixien la directora, un conserge i unes quantes famílies. Al darrere de la foto hi deia, amb lletra grossa, «S. Vidal». A la capsa de cartró hi deia «Còpia de la foto que va fer l’Ana».',
      'La Nora va pensar que l’Ana i S. Vidal podien ser la mateixa persona. La mestra li va ensenyar la llista de participants de la festa. Hi constava en Sergio Vidal, el conserge. També hi sortia l’Ana, una alumna que havia ajudat a repartir materials. Amb la llista no es podia aclarir qui dels dos havia fet servir la càmera.',
      'L’antic conserge va tornar a l’escola per a la celebració. Quan va veure la foto, va dir que es reconeixia al costat de l’arbre. Es pensava que l’havia feta ell perquè recordava que havia deixat la càmera sobre el mur, encarada cap al grup. La Nora li va preguntar qui havia premut el botó. En Sergio va dubtar. A la foto tenia totes dues mans a la pala. Aleshores va recordar que l’Ana li havia demanat la càmera per provar el temporitzador.',
      'Van tornar a revisar la capsa. Entre dos sobres van trobar un paper de l’Ana: «Sergio, et deixo una còpia de la que vaig fer amb la teva càmera. Hi sortim una mica petits, però l’arbre es veu sencer». En Sergio va recordar que havia escrit el seu cognom en unes quantes fotos per saber quines es podia endur quan marxés. L’anotació identificava la còpia que guardava. La nota de l’Ana aclaria qui havia fet la foto.',
      'La Nora va preparar la cartel·la amb els dos noms i el paper de cadascú. Al costat hi va posar una reproducció del paper de l’Ana. En Sergio va afegir a l’àlbum un record seu sobre el dia que van plantar l’arbre i va demanar que hi aparegués com un record, a part del peu de foto.',
    ],
    imageAlt: {
      'la-ultima-foto-del-album': 'La Nora aixeca una pàgina d’un àlbum. Hi ha dues fotos antigues encarades cap a ella: un grup al costat d’un arbre jove i l’entrada de l’escola.',
    },
    questions: [
      { id: 'la-ultima-foto-del-album-q1', type: 'literal', prompt: 'Quines dues anotacions va trobar la Nora al principi?', answer: '«S. Vidal» al darrere de la foto i «Còpia de la foto que va fer l’Ana» a la capsa.', lines: 2 },
      { id: 'la-ultima-foto-del-album-q2', type: 'inference', prompt: 'Per què veure en Sergio amb totes dues mans a la pala no demostra, per si sol, qui va fer la foto?', answer: 'La càmera tenia temporitzador. En Sergio podia sortir a la foto encara que ell hagués programat el temporitzador. El paper de l’Ana dona una altra prova de qui la va fer.', lines: 4 },
      { id: 'la-ultima-foto-del-album-q3', type: 'vocabulary', prompt: 'Què és una «cartel·la» al final del relat?', answer: 'És un text breu al costat de la fotografia que en dona informació.', lines: 2 },
      { id: 'la-ultima-foto-del-album-q4', type: 'structure', prompt: 'Què canvia quan troben el paper de l’Ana després d’haver sentit el primer record d’en Sergio?', answer: 'Ara saben que la càmera era d’en Sergio i que ell guardava una còpia, però que la foto la va fer l’Ana. El primer record d’en Sergio tot sol no ho aclaria.', lines: 3 },
      { id: 'la-ultima-foto-del-album-q5', type: 'inference', prompt: 'Per què té sentit posar en Sergio a la cartel·la sense atribuir-li la fotografia?', answer: 'La càmera era seva i ell en guardava una còpia. També apareix a la foto, però la nota diu que la va fer l’Ana.', lines: 4 },
      { id: 'la-ultima-foto-del-album-q6', type: 'opinion', prompt: 'Què posaries a la cartel·la i què deixaries per al record d’en Sergio? Justifica per què ho separaries.', answer: 'Resposta oberta. Per exemple, a la cartel·la hi posaria que la foto la va fer l’Ana amb la càmera d’en Sergio. Deixaria el record de l’arbre a part perquè és una vivència personal.', lines: 4 },
      { id: 'la-ultima-foto-del-album-q7', type: 'inference', prompt: 'Si només quedessin la foto i la llista d’assistents, què podria afirmar la Nora sobre en Sergio? Què no podria atribuir a ningú?', answer: 'Si el reconegués, podria identificar-lo com a conserge i comprovar que era entre els assistents. Amb aquestes dues fonts no podria afirmar qui va fer la fotografia.', lines: 3 },
    ],
    annotations: [
      { paragraph: 5, text: 'cartel·la', questionId: 'la-ultima-foto-del-album-q3' },
      { paragraph: 5, text: 'reproducció', definition: 'Còpia que conserva l’aspecte de l’objecte original.' },
    ],
  },
];
