# Classificació per cicles

Model editorial de v1.65, del 27 de novembre del 2026. Primària es presenta per **primer cicle (1r–2n), segon cicle (3r–4t) i tercer cicle (5è–6è)**. Secundària conserva **1r d’ESO**, l’abast del material actual. La dificultat s’interpreta dins de cada cicle.

La gradació per cicles és coherent amb l’organització del [currículum de primària de la XTEC](https://xtec.gencat.cat/ca/curriculum/primaria/curriculum-175-2022/). Les franges de Trama són orientacions editorials pròpies, ajustables amb la validació docent i els avisos de la comunitat.

## Criteris

Es valoren conjuntament llenguatge i sintaxi, densitat d’informació, abstracció, distància entre pistes i demanda de les preguntes obertes i ABCD. La llargada i el nombre de preguntes no determinen sols la dificultat. Recuperar una explicació explícita no equival a construir una inferència complexa.

| Cicle | Inicial | Intermèdia | Avançada |
| --- | --- | --- | --- |
| Primer, 1r–2n | Frases i paràgrafs molt breus, referents clars, lèxic proper i localització directa. Seqüències curtes i respostes literals. | Lectura més sostinguda, petits enllaços causals o temporals i alguna inferència pròxima, amb context clar. | Integrar diversos detalls, vocabulari menys immediat explicat al context i justificacions senzilles, dins de la lectura primerenca. |
| Segon, 3r–4t | Situacions accessibles, poca informació simultània i preguntes literals o inferències guiades amb pistes properes. | Relacionar causes, passos o idees de fragments diferents; explicar decisions, aplicar una regla o reconèixer la funció d’un element. | Integrar pistes separades, distingir explicacions, interpretar un model o un contrafactual i justificar amb diverses proves adequades al cicle. |
| Tercer, 5è–6è | Organització clara, lèxic contextualitzat i relacions pròximes entre dades, causes i resultats. | Seguir diversos moments o perspectives, integrar dades i explicar inferències; les relacions principals continuen sustentades de manera visible al text. | Demanda sostinguda en almenys dues dimensions: model conceptual, ordres o perspectives diferents, dades separades, inferències no resoltes directament, límits d’una analogia, transferència o justificació amb diverses proves. |

En avançada, els distractors ABCD disponibles també han d’exigir lectura acurada. Les adaptacions personals de format o preguntes no canvien la classificació editorial de la fitxa completa.

Les 28 lectures actuals del primer cicle són suports molt accessibles de 2n: 48–72 paraules i quatre preguntes literals, d’opinió directa o vocabulari immediat. Es classifiquen com a inicials de cicle. No s’han fabricat altres franges per equilibrar recomptes. A ESO es conserva la gradació existent, relativa a 1r d’ESO.

## Migració i revisió

Ancoratges de partida:

- 3r/5è inicial o intermedi → inicial del cicle corresponent.
- 3r/5è avançat i 4t/6è inicial o intermedi → intermedi del cicle corresponent.
- 4t/6è avançat → avançat del cicle corresponent.

Són ancoratges de migració, no equivalències obligatòries per al material futur. Una revisió independent va contrastar individualment **43 codis en les dues llengües: 86 versions, 660 preguntes obertes amb solucionari i 478 alternatives ABCD**. Va llegir textos i preguntes complets de la mostra de frontera i va justificar dotze excepcions:

- Segon cicle intermedi: L008A, L035, L036, L037, L054A, L065A, L077A i L183.
- Tercer cicle intermedi: L057B.
- Tercer cicle avançat: L206, L314B i L315B.

Els motius concrets són a `data/cycle-classification.js`. L038 conserva avançada per distingir quantitat, volum i pes i interpretar un contrafactual. L280, L284, L286 i L298B continuen intermèdies malgrat l’extensió: les relacions principals són explícites. L309B aplica regles i sumes ja donades; el nombre d’inferències tipificades no justifica promocionar-la.

El [registre de la mostra](cycle-classification-review-2026-11-27.json) conserva identificadors, classificació i empremtes dels inputs llegits. **La resta del catàleg segueix els ancoratges editorials; no s’afirma una revisió individual nova de les 627 fitxes.** S’han comprovat en totes les peces cobertura, correspondència entre idiomes i ordre de les 156 famílies. La validació docent continua oberta.

## Dades, formats i persistència

`data/cycle-classification.js` registra una assignació explícita per codi de fitxa. Les traduccions comparteixen assignació i les variants tenen codi propi. `reading-levels.js` exposa `classificationFor`, `readingLevel` i `readingDifficulty`.

Els camps originals `reading.level` i `reading.difficulty` es conserven com a referència editorial. Textos, preguntes, respostes, il·lustracions, `id`, `workId`, codis i relacions de família no s’han reescrit. Això manté els registres de revisió de contingut i els vincles de maquetats, codis d’aula i col·leccions.

El format inicial continua depenent del curs de referència: Massallera per als suports de 2n, lletra més gran per a 3r, etc. Els formats desats mantenen la prioritat. La migració no reescriu dades personals; els enllaços de fitxa i les còpies de seguretat continuen funcionant.

Els imports personals antics per curs es presenten dins del cicle corresponent amb una correspondència orientativa. Es conserven les dades originals i el registre públic no s’hi aplica encara que coincideixi el codi.

Filtres, targetes, tria de variants, veïnes i comparador mostren cicle i dificultat de cicle. Cada família compta una sola proposta per cerca. Dues variants poden compartir cicle i franja: són categories àmplies i cadascuna conserva text i maquetat propis.

## Extensió en paraules

| Cicle o etapa | Curta | Mitjana | Llarga |
| --- | ---: | ---: | ---: |
| Primer cicle | ≤55 | 56–80 | ≥81 |
| Segon cicle | ≤140 | 141–220 | ≥221 |
| Tercer cicle | ≤260 | 261–380 | ≥381 |
| 1r d’ESO | ≤375 | 376–475 | ≥476 |

Aquests intervals editorials són independents de la dificultat. Una edició pot variar lleugerament d’extensió entre idiomes sense canviar de dificultat.

## Analítica

Les lectures i documents mantenen `nivell` i `dificultat` com a referència històrica i afegeixen `cicle` i `dificultat_cicle` del registre públic. Els avisos inclouen els dos contextos. Les cerques i filtres nous utilitzen `cicle` i `dificultat_cicle`; el selector manté `filtre: level`, amb valors com `primary-cycle-2`. Els esdeveniments antics no es reetiqueten. No s’afegeixen camps personals, cerques ni dades de col·leccions o maquetats.

## Manteniment i proves

Les lectures futures necessiten una assignació explícita per codi, coherent amb aquesta pauta i amb les altres variants. Després d’un canvi que alteri l’exigència, cal revisar-la i documentar el motiu. Les quatre llengües de la interfície comparteixen classificació i tenen les etiquetes i explicacions traduïdes.

- `node tools/check-cycle-classification.mjs`: cobertura, idiomes, progressió, mostra de calibratge, filtres, contingut immutable, maquetats, codis i analítica.
- `node tools/check-cycles-browser.cjs`: navegació, recomptes, famílies i comparació, extensió, quatre idiomes, maquetats generals i de col·lecció entre recàrregues i impressió en la llengua del text.
- `node tools/catalogue-balance.mjs --write`: actualitza el [balanç per cicles i universos](catalogue-balance.md) i el JSON de recomptes, deduplicant famílies i idiomes.

Les proves de navegador utilitzen recursos locals i un tracker simulat. La comprovació de producció la fa l’usuari.
