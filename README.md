# Trama

Catàleg de comprensions lectores imprimibles d’ortogra.fi. La primera col·lecció inclou quatre fitxes en castellà per a 5è de primària. La interfície és en català i les fitxes s’imprimeixen amb els rètols en l’idioma de la lectura quan hi ha una traducció disponible.

A la previsualització, mantén premut Ctrl i gira la roda del ratolí per fer zoom, o fes servir els botons del visor. El zoom de pantalla conserva les mides de la fitxa impresa.

## En local i a GitHub Pages

Des d’aquesta carpeta, executa `node tools/serve.cjs` i obre `http://127.0.0.1:4191/`. El web fa servir HTML, CSS i mòduls JavaScript, amb il·lustracions locals.

GitHub Pages serveix l’arrel de `main`. El fitxer `.nojekyll` permet servir directament els fitxers estàtics. `CNAME` associa el web a `trama.ortogra.fi`. A Nordweb, el registre `trama` és un CNAME que apunta a `aaronfortuno.github.io.`. Totes les rutes internes són relatives.

## Ampliar el catàleg

Les entrades es troben a `data/readings.js`. Els filtres es deriven de les dades i el catàleg mostra les fitxes per tandes. Si creix, es poden separar les col·leccions en mòduls per curs o llengua i reunir-les al mateix export.

- Assigna un `id` únic i estable a cada versió. Comparteix el `workId` entre les traduccions d’una mateixa lectura perquè aparegui el selector d’idioma.
- Fes servir `language` amb una etiqueta BCP 47 i `level` amb un identificador de curs. `catalog.js` recull els noms habituals dels filtres. `worksheet.js` conté els rètols impresos en català, castellà i anglès. Les llengües sense rètols propis fan servir els anglesos.
- Introdueix el text a `paragraphs`, un element per paràgraf. L’extensió es calcula pel recompte de paraules.
- Desa les imatges a `assets/readings/` i indica el camí relatiu, les dimensions originals i el text alternatiu. `afterParagraph` indica quants paràgrafs s’han de mostrar abans de la imatge. El valor `0` la posa abans del primer.
- Dona a cada pregunta un identificador estable, el tipus, l’enunciat, el nombre de línies suggerides i, opcionalment, una resposta orientativa.

## Codis i privadesa

Els codis `TR1` contenen l’identificador de la lectura i els canvis respecte dels ajustos per defecte. Es poden recuperar des del botó del catàleg o obrir amb un enllaç que els porta al fragment `#fitxa=`. El codi inclou qualsevol text personalitzat de l’encapçalament. Conserva els identificadors de les lectures, preguntes i imatges perquè les fitxes guardades es puguin continuar recuperant.

Trama funciona al navegador. Els recursos se serveixen des del mateix web. El projecte no incorpora comptes, cookies, analítica ni emmagatzematge d’ajustos al navegador.
