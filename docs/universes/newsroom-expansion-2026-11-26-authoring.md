# Ampliació de La redacció del pati · 26 de novembre del 2026

Objectiu: passar de sis a quinze històries autònomes de l’univers. L280–L288 són nou famílies noves, cadascuna en català i castellà, amb suport de 5è, referència de 6è i ampliació de 1r d’ESO. Es conserven L070 i L259–L263.

## Format d’autoria

Fitxers `data/newsroom-2026-11-26-280-282.js`, `-283-285.js` i `-286-288.js`, exportant `newsroomDraftFamilies`. Importar `q` i `mc` de `./newsroom-expansion-model.js`. Cada objecte conté `code`, `workId` sense idioma, `title: [ES, CA]`, `themes`, `genre`, `imageAlt: [ES, CA]`, `imageBrief` i tres `editions`.

Cada edició té `suffix`, `level`, `difficulty`, `summary: [ES,CA]`, `paragraphs: [[ES,CA],…]` i `questions`:

- A: `5-primary`, `intermediate`, 250–330 paraules per llengua, 8 preguntes.
- Sense sufix: `6-primary`, `intermediate`, 360–450 paraules, 10 preguntes.
- B: `1-secondary`, `intermediate`, 480–590 paraules, 12 preguntes. Més matisos i relacions, sense registre de secundària avançada.

`q(type, lines, [promptES,promptCA], [answerES,answerCA], [[paragraph1based,exactQuoteES,exactQuoteCA],…], mc(optionsPairs, correctLetter, optionalPromptPair, optionalExplanationPair))`.

ABCD en totes les preguntes apropiades; opinions i producció personal es mantenen obertes. Quatre opcions plausibles i d’extensió comparable, una sola defensable, lletres distribuïdes. Els resums en obert demanen redactar; si ABCD demana reconèixer, utilitzar `choice.prompt` propi. No ometre informació del mode obert que només sigui a les opcions. Des de 5è els distractors confonen dades, seqüència, causa o abast del mateix text, no propietats absurdes.

Abans de lliurar, l’autor ha de rellegir també cadascun dels tres distractors. Tots han de representar una confusió possible entre dades o interpretacions del relat. «El retall converteix el dibuix en fotografia» o «la mida de la foto canvia les quantitats d’una recepta» es descarten sense llegir: no serveixen per graduar l’exigència. És preferible confondre el moment d’una fotografia amb el d’una jugada, la llista d’ingredients amb els passos, una observació amb una valoració o la data prevista amb un fet ja passat. El criteri s’aplica als tres graus, amb més matís al més alt.

Tipus: `literal`, `inference`, `vocabulary`, `structure`, `summary`, `opinion`. Gèneres: `narrative`, `informative`, `instructional`, `interview`, `letter`, `news`, `review`, `diary`, `argument`. Temes del catàleg: `community`, `everyday`, `technology`, `environment`, `arts`, `games`, `history`, `math`, `science`, `nature`, `geography`, `adventure`, `sports`.

Totes les preguntes no personals porten cites literals ES/CA. Una pregunta de vocabulari, com a mínim, cita un terme del text entre «…» perquè se subratlli. Les notes opcionals (`notes: [{paragraph,text:[ES,CA],definition:[ES,CA]}]`) defineixen altres termes, sense resoldre preguntes. Línies ajustades a la resposta. Cada grau té text i tasques propis, amb la mateixa situació i desenllaç; cada llengua s’ha de llegir com a original natural.

## Continuïtat i control editorial

Consultar `redaccio-del-pati.md`, `question-choices.md`, `AGENTS.md` i la pauta de revisió independent. Clara i Omar són alumnes d’onze o dotze anys d’una escola fictícia que fan un diari. Cap no és sempre l’infal·lible. No reduir els relats a protocols de comissió ni a detectar dades equivocades; donar lloc a conversa, acció, creació i humor natural. Cada història reintrodueix context i participants, no pressuposa lectures anteriors i acaba amb una acció concreta, sense moral afegida. Les regles del centre són decisions de ficció, no lleis universals.

Mantenir gravat/risografia de dos colors blau de Prússia i taronja, paper blanc càlid, trama i ratllat. Conservar aparences fixades a la guia. Una escena pròpia per història i la vista compartida de L070; les il·lustracions serveixen als tres graus i als dos idiomes, sense respostes visuals imprescindibles ni text llegible.

Cada autor treballa només al seu fitxer. Un altre agent revisa tots els textos, variants, llengües, preguntes obertes i ABCD, solucionaris i evidències. Després de corregir cal revalidació de les peces afectades i empremta exacta del fitxer. Només llavors s’anomenen provisionals, pendents de validació docent. El coordinador genera imatges d’una en una i publica només famílies completes, després de comprovacions locals; no es comprova producció.
