# Idiomes de la interfície

Des de v1.64, la interfície està disponible en català (`ca`), castellà (`es`), gallec (`gl`) i èuscar (`eu`). El selector de la capçalera mostra els noms propis de cada llengua: Català, Español, Galego i Euskara. Les lectures continuen disponibles en català i castellà; afegir una interfície no crea traduccions del catàleg.

## Preferències i contingut

- `trama.language` recorda la llengua de la interfície entre recàrregues. El valor inicial continua sent català.
- `trama.catalog-language` recorda la tria explícita de llengua de lectura. Aquesta preferència té prioritat encara que canviï la interfície.
- Sense tria explícita, el catàleg utilitza la llengua de la interfície si hi ha lectures disponibles. Per al gallec i l’èuscar, utilitza castellà.
- Els títols, textos, preguntes, il·lustracions i respostes conserven la llengua de l’edició oberta. Els rètols del full i del solucionari també segueixen aquesta llengua, tant al visor com en imprimir, descarregar PDF o preparar lots.
- Els noms de col·leccions i plantilles personals, els codis d’aula i les capçaleres personalitzades són dades de l’usuari: no es tradueixen. Canviar de llengua no altera els maquetats ni la preferència de preguntes obertes/ABCD.

La guia inicial de formats de pregunta continua mostrant captures reals en català o castellà. Amb la interfície en gallec o èuscar es fan servir les captures castellanes i les explicacions traduïdes; no s’intenta carregar cap imatge inexistent en `gl` o `eu`.

## Abast de les traduccions

Els diccionaris de `locales/gl.js` i `locales/eu.js` cobreixen els controls, filtres, plantilles, col·leccions, configurador, ajuda, privadesa, avisos d’error i textos de presentació dels universos. Les marques, els noms de fonts, els codis i les adreces es conserven. Els termes dels filtres són també cercables en les llengües de la interfície.

No es tradueix retrospectivament tot l’historial de canvis. El diàleg ho indica i identifica les notes antigues amb `lang="ca"`; català i castellà mantenen l’historial existent. Les notes de v1.64 estan disponibles en les quatre llengües. En publicar versions futures cal afegir les notes actives als quatre diccionaris. `bindTranslations` només tracta una nota com a traduïda si hi consta el paràgraf complet.

La terminologia gallega utilitza «coleccións», «modelos», «maquetación» i «interliñado». L’èuscar utilitza «bildumak», «txantiloiak», «maketazioa», «lerroartea» i «erantzun-gida». Els cursos es presenten com a `LHko … maila` i `DBHko … maila`. El DUA s’explica com a *Ikaskuntzarako Diseinu Unibertsala (IDU)*, mantenint el mateix concepte educatiu.

Com a referències terminològiques s’han consultat les [normes d’estil de la Xunta](https://wikidog.xunta.gal/index.php/Normas_xerais_de_todos_os_textos), el [manual de comunicació electrònica d’Euskadi](https://www.euskadi.eus/contenidos/informacion/euskalduntze_argit/eu_def/adjuntos/komunikazio_elektronikoa.pdf) i la [presentació de l’IDU a Irakasbil](https://www.ikasten.ikasbil.eus/mod/habecms/view.php/irakasbil/didakteka/ikaskuntzarako_diseinu_unibertsala). Les traduccions es poden polir amb el retorn de parlants i docents; no s’ha fet una validació externa per parlants nadius.

## Manteniment i comprovació

Els diccionaris fan servir com a clau el text català original i preserven els paràmetres com ara `{count}` o `{name}`. Per afegir un idioma, cal registrar-lo a `i18n.js`, afegir l’opció accessible del selector i traduir els textos actius. Els idiomes de contingut es registren per separat: no s’han d’ampliar artificialment ni les facetes de lectura ni els camps d’analítica de les fitxes.

`canvia_idioma` accepta `ca`, `es`, `gl` i `eu`; només registra la tria del menú. Els esdeveniments de lectura i de preparació de documents continuen acceptant exclusivament els idiomes reals del catàleg. No s’hi afegeixen dades personals.

Comprovacions locals:

- `node tools/check-interface-locales.mjs`: cobertura dels textos actius i de les facetes, paràmetres, codificació, cerques traduïdes, llengües independents i llista permesa d’analítica.
- `node tools/check-interface-locales-browser.cjs`: catàleg i visor en gallec i èuscar, canvis entre quatre idiomes, persistència de preferències i maquetats, noms personals de plantilles i col·leccions, captures de la guia inicial, impressió en la llengua del text, historial i ajuda en mòbil. Utilitza Chrome i el Playwright del runtime local. Totes les peticions són locals i no envia analítica real.

Les captures de comprovació es desen a `imports/qa/`, que no es publica. La validació remota queda a càrrec de l’usuari.
