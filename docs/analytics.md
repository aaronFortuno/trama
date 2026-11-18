# Seguiment d’ús de Trama

Des de la versió 1.43. L’objectiu és orientar les millores del projecte: quines lectures interessen i quines eines s’utilitzen. La implementació és a `analytics.js` i valida els esdeveniments abans de passar-los al tracker i abans d’enviar-los.

## Esdeveniments

| Esdeveniment | Quan es compta | Informació prevista |
| --- | --- | --- |
| Visualització de pàgina | Seguiment habitual d’Umami | Domini, títol fix `Trama` i URL fixa `/`; sense cerca, fragment ni referència d’origen |
| `obre_lectura` | En obrir una lectura, també per enllaç directe, fletxes o canvi de versió | Metadades públiques; `origen`: `cataleg`, `anterior`, `seguent`, `idioma` o `enllac`; `colleccio` i `maquetat`: booleans |
| `aplica_filtre` | En canviar manualment un filtre | `filtre` i `valor` del vocabulari públic; `nivell` per al filtre d’extensió si hi ha curs seleccionat |
| `neteja_filtres` | En treure un filtre o netejar la cerca i els filtres | `filtre`: camp eliminat o `tots` |
| `cerca_cataleg` | Després de 800 ms sense escriure, amb almenys dos caràcters | `tipus`: `codi` o `text`; `resultats`: tram del nombre de resultats. Mai la consulta |
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

Els recomptes agrupats són `0`, `1`, `2-5`, `6-15`, `16-50` i `51+`. En crear o ampliar una col·lecció, `quantitat` és el tram de lectures triades per aquella operació; en obrir-la, el del total de lectures que conté.

Els blocs de personalització són `text`, `marges`, `resposta`, `encapcalament`, `peu`, `imatges`, `codi_aula`, `vocabulari`, `pistes` i `preguntes`. Les accions són `ajusta`, `amaga`, `recupera`, `linies` i `consulta` (consulta d’una pista al text des de la resposta). Es compta com a màxim una vegada cada combinació de bloc, acció i estat mentre aquella lectura està oberta. Els botons de mostrar imatges, vocabulari, pistes o codi d’aula poden indicar `estat: true/false`. No es registra quina pregunta s’ha amagat ni quantes línies s’han assignat.

## Lectura útil de les estadístiques

- **Interès pel catàleg:** `obre_lectura`, desglossat per codi, llengua, curs i dificultat. Una obertura no acredita que s’hagi llegit o utilitzat tot el material.
- **Necessitats de cerca:** `aplica_filtre` i les cerques sense resultats. No permeten saber les paraules buscades.
- **Material preparat per a l’aula:** `genera_document`, separat entre alumnat/solucionari, individual/lot i impressió/PDF/ZIP. Es compta un esdeveniment per lot, no per lectura o pàgina. El tram de quantitat dona una idea del volum, sense un total exacte.
- **Valor del configurador:** ús dels diferents blocs de `personalitza_fitxa`, plantilles i pistes. Els recomptes expressen ús del bloc, no el nombre exacte d’edicions.
- **Reutilització:** obertures de col·leccions, lectures amb maquetat desat, aplicació de plantilles personals i còpies de configuració. No s’identifiquen col·leccions ni persones entre sessions o ordinadors des del codi de Trama.

Un esdeveniment d’impressió indica que s’ha preparat el material i s’ha demanat imprimir; no es pot saber si l’usuari acaba imprimint o cancel·la el diàleg. Una descàrrega indica que el navegador ha rebut l’ordre, sense confirmar que l’arxiu s’hagi conservat.

El seguiment compta interaccions, no persones ni alumnes. Els bloquejadors, les preferències de privadesa i els errors de connexió fan que les xifres siguin parcials. No hi ha gravació de sessions, seguiment de moviments del ratolí, temps de lectura individual ni intents d’eludir bloquejos.

## Límits de privadesa

No s’envien textos de cerca, noms de col·leccions o plantilles, identificadors de col·lecció, codis d’aula, capçaleres personalitzades, noms de fitxer, logotips, continguts importats, respostes ni configuracions completes. La URL que rep Umami és sempre `/`, sense paràmetres, fragment, enllaç de fitxa o referrer.

Trama no afegeix cookies ni identificadors d’analítica al seu emmagatzematge local. La petita cua d’inici viu només en memòria i es descarta si el tracker no es carrega; serveix per comptar l’obertura inicial d’un enllaç directe. No es recuperen accions d’una sessió anterior ni es reenvien les fetes amb el seguiment desactivat. No s’envia res des del servidor local, amb Do Not Track, Global Privacy Control o `umami.disabled` actius. Un error del tracker no bloqueja les eines de Trama.

Els avisos d’error conserven el seu enviament explícit amb comprovació de resposta del servidor; les accions d’ús són opcionals i no interfereixen si Umami falla.

## Comprovació local

- `node tools/check-analytics.mjs`: vocabulari autoritzat, eliminació de camps privats, metadades públiques, restriccions de privadesa, cua inicial i avisos.
- `node tools/check-analytics-browser.cjs`: fluxos reals de cerca, maquetació, solucionaris, PDF, lots, plantilles, col·leccions i còpies, amb un tracker simulat i totes les peticions servides en local. No envia esdeveniments a Umami real. Requereix Chrome i Playwright al runtime local indicat al fitxer.
