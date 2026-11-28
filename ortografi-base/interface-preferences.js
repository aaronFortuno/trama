function readPreference(key) {
  if (!key) return null;
  try { return localStorage.getItem(key); } catch { return null; }
}

function writePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* The choice still applies to the current page. */ }
}

function interfacePreference(key, options, initialKey, firstVisit) {
  const saved = readPreference(key);
  const initial = options.includes(saved) ? saved : readPreference(initialKey);
  let value = options.includes(initial) ? initial : firstVisit();
  if (value !== saved) writePreference(key, value);

  return {
    get value() { return value; },
    set(next) {
      if (!options.includes(next) || next === value) return false;
      value = next;
      writePreference(key, value);
      return true;
    },
  };
}

export function createThemePreference(key, { initialKey } = {}) {
  return interfacePreference(key, ['light', 'dark'], initialKey, () =>
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export function createLanguagePreference(key, supported, { fallback = supported[0], initialKey } = {}) {
  return interfacePreference(key, supported, initialKey, () => {
    const browser = globalThis.navigator;
    for (const tag of [...(browser?.languages ?? []), browser?.language]) {
      const locale = tag?.toLowerCase();
      if (supported.includes(locale)) return locale;
      const base = locale?.split('-')[0];
      if (supported.includes(base)) return base;
    }
    return fallback;
  });
}
