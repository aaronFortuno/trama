import { annotationRange } from './reading-annotations.js';

// Numbers remain the primary reference, including in grayscale printouts.
export const evidenceColors = Object.freeze([
  '#f6e89c', '#ccebd7', '#d2e5fa', '#f2d3df', '#e2d6f4', '#f7d8b3',
  '#c7e9e8', '#e7eab8', '#e8d4c7', '#d7def6', '#f5d2c8', '#d6e4c5',
]);

export function prepareAnswerEvidence(reading, questions) {
  const ranges = new Map();
  const byQuestion = new Map();
  questions.forEach((question, index) => {
    const reference = { questionId: question.id, number: index + 1, color: evidenceColors[index % evidenceColors.length] };
    for (const source of question.evidence ?? []) {
      const paragraph = source.paragraph - 1;
      const range = annotationRange(reading.paragraphs[paragraph], source);
      if (!range) continue;
      if (!ranges.has(paragraph)) ranges.set(paragraph, []);
      ranges.get(paragraph).push({ ...range, ...reference });
      byQuestion.set(question.id, reference);
    }
  });
  return { ranges, byQuestion };
}

// Partition once so overlapping answers, underlines and vocabulary notes never
// duplicate passage text. Offsets keep every mark attached when a page splits.
export function passageSegments(text, { marks = [], evidence = [], offset = 0 } = {}) {
  const last = offset + text.length;
  const boundaries = new Set([offset, last]);
  for (const range of [...marks, ...evidence]) {
    if (range.end <= offset || range.start >= last) continue;
    boundaries.add(Math.max(offset, range.start));
    boundaries.add(Math.min(last, range.end));
  }
  const points = [...boundaries].sort((a, b) => a - b);
  return points.slice(0, -1).map((start, index) => {
    const end = points[index + 1];
    const active = evidence.filter(range => range.start < end && range.end > start);
    return {
      text: text.slice(start - offset, end - offset),
      underlined: marks.some(mark => mark.questionId && mark.start < end && mark.end > start),
      notes: marks.filter(mark => mark.definition && mark.end === end),
      evidence: active,
      labels: active.filter(range => Math.min(range.end, last) === end)
        .filter((range, index, list) => list.findIndex(item => item.questionId === range.questionId) === index),
    };
  });
}

export function evidenceBackground(references) {
  const colors = [...new Set(references.map(reference => reference.color))];
  return colors.length === 1 ? colors[0] : `linear-gradient(to bottom, ${colors.map((color, index) =>
    `${color} ${index * 100 / colors.length}% ${(index + 1) * 100 / colors.length}%`).join(', ')})`;
}
