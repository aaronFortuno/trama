# Quarta ampliació de famílies DUA

Encàrrec del 23 de novembre del 2026: completar vint famílies més a partir de lectures sense variants ni univers assignat. Cada original conserva el codi i incorpora suport A i ampliació B, en català i castellà: quaranta variants i vuitanta versions lingüístiques noves. Es publiquen per parelles després de la revisió independent i les comprovacions locals.

## Lectures i cursos orientatius

| Família | Suport A | Original conservat | Ampliació B | Estat |
| --- | --- | --- | --- | --- |
| L105 · El rastre de plata | 2n | 3r | 4t | Provisional, revisió independent superada ES/CA |
| L021 · L’abric del penjador | 3r | 4t | 5è | Provisional, revisió independent superada ES/CA |
| L041 · La volta per l’ombra | 4t | 5è | 6è | Provisional, revisió independent superada ES/CA |
| L083 · Quan el riu deixa una illa | 5è | 6è | 1r d’ESO | Provisional, revisió independent superada ES/CA |
| L110 · Una roda fluixa | 2n | 3r | 4t | Pendent |
| L032 · El pati d’abans | 3r | 4t | 5è | Pendent |
| L045 · Un mapa per arribar-hi sense preguntar | 4t | 5è | 6è | Pendent |
| L084 · Una recepta amb dues dates | 5è | 6è | 1r d’ESO | Pendent |
| L112 · El joc de les fitxes | 2n | 3r | 4t | Pendent |
| L037 · Una resposta per al canal | 3r | 4t | 5è | Pendent |
| L052 · Un matí darrere de la pantalla | 4t | 5è | 6è | Pendent |
| L092 · Dues fitxes i una regla | 5è | 6è | 1r d’ESO | Pendent |
| L141 · El cartell de la font | 2n | 3r | 4t | Pendent |
| L174 · El tren que no sortia del mapa | 3r | 4t | 5è | Pendent |
| L060 · Una proposta per al tauler | 4t | 5è | 6è | Pendent |
| L093 · El costat de l’onada | 5è | 6è | 1r d’ESO | Pendent |
| L148 · Lletres del revés | 2n | 3r | 4t | Pendent |
| L187 · El dibuix que va viatjar en autobús | 3r | 4t | 5è | Pendent |
| L159 · El torn del robot | 4t | 5è | 6è | Pendent |
| L207 · Una entrevista que va començar pel final | 5è | 6è | 1r d’ESO | Pendent |

Hi ha cinc originals de cadascun dels cursos de 3r a 6è, amb narracions, entrevistes, instruccions, cartes, notícies i textos informatius. El curs orienta l’adaptació; el docent decideix la versió adequada.

## Criteris de gradació

Les variants comparteixen situació, personatges, desenvolupament i il·lustracions coherents amb l’original. Canvien extensió, sintaxi, vocabulari, explicitació de pistes i preguntes. El suport de 2n té entre 40 i 80 paraules, paràgrafs de fins a 30 paraules i quatre preguntes literals d’una línia. Les ampliacions de 1r d’ESO tenen entorn de 500 paraules, dues imatges i 11–12 preguntes. Les versions amb una única il·lustració es mantenen fins a 350 paraules en totes dues llengües.

Les preguntes, respostes, línies, subratllats de vocabulari i fragments de resposta són propis de cada variant i idioma. Les preguntes literals demanen dades explícites; les inferències relacionen o apliquen dades del text. Les preguntes obertes admeten alternatives raonables. Es revisen veus, naturalitat, plausibilitat, coneixement dels personatges, cronologia, càlculs i ancoratges exactes.

## Implementació i revisió

El pla i l’agregador són a data/family-expansion-2026-11-23b-plan.js i data/family-expansion-2026-11-23b-adaptations.js; només es registren famílies completes. Els mòduls numerats 01–05 els redacta adaptations_second_ten; els mòduls 06–10, adaptations_third_ten. Root revisa independentment cada variant ES/CA dels mòduls 01–05; review_early_families revisa les dels mòduls 06–10. Root coordina les correccions, la seva revalidació independent i la comprovació dels informes i empremtes abans de publicar.

El registre docs/family-expansion-2026-11-23b-review.json conserva les empremtes de les quaranta versions originals i les noves versions aprovades, amb codi, edició, data, revisor i resultat. Provisional vol dir revisió independent superada i validació docent pendent. Les empremtes aprovades es contrasten amb les dades públiques abans de publicar-les.

Comprovacions: node tools/check-family-expansion.mjs --batch=2026-11-23b comprova la part incorporada; --complete exigeix les vint famílies. Es comproven també fitxes i solucionaris al navegador local. La comprovació de producció la fa l’usuari. Els codis, originals, col·leccions i maquetats existents es preserven.
