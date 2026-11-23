// Thirty existing readings, each with support A and extension B.
export const familyExpansionPlan = [
  [
    "L130",
    "La entrada de cartón",
    "L’entrada de cartró"
  ],
  [
    "L177",
    "El presupuesto del patinete",
    "El pressupost del patinet"
  ],
  [
    "L114",
    "La sombra del títere",
    "L’ombra del titella"
  ],
  [
    "L050",
    "Cartas desde el banco del patio",
    "Cartes des del banc del pati"
  ],
  [
    "L087",
    "Una voz entre los diálogos",
    "Una veu entre els diàlegs"
  ],
  [
    "L123",
    "La lata de los lápices",
    "La llauna dels llapis"
  ],
  [
    "L171",
    "El bolso de la narradora",
    "La bossa de la narradora"
  ],
  [
    "L119",
    "Pulseras por encargo",
    "Polseres per encàrrec"
  ],
  [
    "L085",
    "La maleta que no quería cerrar",
    "La maleta que no es volia tancar"
  ],
  [
    "L126",
    "El camino de las flechas",
    "El camí de les fletxes"
  ],
  [
    "L023",
    "Las hojas que quedan",
    "Els fulls que queden"
  ],
  [
    "L120",
    "Un camino entre la nieve",
    "Un camí entre la neu"
  ],
  [
    "L139",
    "La cuerda del huerto",
    "La corda de l’hort"
  ],
  [
    "L088",
    "Dos cartas para una persiana",
    "Dues cartes per a una persiana"
  ],
  [
    "L026",
    "Un espacio en la pared",
    "Un espai a la paret"
  ],
  [
    "L122",
    "El ritmo de los vasos",
    "El ritme dels gots"
  ],
  [
    "L136",
    "Dos golpes en la puerta",
    "Dos trucs a la porta"
  ],
  [
    "L089",
    "El nudo del cielo",
    "El nus del cel"
  ],
  [
    "L169",
    "Las mochilas de la última fila",
    "Les motxilles de l’última fila"
  ],
  [
    "L046",
    "El jardín de los turnos",
    "El jardí dels torns"
  ],
  [
    "L140",
    "El billete del abuelo",
    "El bitllet de l’avi"
  ],
  [
    "L094",
    "El pez que nadó al revés",
    "El peix que va nedar a l’inrevés"
  ],
  [
    "L172",
    "Dos precios en la etiqueta",
    "Dos preus a l’etiqueta"
  ],
  [
    "L053",
    "El día que cambiaron las señales",
    "El dia que van canviar els senyals"
  ],
  [
    "L149",
    "La caja que da la vuelta",
    "La capsa que fa la volta"
  ],
  [
    "L096",
    "El menú de las dos tortillas",
    "El menú de les dues «tortillas»"
  ],
  [
    "L183",
    "Una foto para recordar el tamaño",
    "Una foto per recordar la mida"
  ],
  [
    "L158",
    "Un libro que se pueda abrir",
    "Un llibre que s’ha de poder obrir"
  ],
  [
    "L155",
    "Doce sillas y dos bancos",
    "Dotze cadires i dos bancs"
  ],
  [
    "L186",
    "Un tablero para ganar juntos",
    "Un tauler per guanyar plegats"
  ]
].map(([code, es, ca]) => ({
  id: `familia-${code.toLowerCase()}`, code, name: {es, ca},
  description: {es: 'La misma propuesta con una versión de apoyo, la lectura original y una ampliación.', ca: 'La mateixa proposta amb una versió de reforç, la lectura original i una ampliació.'},
  variantCodes: [`${code}A`, code, `${code}B`],
}));
