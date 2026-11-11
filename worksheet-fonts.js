const latin = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const latinExt = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';

function latinFaces(id, weights = ['400 700']) {
  return weights.flatMap(weight => [['latin-ext', latinExt], ['latin', latin]].map(([subset, unicodeRange]) => ({
    file: `${id}-${subset}${weight.includes(' ') ? '' : '-' + weight}.woff2`, weight, unicodeRange,
  })));
}

export const fontGroups = {
  serif: 'Amb serifa',
  sans: 'Sense serifa',
  school: 'Lletra lligada escolar',
};

export const worksheetFonts = {
  serif: { name: 'Georgia', group: 'serif', stack: "Georgia, 'Times New Roman', serif" },
  lora: { name: 'Lora', group: 'serif', stack: 'Lora, Georgia, serif', faces: latinFaces('lora') },
  merriweather: { name: 'Merriweather', group: 'serif', stack: 'Merriweather, Georgia, serif', faces: latinFaces('merriweather') },
  sans: { name: 'Arial', group: 'sans', stack: 'Arial, sans-serif' },
  andika: { name: 'Andika', group: 'sans', stack: 'Andika, Arial, sans-serif', faces: latinFaces('andika', ['400', '700']) },
  lexend: { name: 'Lexend', group: 'sans', stack: 'Lexend, Arial, sans-serif', faces: latinFaces('lexend') },
  massallera: { name: 'Massallera', group: 'school', stack: 'Massallera, cursive', faces: [{ file: 'massallera.ttf', weight: '400' }] },
  mono: { name: 'Courier New', code: 'COURIER', stack: "'Courier New', monospace" },
};

const fontUrl = file => new URL(`assets/fonts/${file}`, import.meta.url);
const fontFormat = file => file.endsWith('.woff2') ? 'woff2' : 'truetype';
const fontSource = (url, file) => `url("${url}") format("${fontFormat(file)}")`;
const loaded = new Map();

export function loadWorksheetFont(id) {
  const { name, faces } = worksheetFonts[id];
  if (!faces) return;
  if (!loaded.has(id)) {
    const fonts = faces.map(({ file, weight, unicodeRange }) => {
      const face = new FontFace(name, fontSource(fontUrl(file), file), { weight, ...(unicodeRange && { unicodeRange }) });
      document.fonts.add(face);
      return face;
    });
    loaded.set(id, Promise.all(fonts.map(face => face.load())).catch(error => {
      fonts.forEach(face => document.fonts.delete(face));
      loaded.delete(id);
      throw error;
    }));
  }
  return loaded.get(id);
}

export async function embeddedFontStyles(ids, dataUrl) {
  const styles = await Promise.all([...new Set(ids)].flatMap(id => {
    const { name, faces = [] } = worksheetFonts[id];
    return faces.map(async ({ file, weight, unicodeRange }) =>
      `@font-face { font-family: "${name}"; font-weight: ${weight}; src: ${fontSource(await dataUrl(fontUrl(file)), file)}; ${unicodeRange ? `unicode-range: ${unicodeRange};` : ''} }`);
  }));
  return styles.join('\n');
}
