# Trama

Catàleg de comprensions lectores imprimibles d’ortogra.fi. La primera col·lecció inclou vuit fitxes en castellà per a 5è de primària. La interfície es pot fer servir en català i castellà. Les fitxes mostren els rètols en l’idioma de la lectura quan hi ha una traducció disponible.

A la previsualització, mantén premut Ctrl i gira la roda del ratolí per fer zoom, o fes servir els botons del visor. El zoom de pantalla conserva les mides de la fitxa impresa.

El commutador **Solucionari** mostra la resposta orientativa sota cada pregunta inclosa. **Imprimeix** obre la fitxa d’alumnat. La fletxa del costat ofereix la descàrrega directa en PDF i la impressió o descàrrega del solucionari. La descàrrega directa desa cada pàgina com una imatge d’alta resolució dins del PDF. Des del diàleg d’impressió del navegador es pot desar un PDF amb text seleccionable.

Des de **Plantilles** pots aplicar la plantilla Clàssica (Georgia, 12 pt, interlineat 1×) o una plantilla desada. Les miniatures mostren la cantonada superior del full amb els ajustos de cada plantilla. A **Gestiona les plantilles** pots crear, editar i reordenar les teves plantilles. Cada plantilla pot incloure text i tipografia, marges, espai de resposta, encapçalament i peu o visibilitat de les il·lustracions. Aplica una plantilla, ajusta la fitxa i marca l’opció d’actualitzar els valors per incorporar-hi els canvis.

**Text i tipografia** inclou un ajust per a l’espai abans de les preguntes, amb 8 mm per defecte quan el text i les preguntes comparteixen pàgina. L’encapçalament inclou el logotip de Trama per defecte. A **Encapçalament** i **Peu de pàgina** pots triar la marca de Trama, treure-la o carregar un logotip en PNG, JPEG o WebP. L’alçada màxima és de 8 mm a l’encapçalament i 6 mm al peu. Si deses una plantilla amb aquests blocs, també hi deses els logotips.

## Importar i exportar lectures

Obre **Importa o exporta** al catàleg per consultar l’exemple, descarregar una plantilla, importar un fitxer `.json` o exportar una lectura. Al menú de tres punts del visor també pots descarregar la lectura oberta o suprimir-la si l’has importada. El JSON conté la lectura, les preguntes amb les respostes orientatives i les il·lustracions. El format de la fitxa i els logotips es gestionen amb les plantilles.

Els camps obligatoris són `title`, `language` i `paragraphs`. Les preguntes són opcionals i cadascuna necessita un `prompt`.

```json
{
  "title": "El riu després de la pluja",
  "language": "ca",
  "paragraphs": [
    "L’endemà de la pluja, l’Aina va trobar branques al camí del riu."
  ],
  "questions": [
    {
      "type": "literal",
      "prompt": "Què va trobar l’Aina?",
      "answer": "Va trobar branques al camí.",
      "lines": 2
    }
  ]
}
```

Pots afegir `level`, `difficulty`, `genre`, `themes`, `summary`, `code` i `images`. Si cal, Trama assigna un codi com `P001`. Les imatges dels fitxers JSON descarregats estan incorporades al fitxer com a dades PNG, JPEG o WebP. El límit d’importació és de 2 MB per fitxer, subjecte a l’espai disponible al navegador.

## En local i a GitHub Pages

Des d’aquesta carpeta, executa `node tools/serve.cjs` i obre `http://127.0.0.1:4191/`. El web fa servir HTML, CSS i mòduls JavaScript, amb il·lustracions locals.

GitHub Pages serveix l’arrel de `main`. El fitxer `.nojekyll` permet servir directament els fitxers estàtics. `CNAME` associa el web a `trama.ortogra.fi`. A Nordweb, el registre `trama` és un CNAME que apunta a `aaronfortuno.github.io.`. Totes les rutes internes són relatives.

## Ampliar el catàleg

El catàleg s’exporta des de `data/readings.js` com una llista d’objectes JavaScript. La sèrie L005–L008 és a `data/readings-5-es.js`. Els filtres es deriven de les dades i el catàleg mostra les fitxes per tandes.

- Assigna un `id` únic i estable a cada versió. Comparteix el `workId` i el `code` (per exemple, `L001`) entre les traduccions d’una mateixa lectura.
- Fes servir `language` amb una etiqueta BCP 47 i `level` amb un identificador de curs. `catalog.js` recull els noms habituals dels filtres. `worksheet.js` conté els rètols impresos en català, castellà i anglès. Les llengües sense rètols propis fan servir els anglesos.
- Introdueix el text a `paragraphs`, un element per paràgraf. L’extensió es calcula pel recompte de paraules.
- Desa les imatges a `assets/readings/` i indica el camí relatiu, les dimensions originals i el text alternatiu. `afterParagraph` indica quants paràgrafs s’han de mostrar abans de la imatge. El valor `0` la posa abans del primer.
- Dona a cada pregunta un identificador estable, el tipus, l’enunciat i, opcionalment, una resposta orientativa. `lines` és el nombre de línies de resposta suggerides, de 0 a 8, tant al catàleg com al JSON d’intercanvi. Fes servir 1 línia per a una dada breu, 2 o 3 per a una explicació curta i 4 o 5 per a una resposta amb diversos punts o un resum. El visor aplica aquesta xifra amb **Segons la pregunta** i permet canviar-la per a cada pregunta.

Fonts de verificació de la sèrie L005–L008. [Aqüeducte de Segòvia, portal oficial de turisme](https://www.spain.info/es/lugares-interes/acueducto-segovia/) · [Balena geperuda, NOAA Fisheries](https://www.fisheries.noaa.gov/species/humpback-whale)

## Cerca i privadesa

Escriu un codi de lectura com `L001` al cercador del catàleg i, si cal, acota la cerca amb el filtre de llengua. Els enllaços de fitxa compartits en versions anteriors continuen obrint la lectura amb els seus ajustos. Conserva els codis i els identificadors de les lectures, preguntes i imatges quan ampliïs el catàleg.

Trama funciona al navegador. Els recursos se serveixen des del mateix web. El projecte no incorpora comptes, cookies ni analítica. Les lectures importades, les plantilles i les preferències de tema i idioma es desen al navegador.

## Llicència i crèdits

El codi de Trama es distribueix sota la [llicència MIT](LICENSE). Algunes icones de la interfície són de [Lucide](https://lucide.dev/) i es distribueixen amb els seus [avisos de llicència](assets/icons/LICENSE). La descàrrega de PDF fa servir [pdf-lib](https://pdf-lib.js.org/), amb la seva [llicència MIT](assets/vendor/pdf-lib.LICENSE.md). La fotografia de l’autor i el QR del V4V provenen de [Plec](https://github.com/aaronFortuno/plec-dictats).

Les tipografies incloses al web tenen els seus [crèdits i llicències](assets/fonts/README.md).
