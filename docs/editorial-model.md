# Universos, famílies i recorreguts de Trama

Decisions de disseny acordades el 19 de novembre del 2026. Aquesta guia és la referència per ampliar el catàleg; les relacions editorials no substitueixen el curs, la dificultat, la temàtica ni el tipus de text.

## Identitats que cal mantenir separades

| Concepte | Què comparteix | Cardinalitat per lectura | Identificació |
| --- | --- | --- | --- |
| Lectura o obra | Un text i una activitat concrets, amb les seves traduccions | Una identitat estable | `code` i `workId`; cada llengua té el seu `id` |
| Traducció o adaptació lingüística | Història, exigència i tasques equivalents | Una versió per llengua | Mateixos `code` i `workId`; canvia `language` i `id` |
| Univers | Ubicació, personatges o món compartit; estil visual coherent | Zero, un o diversos | `universeIds: ['identificador']` |
| Família | La mateixa història i desenvolupament amb una exigència diferent | Zero o una | `familyId: 'identificador'`; base de codi comuna i sufix per variant, amb `workId` propis |
| Itinerari editorial | Una selecció justificada amb objectius i ordre suggerit | Una lectura pot aparèixer en diversos | Entitat separada de la lectura; es concretarà en una fase posterior |
| Grup de diàleg | Textos que es contrasten o es complementen | Pot travessar universos i famílies | Relació editorial específica; pendent de prototip |
| Col·lecció d’usuari | Tria, ordre, maquetats i codis d’aula d’un docent | Una lectura pot estar en diverses | Dades locals del navegador; cap identificador editorial les substitueix |

Una traducció **no és una variant d’exigència**. Dues llengües d’una mateixa lectura no han de fer aparèixer una pila de variants ni activar un futur filtre «Només lectures amb variants».

Exemple: L208-ES i L208-CA són la mateixa obra en dues llengües. Les adaptacions més accessibles tenen els codis L208A i L208B i altres `workId`; les tres obres comparteixen `familyId`. Les seves traduccions conserven, respectivament, el codi de cada variant. La L208 original no es renumera: els enllaços, els maquetats i les col·leccions existents continuen funcionant. En famílies noves, es reserva una base comuna i es poden assignar sufixos A, B, C… des del començament. La lletra és un identificador, no un curs ni un ordre de lectura.

Els camps nous són opcionals i compatibles amb les lectures ja existents. L’absència d’`universeIds` equival a cap univers. `familyId` és un únic identificador, mai una llista. El format d’importació/exportació conserva aquests camps i rebutja famílies múltiples.

## Universos: independència amb connexions

- Cada lectura s’ha d’entendre sense haver llegit cap altra. Cal reintroduir els personatges, les seves funcions i les dades necessàries per a la situació.
- No s’exigeix ordre. Es poden reconèixer detalls compartits, però una resposta mai no pot dependre de recordar una altra lectura.
- Compartir un univers no implica repetir arguments ni formes textuals. Hi caben narracions, instruccions, cartes, entrevistes i textos divulgatius.
- Una temàtica comuna no basta per assignar un univers: cal una connexió concreta de món, lloc o personatges. No convertim «medi ambient» o «esport» en universos genèrics.
- Una lectura pot pertànyer a dos universos si hi ha una trobada real entre ells i queda documentada a les seves guies.
- Cada univers té un identificador estable, nom i presentació en cada llengua, una lectura d’origen i una guia de continuïtat narrativa i visual.
- Els noms del catàleg es defineixen a `data/universes.js`. La lectura indica només els seus `universeIds`; no hi copia noms traduïts ni explicacions.

El catàleg ofereix «Univers» als filtres principals, incloent-hi «Sense univers», amb un interrogant que explica el concepte amb ratolí, teclat o toc. La lectura mostra els universos al sidebar de contingut i permet tornar al catàleg filtrat per aquell univers i la llengua de la lectura. Es mostren també amb els filtres habituals i es poden incorporar a qualsevol col·lecció d’usuari.

## Famílies: gradació d’una mateixa proposta

Una família manté tema, personatges, conflicte o idea central i desenvolupament. L’exigència varia amb el lèxic, la sintaxi, l’extensió, la densitat d’informació, les inferències, la formulació de les preguntes i els suports. Cada variant conserva el seu curs i dificultat editorial; no es classifica l’alumnat ni es desen perfils personals.

Les variants poden compartir il·lustracions si són coherents amb totes. Cada text ha de tenir preguntes, respostes, línies de resposta, anotacions i fragments `evidence` revisats en la seva pròpia llengua. No es poden heretar referències a frases que s’han simplificat o suprimit.

Hi pot haver una lectura marc, però les germanes funcionen soles. Assignem un únic `familyId` a totes les obres de la família i a les seves traduccions. Els identificadors actuals no es renumeren: això preserva els enllaços, els maquetats i les col·leccions ja desades.

El prototip de família implementa aquests criteris:

- distingir-les a la graella amb una pila de targetes i el nombre d’obres germanes disponibles en la llengua triada;
- oferir «Famílies: Amb variants» com a filtre principal amb ajuda, calculat a partir d’altres obres de la família en la mateixa llengua, sense comptar traduccions;
- mostrar al visor una secció de variants amb títol, codi, curs i dificultat;
- mantenir separats el canvi d’idioma i el canvi d’exigència;
- conservar un maquetat per cada variant i col·lecció, segons el sistema local actual;
- mantenir el recompte, les col·leccions i la impressió per lectures concretes: una pila visual no selecciona totes les germanes.

En clicar una pila s’obre una tria prèvia amb codi, curs, dificultat, resum, paraules i preguntes de cada variant, sense obrir-ne una per defecte. S’hi mostren totes les germanes disponibles en la llengua de la lectura, indicant les que coincideixen amb els filtres quan n’hi ha d’altres fora de la tria actual. Així es pot veure l’abast de la gradació sense confondre’l amb el filtre de curs.

En mode «Selecciona lectures» i dins de col·leccions, les variants apareixen com a targetes independents. Cada variant té el seu maquetat i codi d’aula, també quan pertany a diverses col·leccions. El menú de pulsació llarga d’una pila obre primer la tria de variant, per no afegir-ne una arbitràriament. Els lots llisten les variants concretes que coincideixen amb els filtres. Les fletxes del visor segueixen l’ordre de les targetes; en sortir d’una pila passen a la proposta següent, i el sidebar permet canviar de germana.

Quan les fletxes arriben a una família des d’una altra proposta del catàleg, també s’obre la tria prèvia. Dins d’una col·lecció les fletxes obren directament la variant concreta que el docent hi ha desat. Canviar a una germana que no és a la col·lecció actual s’indica al botó i la mostra fora de la col·lecció, sense afegir-la ni alterar-ne els maquetats.

El registre de famílies és a `data/families.js`. El primer pilot adapta la L208: L208A (4t intermedi, 208–211 paraules i set preguntes), L208B (6è intermedi, 329–332 paraules i deu preguntes) i L208 (1r d’ESO inicial, original conservat). Totes en català i castellà, amb il·lustracions compartides i fragments del solucionari propis de cada text. No es redefineix com a família el conjunt de la biblioteca de les coses: les L246–L248 són situacions diferents d’un mateix univers.

## Itineraris, ajudes i diàlegs: ordre de continuació

1. **Itineraris preparats.** Seleccions públiques amb objectiu, justificació de la tria, curs orientatiu, estratègies treballades i ordre suggerit. El docent les podrà copiar com a col·leccions pròpies i adaptar-ne contingut i format. No tindran progressió obligatòria ni registre d’alumnes.
2. **Ajudes abans del solucionari.** Suports de lectura, pistes de procés o una variant guiada. No s’han de confondre amb les marques de resposta d’`evidence`. El format es decidirà després dels pilots d’universos i famílies.
3. **Textos en diàleg.** Parelles o grups amb perspectives o informacions complementàries i preguntes de contrast. Es manté una relació pròpia: «Diàlegs compartits» no serà un únic univers que barregi contextos sense món comú. Un grup de diàleg pot, alhora, pertànyer a un univers.

## Primer pilot i criteri de tria

El recompte inicial és de 245 obres, totes en català i castellà. Hi ha quinze obres a cada combinació de curs i dificultat, excepte 5è intermedi, que en té trenta-cinc. No hi ha una única casella clarament més buida: triem **1r d’ESO inicial**, una de les combinacions empatades al mínim.

La L208, «La biblioteca d’objectes», inicia **La biblioteca de les coses**. El local permet connectar decisions quotidianes, responsabilitat, organització, reutilització i diferents formes de text. El pilot hi afegeix tres lectures del mateix tram d’exigència, en tots dos idiomes, sense modificar el text ni les preguntes de la L208. La guia concreta és a [universes/biblioteca-de-les-coses.md](universes/biblioteca-de-les-coses.md).

L’objectiu del pilot és validar la independència, el filtre, la continuïtat del lloc i dels personatges, els solucionaris i la maquetació. No es pressuposa que tot el catàleg actual s’hagi de vincular: la resta d’obres són possibles punts de partida i s’hi assignaran relacions només quan estiguin revisades.

Amb les L246–L248 el catàleg arriba a 248 obres, 496 versions lingüístiques. El tram de 1r d’ESO inicial passa de quinze a divuit obres; el primer univers en conté quatre. Aquesta és una fotografia del pilot, no una quota que substitueixi la revisió de l’exigència.

## Revisió abans de publicar

- Comprovar l’exigència amb lectures existents del mateix tram, les dues llengües i la independència respecte de qualsevol altra obra.
- Revisar que cada pregunta es respon amb el text o està identificada com a resposta oberta; ajustar línies i marques exactes del solucionari.
- Subratllar les expressions literals preguntades i reservar les notes de vocabulari per a altres termes que necessitin suport.
- Incloure dues imatges quan el text supera aproximadament 300–350 paraules. Compartir una il·lustració d’ambient és coherent dins de l’univers; la miniatura ha de poder distingir cada lectura.
- Comprovar identificadors, universos coneguts, una sola família, equivalència dels vincles entre traduccions, filtres, impressió i PDF.
- Publicar cada lectura amb text, preguntes i il·lustracions complets; actualitzar sempre el changelog. La comprovació remota la fa l’usuari.
