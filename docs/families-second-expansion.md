# Segona ampliació de famílies · 22 de novembre del 2026

Deu lectures existents de 3r–6è, cadascuna amb una nova versió simplificada A i una ampliació B, en català i castellà. Cada família manté l’original íntegre i comparteix les il·lustracions que continuen sent coherents. Les variants són vies d’accés a una mateixa proposta i una mesura de DUA; el curs és una orientació editorial que ha de contrastar el docent.

## Tria i gradació

| Família | Suport A | Original conservat | Ampliació B | Estat |
| --- | --- | --- | --- | --- |
| L108 · La capsa dels dibuixos | 2n inicial | 3r intermèdia | 4t inicial | Provisional, revisió independent superada ES/CA |
| L127 · Una pinça per a cada mitjó | 2n inicial | 3r inicial | 4t inicial | Provisional, revisió independent superada ES/CA |
| L025 · Un torn al mercat | 3r intermèdia | 4t inicial | 5è inicial | Provisional, revisió independent superada ES/CA |
| L028 · Les cadires del cinema | 3r avançada | 4t intermèdia | 5è intermèdia | Provisional, revisió independent superada ES/CA |
| L168 · Com guardar una partida | 3r intermèdia | 4t inicial | 5è inicial | Pendent |
| L048 · El sobre de les dues entrades | 4t intermèdia | 5è intermèdia | 6è inicial | Pendent |
| L115 · La passada de la portera | 4t inicial | 5è inicial | 6è inicial | Pendent |
| L117 · El calaix de les peces soltes | 4t inicial | 5è inicial | 6è inicial | Pendent |
| L082 · L’assaig de les dues pauses | 5è intermèdia | 6è avançada | 1r d’ESO inicial | Pendent |
| L204 · Una entrada amb dos horaris | 5è intermèdia | 6è intermèdia | 1r d’ESO inicial | Pendent |

La selecció combina narració, entrevista, carta, instruccions i text informatiu, amb arts, convivència, esport, jocs i raonament sobre quantitats, horaris i informació. Cap lectura de la tanda té un univers assignat; formar una família no n’hi afegeix cap.

Els suports de 2n segueixen el perfil de cicle inicial: entre 40 i 80 paraules, paràgrafs molt breus, quatre preguntes literals d’una línia i informació explícita. S’hi aplica per defecte la plantilla Massallera de cicle inicial, respectant els maquetats personals. En els altres cursos es redueixen densitat, subordinació i passos implícits sense perdre la situació central.

Les ampliacions afegeixen context i relacions que permeten contrastar, inferir o justificar, amb demandes proporcionades al curs. No es converteixen les veus infantils en explicacions d’experts ni s’afegeixen morals al desenllaç. Cada variant disposa de preguntes, solucionari, línies, cites i subratllat de vocabulari propis. Les respostes obertes accepten alternatives raonables. Les versions de més de 350 paraules conserven dues il·lustracions de la lectura d’origen.

## Identitats, maquetació i publicació

La base conserva el seu codi i els seus textos. A–original–B és l’ordre de gradació explícit; cada variant té un `workId` i un `id` per llengua propis. Les traduccions comparteixen codi i exigència, però no compten com a graus diferents. El catàleg continua agrupant cada família en una sola proposta, amb miniatures, comparació i navegació entre germanes. Cada variant i cada col·lecció mantenen un maquetat independent.

Pla: `data/family-expansion-plan.js`. Adaptacions bilingües: `data/family-expansion-01.js` i següents, integrades per `data/family-expansion-adaptations.js`. Es publica cada parella de famílies quan A i B estan completes en tots dos idiomes i han superat la revisió independent. L’ampliació prevista suma vint obres adaptades i quaranta versions lingüístiques, sense alterar els deu originals.

## Revisió

`family-expansion-review.json` conserva l’empremta de les vint versions originals abans de formar les famílies i la de cada versió nova que supera la revisió independent. El registre indica codi, llengua, edició, data, resultat, revisor i validació docent pendent. Un canvi editorial posterior exigeix una nova revisió; «provisional» només s’aplica a material ja revisat, mai a un esborrany.

`node tools/check-family-expansion.mjs` comprova la part publicada: originals preservats, identitats, gradació, extensió, perfil de 2n, equivalència lingüística, temes, tipus de text, recursos, cites exactes, línies i empremtes de revisió. `--complete` exigeix les deu famílies. Les comprovacions locals de navegador revisen també fitxes i solucionaris. La comprovació de producció correspon a l’usuari.
