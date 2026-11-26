# Universos de Trama

Índex de continuïtat narrativa i visual, actualitzat el **26 de novembre del 2026**. Cal consultar-lo abans d’ampliar un univers, adaptar-ne una lectura o crear il·lustracions amb personatges recurrents.

## Els cinc universos

| Univers i guia | Identificador estable | Origen | Altres històries | Tram de les propostes |
| --- | --- | --- | --- | --- |
| [La biblioteca de les coses](biblioteca-de-les-coses.md) | `biblioteca-de-les-coses` | L208 | L246–L248, L269–L279 | 6è–1r d’ESO; 15 històries |
| [L’observatori del turó](observatori-del-turo.md) | `observatori-del-turo` | L175 | L249–L253 | 4t–5è |
| [El taller de la plaça](taller-de-la-placa.md) | `taller-de-la-placa` | L039 | L254–L258 | 4t–5è |
| [La redacció del pati](redaccio-del-pati.md) | `redaccio-del-pati` | L070 | L259–L263 | 6è |
| [Els camins de la ribera](camins-de-la-ribera.md) | `camins-de-la-ribera` | L189 | L264–L268 | 4t–5è |

Totes les històries tenen versió catalana i castellana. Els quatre universos del 20 de novembre incorporen cinc històries cadascun i reutilitzen una lectura d’origen: **sis propostes autònomes per univers**. La biblioteca n’ofereix quinze des del 26 de novembre. Les famílies aporten altres graus, però cadascuna continua comptant com una sola proposta al catàleg. Així, aquest conjunt ofereix **39 propostes connectades**, sense duplicar traduccions ni graus d’una mateixa família.

La tanda L249–L268 del 20 de novembre va afegir 20 obres i 40 versions lingüístiques. En aquella edició el catàleg tenia 310 obres concretes, 620 versions lingüístiques i 268 propostes agrupant les 21 famílies. Són recomptes històrics, no objectius fixos.

La tanda L269–L279 del 26 de novembre afegeix onze famílies noves de la biblioteca: **33 versions graduades i 66 versions lingüístiques**, totes amb resposta textual i alternatives ABCD pertinents, solucionari, evidències i dues il·lustracions. El [registre propi](library-expansion-2026-11-26-review.json) identifica separadament cada variant i idioma revisats. La [guia d’autoria](library-expansion-2026-11-26-authoring.md) fixa el model per continuar ampliant el món.

Les quaranta versions han superat la revisió independent i són **provisionals, pendents de validació docent**. El [registre editorial de la tanda](review-2026-11-20.md) conserva codi, llengua, data, resultat i identificació exacta de la versió revisada. Un canvi editorial posterior requereix revalidar els elements afectats.

## Què comparteix cada món

| Univers | Personatges recurrents | Lloc i identitat visual | Espai per a noves situacions |
| --- | --- | --- | --- |
| Biblioteca | Rosa, Noa i Adil | Local veïnal, finestra verda amb arc, fusta mel; guaix i llapis | Préstecs, necessitats compartides, organització i decisions del servei |
| Observatori | Dani, Mira i Joana | Pedra clara, cúpula grisa, pins, cel lavanda; aquarel·la i llapis | Visites, preguntes, observacions, imaginació i maneres de comprendre |
| Taller | Irene, Hugo i Asha | Porta blava, taules de fusta, plaça i porxo; aquarel·la i llapis | Encàrrecs, oficis, materials, memòria dels objectes i col·laboració |
| Redacció | Clara i Omar; convidats com Sergi | Escola i pati; risografia/gravats en blau i taronja | Informació, entrevistes, opinió, creació, decisions d’edició i accés al diari |
| Ribera | Neri, Elna i Isona | Vall rural atemporal, rierol i molí; aquarel·la de tardor | Encàrrecs, camins, records, trobades, arts i convivència |

Les guies individuals especifiquen les aparences fixades i els límits del món. A la biblioteca, les escenes s’han centrat en els objectes: abans d’il·lustrar els personatges de manera recurrent cal fixar-ne una referència visual comuna. En els altres universos les guies indiquen quina imatge és la referència de cada personatge. Compartir una temàtica no és suficient per barrejar mons.

## Regles editorials compartides

1. **Autonomia.** Cada lectura presenta les persones, els llocs i les dades que necessita. Pot contenir picades d’ullet, però cap pregunta requereix haver llegit una altra història. La taula de codis no és una seqüència obligatòria.
2. **Varietat.** Compartir personatges no significa repetir sempre el mateix conflicte ni limitar-se a narracions. Cal alternar gèneres, punts de vista, ritmes i tasques. Cap infant no és sempre qui s’equivoca o qui corregeix.
3. **Continuïtat explícita.** Abans d’escriure, consultar la lectura d’origen i la guia. Si es fixa una aparença, un lloc o una relació nous, afegir-los a la guia i indicar-ne la primera lectura o imatge de referència. No atribuir al text d’origen detalls que s’han decidit després.
4. **Identitats estables.** Una història nova té codi i `workId` nous. Les traduccions o adaptacions lingüístiques conserven aquests dos valors i tenen `id` propi. Les variants d’exigència formen una família amb identitats pròpies; no són noves aventures d’un univers.
5. **Relacions independents.** `universeIds` admet zero o diversos mons si la trobada està justificada. `familyId` admet una sola família. Les col·leccions de l’usuari continuen sent tries locals i no defineixen l’univers. Vegeu el [model editorial general](../editorial-model.md).
6. **Activitat completa.** Text i preguntes han de tenir una exigència coherent amb curs i dificultat. Cada versió necessita solucionari, línies ajustades, fragments exactes de suport i subratllat dels termes literals preguntats. Les notes defineixen altres termes que necessiten ajuda, sense resoldre preguntes de vocabulari.
7. **Imatges coherents.** Cada història nova té una escena pròpia per distingir-ne la targeta. Es pot reutilitzar una imatge d’ambient com a segona il·lustració; els textos de més de 300–350 paraules han de disposar d’almenys dues. Les respostes es poden extreure del text sense interpretar detalls del dibuix. Revisar mans, papers, seients, eines i perspectiva. Evitar retolació llegible perquè els recursos es comparteixen entre llengües.
8. **Publicació completa.** No publicar lectures sense els seus recursos. Conservar les instruccions d’imatge, actualitzar guia i changelog i passar les comprovacions locals. La revisió de producció la fa l’usuari.

## Dades i recursos

El registre públic és [`data/universes.js`](../../data/universes.js): identificador, noms, presentacions en cada llengua i `seedCode`. La lectura d’origen i les seves variants hereten la relació; afegir un univers no reescriu ni renumera l’original.

Les novetats d’aquesta tanda són a `data/readings-universe-observatory.js`, `data/readings-universe-workshop.js`, `data/readings-universe-newsroom.js` i `data/readings-universe-riverside.js`. `data/readings-new-universes.js` les integra. El petit model d’autoria `data/bilingual-reading-model.js` transforma parelles **[castellà, català]** en les dues lectures ordinàries del catàleg: no és un format diferent per al visor ni obliga a migrar les lectures antigues. Cada referència de resposta inclou paràgraf i citació exacta en tots dos idiomes.

Les imatges definitives són WebP locals a `assets/readings/`, compartides entre llengües. Les instruccions completes de les vint noves escenes són a [prompts](prompts/), de `l249.txt` a `l268.txt`, amb eina, data, referències i arxiu final. Per a la biblioteca, vegeu [la seva guia d’imatges](biblioteca-de-les-coses-images.md). Cal reutilitzar referències del repositori, no dependre d’una ruta temporal de generació.

Comprovacions locals de la tanda:

```text
node tools/check-universe-expansion.mjs --complete
node tools/check-editorial.mjs
node tools/check-answer-evidence.mjs
node tools/check-family-editions.mjs --complete
node tools/check-universes-browser.cjs
node tools/check-library-expansion.mjs --complete
node tools/check-library-expansion-browser.cjs
```

La comprovació d’ampliació valida els cinc mons, les vint obres bilingües, els recursos, les metadades, les preguntes i les cites. La del navegador comprova filtre i recomptes de tots els universos, fitxes i solucionaris en tots dos idiomes, preservació del text, desbordaments i un PDF real, sense visitar producció.
