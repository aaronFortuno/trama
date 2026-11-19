# Trama

Catàleg de comprensions lectores imprimibles d’ortogra.fi. Inclou fitxes de 3r de primària a 1r d’ESO en castellà i català. La interfície es pot fer servir en català i castellà. Les fitxes mostren els rètols en l’idioma de la lectura quan hi ha una traducció disponible.

El botó d’interrogant de la capçalera obre una guia de cerca, maquetació, col·leccions, solucionaris, impressió i còpies de seguretat. Està disponible des del catàleg i el visor, en l’idioma de la interfície.

Les versions d’una mateixa lectura comparteixen codi. El selector **Altres versions**, al costat del títol de la fitxa, permet canviar la llengua i conservar els ajustos i el punt de lectura.

Les fletxes del visor obren la lectura anterior o següent seguint la cerca, els filtres i l’ordre del catàleg.

A la previsualització, mantén premut Ctrl i gira la roda del ratolí per fer zoom, o fes servir els botons del visor. El zoom de pantalla conserva les mides de la fitxa impresa.

El commutador **Solucionari** mostra la resposta orientativa sota cada pregunta inclosa. **Imprimeix** obre la fitxa d’alumnat. La fletxa del costat ofereix la descàrrega directa en PDF i la impressió o descàrrega del solucionari. La descàrrega directa desa cada pàgina com una imatge d’alta resolució dins del PDF. Des del diàleg d’impressió del navegador es pot desar un PDF amb text seleccionable.

Des de **Plantilles** pots aplicar la plantilla Clàssica (Georgia, 12 pt, interlineat 1×) o una plantilla desada. Les miniatures mostren la cantonada superior del full amb els ajustos de cada plantilla. A **Gestiona les plantilles** pots crear, editar i reordenar les teves plantilles. Cada plantilla pot incloure text i tipografia, marges, espai de resposta, encapçalament i peu o visibilitat de les il·lustracions. Aplica una plantilla, ajusta la fitxa i marca l’opció d’actualitzar els valors per incorporar-hi els canvis.

**Text i tipografia** inclou un ajust per a l’espai abans de les preguntes, amb 8 mm per defecte quan el text i les preguntes comparteixen pàgina. L’encapçalament inclou el logotip de Trama per defecte. A **Encapçalament** i **Peu de pàgina** pots triar la marca de Trama, treure-la o carregar un logotip en PNG, JPEG o WebP. L’alçada màxima és de 8 mm a l’encapçalament i 6 mm al peu. Si deses una plantilla amb aquests blocs, també hi deses els logotips.

La mida de lletra i l’interlineat inicials depenen del curs. Si canvies el format o apliques una plantilla de format, els ajustos de pàgina es mantenen mentre obres altres lectures a la mateixa pestanya. **Restableix**, al costat de **Format del full**, recupera el format del curs. Les preguntes amagades i els ajustos de les il·lustracions pertanyen a la fitxa oberta.

Activa **Codi d’aula** a **Encapçalament** per afegir una etiqueta a la dreta de la primera pàgina. El text es desa per a cada versió de la lectura en aquest navegador i surt a la fitxa i al solucionari, també als lots.

Al solucionari, **Pistes al text** ressalta els fragments que sustenten les respostes i els identifica amb el número de la pregunta. **Veure al text**, amb el mateix color, porta al fragment en la previsualització. Els números permeten seguir les referències també en blanc i negre. Pots desactivar les marques des del sidebar de contingut; la tria es desa amb el maquetat i s’aplica també als lots. Les preguntes d’opinió o de síntesi global poden no tenir un fragment localitzat.

## Col·leccions

Quan n’obres una, el seu nom substitueix el títol del catàleg, acompanyat de la icona de capes i una creu per treure el filtre. L’ajuda en passar-hi per sobre o donar-hi focus recorda que ets dins d’una col·lecció. La creu recupera tot el catàleg de la llengua triada, neteja la cerca i els filtres addicionals i recorda la sortida en recarregar. La col·lecció i els seus maquetats es conserven. El canvi té una transició de 220 ms i manté l’alçada de la capçalera.

Les col·leccions es reordenen arrossegant les targetes directament a la graella; l’ordre queda desat i s’aplica a la navegació entre lectures i als lots. Un clic obre la lectura, o la marca/desmarca si has activat la selecció. Una pulsació llarga, clic dret o Majúscules + F10 obre les opcions de la targeta: afegir-la a una col·lecció existent o nova, o retirar-la de l’actual. Retirar-la conserva el maquetat per si la tornes a afegir. Amb el focus a una targeta d’una col·lecció, Alt + fletxes permet reordenar amb el teclat. A **Afegeix lectures**, al sidebar, pots incorporar-hi una selecció més gran.

**Afegeix a una col·lecció** desplega els destins al mateix menú. Tria’n un per afegir-hi la lectura immediatament o **Nova col·lecció** per escriure’n el nom i crear-la allà mateix. Una marca indica que la lectura ja hi és. Es conserva la vista actual del catàleg i el maquetat es copia des de la col·lecció d’origen, si n’hi ha; un maquetat ja existent al destí es manté.

## Imprimir fitxes en bloc

Acota el catàleg amb la cerca i els filtres i obre **Imprimeix un lot**. Totes les lectures de la llista apareixen marcades i pots desmarcar les que no et calen. **Imprimeix** obre les fitxes d’alumnat al diàleg d’impressió del navegador. La fletxa del costat permet imprimir el solucionari i descarregar les fitxes o els solucionaris en un PDF conjunt o en un ZIP amb un PDF per lectura. S’hi aplica el format inicial del curs o el que hagis ajustat durant la sessió.

**Cada lectura en un full nou (doble cara)** afegeix una pàgina en blanc després de cada fitxa o solucionari amb un nombre senar de pàgines, també als PDF i ZIP. L’interrogant explica la funció en passar-hi el ratolí, donar-li focus o tocar-lo. La impressora s’ha de configurar també per imprimir a doble cara.

**Còpia de seguretat i recuperació** explica el desament automàtic i permet descarregar o recuperar els maquetats, els codis d’aula, les plantilles i les col·leccions. **Restableix els maquetats** agrupa a part el retorn al format inicial, també per a les lectures de col·leccions; es mantenen les col·leccions i les plantilles.

Les lectures personals importades en versions anteriors continuen disponibles al navegador.

## En local i a GitHub Pages

Des d’aquesta carpeta, executa `node tools/serve.cjs` i obre `http://127.0.0.1:4191/`. El web fa servir HTML, CSS i mòduls JavaScript, amb il·lustracions locals.

GitHub Pages serveix l’arrel de `main`. El fitxer `.nojekyll` permet servir directament els fitxers estàtics. `CNAME` associa el web a `trama.ortogra.fi`. A Nordweb, el registre `trama` és un CNAME que apunta a `aaronfortuno.github.io.`. Totes les rutes internes són relatives.

## Ampliar el catàleg

Abans de crear o relacionar lectures, consulta el [model editorial d’universos, famílies i recorreguts](docs/editorial-model.md). `universeIds` admet zero o diversos universos; `familyId`, una única família opcional. Les traduccions comparteixen obra i codi, mentre que les variants d’exigència d’una família tindran codis propis. El registre d’universos és a `data/universes.js`, i cada univers té una guia narrativa i visual a `docs/universes/`.

El primer univers és [La biblioteca de les coses](docs/universes/biblioteca-de-les-coses.md), amb les L208 i L246–L248, de 1r d’ESO inicial i disponibles en català i castellà. `node tools/check-editorial.mjs` valida les relacions i els filtres; `node tools/check-universes-browser.cjs` comprova en local la navegació de l’univers, la composició de les noves fitxes i solucionaris i la generació de PDF.

El primer prototip de família agrupa la L208 amb les L208A (4t) i L208B (6è). Cada variant conserva una identitat i un maquetat propis; el registre de `data/families.js` defineix nom, base del codi i ordre de presentació. El catàleg compta una proposta per família i ofereix un checkbox per mostrar només lectures amb variants. Els filtres s’apliquen a les variants abans d’agrupar; els recomptes de cada opció també dedupliquen famílies. En obrir una pila, la tria mostra la primera pàgina real de cada variant amb el seu format. La selecció de col·leccions continua mostrant les fitxes individualment. `node tools/check-families.mjs` i `node tools/check-families-browser.cjs` comproven les relacions, els recomptes, els codis amb sufix, la navegació i la maquetació.

`family-stage.js` mostra les miniatures reals de les variants veïnes al voltant de la fitxa i anima el canvi al primer pla. El comparador de `family-comparison.js` mostra les fitxes reals en columnes ordenades per gradació, amb scroll sincronitzat per defecte, accés a les preguntes i vista de solucionari. Es pot desactivar la sincronització. Tots dos reutilitzen el motor de maquetació sense desar canvis. `node tools/check-family-comparison.cjs` verifica la composició, les dues llengües, els maquetats generals i de col·lecció, la navegació visual, la sincronització i la vista mòbil.

El catàleg s’exporta des de `data/readings.js` com una llista d’objectes JavaScript. Les sèries de 5è i 6è es troben a `data/readings-5-es*.js` i `data/readings-6-es*.js`, respectivament. Les lectures de 4t es troben a `data/readings-4-es.js`. Els filtres es deriven de les dades i el catàleg mostra les fitxes per tandes.

- Assigna un `id` únic i estable a cada versió. Comparteix el `workId` i el `code` (per exemple, `L001`) entre les traduccions d’una mateixa lectura.
- Als mòduls `data/readings-*-ca.js` les versions catalanes indiquen el codi de l’original i aporten el text, els exercicis, les anotacions i els textos alternatius de les imatges. Conserva l’identificador d’una pregunta si planteja la mateixa tasca en totes dues llengües.
- Fes servir `language` amb una etiqueta BCP 47 i `level` amb un identificador de curs. `catalog.js` recull els noms habituals dels filtres. `worksheet.js` conté els rètols impresos en català, castellà i anglès. Les llengües sense rètols propis fan servir els anglesos.
- Introdueix el text a `paragraphs`, un element per paràgraf. L’extensió es calcula pel recompte de paraules amb els llindars de cada curs definits a `catalog.js`. Quan incorporis un curs nou, afegeix-hi els seus llindars. Fins aleshores, l’extensió d’aquell curs apareix com a «Sense especificar».
- Assigna `difficulty` dins del curs, tenint en compte el vocabulari, l’estructura del text i el raonament que demanen les preguntes.
- Desa les imatges a `assets/readings/` i indica el camí relatiu, les dimensions originals i el text alternatiu. `afterParagraph` indica quants paràgrafs s’han de mostrar abans de la imatge. El valor `0` la posa abans del primer.
- A les lectures de més de 350 paraules, acompanya dos moments diferents del text amb il·lustracions del mateix estil.
- Dona a cada pregunta un identificador estable, el tipus, l’enunciat i, opcionalment, una resposta orientativa. `lines` és el nombre de línies de resposta suggerides, de 0 a 8, tant al catàleg com al JSON d’intercanvi. Fes servir 1 línia per a una dada breu, 2 o 3 per a una explicació curta i 4 o 5 per a una resposta amb diversos punts o un resum. El visor aplica aquesta xifra amb **Segons la pregunta** i permet canviar-la per a cada pregunta.

Cada pregunta pot incloure `evidence`, una llista de fragments exactes que en justifiquen la resposta. Per exemple: `evidence: [{ paragraph: 2, text: 'dotze centímetres' }]`. El número de paràgraf comença en 1; `occurrence`, també des d’1, resol les expressions repetides dins d’un mateix paràgraf. Selecciona les paraules necessàries per justificar la resposta i afegeix diversos fragments quan calgui relacionar pistes. No atribueixis una resposta personal o una síntesi global a una frase arbitrària. Les versions traduïdes han de dur fragments en la seva pròpia llengua. Aquest camp es conserva en importar i exportar JSON.

La selecció retrospectiva del catàleg és a `data/evidence-selection.json`: cada fila correspon a una pregunta; `2.3` selecciona la tercera frase del segon paràgraf, `2.3-4` dues frases consecutives, `2~fragment exacte` una expressió i `;` separa fragments. Una fila buida deixa la pregunta sense marca. `node tools/build-answer-evidence.mjs build` genera els fragments exactes de `data/answer-evidence.js`. Revisa tots dos idiomes i torna a generar i comprovar les referències si canvies el text o les preguntes. Les L001–L245 tenen una selecció revisada en català i castellà. Les lectures futures han d’incorporar també els fragments de suport quan les respostes es puguin localitzar al text.

`node tools/check-answer-evidence.mjs` comprova els fragments i la composició de marques, i exigeix que totes les versions del catàleg tinguin pistes revisades. `node tools/check-evidence-browser.cjs` comprova el visor i el PDF en local; amb `--all`, també comprova la paginació i la integritat del text de tots els solucionaris del catàleg, amb una mostra de fitxes d’alumnat i de solucionaris sense marques.

Les lectures i el JSON d’intercanvi accepten una llista opcional `annotations`:

- `paragraph` és el número del paràgraf, començant per 1. `text` és l’expressió exacta tal com hi apareix. Si es repeteix en aquell paràgraf, indica quina aparició vols amb `occurrence`, també comptant des d’1.
- Amb `questionId`, l’expressió se subratlla quan la pregunta corresponent és visible. Amb `definition`, hi apareix un superíndex i, al final del text, una nota numerada. Fes servir només un dels dos camps per a cada anotació. Reserva les notes per a termes que ajuden a entendre el passatge sense resoldre cap pregunta.
- Les anotacions inicials del catàleg castellà són a `data/annotations-es.js`. Per a una lectura nova, pots incloure `annotations` directament a la fitxa, en la llengua de la lectura.

Fonts de verificació de la sèrie L005–L008. [Aqüeducte de Segòvia, portal oficial de turisme](https://www.spain.info/es/lugares-interes/acueducto-segovia/) · [Balena geperuda, NOAA Fisheries](https://www.fisheries.noaa.gov/species/humpback-whale)

Fonts de la sèrie L009–L012. [Petjades fòssils, National Park Service](https://www.nps.gov/dena/learn/nature/making-dino-prints.htm) · [Músculs del braç, OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-1-interactions-of-skeletal-muscles-their-fascicle-arrangement-and-their-lever-systems) · [Comunicació dels vestits espacials, NASA](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/) · [Himne homèric a Hermes, Project Gutenberg](https://www.gutenberg.org/files/16338/16338-h/16338-h.htm)

Fonts de la sèrie L013–L016. [Brúixola a la Xina, Columbia University](https://afe.easia.columbia.edu/songdynasty-module/tech-compass.html) · [Brúixola amb suro, NOAA](https://oceanservice.noaa.gov/education/dyw-make-compass.html) · [Cargol de jardí, University of Florida](https://ask.ifas.ufl.edu/publication/IN396) · [Efectes de la pluja àcida, EPA](https://www.epa.gov/acidrain/effects-acid-rain) · [Pluja àcida i roca calcària, USGS](https://pubs.usgs.gov/circ/1995/1108/report.pdf) · [Pell i regulació de la temperatura, OpenStax](https://openstax.org/books/clinical-nursing-skills/pages/21-1-structure-and-functions-of-the-skin) · [Evaporació de la suor, National Academies](https://www.nationalacademies.org/read/10925/chapter/6)

Fonts de la sèrie L017–L020. [Relat de Cleomedes sobre Eratòstenes](https://www.roger-pearse.com/weblog/2017/04/15/cleomedes-how-big-is-the-earth/) · [Construcció i funció de les teranyines, Australian Museum](https://australian.museum/learn/animals/spiders/spider-webs/) · [Estudi de les llars de foc a la cova de Qesem](https://www.sciencedirect.com/science/article/pii/S0305440313004068) · [Fosa del bronze a la Xina, The Met](https://www.metmuseum.org/essays/shang-and-zhou-dynasties-the-bronze-age-of-china) · [Vas xinès de bronze amb inscripció, The Met](https://www.metmuseum.org/art/collection/search/44514)

## Cerca i privadesa

Al domini públic, la instància pròpia d’Umami d’ortogra.fi compta visualitzacions, obertures de lectures, ús dels filtres, preparació d’impressions i PDF, consulta de solucionaris i ús de la maquetació, les plantilles, les col·leccions i les còpies de seguretat. Les lectures públiques poden aportar codi, llengua, curs i dificultat; les lectures personals no envien cap identificador ni contingut.

Només s’envien opcions predefinides, booleans i recomptes agrupats. En una cerca es compta si és per codi o text i el tram de resultats, sense enviar mai el que s’ha escrit. Tampoc s’envien noms de col·leccions o plantilles, codis d’aula, logotips, continguts, respostes, fitxers ni fragments dels enllaços. Els sliders no generen un esdeveniment per cada moviment: la personalització es compta una vegada per bloc, acció i estat mentre la lectura és oberta. El seguiment respecta Do Not Track, Global Privacy Control i la desactivació d’Umami i no s’activa en local. Si el servei està bloquejat, el web continua funcionant. Consulta l’[inventari d’esdeveniments i els seus límits](docs/analytics.md).

Les banderes de les lectures públiques obren un formulari d’avís. Quan es prem «Envia l’avís», Trama envia `notifica_error` a Umami amb `codi`, `llengua`, `part`, `motiu` i, si escau, `element`. L’element és l’identificador de la imatge o de la pregunta, o la posició del paràgraf dins de la lectura. El formulari es pot completar encara que l’enviament estigui bloquejat. El formulari mostra el motiu quan detecta un bloqueig i ofereix l’ajuda «Com permetre els avisos».

Escriu un codi de lectura com `L001` al cercador del catàleg i, si cal, acota la cerca amb el filtre de llengua. Els enllaços de fitxa compartits en versions anteriors continuen obrint la lectura amb els seus ajustos. Conserva els codis i els identificadors de les lectures, preguntes i imatges quan ampliïs el catàleg.

Trama funciona al navegador. L’aplicació, les lectures i les il·lustracions se serveixen des del mateix web. Les lectures importades, les plantilles i les preferències de tema i idioma es desen al navegador.

## Llicència i crèdits

Els textos, les preguntes i les respostes orientatives originals del catàleg es publiquen sota [Creative Commons Reconeixement 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Atribueix el material a [Trama](https://trama.ortogra.fi/) i indica els canvis si l’adaptes. L’avís del peu de les fitxes correspon a aquests textos. Les il·lustracions, els recursos de tercers i les lectures que importis queden fora d’aquest avís.

El codi de Trama es distribueix sota la [llicència MIT](LICENSE). Algunes icones de la interfície són de [Lucide](https://lucide.dev/) i es distribueixen amb els seus [avisos de llicència](assets/icons/LICENSE). La descàrrega de PDF fa servir [pdf-lib](https://pdf-lib.js.org/), amb la seva [llicència MIT](assets/vendor/pdf-lib.LICENSE.md). La fotografia de l’autor i el QR del V4V provenen de [Plec](https://github.com/aaronFortuno/plec-dictats).

La reordenació de targetes fa servir [SortableJS 1.15.7](assets/vendor/sortable/README.md), amb [llicència MIT](assets/vendor/sortable/LICENSE), servit localment.

Les tipografies incloses al web tenen els seus [crèdits i llicències](assets/fonts/README.md).

La partició opcional de mots en català i castellà fa servir [Hyphen i els patrons de TeX](assets/vendor/hyphen/README.md). El web serveix tots els fitxers localment.
