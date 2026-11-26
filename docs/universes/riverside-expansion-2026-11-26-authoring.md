# Ampliació dels Camins de la ribera · 26 de novembre del 2026

Nou famílies L307–L315 per passar de sis a quinze històries independents. Cada família: suport de 4t, referència de 5è i ampliació de 6è, en català i castellà. Conservar L189 i L264–L268. Llegir camins-de-la-ribera.md, question-choices.md, AGENTS.md i la pauta de revisió independent.

## Contracte d’autoria

Fitxers data/riverside-2026-11-26-307-309.js, -310-312.js i -313-315.js, exportant riversideDraftFamilies. Importar q, mc de ./riverside-expansion-model.js. Model d’exemple: data/workshop-2026-11-26-298-300.js. Cada especificació: code, workId sense idioma, title:[ES,CA], themes, genre, imageAlt:[ES,CA], imageBrief, editions.

- A: 4-primary, intermediate, 180–240 paraules per llengua i 8 preguntes.
- Sense sufix: 5-primary, intermediate, 270–340 paraules i 10 preguntes.
- B: 6-primary, intermediate, 360–450 paraules i 12 preguntes. Més matisos i relacions, sense veu d’expert ni frases farcides.

Cada edició: suffix, level, difficulty, summary:[ES,CA], paragraphs:[[ES,CA],…], questions. Mateixa situació i desenllaç entre germanes, amb textos, tasques, evidències i alternatives propis. Cadascuna es llegeix tota sola. Traducció natural i idiomàtica, també als enunciats i opcions.

q(type, lines, [promptES,promptCA], [answerES,answerCA], [[paragraph1based,exactQuoteES,exactQuoteCA],…], mc(optionsPairs,correctLetter,optionalPromptPair,optionalExplanationPair)). Els resums de producció mantenen enunciat obert; quan ABCD demana reconèixer un resum, usar choice.prompt propi. Opinió i creació sempre obertes. Línies segons resposta esperada, habitualment 1–4, fins a 5 quan cal.

Tipus: literal, inference, vocabulary, structure, summary, opinion. Gèneres: narrative, informative, instructional, interview, letter, news, review, diary, argument. Temes: community, everyday, technology, environment, arts, games, history, math, science, nature, geography, adventure, sports. Tots els textos han de tenir almenys un tema i gènere vàlids.

ABCD per a les preguntes adequades, com a mínim nombre de preguntes menys 3 en cada edició. Quatre opcions d’extensió i registre comparables, una única defensable; repartir lletres. Cada distractor ha de representar un malentès concret del text (temps, causa, condició, dada aplicada a una altra cosa, informació parcial…), no una possibilitat absurda, físicament impossible o un element aliè a la lectura. A 5è–6è, alternatives que facin rellegir amb cura. L’autor ha de poder justificar el malentès de cadascuna abans de lliurar. La revisió independent inclou les quatre opcions.

Totes les preguntes no personals amb cites literals ES/CA. Si la resposta ja és explícita, tipus literal; inferència necessita relacionar pistes. Almenys una pregunta de vocabulari per edició, amb terme literal entre «…» al seu enunciat i existent al text perquè se subratlli. Notes opcionals només per altres termes. Verificar wordCount de catalog.js, compileRiversideFamily i cites/anotacions; no copiar aprovació d’una variant o idioma a l’altre.

## Continuïtat i estil

Món rural atemporal de places de pedra, prats, camins, rierol, passera de fusta i molí de pedra amb roda. Neri és un infant d’uns onze anys que porta encàrrecs i també juga, escolta, escriu i participa de la vida cultural. Isona, amiga d’edat semblant, té veu i decisions pròpies, toca la flauta. Elna, adulta d’uns cinquanta o seixanta anys, és propietària del molí; fa les tasques tècniques adultes. Reintroduir persones i lloc cada lectura. Ni mòbils, motor, plàstic, equip de so, institucions modernes ni màgia real. Una representació o un conte sí poden contenir fantasia. No mapes exactes, distàncies fixes ni orientacions noves que comprometin continuïtat.

Variar conflictes i gèneres: no repetir camí tallat, càrrega delicada, porta tancada, córrer per arribar a temps o reconstruir records a cada història. Veus naturals; els infants no són tècnics ni membres d’una comissió. Evitar protocols arbitraris, morals afegides, aforismes perfectes i aclariments preventius sense cap dubte real del relat. Finals en acció i decisions amb motius. No fer manuals tècnics de molins, hidrologia, navegació o plantes; les observacions fictícies són concretes i qualsevol afirmació factual dubtosa necessita font primària.

Visual: aquarel·la/guaix i llapis, gra de paper, detall fi, tardor daurada, fulles taronges, pins foscos, muntanyes blavoses i llum càlida. Neri: cara i roba de L264, cabell castany curt despentinat, pigues suaus, capa marró amb caputxa i vora irregular, pantalons gris fosc, botes i sarró color mel. Elna: L266, cabell gris en trena gruixuda, brusa clara, davantal verd fosc i xal bordeus. Isona: L268, pell bruna, cabell negre curt lleument ondulat, armilla mostassa, túnica blau indi, botes. Conservar cares; variar composicions entre paisatge, objectes i persones. Mans, papers, càrregues, seients i eines plausibles. Sense text llegible; cap resposta depèn només del dibuix. Una escena nova per família i ambient compartit L189, compartides entre graus i llengües.

Cada autor modifica només el seu fitxer. Un altre agent revisa independentment totes les versions, textos, preguntes, quatre opcions, respostes, cites, llengua, gradació i plausibilitat. Correccions per l’autor i revalidació independent; comunicar SHA final exacte. Només llavors provisional pendent de validació docent. Root fa les imatges d’una en una, integra, comprova localment i publica famílies completes progressivament amb changelog. La producció la comprova l’usuari.

## Tancament i comprovacions

Les nou famílies han superat revisió creuada entre els tres autors i revalidació de les correccions, amb les empremtes exactes als registres editorial i d’ABCD. La tanda afegeix 27 fitxes graduades, 54 versions lingüístiques, 540 preguntes i 486 alternatives ABCD localitzades. Les nou escenes pròpies, les referències i la correcció d’orientació del dibuix de L313 es documenten a riverside-expansion-2026-11-26-images.json; les imatges definitives són a assets/readings/.

Comprovacions locals superades: node tools/check-riverside-expansion.mjs --complete, node tools/check-question-choices.mjs, node tools/check-editorial.mjs, node tools/check-answer-evidence.mjs i node tools/check-analytics.mjs. El comprovador node tools/check-riverside-expansion-browser.cjs --code=L307, repetit fins a L315, ha comprovat **432 escenaris**: tots els graus i idiomes, preguntes obertes/ABCD, alumnat/solucionari i format normal/extrem. Valida imatges carregades, preguntes preservades, marques correctes, ordre de germanes, recompte únic de famílies i absència de desbordaments. Les peticions externes queden bloquejades durant aquestes proves; no s’ha comprovat producció.

En tancar la tanda, els cinc universos ofereixen quinze històries cadascun. El catàleg té 315 propostes agrupades, 627 fitxes concretes i 1.254 versions lingüístiques; les 627 fitxes disposen d’alternatives pertinents en les dues llengües. Tots els continguts nous són provisionals, pendents de validació docent.
