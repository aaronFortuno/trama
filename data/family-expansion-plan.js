// Second mixed-course expansion, 22 November 2026. A–original–B.
export const familyExpansionPlan = [
  ['L108', 'La caja de los dibujos', 'La capsa dels dibuixos'],
  ['L127', 'Una pinza para cada calcetín', 'Una pinça per a cada mitjó'],
  ['L025', 'Un turno en el mercado', 'Un torn al mercat'],
  ['L028', 'Las sillas del cine', 'Les cadires del cinema'],
  ['L168', 'Cómo guardar una partida', 'Com guardar una partida'],
  ['L048', 'El sobre de las dos entradas', 'El sobre de les dues entrades'],
  ['L115', 'El pase de la portera', 'La passada de la portera'],
  ['L117', 'El cajón de las piezas sueltas', 'El calaix de les peces soltes'],
  ['L082', 'El ensayo de las dos pausas', 'L’assaig de les dues pauses'],
  ['L204', 'Una entrada con dos horarios', 'Una entrada amb dos horaris'],
].map(([code, es, ca]) => ({
  id: `familia-${code.toLowerCase()}`, code, name: { es, ca },
  description: {
    es: 'La misma propuesta con una versión de apoyo, la lectura original y una ampliación.',
    ca: 'La mateixa proposta amb una versió de reforç, la lectura original i una ampliació.',
  },
  variantCodes: [`${code}A`, code, `${code}B`],
}));
