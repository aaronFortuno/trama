const wordStart = /^[\p{L}\p{M}\p{N}]/u;
const wordEnd = /[\p{L}\p{M}\p{N}]$/u;

export function annotationRange(paragraph, { text, occurrence }) {
  if (!paragraph || !text) return null;
  const matches = [];
  for (let start = paragraph.indexOf(text); start !== -1; start = paragraph.indexOf(text, start + 1)) {
    const end = start + text.length;
    if (wordStart.test(text) && wordEnd.test(paragraph.slice(0, start))) continue;
    if (wordEnd.test(text) && wordStart.test(paragraph.slice(end))) continue;
    matches.push({ start, end });
  }
  if (occurrence === undefined && matches.length !== 1) return null;
  return matches[(occurrence ?? 1) - 1] ?? null;
}

export function prepareAnnotations(reading, questions, { showVocabulary = true } = {}) {
  const activeQuestions = new Set(questions.map(question => question.id));
  const ranges = new Map();
  for (const annotation of reading.annotations ?? []) {
    if (annotation.definition && !showVocabulary) continue;
    if (annotation.questionId && !activeQuestions.has(annotation.questionId)) continue;
    const index = annotation.paragraph - 1;
    const range = annotationRange(reading.paragraphs[index], annotation);
    if (!range) continue;
    if (!ranges.has(index)) ranges.set(index, []);
    ranges.get(index).push({ ...annotation, ...range });
  }

  const notes = [];
  for (let index = 0; index < reading.paragraphs.length; index++) {
    ranges.get(index)?.sort((a, b) => a.start - b.start).forEach(annotation => {
      if (annotation.definition) {
        annotation.number = notes.length + 1;
        notes.push(annotation);
      }
    });
  }
  return { ranges, notes };
}
