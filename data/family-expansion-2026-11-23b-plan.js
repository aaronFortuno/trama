// Fourth DUA expansion: twenty originals, each with support A and extension B.
export const familyExpansionPlan = [
  [
    "L105",
    "El rastro de plata",
    "El rastre de plata"
  ],
  [
    "L021",
    "El abrigo del perchero",
    "L’abric del penjador"
  ],
  [
    "L041",
    "La vuelta por la sombra",
    "La volta per l’ombra"
  ],
  [
    "L083",
    "Cuando el río deja una isla",
    "Quan el riu deixa una illa"
  ],
  [
    "L110",
    "Una rueda floja",
    "Una roda fluixa"
  ],
  [
    "L032",
    "El patio de antes",
    "El pati d’abans"
  ],
  [
    "L045",
    "Un mapa para llegar sin preguntar",
    "Un mapa per arribar-hi sense preguntar"
  ],
  [
    "L084",
    "Una receta con dos fechas",
    "Una recepta amb dues dates"
  ],
  [
    "L112",
    "El juego de las fichas",
    "El joc de les fitxes"
  ],
  [
    "L037",
    "Una respuesta para el canal",
    "Una resposta per al canal"
  ],
  [
    "L052",
    "Una mañana detrás de la pantalla",
    "Un matí darrere de la pantalla"
  ],
  [
    "L092",
    "Dos fichas y una regla",
    "Dues fitxes i una regla"
  ],
  [
    "L141",
    "El cartel de la fuente",
    "El cartell de la font"
  ],
  [
    "L174",
    "El tren que no salía del mapa",
    "El tren que no sortia del mapa"
  ],
  [
    "L060",
    "Una propuesta para el tablón",
    "Una proposta per al tauler"
  ],
  [
    "L093",
    "El lado de la ola",
    "El costat de l’onada"
  ],
  [
    "L148",
    "Letras del revés",
    "Lletres del revés"
  ],
  [
    "L187",
    "El dibujo que viajó en autobús",
    "El dibuix que va viatjar en autobús"
  ],
  [
    "L159",
    "El turno del robot",
    "El torn del robot"
  ],
  [
    "L207",
    "Una entrevista que empezó por el final",
    "Una entrevista que va començar pel final"
  ]
].map(([code, es, ca]) => ({
  id: `familia-${code.toLowerCase()}`, code, name: {es, ca},
  description: {es: 'La misma propuesta con una versión de apoyo, la lectura original y una ampliación.', ca: 'La mateixa proposta amb una versió de reforç, la lectura original i una ampliació.'},
  variantCodes: [`${code}A`, code, `${code}B`],
}));
