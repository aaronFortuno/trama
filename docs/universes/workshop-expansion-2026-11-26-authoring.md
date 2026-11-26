# Ampliació del Taller de la plaça · 26 de novembre del 2026

Nou famílies L298–L306 per passar de sis a quinze històries autònomes. Cada família té suport de 4t, referència de 5è i ampliació de 6è, en català i castellà. Es conserven L039 i L254–L258. Llegir la guia `taller-de-la-placa.md`, `question-choices.md`, `AGENTS.md` i la pauta de revisió independent.

## Contracte de dades

Fitxers `data/workshop-2026-11-26-298-300.js`, `-301-303.js` i `-304-306.js`, exportant `workshopDraftFamilies`. Importar `q, mc` de `./workshop-expansion-model.js`. Cada especificació: `code`, `workId` sense idioma, `title:[ES,CA]`, `themes`, `genre`, `imageAlt:[ES,CA]`, `imageBrief`, `editions`.

- A: `4-primary`, `intermediate`, 180–240 paraules per llengua, 8 preguntes.
- Sense sufix: `5-primary`, `intermediate`, 270–340 paraules, 10 preguntes.
- B: `6-primary`, `intermediate`, 360–450 paraules, 12 preguntes. Més relacions i matisos, sense llenguatge d’expert.

Cada edició: `suffix`, `level`, `difficulty`, `summary:[ES,CA]`, `paragraphs:[[ES,CA],…]`, `questions`. Les tres versions comparteixen situació i desenllaç, però tenen textos, tasques i evidències propis. Traducció natural, no subordinades afegides per arribar a una quota.

`q(type, lines, [promptES,promptCA], [answerES,answerCA], [[paragraph1based,exactQuoteES,exactQuoteCA],…], mc(optionsPairs,correctLetter,optionalPromptPair,optionalExplanationPair))`.

Tipus: `literal`, `inference`, `vocabulary`, `structure`, `summary`, `opinion`. Gèneres: `narrative`, `informative`, `instructional`, `interview`, `letter`, `news`, `review`, `diary`, `argument`. Temes: `community`, `everyday`, `technology`, `environment`, `arts`, `games`, `history`, `math`, `science`, `nature`, `geography`, `adventure`, `sports`.

ABCD quan encaixi; opinió i producció personal obertes. Preguntes obertes autosuficients, resums de producció amb `choice.prompt` diferent quan ABCD demani reconèixer. Quatre opcions d’extensió comparable, única defensable i lletres correctes repartides. Distractors que confonen dades, ordre, causa, ús o abast del relat. Abans de lliurar, l’autor ha de poder identificar **quin malentès concret del text** faria triar cadascun dels tres distractors. Si només es descarta perquè és absurd, físicament impossible o aliè als personatges, s’ha de refer. Evitar acudits literals en vocabulari i opcions correctes sistemàticament més llargues. La revisió independent inclou aquesta exigència.

Preguntes no personals amb cites literals ES/CA. Almenys una vocabulari amb expressió literal entre «…» que se subratllarà. Notes opcionals només per altres termes. Línies ajustades. Verificar `wordCount` de `catalog.js`, compilació amb `compileWorkshopFamily`, cites i anotacions. Si la resposta és explícita, tipus literal; inferència exigeix relacionar pistes.

## Continuïtat i plausibilitat

Irene és la reparadora adulta; Hugo i Asha són infants d’uns deu anys. No convertir-los en tècnics ni assistents de taller. Ajuden a observar, dibuixar, escriure o provar objectes senzills quan l’adult ho proposa. El taller repara objectes de les persones propietàries; no els presta. Els encàrrecs es negocien amb motius clars. No tots són records sentimentals ni tots es resolen endevinant una avaria amagada.

Converses naturals, context autònom i finals en acció. Evitar comissions, protocols arbitraris, morals afegides i aclariments preventius que no responen a cap dubte real. Les decisions del taller fictici no són normes generals. No donar instruccions de reparació elèctrica o estructural per a infants. Descriure accions i proves concretes d’Irene sense inventar propietats tècniques universals; qualsevol afirmació factual dubtosa requereix font primària.

Visual: aquarel·la/guaix i llapis, paper amb gra, porta blava, taules mel, pots i retalls, plantes i llum de fulles. Irene cabell castany amb flocs grisos i monyo baix, brusa oliva i davantal indi amb tires cuir; Hugo cabell castany curt despentinat, dessuadora blava, samarreta clara de ratlles i llibreta verda; Asha pell bruna càlida, bob negre llis, granota violeta i samarreta teula. Conservar rostres. Una escena pròpia per història i ambient compartit L039; cap resposta només al dibuix. Mans, frontisses, peces i perspectives plausibles; sense text llegible.

Cada autor treballa només al seu fitxer. Un altre agent revisa tots els graus, llengües, textos, quatre opcions, respostes, cites, naturalitat i plausibilitat. Després de corregir, revalidació independent i SHA final exacte. Només aleshores provisional, pendent de validació docent. El coordinador fa imatges d’una en una i publica famílies completes després de comprovació local; la producció la comprova l’usuari.

## Tancament i comprovacions

Les nou famílies han superat revisió creuada entre els tres autors, amb correccions revalidades i empremtes exactes als registres editorial i d’ABCD. La tanda incorpora 27 fitxes graduades, 54 versions lingüístiques, 540 preguntes i 468 alternatives ABCD localitzades. Els nou recursos propis són a `assets/readings/`; les instruccions i els retocs d’objectes fets amb l’eina d’imatges es documenten a `workshop-expansion-2026-11-26-images.json`.

Comprovacions locals: `node tools/check-workshop-expansion.mjs --complete`, `node tools/check-question-choices.mjs`, `node tools/check-editorial.mjs` i `node tools/check-answer-evidence.mjs`. El comprovador de navegador `node tools/check-workshop-expansion-browser.cjs --code=L298` (repetit per cada família fins a L306) ha verificat **432 escenaris**: tots els graus i idiomes, resposta oberta/ABCD, alumnat/solucionari i format normal/extrem. S’hi comproven les imatges carregades, l’ordre de variants, el recompte únic de famílies, les preguntes, les marques correctes i els desbordaments. Les peticions externes s’hi bloquegen; no s’ha revisat producció.
