# Trama

Catàleg de comprensions lectores imprimibles d’ortogra.fi. Inclou fitxes de 3r de primària a 1r d’ESO en castellà i català. La interfície es pot fer servir en català i castellà. Les fitxes mostren els rètols en l’idioma de la lectura quan hi ha una traducció disponible.

Les versions d’una mateixa lectura comparteixen codi. El selector **Altres versions**, al costat del títol de la fitxa, permet canviar la llengua i conservar els ajustos i el punt de lectura.

Les fletxes del visor obren la lectura anterior o següent seguint la cerca, els filtres i l’ordre del catàleg.

A la previsualització, mantén premut Ctrl i gira la roda del ratolí per fer zoom, o fes servir els botons del visor. El zoom de pantalla conserva les mides de la fitxa impresa.

El commutador **Solucionari** mostra la resposta orientativa sota cada pregunta inclosa. **Imprimeix** obre la fitxa d’alumnat. La fletxa del costat ofereix la descàrrega directa en PDF i la impressió o descàrrega del solucionari. La descàrrega directa desa cada pàgina com una imatge d’alta resolució dins del PDF. Des del diàleg d’impressió del navegador es pot desar un PDF amb text seleccionable.

Des de **Plantilles** pots aplicar la plantilla Clàssica (Georgia, 12 pt, interlineat 1×) o una plantilla desada. Les miniatures mostren la cantonada superior del full amb els ajustos de cada plantilla. A **Gestiona les plantilles** pots crear, editar i reordenar les teves plantilles. Cada plantilla pot incloure text i tipografia, marges, espai de resposta, encapçalament i peu o visibilitat de les il·lustracions. Aplica una plantilla, ajusta la fitxa i marca l’opció d’actualitzar els valors per incorporar-hi els canvis.

**Text i tipografia** inclou un ajust per a l’espai abans de les preguntes, amb 8 mm per defecte quan el text i les preguntes comparteixen pàgina. L’encapçalament inclou el logotip de Trama per defecte. A **Encapçalament** i **Peu de pàgina** pots triar la marca de Trama, treure-la o carregar un logotip en PNG, JPEG o WebP. L’alçada màxima és de 8 mm a l’encapçalament i 6 mm al peu. Si deses una plantilla amb aquests blocs, també hi deses els logotips.

La mida de lletra i l’interlineat inicials depenen del curs. Si canvies el format o apliques una plantilla de format, els ajustos de pàgina es mantenen mentre obres altres lectures a la mateixa pestanya. **Restableix**, al costat de **Format del full**, recupera el format del curs. Les preguntes amagades i els ajustos de les il·lustracions pertanyen a la fitxa oberta.

## Imprimir fitxes en bloc

Acota el catàleg amb la cerca i els filtres i obre **Imprimeix un lot**. Totes les lectures de la llista apareixen marcades i pots desmarcar les que no et calen. **Imprimeix** obre les fitxes d’alumnat al diàleg d’impressió del navegador. La fletxa del costat permet imprimir el solucionari i descarregar les fitxes o els solucionaris en un PDF conjunt o en un ZIP amb un PDF per lectura. S’hi aplica el format inicial del curs o el que hagis ajustat durant la sessió.

Les lectures personals importades en versions anteriors continuen disponibles al navegador.

## En local i a GitHub Pages

Des d’aquesta carpeta, executa `node tools/serve.cjs` i obre `http://127.0.0.1:4191/`. El web fa servir HTML, CSS i mòduls JavaScript, amb il·lustracions locals.

GitHub Pages serveix l’arrel de `main`. El fitxer `.nojekyll` permet servir directament els fitxers estàtics. `CNAME` associa el web a `trama.ortogra.fi`. A Nordweb, el registre `trama` és un CNAME que apunta a `aaronfortuno.github.io.`. Totes les rutes internes són relatives.

## Ampliar el catàleg

El catàleg s’exporta des de `data/readings.js` com una llista d’objectes JavaScript. Les sèries de 5è i 6è es troben a `data/readings-5-es*.js` i `data/readings-6-es*.js`, respectivament. Les lectures de 4t es troben a `data/readings-4-es.js`. Els filtres es deriven de les dades i el catàleg mostra les fitxes per tandes.

- Assigna un `id` únic i estable a cada versió. Comparteix el `workId` i el `code` (per exemple, `L001`) entre les traduccions d’una mateixa lectura.
- Als mòduls `data/readings-*-ca.js` les versions catalanes indiquen el codi de l’original i aporten el text, els exercicis, les anotacions i els textos alternatius de les imatges. Conserva l’identificador d’una pregunta si planteja la mateixa tasca en totes dues llengües.
- Fes servir `language` amb una etiqueta BCP 47 i `level` amb un identificador de curs. `catalog.js` recull els noms habituals dels filtres. `worksheet.js` conté els rètols impresos en català, castellà i anglès. Les llengües sense rètols propis fan servir els anglesos.
- Introdueix el text a `paragraphs`, un element per paràgraf. L’extensió es calcula pel recompte de paraules amb els llindars de cada curs definits a `catalog.js`. Quan incorporis un curs nou, afegeix-hi els seus llindars. Fins aleshores, l’extensió d’aquell curs apareix com a «Sense especificar».
- Assigna `difficulty` dins del curs, tenint en compte el vocabulari, l’estructura del text i el raonament que demanen les preguntes.
- Desa les imatges a `assets/readings/` i indica el camí relatiu, les dimensions originals i el text alternatiu. `afterParagraph` indica quants paràgrafs s’han de mostrar abans de la imatge. El valor `0` la posa abans del primer.
- A les lectures de més de 350 paraules, acompanya dos moments diferents del text amb il·lustracions del mateix estil.
- Dona a cada pregunta un identificador estable, el tipus, l’enunciat i, opcionalment, una resposta orientativa. `lines` és el nombre de línies de resposta suggerides, de 0 a 8, tant al catàleg com al JSON d’intercanvi. Fes servir 1 línia per a una dada breu, 2 o 3 per a una explicació curta i 4 o 5 per a una resposta amb diversos punts o un resum. El visor aplica aquesta xifra amb **Segons la pregunta** i permet canviar-la per a cada pregunta.

Les lectures i el JSON d’intercanvi accepten una llista opcional `annotations`:

- `paragraph` és el número del paràgraf, començant per 1. `text` és l’expressió exacta tal com hi apareix. Si es repeteix en aquell paràgraf, indica quina aparició vols amb `occurrence`, també comptant des d’1.
- Amb `questionId`, l’expressió se subratlla quan la pregunta corresponent és visible. Amb `definition`, hi apareix un superíndex i, al final del text, una nota numerada. Fes servir només un dels dos camps per a cada anotació. Reserva les notes per a termes que ajuden a entendre el passatge sense resoldre cap pregunta.
- Les anotacions inicials del catàleg castellà són a `data/annotations-es.js`. Per a una lectura nova, pots incloure `annotations` directament a la fitxa, en la llengua de la lectura.

Fonts de verificació de la sèrie L005–L008. [Aqüeducte de Segòvia, portal oficial de turisme](https://www.spain.info/es/lugares-interes/acueducto-segovia/) · [Balena geperuda, NOAA Fisheries](https://www.fisheries.noaa.gov/species/humpback-whale)

Fonts de la sèrie L009–L012. [Petjades fòssils, National Park Service](https://www.nps.gov/dena/learn/nature/making-dino-prints.htm) · [Músculs del braç, OpenStax](https://openstax.org/books/anatomy-and-physiology-2e/pages/11-1-interactions-of-skeletal-muscles-their-fascicle-arrangement-and-their-lever-systems) · [Comunicació dels vestits espacials, NASA](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/) · [Himne homèric a Hermes, Project Gutenberg](https://www.gutenberg.org/files/16338/16338-h/16338-h.htm)

Fonts de la sèrie L013–L016. [Brúixola a la Xina, Columbia University](https://afe.easia.columbia.edu/songdynasty-module/tech-compass.html) · [Brúixola amb suro, NOAA](https://oceanservice.noaa.gov/education/dyw-make-compass.html) · [Cargol de jardí, University of Florida](https://ask.ifas.ufl.edu/publication/IN396) · [Efectes de la pluja àcida, EPA](https://www.epa.gov/acidrain/effects-acid-rain) · [Pluja àcida i roca calcària, USGS](https://pubs.usgs.gov/circ/1995/1108/report.pdf) · [Pell i regulació de la temperatura, OpenStax](https://openstax.org/books/clinical-nursing-skills/pages/21-1-structure-and-functions-of-the-skin) · [Evaporació de la suor, National Academies](https://www.nationalacademies.org/read/10925/chapter/6)

Fonts de la sèrie L017–L020. [Relat de Cleomedes sobre Eratòstenes](https://www.roger-pearse.com/weblog/2017/04/15/cleomedes-how-big-is-the-earth/) · [Construcció i funció de les teranyines, Australian Museum](https://australian.museum/learn/animals/spiders/spider-webs/) · [Estudi de les llars de foc a la cova de Qesem](https://www.sciencedirect.com/science/article/pii/S0305440313004068) · [Fosa del bronze a la Xina, The Met](https://www.metmuseum.org/essays/shang-and-zhou-dynasties-the-bronze-age-of-china) · [Vas xinès de bronze amb inscripció, The Met](https://www.metmuseum.org/art/collection/search/44514)

## Cerca i privadesa

Al domini públic, la instància pròpia d’Umami d’ortogra.fi compta visualitzacions de la pàgina i obertures de lectura des del catàleg (`obre_lectura`). Només les obertures de lectures públiques inclouen el camp `codi` (per exemple, `L001`). Una lectura importada només suma una obertura genèrica.

Quan es tria una opció de filtre del catàleg, Umami rep l’esdeveniment `aplica_filtre`, amb els camps `filtre` i `valor` si l’opció forma part dels valors predefinits de Trama. En el cas de l’extensió, el camp `nivell` indica el curs si n’hi ha un de seleccionat. Les cerques, els títols, els continguts, les respostes i el fragment dels enllaços compartits queden fora del seguiment. El seguiment respecta Do Not Track i Global Privacy Control i no s’activa en local.

Les banderes de les lectures públiques obren un formulari d’avís. Quan es prem «Envia l’avís», Trama envia `notifica_error` a Umami amb `codi`, `llengua`, `part`, `motiu` i, si escau, `element`. L’element és l’identificador de la imatge o de la pregunta, o la posició del paràgraf dins de la lectura. El formulari es pot completar encara que l’enviament estigui bloquejat. El formulari mostra el motiu quan detecta un bloqueig i ofereix l’ajuda «Com permetre els avisos».

Escriu un codi de lectura com `L001` al cercador del catàleg i, si cal, acota la cerca amb el filtre de llengua. Els enllaços de fitxa compartits en versions anteriors continuen obrint la lectura amb els seus ajustos. Conserva els codis i els identificadors de les lectures, preguntes i imatges quan ampliïs el catàleg.

Trama funciona al navegador. L’aplicació, les lectures i les il·lustracions se serveixen des del mateix web. Les lectures importades, les plantilles i les preferències de tema i idioma es desen al navegador.

## Llicència i crèdits

Els textos, les preguntes i les respostes orientatives originals del catàleg es publiquen sota [Creative Commons Reconeixement 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). Atribueix el material a [Trama](https://trama.ortogra.fi/) i indica els canvis si l’adaptes. L’avís del peu de les fitxes correspon a aquests textos. Les il·lustracions, els recursos de tercers i les lectures que importis queden fora d’aquest avís.

El codi de Trama es distribueix sota la [llicència MIT](LICENSE). Algunes icones de la interfície són de [Lucide](https://lucide.dev/) i es distribueixen amb els seus [avisos de llicència](assets/icons/LICENSE). La descàrrega de PDF fa servir [pdf-lib](https://pdf-lib.js.org/), amb la seva [llicència MIT](assets/vendor/pdf-lib.LICENSE.md). La fotografia de l’autor i el QR del V4V provenen de [Plec](https://github.com/aaronFortuno/plec-dictats).

Les tipografies incloses al web tenen els seus [crèdits i llicències](assets/fonts/README.md).

La partició opcional de mots en català i castellà fa servir [Hyphen i els patrons de TeX](assets/vendor/hyphen/README.md). El web serveix tots els fitxers localment.
