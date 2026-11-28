const trama = [
  ['El banc del passadís', 'Narració', 'Cicle mitjà', 'Inicial', 'La Nura troba un banc de fusta al passadís i hi deixa una capsa de guixos perquè tothom els pugui agafar.', 'Què hi deixa, la Nura?', 'Una capsa de guixos.'],
  ['Garlandes per a la plaça', 'Instruccions', 'Cicle mitjà', 'Intermèdia', 'Retalla sis tires de paper. Enganxa els extrems de cada tira i passa cada anella per dins de l’anterior.', 'Quantes tires cal retallar?', 'Sis.'],
  ['El carretó verd', 'Narració', 'Cicle superior', 'Inicial', 'En Roc es fa un senyal a la mà amb un retolador verd per recordar que ha de tornar el carretó al magatzem.', 'Per a què serveix el senyal?', 'Per recordar que ha de tornar el carretó.'],
  ['Quan l’ombra canvia de lloc', 'Text explicatiu', 'Cicle superior', 'Intermèdia', 'A mig matí, l’ombra del pal tocava la jardinera. Després de dinar, queia cap a l’altra banda del pati.', 'Què es compara?', 'La posició de l’ombra en dos moments del dia.'],
  ['Una postal sense segell', 'Carta', 'Cicle mitjà', 'Intermèdia', 'Estimada Bruna, la postal encara és damunt la taula. Demà aniré al quiosc a buscar un segell. Una abraçada, Aran.', 'Què farà l’Aran demà?', 'Anirà al quiosc a buscar un segell.'],
  ['Llums de camí al refugi', 'Narració', 'Cicle superior', 'Avançada', 'El grup només encenia les llanternes quan calia mirar les marques del camí. A la resta del trajecte, els ulls s’acostumaven a la foscor.', 'Quan encenien les llanternes?', 'Quan havia de mirar les marques del camí.'],
  ['Recollida després de la festa', 'Notícia', 'Cicle superior', 'Intermèdia', 'Diumenge, una quinzena de voluntaris va recollir les cadires de la plaça. Les van deixar al magatzem abans del migdia.', 'On van dur les cadires?', 'Al magatzem.'],
  ['Assajar sense presses', 'Text d’opinió', 'Primer cicle d’ESO', 'Avançada', 'Als assajos ens convé poder aturar-nos i repetir una escena. Així és més fàcil ajudar-nos i entendre què hem de millorar.', 'Què defensa el text?', 'Que convé aturar-se i repetir les escenes als assajos.'],
];

const sentit = [
  ['Un avís abans del pati', 'Diàleg', 'dialogue', 'Cicle mitjà', 'Inicial', 'L’Aina i en Jan preparen un avís per recordar que la biblioteca obrirà a l’hora del pati.', 'Quin espai obrirà a l’hora del pati?', 'La biblioteca.'],
  ['Una butxaca per al tiquet', 'Narració', 'story', 'Cicle mitjà', 'Inicial', 'En Nil pensa que ha perdut el tiquet, però el troba a la butxaca interior de la jaqueta.', 'On era el tiquet?', 'A la butxaca interior de la jaqueta.'],
  ['Qui afina el piano?', 'Entrevista', 'interview', 'Cicle superior', 'Intermèdia', 'Una tècnica explica que sovint visita les escoles al matí, quan les sales de música encara són buides.', 'Per què hi va al matí?', 'Perquè les sales de música encara són buides.'],
  ['Un accés nou al jardí', 'Notícia', 'news', 'Cicle superior', 'Intermèdia', 'A partir de dilluns el jardí tindrà una entrada pel carrer de la Font.', 'Per quin carrer s’hi podrà entrar?', 'Pel carrer de la Font.'],
  ['Què passa quan s’eixuga un bassal?', 'Text explicatiu', 'explanation', 'Primer cicle d’ESO', 'Avançada', 'Una veu descriu com part de l’aigua del bassal passa a l’aire quan el sol escalfa el terra.', 'On va part de l’aigua?', 'A l’aire.'],
  ['Preparem un sobre per al futur', 'Instruccions', 'instructions', 'Cicle mitjà', 'Intermèdia', 'Cal escriure la data al sobre abans de tancar-lo i desar-lo al calaix.', 'Què cal fer abans de tancar el sobre?', 'Escriure-hi la data.'],
  ['Entrevista a una fornera', 'Entrevista', 'interview', 'Cicle superior', 'Avançada', 'La fornera explica que reserva el pa del dia anterior per fer-ne torrades.', 'Per a què reserva el pa?', 'Per fer torrades.'],
  ['Quina foto pengem?', 'Diàleg', 'dialogue', 'Cicle mitjà', 'Intermèdia', 'Dues amigues trien la fotografia de grup per obrir l’àlbum de l’excursió.', 'Quina fotografia trien?', 'La fotografia de grup.'],
];

function material(project, index, title, type, genre, level, difficulty, summary, prompt, answer) {
  const code = `PROVA-${project[0].toUpperCase()}${String(index + 1).padStart(2, '0')}`;
  return {
    code, title, type, genre, level, difficulty, summary,
    questions: [{ prompt, answer }, { prompt: project === 'trama' ? 'Copia una expressió del text que justifiqui la resposta.' : 'Resumeix la situació en una frase.', answer: summary }],
  };
}

export const studyMaterials = {
  trama: trama.map(([title, type, level, difficulty, summary, prompt, answer], index) =>
    material('trama', index, title, type, null, level, difficulty, summary, prompt, answer)),
  sentit: sentit.map((values, index) => material('sentit', index, ...values)),
};

export function getStudyMaterial(project, code) {
  const list = studyMaterials[project];
  return list.find(item => item.code === code) ?? list[0];
}

export function studyLink(page, code) {
  return `./${page}.html?material=${encodeURIComponent(code)}`;
}
