import { multipleChoice } from './data/question-choices.js';

export const responseModes = ['open', 'choice'];

export function questionMode(reading, question, settings) {
  return multipleChoice(reading, question) && (settings.questionModes?.[question.id] ?? settings.questionMode) === 'choice' ? 'choice' : 'open';
}

export function responseQuestion(reading, question, settings) {
  const alternative = multipleChoice(reading, question);
  const responseMode = questionMode(reading, question, settings);
  if (responseMode === 'open') return { ...question, alternative, responseMode };
  const selected = alternative.options.find(option => option.id === alternative.correct);
  const normalize = text => text.trim().replace(/[.。]$/, '').toLocaleLowerCase(reading.language);
  const explanation = normalize(alternative.explanation) === normalize(selected.text) ? '' : `\n${alternative.explanation}`;
  return { ...question, alternative, responseMode, prompt: alternative.prompt,
    answer: `${selected.id.toUpperCase()}. ${selected.text}${explanation}`,
    evidence: alternative.evidence ?? question.evidence };
}
