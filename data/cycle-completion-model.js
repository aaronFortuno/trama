import { q } from './family-adaptation-model.js';

// Every distractor is authored. Pairs are [Spanish, Catalan], as in the family model.
export function task(type, lines, prompt, answer, evidence = [], options, correct) {
  return { ...q(type, lines, ...prompt, ...answer, ...evidence),
    ...(options ? { choice: { options, correct } } : {}) };
}

export function completionChoices(adaptations) {
  return adaptations.flatMap(edition => ['es', 'ca'].map((language, locale) => ({
    code: edition.source + edition.suffix, language,
    questions: Object.fromEntries(edition.questions.flatMap((question, index) => question.choice ? [[
      `${edition.source.toLowerCase()}${edition.suffix.toLowerCase()}-q${index + 1}`,
      { prompt: question.prompt[locale], options: question.choice.options.map(pair => pair[locale]), correct: question.choice.correct },
    ]] : [])),
  })));
}
