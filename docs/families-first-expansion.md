# Primera ampliació de famílies

Encàrrec del 19 de novembre del 2026: construir reforç i ampliació per a vint lectures existents, en català i castellà. És una proposta editorial per facilitar el treball simultani amb nivells diversos i oferir diferents vies d’accés a un material comú.

## Tria i gradació

La selecció és a `data/family-edition-plan.js`: dotze originals de 5è, cinc de 4t i tres de 6è. Inclou narració, divulgació, instruccions, entrevista, carta, diari, ressenya i notícia, amb temes científics, culturals, socials, matemàtics i esportius. No s’assignen universos només pel fet de compartir una temàtica.

Cada original conserva el codi, el text, les preguntes i els identificadors previs. L’A és la nova versió de reforç i la B la nova ampliació; l’ordre explícit és A–original–B. El prototip L208 manté la nomenclatura anterior. Les traduccions comparteixen codi i grau; no són graus addicionals.

- **Reforç:** menys extensió i densitat, frases més curtes, referents explícits i sis o set preguntes amb demandes delimitades. Es mantenen la situació i els fets centrals, sense convertir el text en un resum telegràfic.
- **Original:** punt de treball comú, conservat íntegrament.
- **Ampliació:** més context, relacions causals, matisos i nou o més preguntes; cal justificar, contrastar o distingir certeses d’hipòtesis. L’exigència s’ajusta al material i no obliga a canviar sempre de curs.

Les il·lustracions s’aprofiten quan continuen representant fidelment els textos. Cada variant té la seva posició d’imatges, les seves preguntes, les línies adequades i els fragments de resposta exactes. No s’hereten anotacions del text original. Les expressions literals preguntades com a vocabulari se subratllen a la versió corresponent.

## Tanda completa: 20 de novembre del 2026

Vint famílies noves, amb quaranta adaptacions i vuitanta versions lingüístiques. Sumant el pilot L208 hi ha vint-i-una famílies. El catàleg té 290 obres concretes i 580 versions, agrupades en 248 propostes per llengua: afegir germanes a una lectura existent no afegeix targetes independents al catàleg de descoberta.

La gradació es valora per extensió, sintaxi, densitat i demanda de les preguntes. En alguns casos l’ampliació puja la dificultat dins del mateix curs; en altres, el curs. Les etiquetes són una orientació editorial que el docent pot contrastar amb el grup.

| Base i família | Reforç A | Original | Ampliació B |
| --- | --- | --- | --- |
| L001 · El cartell de la plaça | 4t inicial | 5è inicial | 5è avançada |
| L002 · Un pont de paper | 4t intermèdia | 5è intermèdia | 6è intermèdia |
| L003 · Un mapa per escoltar | 4t intermèdia | 5è intermèdia | 6è intermèdia |
| L004 · La caixa dels dimarts | 4t avançada | 5è avançada | 6è avançada |
| L005 · L’aigua que arribava a la ciutat | 4t intermèdia | 5è intermèdia | 6è intermèdia |
| L006 · Dues fotos, una mateixa balena | 4t intermèdia | 5è intermèdia | 6è intermèdia |
| L008 · La pinça que cuidava els dibuixos | 4t avançada | 5è avançada | 6è avançada |
| L031 · Un mosaic que es repeteix | 3r avançada | 4t intermèdia | 5è intermèdia |
| L039 · El taller dels paraigües | 3r avançada | 4t avançada | 5è avançada |
| L043 · Una carta per a l’última parada | 4t intermèdia | 5è intermèdia | 6è inicial |
| L044 · Preguntes a una afinadora | 4t intermèdia | 5è inicial | 6è inicial |
| L054 · Quant fa d’ample el riu al plànol? | 4t avançada | 5è intermèdia | 6è intermèdia |
| L065 · El pont dels set minuts | 4t avançada | 5è intermèdia | 6è intermèdia |
| L077 · Qui fa servir la pista? | 4t avançada | 5è intermèdia | 6è intermèdia |
| L175 · Una nit sense estrelles | 3r intermèdia | 4t intermèdia | 5è avançada |
| L179 · Una ressenya amb un però | 3r avançada | 4t intermèdia | 5è avançada |
| L180 · L’equip que es va quedar a recollir | 3r intermèdia | 4t intermèdia | 5è intermèdia |
| L202 · El mapa de les illes de llum | 5è intermèdia | 6è intermèdia | 1r d’ESO inicial |
| L203 · La cançó que va perdre una estrofa | 5è avançada | 6è intermèdia | 1r d’ESO inicial |
| L205 · El campionat de les peces prestades | 5è intermèdia | 6è intermèdia | 1r d’ESO inicial |

Per exemple, la família L043 s’ordena L043A–L043–L043B, i cada codi disposa de català i castellà. Les versions de reforç tenen sis o set preguntes; les d’ampliació, entre nou i dotze. Les originals conserven les seves preguntes.

## Autoria i validació

Els fitxers `data/family-adaptations-01.js` a `-05.js` agrupen quatre famílies cadascun. Les parelles de text s’escriuen en l’ordre castellà–català, per mantenir visibles les equivalències de cada paràgraf i pregunta. `q()` rep tipus, línies, pregunta ES, pregunta CA, resposta ES, resposta CA i fragments `[paràgraf, ES, CA]`. El constructor produeix objectes de lectura normals per a la maquetació i l’exportació.

`tools/check-family-editions.mjs` comprova identitats, ordre de demanda, traduccions, longituds, preguntes, línies, il·lustracions i referències. Les comprovacions del catàleg validen l’agrupació i els filtres; les del navegador proven la maquetació real d’alumnat i solucionari, sense alterar configuracions d’usuari. Aquestes comprovacions no substitueixen la revisió docent de dificultat.

Es publiquen només famílies amb les dues variants completes i les dues llengües. El registre filtra el pla segons les adaptacions disponibles. Les publicacions parcials consten al changelog; la revisió remota la fa l’usuari.
