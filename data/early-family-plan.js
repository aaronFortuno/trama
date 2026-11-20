// Sequential editions: existing year-3 readings, year-2 support, year-4 extension.
export const earlyFamilyPlan = [
  ['L104', 'El banco mojado', 'El banc moll'],
  ['L107', 'Una guirnalda de papel', 'Una garlanda de paper'],
  ['L129', 'El agua del jarrón', 'L’aigua del gerro'],
  ['L133', 'Un mensaje en la nevera', 'Un missatge a la nevera'],
  ['L106', 'El guante de rayas', 'El guant de ratlles'],
  ['L111', 'Vasos de tres colores', 'Gots de tres colors'],
  ['L113', 'Una carta llena de azul', 'Una carta plena de blau'],
  ['L138', 'Un buzón en la biblioteca', 'Una bústia a la biblioteca'],
].map(([code, es, ca]) => ({
  id: `familia-${code.toLowerCase()}`, code, name: { es, ca },
  description: {
    es: 'Una misma propuesta con una lectura breve de 2.º, el original de 3.º y una ampliación de 4.º.',
    ca: 'Una mateixa proposta amb una lectura breu de 2n, l’original de 3r i una ampliació de 4t.',
  },
  variantCodes: [`${code}A`, code, `${code}B`],
}));
