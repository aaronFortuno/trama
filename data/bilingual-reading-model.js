// Editorial authoring: pairs are [Spanish, Catalan]. Public readings are normal
// objects, with separate ids and the same workId/code across the two languages.
export function question(type, lines, esPrompt, caPrompt, esAnswer, caAnswer, ...evidence) {
  return { type, lines, prompt: [esPrompt, caPrompt], answer: [esAnswer, caAnswer], evidence };
}

export function bilingualReading(entry) {
  return ['es', 'ca'].map((language, locale) => {
    const paragraphs = entry.paragraphs.map(pair => pair[locale]);
    const questions = entry.questions.map((item, index) => ({
      id: `${entry.code.toLowerCase()}-q${index + 1}`, type: item.type, lines: item.lines,
      prompt: item.prompt[locale], answer: item.answer[locale],
      ...(item.evidence.length ? { evidence: item.evidence.map(([paragraph, es, ca]) => ({ paragraph, text: locale ? ca : es })) } : {}),
    }));
    const annotations = questions.filter(item => item.type === 'vocabulary').flatMap(item => {
      const term = item.prompt.match(/«([^»]+)»/)?.[1];
      const paragraph = term && paragraphs.findIndex(text => text.includes(term));
      return term && paragraph >= 0 ? [{ paragraph: paragraph + 1, text: term, occurrence: 1, questionId: item.id }] : [];
    });
    annotations.push(...(entry.notes ?? []).map(note => ({
      paragraph: note.paragraph, text: note.text[locale], definition: note.definition[locale], occurrence: 1,
    })));
    return {
      id: `${entry.workId}-${language}`, code: entry.code, workId: entry.workId, language,
      universeIds: [entry.universeId], level: entry.level, difficulty: entry.difficulty,
      themes: entry.themes, genre: entry.genre, title: entry.title[locale], summary: entry.summary[locale],
      paragraphs, questions, annotations,
      images: entry.images.map(({ alt, ...image }) => ({ ...image, width: 1100, height: 733, alt: alt[locale] })),
    };
  });
}
