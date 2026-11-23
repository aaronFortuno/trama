// Fifth DUA expansion: twenty originals, each with support A and extension B.
export const familyExpansionPlan = [
  [
    "L109",
    "A la sombra del puente",
    "A l’ombra del pont"
  ],
  [
    "L027",
    "El reloj del pan",
    "El rellotge del pa"
  ],
  [
    "L049",
    "Un juego de pistas en el espejo",
    "Un joc de pistes al mirall"
  ],
  [
    "L086",
    "Un minuto en el reloj de agua",
    "Un minut al rellotge d’aigua"
  ],
  [
    "L125",
    "Una barca para dos",
    "Una barca per a dos"
  ],
  [
    "L033",
    "La última parada",
    "L’última parada"
  ],
  [
    "L055",
    "La botella de los mensajes",
    "L’ampolla dels missatges"
  ],
  [
    "L090",
    "Una carta dentro del barro",
    "Una carta dins del fang"
  ],
  [
    "L128",
    "El pan de la merienda",
    "El pa del berenar"
  ],
  [
    "L166",
    "La taza de las dos asas",
    "La tassa de les dues nanses"
  ],
  [
    "L057",
    "La feria por dentro",
    "La fira per dins"
  ],
  [
    "L091",
    "El turno de las polillas",
    "El torn de les papallones nocturnes"
  ],
  [
    "L145",
    "La manta de las mangas",
    "La manta de les mànigues"
  ],
  [
    "L182",
    "La piedra que pesaba poco",
    "La pedra que pesava poc"
  ],
  [
    "L118",
    "El rincón de Bruna",
    "El racó de la Bruna"
  ],
  [
    "L095",
    "La playa que viajó con las olas",
    "La platja que va viatjar amb les onades"
  ],
  [
    "L150",
    "Un vaso para medir",
    "Un got per mesurar"
  ],
  [
    "L184",
    "Una carta para el ropero",
    "Una carta per al rober"
  ],
  [
    "L162",
    "Una jugada sin marcador",
    "Una jugada sense marcador"
  ],
  [
    "L206",
    "Las dos velocidades de un glaciar",
    "Les dues velocitats d’una glacera"
  ]
].map(([code, es, ca]) => ({
  id: `familia-${code.toLowerCase()}`, code, name: {es, ca},
  description: {es: 'La misma propuesta con una versión de apoyo, la lectura original y una ampliación.', ca: 'La mateixa proposta amb una versió de reforç, la lectura original i una ampliació.'},
  variantCodes: [`${code}A`, code, `${code}B`],
}));
