# Base d’ortogra.fi

## Galeria i preferències

- Mantén l’amplada mínima del pilot de Trama, `--of-card-min: 224px`, com a mida comuna de les targetes de catàleg. En pantalles més estretes la targeta pot ocupar tota l’amplada disponible. El contingut de cada projecte determina l’alçada.
- Desa el tema i l’idioma de la interfície per projecte. Recupera una tria desada vàlida abans de deduir cap valor inicial. A la primera visita, desa el tema clar o fosc del sistema i el primer idioma del navegador que l’eina admeti. Fes servir el català si no hi ha cap coincidència.
- Mantén el valor desat fins que l’usuari el canviï manualment. L’idioma dels materials es gestiona per separat. Quan migres una aplicació a la base, conserva les claus de preferències que ja fa servir.

## Maquetació i impressió

- Col·loca el format del full al lateral esquerre del maquetador amb l’amplada del filtre del catàleg. La vista prèvia ocupa el centre i els controls específics tenen espai propi.
- Fes servir `printFields` per mantenir l’ordre de la tipografia, el cos de lletra, l’interlineat i l’espaiat. A sota, agrupa els marges en l’ordre superior, dret, inferior i esquerre.
- Mantén el format i les claus dels ajustos desats. En afegir un control, aplica als maquetats antics el valor que ja feia servir el projecte. La vista prèvia i el document imprès comparteixen els valors de cada fitxa.

## Preparació de versions

- Classifica l’impacte abans de triar el número. **Pedaç** per a correccions compatibles, ajustos visuals acotats o tandes ordinàries de materials. **Menor** per a una funció compatible nova o un canvi rellevant del flux d’ús. **Major** per a una incompatibilitat amb el contracte públic i per declarar la primera versió estable `1.0.0`. Documenta el motiu i la migració pertinent. En una sèrie `0.x` encara inestable, registra la incompatibilitat i puja la menor si encara s’està definint el contracte.
- Parteix de l’última versió publicada del component o de l’eina. Cada número té tres enters independents. Un canvi menor després de `1.9` és `1.10.0`. Un pedaç després de `1.9.9` és `1.9.10`. Les dues xifres històriques compten com si tinguessin un pedaç zero a l’hora de calcular la següent versió.
- Agrupa el treball a **Pendent de publicar** i aplica l’increment de més impacte del lot. En preparar una publicació, deixa constància en una frase del tipus de canvi i del motiu. Les dates del changelog són dates de publicació. Les versions de la base, de cada eina i dels seus formats tenen cicles independents.
- A la base, sincronitza `package.json`, `release.json`, `CHANGELOG.md` i l’etiqueta `vMAJOR.MENOR.PEDAÇ`. `node --test release-version.test.mjs` comprova les regles i `node sync.mjs` i `node preview.mjs` validen l’increment registrat abans de preparar els fitxers. A les eines, sincronitza el número visible i l’historial amb la publicació corresponent.
- Les entrades noves de l’historial s’ordenen per data descendent. Agrupa-les en **Compatibilitat**, **Novetats**, **Millores**, **Correccions** i **Materials**, amb només les categories que tenen contingut. Conserva les notes històriques i enllaça sempre al `CHANGELOG.md` complet.
