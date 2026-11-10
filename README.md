# Trama

Catàleg de comprensions lectores imprimibles d’ortogra.fi. La primera col·lecció inclou quatre fitxes en castellà per a 5è de primària. La interfície és en català i les fitxes s’imprimeixen amb els rètols en l’idioma de la lectura quan hi ha una traducció disponible.

A la previsualització, mantén premut Ctrl i gira la roda del ratolí per fer zoom, o fes servir els botons del visor. El zoom de pantalla conserva les mides de la fitxa impresa.

Des de **Plantilles** als ajustos de la fitxa pots crear formats a partir dels ajustos actuals i aplicar-los a qualsevol lectura. Cada plantilla pot incloure text i tipografia, marges, espai de resposta, encapçalament i peu o visibilitat de les il·lustracions. Aplica una plantilla, ajusta la fitxa i marca l’opció d’actualitzar els valors per incorporar-hi els canvis.

## En local i a GitHub Pages

Des d’aquesta carpeta, executa `node tools/serve.cjs` i obre `http://127.0.0.1:4191/`. El web fa servir HTML, CSS i mòduls JavaScript, amb il·lustracions locals.

GitHub Pages serveix l’arrel de `main`. El fitxer `.nojekyll` permet servir directament els fitxers estàtics. `CNAME` associa el web a `trama.ortogra.fi`. A Nordweb, el registre `trama` és un CNAME que apunta a `aaronfortuno.github.io.`. Totes les rutes internes són relatives.

## Ampliar el catàleg

Les entrades es troben a `data/readings.js`. Els filtres es deriven de les dades i el catàleg mostra les fitxes per tandes. Si creix, es poden separar les col·leccions en mòduls per curs o llengua i reunir-les al mateix export.

- Assigna un `id` únic i estable a cada versió. Comparteix el `workId` i el `code` (per exemple, `L001`) entre les traduccions d’una mateixa lectura.
- Fes servir `language` amb una etiqueta BCP 47 i `level` amb un identificador de curs. `catalog.js` recull els noms habituals dels filtres. `worksheet.js` conté els rètols impresos en català, castellà i anglès. Les llengües sense rètols propis fan servir els anglesos.
- Introdueix el text a `paragraphs`, un element per paràgraf. L’extensió es calcula pel recompte de paraules.
- Desa les imatges a `assets/readings/` i indica el camí relatiu, les dimensions originals i el text alternatiu. `afterParagraph` indica quants paràgrafs s’han de mostrar abans de la imatge. El valor `0` la posa abans del primer.
- Dona a cada pregunta un identificador estable, el tipus, l’enunciat, el nombre de línies suggerides i, opcionalment, una resposta orientativa.

## Codis i privadesa

Un codi com `L001-ES` identifica la lectura i l’idioma. `L001-ES-X1.3` recupera la mateixa lectura amb les preguntes 1 i 3 omeses. L’enllaç compartit també recupera el format i els ajustos individuals, inclòs el text personalitzat de l’encapçalament.

Escriu o enganxa el codi al catàleg, o obre un enllaç compartit amb `#fitxa=`. Es poden recuperar igualment els codis anteriors. Conserva els codis i els identificadors de les lectures, preguntes i imatges quan ampliïs el catàleg.

Trama funciona al navegador. Els recursos se serveixen des del mateix web. El projecte no incorpora comptes, cookies ni analítica. Les plantilles i la preferència de tema es desen al navegador.
