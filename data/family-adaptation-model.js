// Bilingual authoring helper: prompt and answer in ES/CA, followed by exact
// evidence tuples [one-based paragraph, ES quote, CA quote]. Public exports
// remain ordinary reading/question objects, including separate work identities.
export function q(type, lines, esPrompt, caPrompt, esAnswer, caAnswer, ...evidence) {
  return { type, lines, prompt: [esPrompt, caPrompt], answer: [esAnswer, caAnswer], evidence };
}

export function buildFamilyAdaptations(baseReadings, adaptations, families) {
  const originals = new Map(baseReadings.map(reading => [`${reading.code}:${reading.language}`, reading]));
  const registry = new Map(families.map(family => [family.code, family.id]));
  return adaptations.flatMap(edition => ['es', 'ca'].map((language, locale) => {
    const base = originals.get(`${edition.source}:${language}`);
    if (!base) throw Error(`Missing family source ${edition.source}:${language}`);
    const code = `${edition.source}${edition.suffix}`;
    const paragraphs = edition.paragraphs.map(pair => pair[locale]);
    const questions = edition.questions.map((question, index) => ({
      id: `${code.toLowerCase()}-q${index + 1}`, type: question.type, lines: question.lines,
      prompt: question.prompt[locale], answer: question.answer[locale],
      ...(question.evidence.length ? { evidence: question.evidence.map(([paragraph, es, ca]) => ({ paragraph, text: locale ? ca : es })) } : {}),
    }));
    const annotations = questions.filter(question => question.type === 'vocabulary').flatMap(question => {
      const term = question.prompt.match(/«([^»]+)»/)?.[1];
      const paragraph = term && paragraphs.findIndex(text => text.includes(term));
      return term && paragraph >= 0 ? [{ paragraph: paragraph + 1, text: term, questionId: question.id }] : [];
    });
    return {
      ...base, id: `${base.workId}-${edition.suffix.toLowerCase()}-${language}`,
      workId: `${base.workId}-${edition.suffix.toLowerCase()}`, code,
      familyId: registry.get(edition.source), level: edition.level, difficulty: edition.difficulty,
      summary: edition.summary[locale], paragraphs, questions, annotations,
      images: base.images.map((image, index) => ({
        ...image, afterParagraph: edition.imageAfter?.[index] ?? Math.max(1, Math.min(paragraphs.length, Math.round((index + 1) * paragraphs.length / (base.images.length + 1)))),
      })),
    };
  }));
}
