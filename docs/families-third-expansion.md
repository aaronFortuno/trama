# Ampliació DUA del 23 de novembre del 2026

Encàrrec: donar una variant de suport A i una d’ampliació B a trenta lectures existents que no tenien família. Són seixanta variants noves, cadascuna en català i castellà: cent vint versions lingüístiques. Primer es completen deu famílies i després les vint següents. Els originals, codis i maquetats existents es conserven.

## Tria i cursos orientatius

| Família | Suport A | Original conservat | Ampliació B | Estat |
| --- | --- | --- | --- | --- |
| L130 · L’entrada de cartró | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |
| L177 · El pressupost del patinet | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L114 · L’ombra del titella | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L050 · Cartes des del banc del pati | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L087 · Una veu entre els diàlegs | 5è | 6è | 1r d’ESO | Provisional, revisió independent superada ES/CA |
| L123 · La llauna dels llapis | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |
| L171 · La bossa de la narradora | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L119 · Polseres per encàrrec | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L085 · La maleta que no es volia tancar | 5è | 6è | 1r d’ESO | Provisional, revisió independent superada ES/CA |
| L126 · El camí de les fletxes | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |

Les vint famílies següents:

| Família | Suport A | Original conservat | Ampliació B | Estat |
| --- | --- | --- | --- | --- |
| L023 · Els fulls que queden | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L120 · Un camí entre la neu | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L139 · La corda de l’hort | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |
| L088 · Dues cartes per a una persiana | 5è | 6è | 1r d’ESO | Provisional, revisió independent superada ES/CA |
| L026 · Un espai a la paret | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L122 · El ritme dels gots | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L136 · Dos trucs a la porta | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |
| L089 · El nus del cel | 5è | 6è | 1r d’ESO | Provisional, revisió independent superada ES/CA |
| L169 · Les motxilles de l’última fila | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L046 · El jardí dels torns | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L140 · El bitllet de l’avi | 2n | 3r | 4t | Pendent |
| L094 · El peix que va nedar a l’inrevés | 5è | 6è | 1r d’ESO | Pendent |
| L172 · Dos preus a l’etiqueta | 3r | 4t | 5è | Pendent |
| L053 · El dia que van canviar els senyals | 4t | 5è | 6è | Pendent |
| L149 · La capsa que fa la volta | 2n | 3r | 4t | Pendent |
| L096 · El menú de les dues «tortillas» | 5è | 6è | 1r d’ESO | Pendent |
| L183 · Una foto per recordar la mida | 3r | 4t | 5è | Pendent |
| L158 · Un llibre que s’ha de poder obrir | 4t | 5è | 6è | Pendent |
| L155 · Dotze cadires i dos bancs | 2n | 3r | 4t | Pendent |
| L186 · Un tauler per guanyar plegats | 3r | 4t | 5è | Pendent |

La tria es reparteix entre vuit originals de 3r, vuit de 4t, vuit de 5è i sis de 6è. S’hi combinen narracions, cartes, instruccions, entrevistes, textos informatius i una ressenya. Cap original d’aquesta tanda té univers assignat ni una família prèvia.

## Criteris editorials

Cada família manté la situació, els personatges i el desenvolupament central. La gradació s’ajusta amb extensió, sintaxi, lèxic, informació explícita, relacions i preguntes; el curs orienta el docent i no classifica l’alumnat. Les veus infantils han de sonar naturals. Es conserven les il·lustracions que continuen sent fidels a la història, amb una posició adaptada al text.

El suport de 2n té entre 40 i 80 paraules, paràgrafs curts i quatre preguntes literals d’una línia. Utilitza la plantilla de cicle inicial per defecte, respectant els maquetats personals. A la resta de cursos es redueix densitat sense convertir la narració en una llista telegràfica. Les ampliacions afegeixen relacions i preguntes proporcionades al curs. Les que superen 350 paraules disposen de dues imatges.

Cada variant i llengua té preguntes, respostes, línies, fragments exactes de suport i subratllat de vocabulari propis. Les preguntes literals s’etiqueten com a literals encara que demanin un motiu expressat directament. Les inferències han de relacionar o aplicar informació; les respostes obertes admeten alternatives raonables.

## Implementació i revisió

El pla és a data/family-expansion-2026-11-23-plan.js. L’agregador data/family-expansion-2026-11-23-adaptations.js integra les parelles completes dels mòduls numerats de la tanda. El catàleg només registra famílies que tenen A i B. Les traduccions comparteixen codi; cada grau conserva identitat i maquetat propis, també dins de col·leccions.

El registre family-expansion-2026-11-23-review.json conserva les empremtes dels seixanta originals lingüístics i de cada versió nova que supera la revisió independent. S’hi anoten edició, data, codi, llengua, resultat i revisor. Provisional vol dir revisió independent superada i validació docent pendent. Les correccions posteriors es revaliden.

Autoria i separació de la revisió: els mòduls 01–05 els redacta root i els revisa review_early_families. Els mòduls 06–10 els redacta adaptations_second_ten, i els mòduls 11–15, adaptations_third_ten; en aquests dos blocs root revisa independentment els originals i cadascuna de les variants ES/CA. Les empremtes aprovades es contrasten de nou amb els objectes públics abans de publicar cada parella.

Comprovacions locals: node tools/check-family-expansion.mjs --batch=2026-11-23 valida la part publicada; --complete exigeix les trenta famílies. Es comproven originals preservats, cursos, extensió, preguntes, cites, imatges, equivalència lingüística i revisió exacta. Les proves de navegador comproven també fitxes i solucionaris. La revisió de producció la fa l’usuari.
