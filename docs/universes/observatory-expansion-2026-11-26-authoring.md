# Ampliació de L’observatori del turó · 26 de novembre del 2026

Nou famílies L289–L297 per passar de sis a quinze històries autònomes. Cada família té suport de 3r, referència de 4t i ampliació de 5è, en català i castellà. Es conserven L175 i L249–L253. Llegir abans la guia `observatori-del-turo.md`, `question-choices.md`, `AGENTS.md` i la pauta de revisió independent.

## Contracte de dades

Fitxers `data/observatory-2026-11-26-289-291.js`, `-292-294.js`, `-295-297.js`, exportant `observatoryDraftFamilies`. Importar `q, mc` de `./observatory-expansion-model.js`. Especificació: `code`, `workId` sense idioma, `title:[ES,CA]`, `themes`, `genre`, `imageAlt:[ES,CA]`, `imageBrief`, `editions`.

- A: `3-primary`, `intermediate`, 140–190 paraules per llengua, 6 preguntes. Frases curtes, informació directa, inferències modestes.
- Sense sufix: `4-primary`, `intermediate`, 220–280 paraules, 8 preguntes.
- B: `5-primary`, `intermediate`, 310–390 paraules, 10 preguntes. Més relacions i matisos, sense llenguatge d’expert.

Cada edició: `suffix`, `level`, `difficulty`, `summary:[ES,CA]`, `paragraphs:[[ES,CA],…]`, `questions`. Les tres versions comparteixen situació i desenllaç, amb textos i tasques propis.

`q(type, lines, [promptES,promptCA], [answerES,answerCA], [[paragraph1based,exactQuoteES,exactQuoteCA],…], mc(optionsPairs,correctLetter,optionalPromptPair,optionalExplanationPair))`.

Tipus: `literal`, `inference`, `vocabulary`, `structure`, `summary`, `opinion`. Gèneres: `narrative`, `informative`, `instructional`, `interview`, `letter`, `news`, `review`, `diary`, `argument`. Temes: `community`, `everyday`, `technology`, `environment`, `arts`, `games`, `history`, `math`, `science`, `nature`, `geography`, `adventure`, `sports`.

ABCD on sigui pertinent, opinió i producció personal obertes. Les preguntes obertes han de funcionar sense opcions; els resums demanen redactar i tenen `choice.prompt` propi si l’alternativa demana reconèixer. Quatre opcions plausibles, d’extensió comparable, una sola defensable; lletres correctes distribuïdes. Revisar cada distractor abans de lliurar: confusions del mateix relat (ordre, causa, moment, abast), no propietats absurdes o informació aliena. A 3r són més directes; a 4t–5è requereixen lectura acurada.

Preguntes no personals amb cites literals ES/CA. Almenys una pregunta de vocabulari cita un terme literal entre «…» que el compilador subratlla. Notes opcionals per a altres termes, sense resoldre aquella pregunta. Línies ajustades a la resposta. Comprovar amb `wordCount` de `catalog.js` i `compileObservatoryFamily`.

## Món, llenguatge i ciència

Dani i Mira són infants d’uns deu/onze anys; Joana és la guia adulta. Alternar papers i veus; cap infant sempre infal·lible. Context autònom, converses naturals, accions concretes i algun humor; evitar comissions, protocols arbitraris, morals afegides i aclariments preventius sense un dubte real. Les dades del servei fictici no són normes universals. Els models es presenten com a models i els poemes com a creació.

Consultar `observatory-expansion-2026-11-26-sources.md` per als fets científics contrastats. No afegir altres afirmacions astronòmiques sense verificació primària. No fer observació solar amb telescopi ordinari ni dibuixar equips apuntant al Sol. Els textos no depenen de les il·lustracions per respondre.

Visual: aquarel·la/guaix i llapis, paper amb gra, pedra crema, cúpula gris, pins, lavanda i ambre. Dani pèl-roig curt, jaqueta verd blavós i pantalons grisos; Mira pell fosca, cabell negre curt molt arrissat i dessuadora taronja; Joana cabell gris curt, ulleres rodones i jaqueta de punt blau marí. Una escena pròpia per història més la vista comuna L175.

Cada autor modifica només la seva font. Un altre agent llegeix tots els graus, llengües, textos, preguntes, quatre opcions, solucionaris i evidències, amb passada de naturalitat i plausibilitat. Després de corregir, revalidació independent exacta i SHA final. Només llavors és provisional, pendent de validació docent. El coordinador genera imatges d’una en una, comprova en local i publica famílies completes progressivament. No es comprova producció.
