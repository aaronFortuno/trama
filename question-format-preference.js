export const questionFormatPreferenceKey = 'trama.question-format.v1';
export const questionFormatSeenKey = 'trama.question-format-seen.v1';
const valid = value => value === 'open' || value === 'choice';
function browserStorage() { try { return globalThis.localStorage; } catch { return null; } }

export function createQuestionFormatPreference(storage = browserStorage()) {
  let mode = null, seen = false;
  try {
    const stored = storage?.getItem(questionFormatPreferenceKey);
    if (valid(stored)) mode = stored;
    seen = storage?.getItem(questionFormatSeenKey) === '1' || mode !== null;
  } catch { /* Session memory also works without browser storage. */ }
  return {
    mode: () => mode,
    seen: () => seen,
    markSeen() { seen = true; try { storage?.setItem(questionFormatSeenKey, '1'); } catch { /* Keep it seen this session. */ } },
    set(value) {
      if (!valid(value)) throw Error('Unknown question format');
      mode = value; this.markSeen();
      try { storage?.setItem(questionFormatPreferenceKey, value); } catch { /* Keep the session choice. */ }
    },
    clear() {
      mode = null; seen = false;
      try { storage?.removeItem(questionFormatPreferenceKey); storage?.removeItem(questionFormatSeenKey); } catch { /* Keep session memory. */ }
    },
    apply(settings) { return mode ? { ...settings, questionMode: mode } : settings; },
  };
}

export const questionFormatPreference = createQuestionFormatPreference();
