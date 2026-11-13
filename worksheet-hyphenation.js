import createHyphenator from './assets/vendor/hyphen/hyphen.js';
import catalan from './assets/vendor/hyphen/patterns-ca.js';
import spanish from './assets/vendor/hyphen/patterns-es.js';

const softHyphen = '\u00ad';
const hyphenators = new Map([
  ['ca', createHyphenator(catalan, { minWordLength: 8, html: false })],
  ['es', createHyphenator(spanish, { minWordLength: 8, html: false })],
]);
const baseLanguage = language => language.toLowerCase().split('-')[0];

export const supportsHyphenation = language => hyphenators.has(baseLanguage(language));

export function withHyphenation(text, language) {
  const hyphenate = hyphenators.get(baseLanguage(language));
  if (!hyphenate) return text;
  return text.replace(/\S+/gu, token => {
    // Keep URLs, abbreviations, compounds and words with elisions intact.
    const match = /^(\p{P}*)(\p{L}[\p{L}\p{M}·]{7,})(\p{P}*)$/u.exec(token);
    if (!match) return token;
    const [, before, word, after] = match;
    if (word === word.toUpperCase()) return token;
    const parts = hyphenate(word.normalize('NFC')).split(softHyphen);
    if (parts.length === 1 || parts.join('') !== word) return token;
    let offset = 0;
    return before + parts.map((part, index) => {
      offset += part.length;
      const isAllowed = offset >= 3 && offset <= word.length - 3
        && word[offset - 1] !== '·' && word[offset] !== '·';
      return index < parts.length - 1 && isAllowed ? part + softHyphen : part;
    }).join('') + after;
  });
}
