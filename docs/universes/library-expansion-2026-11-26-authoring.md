# Ampliació de la biblioteca · 26 de novembre del 2026

Objectiu autoritzat: onze històries noves, L269–L279, que completen quinze propostes de l’univers. Cada nova història és una família pròpia amb tres graus i català/castellà: 66 versions lingüístiques noves. Les quatre històries anteriors es conserven.

## Contracte de les dades d’autoria

Els fitxers exporten `libraryDraftFamilies`, una llista de famílies. Importar `q` i `mc` de `./library-expansion-model.js`. Parelles sempre `[castellà, català]`.

Cada família conté `code`, `workId` estable (slug sense idioma), `title` (parella), `themes` (valors del catàleg), `genre`, `imageAlt` (parella), `imageBrief` (escena pròpia sense persones; objectes i espai de la guia) i `editions`.

Cada edició conté `suffix` (`A`, cadena buida, `B`), `level`, `difficulty`, `summary` (parella), `paragraphs` (parelles), `questions` i, si cal, `notes`.

- A: `6-primary`, `intermediate`, 300–390 paraules per idioma, 8 preguntes. Mateixa història, amb context explícit, frases més directes i inferències accessibles.
- Sense sufix: `1-secondary`, `intermediate`, 440–540 paraules, 10 preguntes. Versió de referència.
- B: `1-secondary`, `advanced`, 570–680 paraules, 12 preguntes. Més matisos, contrast de fonts o perspectiva, sense convertir els adolescents en tècnics ni afegir protocols artificials.

`q(type, lines, [enunciatES, enunciatCA], [respostaES, respostaCA], [[paràgraf1based, citaESexacta, citaCAexacta], ...], mc(...))`.

`mc([[opcióAES, opcióACA], [opcióBES, opcióBCA], [opcióCES, opcióCCA], [opcióDES, opcióDCA]], 'a'|'b'|'c'|'d', enunciatAlternatiuOpcional, explicacióOpcional)`.

Ometre l’últim argument de `q` en opinió, creació o justificació personal. La resta d’ítems convertibles incorporen ABCD ben graduades, quatre opcions de mida comparable i una sola resposta defensable. Distribuir les lletres correctes. Cada variant té dades, cites i alternatives pròpies. No heretar preguntes per copiar-les mecànicament d’un grau a l’altre.

Tipus de pregunta: `literal`, `inference`, `vocabulary`, `structure`, `summary`, `opinion`. Gèneres: `narrative`, `informative`, `instructional`, `interview`, `letter`, `news`, `review`, `diary`, `argument`. Temes: `community`, `everyday`, `technology`, `environment`, `arts`, `games`, `history`, `math`, `science`, `nature`, `geography`, `adventure`, `sports`.

Incloure almenys una pregunta de vocabulari sustentada en una expressió literal «...» del text; el compilador en subratlla el fragment. Les notes, quan ajudin, són per a altres termes i no han de resoldre aquesta pregunta. Totes les preguntes no personals tenen cites exactes de suport. Ajustar línies a la resposta.

## Continuïtat i revisió

Llegir la guia `biblioteca-de-les-coses.md`, els criteris de `question-choices.md`, `AGENTS.md` i el skill de revisió. Rosa coordina; Noa i Adil són adolescents col·laboradors, amb papers diversos. Reintroduir context i participants; cap lectura necessita una altra. Històries amb detalls concrets, decisions motivades, desenllaços naturals; evitar onze variants del mateix procediment de reserves o inventari. Les incidències són de ficció, no normes generals.

No modificar fitxers d’altres autors, ni registres públics, ni publicar abans de revisió independent. El coordinador fa il·lustracions, integració, registres i publicació. Cada fitxer d’autoria es revisa després per un altre agent; s’hi comproven tots els idiomes, graus, distractors i cites. La versió exacta superada queda provisional, pendent de validació docent.
