// Alternate response forms, reviewed separately from the original open questions.
// The exact reading code is intentional: family variants need their own alternatives.
import { choiceBatches } from './question-choices-batches.js';
import { libraryChoiceReadings } from './library-expansion.js';
import { newsroomChoiceReadings } from './newsroom-expansion.js';
import { observatoryChoiceReadings } from './observatory-expansion.js';
import { workshopChoiceReadings } from './workshop-expansion.js';
import { riversideChoiceReadings } from './riverside-expansion.js';
const choice = (prompt, options, correct, explanation) => ({ prompt, options, correct, ...(explanation ? { explanation } : {}) });
export const questionChoices = {
  L001: {
    'cartel-q1': choice(
      ['¿Qué había que hacer para llevarse un cuento?', 'Què s’havia de fer per endur-se un conte?'],
      [['Dejar un libro y devolver después el que se llevara.', 'Deixar un llibre i tornar després el que s’endugués.'], ['Dejar un libro en el intercambio.', 'Deixar un llibre a l’intercanvi.'], ['Llevarse un libro y dejar otro en una próxima visita.', 'Endur-se un llibre i deixar-ne un altre en una visita posterior.'], ['Leer un libro en la plaza antes de llevarse otro.', 'Llegir un llibre a la plaça abans d’endur-se’n un altre.']], 'b'),
    'cartel-q2': choice(
      ['¿Qué explicación de que los niños pasaran de largo está mejor apoyada por el texto?', 'Quina explicació del fet que els nens passessin de llarg té més suport al text?'],
      [['El cartel atraía con el dibujo, pero anunciaba un horario que ya había terminado.', 'El cartell atreia amb el dibuix, però anunciava un horari que ja s’havia acabat.'], ['El dragón no se distinguía desde la fuente y los niños no vieron el cartel.', 'El drac no es distingia des de la font i els nens no van veure el cartell.'], ['El mensaje oscuro se confundía con el dibujo y ocultaba las condiciones del intercambio.', 'El missatge fosc es confonia amb el dibuix i amagava les condicions de l’intercanvi.'], ['Quizá no entendieron el intercambio porque el mensaje se leía mal desde lejos.', 'Potser no van entendre l’intercanvi perquè el missatge es llegia malament de lluny.']], 'd'),
    'cartel-q3': choice(
      ['¿Qué quiere decir «pálido» al describir el amarillo del cartel?', 'Què vol dir «pàl·lid» quan descriu el groc del cartell?'],
      [['Claro y poco intenso.', 'Clar i poc intens.'], ['Oscuro y muy marcado.', 'Fosc i molt marcat.'], ['Brillante y fácil de ver.', 'Brillant i fàcil de veure.'], ['Borrado por completo.', 'Esborrat del tot.']], 'a'),
    'cartel-q4': choice(
      ['¿Qué pudo comprobar Nora al volver a mirar el cartel desde la misma fuente?', 'Què va poder comprovar la Nora quan va tornar a mirar el cartell des de la mateixa font?'],
      [['Que se leía mejor porque había reducido la distancia al quiosco.', 'Que es llegia més bé perquè havia reduït la distància al quiosc.'], ['Que el mensaje se leía mejor únicamente por estar debajo del dragón.', 'Que el missatge es llegia més bé únicament pel fet de ser sota el drac.'], ['Que el mensaje en negro se leía desde la misma distancia.', 'Que el missatge en negre es llegia des de la mateixa distància.'], ['Que el cambio había hecho volver a todas las personas que pasaron de largo.', 'Que el canvi havia fet tornar totes les persones que havien passat de llarg.']], 'c'),
  },
  L002: {
    'puente-q1': choice(
      ['¿Qué anotas si el puente se hunde con el cartón, antes de añadir monedas?', 'Què anotes si el pont s’enfonsa amb el cartró, abans d’afegir-hi monedes?'],
      [['Una moneda, contando el cartón como primera carga.', 'Una moneda, comptant el cartró com a primera càrrega.'], ['El peso del cartón, porque todavía no hay monedas.', 'El pes del cartró, perquè encara no hi ha monedes.'], ['Cero monedas, porque no llegó a sostener ninguna.', 'Zero monedes, perquè no n’ha arribat a aguantar cap.'], ['Nada: solo se anota la prueba si sostiene el cartón.', 'Res: només s’anota la prova si aguanta el cartró.']], 'c'),
    'puente-q2': choice(
      ['¿Por qué se mantiene la misma distancia entre los vasos en las dos pruebas?', 'Per què es manté la mateixa distància entre els gots en totes dues proves?'],
      [['Para comparar el efecto de los pliegues sin cambiar también la separación.', 'Per comparar l’efecte dels plecs sense canviar també la separació.'], ['Para asegurar que ambos puentes alcancen la misma carga máxima.', 'Per assegurar que tots dos ponts arribin a la mateixa càrrega màxima.'], ['Para comparar la resistencia de los vasos al colocar encima papeles distintos.', 'Per comparar la resistència dels gots quan s’hi posen papers diferents al damunt.'], ['Para poder cambiar el cartón sin que eso afecte a los resultados.', 'Per poder canviar el cartró sense que això afecti els resultats.']], 'a'),
    'puente-q3': choice(
      ['Si el puente soporta «al menos» seis monedas y ya no tienes más, ¿qué puedes afirmar?', 'Si el pont aguanta «com a mínim» sis monedes i ja no en tens més, què pots afirmar?'],
      [['Que seis es la carga máxima de ese puente.', 'Que sis és la càrrega màxima d’aquell pont.'], ['Que al llegar a seis se debe terminar siempre la prueba.', 'Que quan s’arriba a sis s’ha d’acabar sempre la prova.'], ['Que otro puente que soporte seis tendrá exactamente la misma resistencia.', 'Que un altre pont que aguanti sis tindrà exactament la mateixa resistència.'], ['Que aguantó seis, pero no sabes si podría aguantar más.', 'Que n’ha aguantat sis, però no saps si en podria aguantar més.']], 'd'),
    'puente-q6': { ...choice(
      ['¿Entre qué puntos deben quedar los doce centímetros de separación?', 'Entre quins punts hi ha d’haver els dotze centímetres de separació?'],
      [['Entre los centros de los dos vasos.', 'Entre els centres de tots dos gots.'], ['Entre los bordes más próximos de los vasos.', 'Entre les vores més pròximes dels gots.'], ['Entre los bordes exteriores más alejados de los vasos.', 'Entre les vores exteriors més allunyades dels gots.'], ['Entre el centro de un vaso y el borde más próximo del otro.', 'Entre el centre d’un got i la vora més pròxima de l’altre.']], 'b',
      ['Las instrucciones miden el espacio libre entre los bordes más próximos, no entre los centros ni entre los bordes exteriores.', 'Les instruccions mesuren l’espai lliure entre les vores més pròximes, no entre els centres ni entre les vores exteriors.']),
      evidence: [[{ paragraph: 2, text: 'Deja doce centímetros entre los bordes más próximos.' }], [{ paragraph: 2, text: 'Deixa dotze centímetres entre les vores que queden més a prop l’una de l’altra.' }]],
    },
  },
  L003: {
    'mapa-q1': choice(
      ['¿Qué dos datos intentaban anotar junto a cada sonido?', 'Quines dues dades miraven d’anotar al costat de cada so?'],
      [['La hora y su procedencia, si podían reconocerla.', 'L’hora i d’on venia, si ho podien identificar.'], ['La hora y los dos minutos que duraba cada parada.', 'L’hora i els dos minuts que durava cada parada.'], ['El número de lugares y el tiempo total del recorrido.', 'El nombre de llocs i el temps total del recorregut.'], ['Su procedencia y el símbolo que tenía en la leyenda final.', 'D’on venia i el símbol que tenia a la llegenda final.']], 'a'),
    'mapa-q2': choice(
      ['Un visitante pasa por el mercado por la mañana y no oye el silbido. ¿Qué interpretación se ajusta mejor al mapa?', 'Un visitant passa pel mercat al matí i no sent el xiulet. Quina interpretació s’ajusta més al mapa?'],
      [['El silbido se anotó por la tarde, por lo que se oirá todas las tardes.', 'El xiulet es va anotar a la tarda, de manera que se sentirà totes les tardes.'], ['Su visita demuestra que el grupo de la tarde se equivocó al anotar el silbido.', 'La seva visita demostra que el grup de la tarda es va equivocar quan va anotar el xiulet.'], ['El silbido se anotó por la tarde y los sonidos pueden cambiar con la hora.', 'El xiulet es va anotar a la tarda i els sons poden canviar amb l’hora.'], ['Debe sustituir el silbido por los carros que oyó el grupo de la mañana.', 'Ha de substituir el xiulet pels carretons que va sentir el grup del matí.']], 'c'),
    'mapa-q4': choice(
      ['¿Para qué se incluye el ejemplo de las dos visitas al mercado?', 'Per a què s’inclou l’exemple de les dues visites al mercat?'],
      [['Para averiguar de dónde procedía el golpeteo anotado en la plaza.', 'Per esbrinar d’on venien els cops anotats a la plaça.'], ['Para mostrar que un mismo lugar puede tener sonidos distintos según el momento.', 'Per mostrar que un mateix lloc pot tenir sons diferents segons el moment.'], ['Para decidir cuál de los dos grupos describió correctamente el mercado.', 'Per decidir quin dels dos grups va descriure correctament el mercat.'], ['Para explicar que el segundo dibujo corrige lo que había anotado el primer grupo.', 'Per explicar que el segon dibuix corregeix el que havia anotat el primer grup.']], 'b'),
    'mapa-q6': choice(
      ['Si dibujaran una máquina como origen del golpeteo que no pudieron identificar, ¿qué ocurriría?', 'Si dibuixessin una màquina com a origen dels cops que no van poder identificar, què passaria?'],
      [['Cambiaría aquel sonido por otro más fácil de representar con un dibujo.', 'Canviaria aquell so per un altre més fàcil de representar amb un dibuix.'], ['Añadiría un símbolo distinto sin cambiar la información registrada.', 'Afegiria un símbol diferent sense canviar la informació registrada.'], ['Completaría el origen con una pista que el equipo ya había reconocido.', 'Completaria l’origen amb una pista que l’equip ja havia reconegut.'], ['El mapa atribuiría el sonido a una máquina sin haberlo comprobado.', 'El mapa atribuiria el so a una màquina sense haver-ho comprovat.']], 'd'),
  },
  L004: {
    'caja-q1': choice(
      ['¿Qué dos cosas había dentro del sobre?', 'Quines dues coses hi havia dins del sobre?'],
      [['Un billete caducado y la frase «Para quien dibujó un zorro en la última página».', 'Un bitllet caducat i la frase «Per a qui va dibuixar una guineu a l’última pàgina».'], ['Un billete caducado y una nota escrita por Marta.', 'Un bitllet caducat i una nota escrita per la Marta.'], ['Una nota de Inés y un cartel del antiguo club de lectura.', 'Una nota de la Inés i un cartell de l’antic club de lectura.'], ['Un billete de autobús caducado y una nota de Inés.', 'Un bitllet d’autobús caducat i una nota de la Inés.']], 'd'),
    'caja-q2': choice(
      ['¿Qué dos pistas relacionan a Marta con el dibujo antes de que ella lo reconozca?', 'Quines dues pistes relacionen la Marta amb el dibuix abans que ella el reconegui?'],
      [['Las iniciales M. R. y el color verde de las tapas.', 'Les inicials M. R. i el color verd de les cobertes.'], ['Las iniciales M. R. y la misma oreja doblada en un dibujo firmado por ella.', 'Les inicials M. R. i la mateixa orella doblegada en un dibuix signat per ella.'], ['Su lugar de trabajo y la oreja que reconoce al ver el sobre.', 'El lloc on treballa i l’orella que reconeix quan veu el sobre.'], ['El dibujo del cartel y el billete que cayó al abrir el libro.', 'El dibuix del cartell i el bitllet que va caure quan van obrir el llibre.']], 'b'),
    'caja-q4': choice(
      ['¿Qué función tiene la oreja doblada al principio y al final?', 'Quina funció té l’orella doblegada al principi i al final?'],
      [['Primero identifica a la dibujante; al final muestra que Marta ha aprendido a hacerla recta.', 'Primer identifica la dibuixant; al final mostra que la Marta ha après a fer-la dreta.'], ['Primero permite reconocer a Inés; al final enlaza el dibujo nuevo con el antiguo.', 'Primer permet reconèixer la Inés; al final relaciona el dibuix nou amb l’antic.'], ['Primero ayuda a identificar a la dibujante; al final enlaza el nuevo dibujo de Marta con el antiguo.', 'Primer ajuda a identificar la dibuixant; al final relaciona el dibuix nou de la Marta amb l’antic.'], ['Primero solo decora el libro; al final revela qué decía la nota de Inés.', 'Primer només decora el llibre; al final revela què deia la nota de la Inés.']], 'c'),
    'caja-q7': choice(
      ['¿Por qué la caja de objetos olvidados no bastaba para saber de quién era el libro?', 'Per què la caixa d’objectes oblidats no era suficient per saber de qui era el llibre?'],
      [['Porque había llegado con una donación y se había mezclado con esos objetos al ordenar.', 'Perquè havia arribat amb una donació i s’havia barrejat amb aquells objectes mentre endreçaven.'], ['Porque un miembro del club había olvidado allí el libro al acabar una actividad.', 'Perquè un membre del club havia oblidat allà el llibre quan s’havia acabat una activitat.'], ['Porque la caja recogía las donaciones del club y había otros libros iguales.', 'Perquè la caixa recollia les donacions del club i hi havia altres llibres iguals.'], ['Porque el sobre había llegado a la caja separado del libro de tapas verdes.', 'Perquè el sobre havia arribat a la caixa separat del llibre de cobertes verdes.']], 'a'),
  },
  L005: {
    'agua-q1': choice(
      ['¿En qué ciudad está el acueducto mencionado?', 'A quina ciutat és l’aqüeducte esmentat?'],
      [['En Roma.', 'A Roma.'], ['En Segovia.', 'A Segòvia.'], ['En Toledo.', 'A Toledo.'], ['En Tarragona.', 'A Tarragona.']], 'b'),
    'agua-q2': choice(
      ['¿Qué significa que el canal tenía una «ligera pendiente»?', 'Què vol dir que el canal tenia un «pendent suau»?'],
      [['Que el fondo subía despacio hacia la ciudad.', 'Que el fons pujava a poc a poc cap a la ciutat.'], ['Que parecía inclinado, pero su fondo era horizontal.', 'Que semblava inclinat, però el fons era horitzontal.'], ['Que el fondo seguía todas las bajadas y subidas del terreno.', 'Que el fons seguia totes les baixades i pujades del terreny.'], ['Que el fondo perdía altura poco a poco.', 'Que el fons anava perdent altura a poc a poc.']], 'd'),
    'agua-q3': choice(
      ['¿Qué dos destinos del agua se mencionan en el texto?', 'Quins dos destins de l’aigua s’esmenten al text?'],
      [['Las fuentes y edificios como los baños.', 'Les fonts i edificis com els banys.'], ['Las fuentes y los caminos que cruzaban la plaza.', 'Les fonts i els camins que travessaven la plaça.'], ['Los baños y el lugar alto donde empezaba el canal.', 'Els banys i el lloc alt on començava el canal.'], ['Los arcos y las bases de los pilares de la plaza.', 'Els arcs i les bases dels pilars de la plaça.']], 'a'),
    'agua-q4': choice(
      ['Si el terreno baja mucho y después sube, ¿qué permiten hacer los arcos?', 'Si el terreny baixa molt i després puja, què permeten fer els arcs?'],
      [['Mantener el fondo del canal pegado a todas las formas del terreno.', 'Mantenir el fons del canal arran de totes les formes del terreny.'], ['Recuperar altura empujando el agua desde la parte más baja.', 'Recuperar altura empenyent l’aigua des de la part més baixa.'], ['Sostener el canal sobre la parte baja y mantener una bajada suave.', 'Sostenir el canal damunt de la part baixa i mantenir un pendent suau.'], ['Evitar que el agua pierda altura a lo largo de todo el recorrido.', 'Evitar que l’aigua perdi altura al llarg de tot el recorregut.']], 'c'),
  },
};

const localizedReadings = new Map();
for (const entry of [...choiceBatches.flatMap(batch => batch.readings), ...libraryChoiceReadings, ...newsroomChoiceReadings, ...observatoryChoiceReadings, ...workshopChoiceReadings, ...riversideChoiceReadings]) {
  const key = `${entry.code}:${entry.language}`;
  if (localizedReadings.has(key) || Object.hasOwn(questionChoices, entry.code)) throw Error(`Duplicate question choices: ${key}`);
  localizedReadings.set(key, entry);
}

export const choiceCodes = Object.freeze([...new Set([...Object.keys(questionChoices), ...choiceBatches.flatMap(batch => batch.readings.map(entry => entry.code)), ...libraryChoiceReadings.map(entry => entry.code), ...newsroomChoiceReadings.map(entry => entry.code), ...observatoryChoiceReadings.map(entry => entry.code), ...workshopChoiceReadings.map(entry => entry.code), ...riversideChoiceReadings.map(entry => entry.code)])]);

export function localizedChoice(record, question) {
  return { prompt: record.prompt, options: record.options.map((text, index) => ({ id: 'abcd'[index], text })),
    correct: record.correct, explanation: record.explanation ?? question.answer,
    ...(record.evidence ? { evidence: record.evidence } : {}) };
}

export function multipleChoice(reading, question) {
  if (reading.personal || !['es', 'ca'].includes(reading.language)) return null;
  const localized = localizedReadings.get(`${reading.code}:${reading.language}`)?.questions[question.id];
  if (localized) return localizedChoice(localized, question);
  const record = questionChoices[reading.code]?.[question.id];
  if (!record) return null;
  const locale = reading.language === 'es' ? 0 : 1;
  return { prompt: record.prompt[locale], options: record.options.map((pair, index) => ({ id: 'abcd'[index], text: pair[locale] })), correct: record.correct, explanation: record.explanation?.[locale] ?? question.answer,
    ...(record.evidence ? { evidence: record.evidence[locale] } : {}) };
}

export function choiceReviewSnapshot(reading, question, alternative = multipleChoice(reading, question)) {
  return { code: reading.code, language: reading.language, questionId: question.id,
    paragraphs: reading.paragraphs, openPrompt: question.prompt, openAnswer: question.answer,
    evidence: question.evidence ?? [], ...alternative };
}
