# Compleció del catàleg per cicles

Tanda autoritzada el 27 de novembre del 2026: 30 variants per completar quinze històries de primer cicle i cinc ampliacions de segon cicle dins de l’Observatori. Es mantenen les 315 històries i les famílies existents. Les publicacions són progressives i la validació docent continua pendent.

## Primer cicle de primària

Les versions C són inicials: frases breus, poca informació simultània, unes 10–40 paraules i tres preguntes literals. Les D són avançades de primer cicle: lectura més sostinguda, unes 60–130 paraules i cinc preguntes amb connexions o inferències pròximes. Les versions A de 2n inicial ja publicades continuen com a intermèdies de cicle. Els intervals són orientatius; la revisió concreta comprova text, preguntes i il·lustracions.

Ordre editorial: **C → A → D → original → B**. C, A i D ofereixen els tres trams del primer cicle; original i B continuen disponibles al segon cicle. Una família pot tenir cinc variants i cadascuna manté identitat i maquetat propis. Els sufixos no defineixen dificultat per si sols.

| Família | Variants noves publicades | Estat |
| --- | --- | --- |
| L104 · El banc moll | L104C, L104D | Provisional ES/CA, revisió superada |
| L107 · Una garlanda de paper | L107C, L107D | Provisional ES/CA, revisió superada |
| L133 · Un missatge a la nevera | L133C, L133D | Provisional ES/CA, revisió superada |
| L106 · El guant de ratlles | L106C, L106D | Provisional ES/CA, revisió superada |
| L111 · Gots de tres colors | L111C, L111D | Provisional ES/CA, revisió superada |
| L113 · Una carta plena de blau | L113C, L113D | Provisional ES/CA, revisió superada |
| L129 · L’aigua del gerro | L129C, L129D | Provisional ES/CA, revisió superada |
| L138 · Una bústia a la biblioteca | L138C, L138D | Provisional ES/CA, revisió superada |
| L108 · La capsa dels dibuixos | L108C, L108D | Provisional ES/CA, revisió superada |
| L127 · Una pinça per a cada mitjó | L127C, L127D | Provisional ES/CA, revisió superada |
| L123 · La llauna dels llapis | L123C, L123D | Provisional ES/CA, revisió superada |
| L126 · El camí de les fletxes | L126C, L126D | Provisional ES/CA, revisió superada |
| L139 · La corda de l’hort | L139C, L139D | Provisional ES/CA, revisió superada |
| L125 · Una barca per a dos | L125C, L125D | Provisional ES/CA, revisió superada |
| L145 · La manta de les mànigues | L145C, L145D | Provisional ES/CA, revisió superada |

## Segon cicle avançat · Observatori

Cinc versions C amplien famílies existents de l’Observatori. S’ordenen entre l’original i B: **A → original → C → B**. La dificultat s’ha de construir amb integració de pistes, interpretacions i justificacions; allargar el text no és suficient.

| Família | Variant nova publicada | Estat |
| --- | --- | --- |
| L289 · La visita a plena llum | L289C | Provisional ES/CA, revisió superada |
| L290 · Un banc a mig camí | L290C | Provisional ES/CA, revisió superada |
| L291 · La maleta de les preguntes | L291C | Provisional ES/CA, revisió superada |
| L292 · Una Lluna que cabia a la mà | L292C | Provisional ES/CA, revisió superada |
| L293 · La maqueta del cel del poble | L293C | Provisional ES/CA, revisió superada |

## Revisió i compatibilitat

Cada idioma i variant es revisa independentment, incloses totes les opcions ABCD, respostes, evidències i la compatibilitat de la il·lustració compartida. Les opinions mantenen resposta oberta. Es conserva una línia per a respostes breus i més espai quan cal explicar. Les inicials i avançades de primer cicle utilitzen Massallera de 15 punts i la plantilla existent del cicle.

El [registre](cycle-completion/review.json) identifica la versió exacta, l’autor i el revisor. El [registre ABCD](question-choices/cycle-completion-review.json) conserva cada alternativa. No s’ha regenerat cap aprovació antiga. Les [empremtes anteriors](cycle-completion/originals.json) protegeixen 120 versions lingüístiques prèvies, amb preguntes i alternatives.

La comprovació històrica `check-early-families.mjs` troba una empremta antiga de L104A diferent de la versió ja publicada abans d’aquesta tanda. Aquella aprovació no es reescriu: el control nou compara els originals amb la fotografia prèvia a la tanda i confirma que es conserven.

Comprovacions: `node tools/check-cycle-completion.mjs --complete`, `node tools/check-question-choices.mjs`, `node tools/check-cycle-classification.mjs` i `node tools/check-cycle-completion-browser.cjs`. Durant la publicació progressiva s’omet `--complete`. La prova de navegador és local; producció la revisa l’usuari.
