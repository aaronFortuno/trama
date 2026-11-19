# Primera ampliació de famílies

Encàrrec del 19 de novembre del 2026: construir reforç i ampliació per a vint lectures existents, en català i castellà. És una proposta editorial per facilitar el treball simultani amb nivells diversos i oferir diferents vies d’accés a un material comú.

## Tria i gradació

La selecció és a `data/family-edition-plan.js`: dotze originals de 5è, cinc de 4t i tres de 6è. Inclou narració, divulgació, instruccions, entrevista, carta, diari, ressenya i notícia, amb temes científics, culturals, socials, matemàtics i esportius. No s’assignen universos només pel fet de compartir una temàtica.

Cada original conserva el codi, el text, les preguntes i els identificadors previs. L’A és la nova versió de reforç i la B la nova ampliació; l’ordre explícit és A–original–B. El prototip L208 manté la nomenclatura anterior. Les traduccions comparteixen codi i grau; no són graus addicionals.

- **Reforç:** menys extensió i densitat, frases més curtes, referents explícits i sis o set preguntes amb demandes delimitades. Es mantenen la situació i els fets centrals, sense convertir el text en un resum telegràfic.
- **Original:** punt de treball comú, conservat íntegrament.
- **Ampliació:** més context, relacions causals, matisos i nou o més preguntes; cal justificar, contrastar o distingir certeses d’hipòtesis. L’exigència s’ajusta al material i no obliga a canviar sempre de curs.

Les il·lustracions s’aprofiten quan continuen representant fidelment els textos. Cada variant té la seva posició d’imatges, les seves preguntes, les línies adequades i els fragments de resposta exactes. No s’hereten anotacions del text original. Les expressions literals preguntades com a vocabulari se subratllen a la versió corresponent.

## Autoria i validació

Els fitxers `data/family-adaptations-01.js` a `-05.js` agrupen quatre famílies cadascun. Les parelles de text s’escriuen en l’ordre castellà–català, per mantenir visibles les equivalències de cada paràgraf i pregunta. `q()` rep tipus, línies, pregunta ES, pregunta CA, resposta ES, resposta CA i fragments `[paràgraf, ES, CA]`. El constructor produeix objectes de lectura normals per a la maquetació i l’exportació.

`tools/check-family-editions.mjs` comprova identitats, ordre de demanda, traduccions, longituds, preguntes, línies, il·lustracions i referències. Les comprovacions del catàleg validen l’agrupació i els filtres; les del navegador proven la maquetació real d’alumnat i solucionari, sense alterar configuracions d’usuari. Aquestes comprovacions no substitueixen la revisió docent de dificultat.

Es publiquen només famílies amb les dues variants completes i les dues llengües. El registre filtra el pla segons les adaptacions disponibles. Les publicacions parcials consten al changelog; la revisió remota la fa l’usuari.
