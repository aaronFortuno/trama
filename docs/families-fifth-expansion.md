# Cinquena ampliació de famílies DUA

Encàrrec del 23 de novembre del 2026: preparar vint famílies més a partir de lectures sense variants ni univers assignat. Cada original conserva el codi i incorpora suport A i ampliació B, en català i castellà: quaranta variants i vuitanta versions lingüístiques noves. Es publiquen per parelles després de la revisió independent i les comprovacions locals. La validació docent es pot fer progressivament.

## Lectures i cursos orientatius

| Família | Suport A | Original conservat | Ampliació B | Estat |
| --- | --- | --- | --- | --- |
| L109 · A l’ombra del pont | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |
| L027 · El rellotge del pa | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L049 · Un joc de pistes al mirall | 4t | 5è | 6è | Pendent |
| L086 · Un minut al rellotge d’aigua | 5è | 6è | 1r d’ESO | Pendent |
| L125 · Una barca per a dos | 2n | 3r | 4t | Pendent |
| L033 · L’última parada | 3r | 4t | 5è | Pendent |
| L055 · L’ampolla dels missatges | 4t | 5è | 6è | Pendent |
| L090 · Una carta dins del fang | 5è | 6è | 1r d’ESO | Pendent |
| L128 · El pa del berenar | 2n | 3r | 4t | Pendent |
| L166 · La tassa de les dues nanses | 3r | 4t | 5è | Pendent |
| L057 · La fira per dins | 4t | 5è | 6è | Pendent |
| L091 · El torn de les papallones nocturnes | 5è | 6è | 1r d’ESO | Pendent |
| L145 · La manta de les mànigues | 2n | 3r | 4t | Pendent |
| L182 · La pedra que pesava poc | 3r | 4t | 5è | Pendent |
| L118 · El racó de la Bruna | 4t | 5è | 6è | Pendent |
| L095 · La platja que va viatjar amb les onades | 5è | 6è | 1r d’ESO | Pendent |
| L150 · Un got per mesurar | 2n | 3r | 4t | Pendent |
| L184 · Una carta per al rober | 3r | 4t | 5è | Pendent |
| L162 · Una jugada sense marcador | 4t | 5è | 6è | Pendent |
| L206 · Les dues velocitats d’una glacera | 5è | 6è | 1r d’ESO | Pendent |

La tria es reparteix entre cinc originals de cadascun dels cursos de 3r a 6è. Combina relats, entrevistes, instruccions, una carta i textos informatius sobre temes quotidians, història, ciència i natura. El curs orienta la tria del docent; les tres versions d’una família comparteixen el nucli de l’activitat.

## Criteris de gradació i coherència

Es mantenen personatges, situació i desenvolupament central, amb les il·lustracions originals que continuen sent coherents. La gradació canvia extensió, sintaxi, lèxic, explicitació de pistes i preguntes. El suport de 2n té entre 40 i 80 paraules, paràgrafs de fins a 30 paraules i quatre preguntes literals d’una línia. Les ampliacions d’ESO tenen entorn de 500 paraules, dues imatges i 11–12 preguntes. Les variants amb una sola imatge es mantenen fins a 350 paraules en totes dues llengües.

Cada variant té preguntes, solucionari, línies, subratllats de vocabulari i fragments de resposta propis en ES/CA. Les dades o motius explícits corresponen a preguntes literals; les inferències relacionen o apliquen informació. Les respostes obertes admeten alternatives raonables. Es comproven veus, naturalitat, cronologia, coneixement dels personatges, objectes, quantitats, fets tècnics i límits de les conclusions. Les cites s’han d’ajustar a mots sencers i passar annotationRange.

## Implementació i revisió

El pla i l’agregador són a data/family-expansion-2026-11-23c-plan.js i data/family-expansion-2026-11-23c-adaptations.js. Només s’incorporen famílies completes, amb identitat i maquetat propis per variant. Els mòduls 01–05 els redacta adaptations_second_ten i els revisa independentment root; els 06–10 els redacta adaptations_third_ten i els revisa review_early_families. Root coordina correccions, revalidacions i publicació.

El registre docs/family-expansion-2026-11-23c-review.json conserva les empremtes de les quaranta versions originals i de les noves versions aprovades, amb codi, edició, data, revisor i resultat. Les empremtes aprovades es contrasten amb les dades públiques abans de cada publicació. Provisional significa revisió independent superada i validació docent pendent.

Comprovacions: node tools/check-family-expansion.mjs --batch=2026-11-23c comprova la part incorporada; --complete exigeix les vint famílies. També es comproven fitxes i solucionaris al navegador local. La comprovació de producció la fa l’usuari. Es preserven originals, codis, col·leccions i maquetats existents.
