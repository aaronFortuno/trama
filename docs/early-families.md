# Famílies de 2n–3r–4t de primària

Tandes seqüencials, iniciades el 20 de novembre del 2026. Punt de partida: lectures existents de 3r. Cada família conserva l’original i afegeix una lectura de suport de 2n (A) i una ampliació de 4t (B), totes en català i castellà. Es publica cada família després de completar i revisar els seus dos graus nous en tots dos idiomes.

## Criteris per al suport de 2n

- Unes 40–80 paraules, prioritzant 50–75, repartides en paràgrafs breus. Frases curtes, poca subordinació i vocabulari quotidià.
- Poques dades, accions pròximes i referents clars. La informació necessària apareix explícita; la dificultat no prové de retenir una llista ni d’endevinar una intenció.
- Quatre preguntes literals amb respostes d’una paraula o d’un grup breu. Una línia per defecte. No es demanen grans inferències, hipòtesis ni justificacions abstractes.
- L’original de 3r no es modifica. L’ampliació de 4t desenvolupa la mateixa situació i afegeix relacions senzilles i set preguntes o més, sense canviar l’argument central.
- Cada llengua i grau té preguntes, respostes i cites pròpies. La il·lustració es comparteix quan continua sent fidel a tots els graus.

El format inicial de 2n és de 16 pt i interlineat 1,15× (valor intern 2,3), una mica més ample que el de 3r. Es mantenen els formats personals i els maquetats locals. Els intervals d’extensió de 2n són curtes fins a 55 paraules, mitjanes de 56 a 75 i llargues a partir de 76: orientacions internes del catàleg, no llindars normatius.

Les variants són una mesura de DUA per facilitar una proposta compartida amb diferents vies d’accés. El curs és una orientació del material; no assigna alumnat a grups fixos ni substitueix la decisió del docent.

## Pla i publicació

### Primera tanda

| Família | Suport | Original conservat | Ampliació | Estat |
| --- | --- | --- | --- | --- |
| L104 · El banc moll | L104A · 2n inicial | L104 · 3r inicial | L104B · 4t inicial | Provisional, revisió independent superada ES/CA |
| L107 · Una garlanda de paper | L107A · 2n inicial | L107 · 3r inicial | L107B · 4t inicial | Provisional, revisió independent superada ES/CA |
| L129 · L’aigua del gerro | L129A · 2n inicial | L129 · 3r inicial | L129B · 4t inicial | Provisional, revisió independent superada ES/CA |
| L133 · Un missatge a la nevera | L133A · 2n inicial | L133 · 3r inicial | L133B · 4t inicial | Provisional, revisió independent superada ES/CA |

Les obres d’origen no tenen un univers assignat. Compartir una temàtica o formar una família no els n’afegeix automàticament cap.

Tanda completada: quatre famílies, vuit obres adaptades i setze versions lingüístiques noves. Els quatre originals de 3r conserven els textos, preguntes i identificadors. Totes les versions noves han superat la revisió independent; la validació docent continua pendent.

### Segona tanda

Mateix perfil de suport de 2n i ampliació de 4t, amb narració, recepta, carta i entrevista. Els originals de 3r d’aquesta tanda inclouen dificultat inicial i intermèdia.

| Família | Suport | Original conservat | Ampliació | Estat |
| --- | --- | --- | --- | --- |
| L106 · El guant de ratlles | L106A · 2n inicial | L106 · 3r intermèdia | L106B · 4t inicial | Provisional, revisió independent superada ES/CA |
| L111 · Gots de tres colors | L111A · 2n inicial | L111 · 3r inicial | L111B · 4t inicial | Pendent |
| L113 · Una carta plena de blau | L113A · 2n inicial | L113 · 3r intermèdia | L113B · 4t inicial | Pendent |
| L138 · Una bústia a la biblioteca | L138A · 2n inicial | L138 · 3r intermèdia | L138B · 4t inicial | Pendent |

La situació de la L129 és fictícia, però el fenomen està contrastat amb l’activitat [Water on the Move de Science World](https://www.scienceworld.ca/resource/water-move/): un clavell blanc en aigua amb colorant permet observar el recorregut de l’aigua cap als pètals. El canvi pot requerir hores o tota la nit; la narració descriu una observació concreta, sense prometre un termini universal. A la versió de 2n es prioritzen els fets explícits; la de 4t desenvolupa el recorregut i el registre abans/després.

## Dades i revisió

Pla: `data/early-family-plan.js`. Adaptacions: `data/early-family-adaptations.js`. El registre només mostra famílies que tenen A i B completes. El constructor compartit produeix lectures ordinàries, amb codi i maquetat independents, i manté els identificadors dels originals.

Cada nova versió requereix una revisió editorial independent, també de la seva adequació a 2n quan correspon. El registre `early-families-review.json` conserva codi, llengua, data, resultat i empremta del contingut exacte. «Provisional» vol dir revisió independent superada i validació docent pendent. Un canvi editorial posterior exigeix revalidació.

`node tools/check-early-families.mjs` valida la part publicada; `--complete` exigeix totes les famílies previstes al pla. Es comproven gradació, preguntes literals de 2n, cites exactes, recursos, filtres i registre de revisió. Les comprovacions locals de navegador validen també els fulls d’alumnat i solucionari.
