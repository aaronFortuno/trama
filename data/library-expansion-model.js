// Authoring pairs are [Spanish, Catalan]. This model keeps every edition's
// text, questions, evidence and choices independent while sharing its artwork.
export const q = (type, lines, prompt, answer, evidence = [], choice = null) =>
  ({ type, lines, prompt, answer, evidence, ...(choice ? { choice } : {}) });
export const mc = (options, correct, prompt = null, explanation = null) =>
  ({ options, correct, ...(prompt ? { prompt } : {}), ...(explanation ? { explanation } : {}) });

const libraryWorld = {
  id: 'biblioteca-de-les-coses', imageSuffix: 'biblioteca',
  description: {
    ca: 'Una història de La biblioteca de les coses, amb suport, versió de referència i ampliació.',
    es: 'Una historia de La biblioteca de las cosas, con apoyo, versión de referencia y ampliación.',
  },
  sharedImage: { id: 'library-room', src: 'assets/readings/l208-la-biblioteca-de-objetos-1.webp',
    alt: ['Interior de la biblioteca de objetos con estanterías de madera y una ventana verde con arco.', 'Interior de la biblioteca d’objectes amb prestatgeries de fusta i una finestra verda amb arc.'] },
};

export function compileLibraryFamily(spec, world = libraryWorld) {
  const familyId = `familia-${spec.code.toLowerCase()}`;
  const family = {
    id: familyId, code: spec.code,
    name: { es: spec.title[0], ca: spec.title[1] },
    description: world.description, variantCodes: [`${spec.code}A`, spec.code, `${spec.code}B`],
  };
  const readings = [], choices = [];
  for (const edition of spec.editions) for (const [locale, language] of ['es', 'ca'].entries()) {
    const code = spec.code + edition.suffix;
    const workId = spec.workId + (edition.suffix ? '-' + edition.suffix.toLowerCase() : '');
    const paragraphs = edition.paragraphs.map(pair => pair[locale]);
    const questions = edition.questions.map((question, index) => ({
      id: `${code.toLowerCase()}-q${index + 1}`, type: question.type, lines: question.lines,
      prompt: question.prompt[locale], answer: question.answer[locale],
      ...(question.evidence.length ? { evidence: question.evidence.map(([paragraph, es, ca]) => ({ paragraph, text: locale ? ca : es })) } : {}),
    }));
    const annotations = questions.filter(question => question.type === 'vocabulary').flatMap(question => {
      const term = question.prompt.match(/«([^»]+)»/)?.[1];
      const paragraph = term ? paragraphs.findIndex(text => text.includes(term)) : -1;
      return paragraph < 0 ? [] : [{ paragraph: paragraph + 1, text: term, occurrence: 1, questionId: question.id }];
    });
    annotations.push(...(edition.notes ?? []).map(note => ({ paragraph: note.paragraph,
      text: note.text[locale], definition: note.definition[locale], occurrence: 1 })));
    readings.push({ id: `${workId}-${language}`, code, workId, language,
      familyId, universeIds: [world.id],
      level: edition.level, difficulty: edition.difficulty,
      themes: spec.themes, genre: spec.genre, title: spec.title[locale],
      summary: edition.summary[locale], paragraphs, questions, annotations,
      images: [
        { id: `${spec.code.toLowerCase()}-scene`, src: `assets/readings/${spec.code.toLowerCase()}-${world.imageSuffix}.webp`,
          width: 1100, height: 733, alt: spec.imageAlt[locale], afterParagraph: Math.max(1, Math.round(paragraphs.length / 3)) },
        { id: world.sharedImage.id, src: world.sharedImage.src,
          width: 1100, height: 733,
          alt: world.sharedImage.alt[locale],
          afterParagraph: Math.max(2, Math.round(paragraphs.length * 2 / 3)) },
      ],
    });
    const alternatives = {};
    edition.questions.forEach((question, index) => {
      if (!question.choice) return;
      alternatives[questions[index].id] = {
        prompt: (question.choice.prompt ?? question.prompt)[locale],
        options: question.choice.options.map(pair => pair[locale]), correct: question.choice.correct,
        explanation: (question.choice.explanation ?? question.answer)[locale],
      };
    });
    choices.push({ code, language, questions: alternatives });
  }
  return { family, readings, choices };
}
