# Seguiment d’ús de Trama

Des de la versió 1.43; context de cerca i famílies ampliat a la 1.48. L’objectiu és orientar les millores del projecte: quines lectures interessen i quines eines s’utilitzen. La implementació és a `analytics.js` i valida els esdeveniments abans de passar-los al tracker i abans d’enviar-los.

## Esdeveniments

| Esdeveniment | Quan es compta | Informació prevista |
| --- | --- | --- |
| Visualització de pàgina | Seguiment habitual d’Umami | Domini, títol fix `Trama` i URL fixa `/`; sense cerca, fragment ni referència d’origen |
| `obre_lectura` | En obrir una lectura, també per enllaç directe, fletxes o canvi de versió | Metadades públiques; `origen`: `cataleg`, `anterior`, `seguent`, `idioma`, `familia` o `enllac`; `colleccio` i `maquetat`: booleans |
| `aplica_filtre` | En canviar un filtre o obrir un univers des d’una lectura | `filtre`, `valor`, context del catàleg i tram de resultats; `origen`: `selector` o `lectura` |
| `neteja_filtres` | En treure un filtre o netejar la cerca i els filtres | `filtre`: camp eliminat o `tots` |
| `cerca_cataleg` | Després de 800 ms sense escriure, amb almenys dos caràcters | `tipus`: `codi` o `text`; context de filtres i `resultats` agrupats. Mai la consulta |
| `familia` | En obrir la tria visual o el comparador d’una família pública | `accio`: `obre` o `compara`; `familia`, `llengua`, `origen` i `quantitat` de variants agrupada |
| `obre_lot` | En obrir el diàleg d’impressió en lot des de la capçalera | `origen`: `capcalera`; `vista`: `cataleg` o `lectura`; `quantitat`: tram de fitxes disponibles; `colleccio`: booleà, sense nom ni identificador |
| `genera_document` | Quan s’ha preparat el document per imprimir o s’ha iniciat la descàrrega | `abast`: `individual` o `lot`; `format`: `impressio`, `pdf` o `zip`; `contingut`: `alumnat` o `solucionari`; `quantitat`: tram de lectures; `colleccio` i `maquetats`: booleans; `doble_cara`: booleà per als lots. Metadades públiques només en documents individuals |
| `canvia_vista` | En activar o desactivar el solucionari | Metadades públiques; `vista`: `alumnat` o `solucionari` |
| `personalitza_fitxa` | En modificar un bloc o utilitzar eines del preview | `bloc`, `accio` i, en alguns interruptors, `estat` booleà; cap valor de text o mida |
| `plantilla` | Després d’aplicar, desar, editar, reordenar o suprimir una plantilla | `accio`: `aplica`, `crea`, `actualitza`, `reordena` o `elimina`; `tipus`: `predefinida` o `personal` |
| `colleccio` | En iniciar una selecció o obrir, crear, ampliar, reordenar, reduir o suprimir una col·lecció | `accio`: `selecciona`, `obre`, `crea`, `afegeix`, `reordena`, `retira` o `elimina`; `quantitat` agrupada en obrir, crear o afegir |
| `copia_configuracio` | Després de preparar la còpia o recuperar-la correctament | `accio`: `exporta` o `importa` |
| `restableix_maquetat` | Després de restablir correctament el format | `abast`: `fitxa` o `tots` |
| `canvia_idioma` | En canviar l’idioma de la interfície | `llengua`: `ca` o `es`; independent de l’idioma de les lectures |
| `notifica_error` | En confirmar explícitament l’enviament d’un avís | `codi`, `llengua`, `part`, `motiu` i, si escau, `element`, tots validats contra el catàleg i els motius previstos |

Les metadades públiques són `codi` (p. ex. `L001`), `llengua` (`ca`/`es`), `nivell` (p. ex. `5-primary`) i `dificultat` (`initial`/`intermediate`/`advanced`). Es deriven del catàleg, sense copiar títols ni contingut. Les lectures personals només aporten ús genèric de funcionalitats.

Les lectures públiques amb variants afegeixen `familia`, derivat del registre editorial i mai copiat d’un camp personal. Les obertures i comparacions de famílies personals no generen l’esdeveniment `familia`.

Des de la v1.51.4, `obre_lot` permet distingir l’interès inicial en la impressió en lot de l’ús efectiu, que continua registrat amb `genera_document` i `abast: lot`. Comparar obertures, generacions i el booleà `colleccio` ajudarà a decidir si mantenir l’accés general o donar més pes a les col·leccions. Obrir el diàleg no compta com imprimir: també conté les còpies de seguretat. Preparar una impressió tampoc no confirma que l’usuari hagi acabat imprimint al diàleg del navegador.

## Context de cerques i filtres

S’envien només les opcions predefinides que estiguin seleccionades. Els valors buits o desconeguts queden descartats.

| Camp | Significat |
| --- | --- |
| `nivell` | Curs, per exemple `6-primary`; es conserva el nom històric del camp |
| `dificultat` | `initial`, `intermediate` o `advanced` dins del curs |
| `llengua` | Llengua de les lectures, independent de la interfície |
| `extensio`, `tema`, `tipus_text` | Opcions del vocabulari públic de cada filtre |
| `univers` | Identificador públic seleccionat o `no-universe` |
| `variants` | Si el checkbox «Només lectures amb variants» està activat |
| `abast` | `cataleg`, `colleccio` o `seleccio`, sense cap nom ni identificador personal |
| `resultats` | Tram del recompte actual; es pot detectar `0` sense saber què s’ha escrit |

`filtre: level` identifica el selector de curs i `filtre: difficulty` el de dificultat. Els altres filtres són `language`, `length`, `theme`, `genre`, `universe` i `family`. Es mantenen aquests identificadors per comparar amb l’històric. El context permet, per exemple, desglossar les seleccions d’extensió llarga segons curs i dificultat, o les cerques sense resultats dins d’un univers.

El filtre `universe` segueix la mateixa llista permesa: només s’envien identificadors del registre públic de Trama o `no-universe`. Les etiquetes d’universos d’una lectura personal no s’envien si no són al registre públic.

El checkbox de famílies envia `aplica_filtre` amb `filtre: family` i `valor: with-variants` en activar-lo i `neteja_filtres` en desactivar-lo. No s’envien noms ni identificadors de famílies personals. El canvi de grau d’exigència al visor es distingeix amb l’origen `familia`; triar una variant des de la pila del catàleg conserva l’origen `cataleg`. Els resultats de cerca es compten per propostes (una per família) durant la descoberta i per fitxes concretes en seleccionar o consultar una col·lecció.

L’esdeveniment `familia` separa l’obertura de la tria (`accio: obre`, origen `cataleg`, `anterior` o `seguent`) de la comparació (`accio: compara`, origen `visor`). L’identificador i la quantitat de variants es comproven contra el catàleg públic. Un clic no compta totes les variants com a lectures obertes: aquestes continuen generant `obre_lectura` només quan s’obren realment.

Els recomptes agrupats són `0`, `1`, `2-5`, `6-15`, `16-50` i `51+`. En crear o ampliar una col·lecció, `quantitat` és el tram de lectures triades per aquella operació; en obrir-la, el del total de lectures que conté.

Els blocs de personalització són `text`, `marges`, `resposta`, `encapcalament`, `peu`, `imatges`, `codi_aula`, `vocabulari`, `pistes` i `preguntes`. Les accions són `ajusta`, `amaga`, `recupera`, `linies` i `consulta` (consulta d’una pista al text des de la resposta). Es compta com a màxim una vegada cada combinació de bloc, acció i estat mentre aquella lectura està oberta. Els botons de mostrar imatges, vocabulari, pistes o codi d’aula poden indicar `estat: true/false`. No es registra quina pregunta s’ha amagat ni quantes línies s’han assignat.

## Lectura útil de les estadístiques

- **Interès pel catàleg:** `obre_lectura`, desglossat per codi, llengua, curs i dificultat. Una obertura no acredita que s’hagi llegit o utilitzat tot el material.
- **Necessitats de cerca:** `aplica_filtre`, desglossat per `filtre` i `valor`, i `cerca_cataleg` amb els seus contextos de curs, dificultat, llengua i resultats. No permeten saber les paraules buscades. Les combinacions més repetides i les que arriben a zero resultats ajuden a prioritzar revisions i ampliacions.
- **Universos i gradació:** ús del filtre `universe` i de la drecera des d’una fitxa; checkbox `family`, obertures de famílies i comparacions. Les obertures de lectures concretes permeten veure quins cursos i variants es consulten després.
- **Material preparat per a l’aula:** `genera_document`, separat entre alumnat/solucionari, individual/lot i impressió/PDF/ZIP. Es compta un esdeveniment per lot, no per lectura o pàgina. El tram de quantitat dona una idea del volum, sense un total exacte.
- **Valor del configurador:** ús dels diferents blocs de `personalitza_fitxa`, plantilles i pistes. Els recomptes expressen ús del bloc, no el nombre exacte d’edicions.
- **Reutilització:** obertures de col·leccions, lectures amb maquetat desat, aplicació de plantilles personals i còpies de configuració. No s’identifiquen col·leccions ni persones entre sessions o ordinadors des del codi de Trama.

Un esdeveniment d’impressió indica que s’ha preparat el material i s’ha demanat imprimir; no es pot saber si l’usuari acaba imprimint o cancel·la el diàleg. Una descàrrega indica que el navegador ha rebut l’ordre, sense confirmar que l’arxiu s’hagi conservat.

El seguiment compta interaccions, no persones ni alumnes. Els bloquejadors, les preferències de privadesa i els errors de connexió fan que les xifres siguin parcials. No hi ha gravació de sessions, seguiment de moviments del ratolí, temps de lectura individual ni intents d’eludir bloquejos.

Els camps nous comencen a recollir-se amb la versió 1.48; no es reconstrueix context per a esdeveniments històrics.

## Límits de privadesa

No s’envien textos de cerca, noms de col·leccions o plantilles, identificadors de col·lecció, codis d’aula, capçaleres personalitzades, noms de fitxer, logotips, continguts importats, respostes ni configuracions completes. La URL que rep Umami és sempre `/`, sense paràmetres, fragment, enllaç de fitxa o referrer.

Trama no afegeix cookies ni identificadors d’analítica al seu emmagatzematge local. La petita cua d’inici viu només en memòria i es descarta si el tracker no es carrega; serveix per comptar l’obertura inicial d’un enllaç directe. No es recuperen accions d’una sessió anterior ni es reenvien les fetes amb el seguiment desactivat. No s’envia res des del servidor local, amb Do Not Track, Global Privacy Control o `umami.disabled` actius. Un error del tracker no bloqueja les eines de Trama.

Els avisos d’error conserven el seu enviament explícit amb comprovació de resposta del servidor; les accions d’ús són opcionals i no interfereixen si Umami falla.

Des de v1.56, un avís sobre pregunta o solucionari pot indicar `format_pregunta: oberta/abcd`, perquè es pugui localitzar l’alternativa afectada. Només s’accepta ABCD si aquella pregunta pública disposa d’alternativa. El formulari mostra el format abans de confirmar l’enviament. No s’envien opcions, respostes d’alumnes ni configuracions.

## Comprovació local

- `node tools/check-analytics.mjs`: vocabulari autoritzat, eliminació de camps privats, metadades públiques, restriccions de privadesa, cua inicial i avisos.
- `node tools/check-analytics-browser.cjs`: fluxos reals de cerca, maquetació, solucionaris, PDF, lots, plantilles, col·leccions i còpies, amb un tracker simulat i totes les peticions servides en local. No envia esdeveniments a Umami real. Requereix Chrome i Playwright al runtime local indicat al fitxer.
