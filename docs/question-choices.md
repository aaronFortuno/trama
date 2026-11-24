# Preguntes amb resposta oberta o ABCD

Prototip v1.56, 24 de novembre del 2026. Les cinc lectures base L001–L005 tenen quatre preguntes amb alternativa ABCD en català i castellà: vint alternatives i quaranta versions lingüístiques. Les lectures i preguntes obertes originals es conserven. Les variants de família A/B necessitaran alternatives pròpies; no les hereten.

| Lectura | Preguntes amb alternativa ABCD | Estat ES/CA |
| --- | --- | --- |
| L001 | 1, 2, 3, 4 | Provisional, revisió independent superada |
| L002 | 1, 2, 3, 6 | Provisional, revisió independent superada |
| L003 | 1, 2, 4, 6 | Provisional, revisió independent superada |
| L004 | 1, 2, 4, 7 | Provisional, revisió independent superada |
| L005 | 1, 2, 3, 4 | Provisional, revisió independent superada |

La validació docent queda pendent. La següent ampliació seqüencial començarà a L006, després de valorar el prototip. La cobertura es registra per codi i pregunta; tenir una lectura coberta no vol dir convertir totes les preguntes.

## Criteris editorials

- Una única resposta correcta o clarament més sustentada segons l’enunciat i el text. El docent ha de poder justificar la tria sense coneixements externs.
- Quatre opcions amb registre, extensió i estructura comparables. Sense pistes gramaticals ni una resposta correcta sistemàticament més detallada.
- Les alternatives incorrectes representen errors plausibles de lectura: causa i conseqüència, informació parcial, abast d’una afirmació, ubicació, moment o personatge. Revisar les quatre opcions, no només la correcta.
- Amb 2n–3r, frases curtes i distincions directes. Des de 4t–5è, més exigència: opcions aparentment lògiques, dades reals aplicades a un altre context i relacions que obliguen a rellegir. A 6è–ESO es poden afegir matisos, condicions i conclusions que sobrepassen les dades. L’exigència ve de comprendre; s’eviten ambigüitats involuntàries i trampes de redacció.
- Les opinions personals i la creació es mantenen obertes. Reconèixer un resum no equival a redactar-lo: cada canvi de format ha de conservar o explicitar l’objectiu.
- Revisió independent de cada idioma i variant, amb enunciat, quatre opcions, resposta, explicació i evidències. Qualsevol canvi posterior d’aquests elements requereix revalidació.
- Ordre de les opcions estable per poder recuperar i reimprimir exactament el material.

## Funcionament

«Format de les preguntes», al sidebar de contingut, aplica una preferència a totes les preguntes compatibles. El llapis i ABCD al preview canvien una pregunta concreta. La resposta oberta és el valor inicial. Una fitxa pot combinar els dos formats; les preguntes sense alternativa es mantenen obertes.

En ABCD es mostren quatre caselles i s’ometen les línies de resposta. Tornar a oberta recupera les línies configurades. El solucionari mostra les opcions, marca la correcta i inclou la lletra, el text i l’explicació. Les evidències són pròpies quan la formulació alternativa ho necessita.

La tria es desa per lectura i per col·lecció, s’inclou a la còpia de seguretat i es conserva en impressions individuals, lots, PDF i solucionaris. Restablir el maquetat torna al format obert. No altera el codi curt d’identificació de la lectura.

## Dades i seguiment

Les alternatives són a data/question-choices.js, vinculades a codi exacte i identificador de pregunta. Cada registre conté enunciat ES/CA, opcions ES/CA i identificador estable de l’opció correcta; admet explicació i evidències pròpies. L’explicació recorre al solucionari obert quan continua sent pertinent. Aquesta capa manté intactes els textos i els registres editorials originals.

question-responses.js resol el format triat. Els maquetats incorporen questionMode i questionModes per a les excepcions individuals. Els enllaços de maquetat poden utilitzar PREG=ABCD i TIPUSRES=1:OBERTA; els codis curts continuen identificant lectura, llengua i omissions.

docs/question-choices-review.json registra les quaranta versions exactes revisades, amb empremta del text, pregunta oberta, alternativa, explicació i evidències. Autor: root. Revisor independent: review_early_families. Les empremtes s’han de contrastar abans de publicar.

## Cerca per rangs

- -5 o -L005: de L001 a L005, incloses les variants de família.
- 10-20 o L010-L020: interval inclusiu.
- 20- o L020-: de L020 en endavant.
- Es mantenen la llengua, els filtres i l’ordre del catàleg. Es pot combinar un rang amb paraules de cerca. Un interval invertit no retorna resultats.

Comprovacions: tools/check-question-choices.mjs per contingut revisat, rangs, maquetats i codis; tools/check-question-choices-browser.cjs per controls, persistència, col·leccions, còpies, impressió i paginació. La comprovació de producció la fa l’usuari.
