export const printMarginLimits = Object.freeze({ min: 8, max: 32, step: 1 });

const textFields = {
  font: ['Tipografia', 'sheetFont'],
  size: ['Cos de lletra', 'sheetSize', 'pt'],
  leading: ['Interlineat', 'sheetLeading', '×'],
  spacing: ['Espaiat', 'sheetSpacing', 'mm'],
};
const marginFields = {
  marginTop: ['Superior', 'sheetMarginTop', 'mm'],
  marginRight: ['Dret', 'sheetMarginRight', 'mm'],
  marginBottom: ['Inferior', 'sheetMarginBottom', 'mm'],
  marginLeft: ['Esquerre', 'sheetMarginLeft', 'mm'],
};

export function printFields(group, controls = {}, { translations = false } = {}) {
  const fields = group === 'margins' ? marginFields : textFields;
  return Object.entries(fields).map(([key, [label, translation, unit]]) => {
    const { name = key, id, options, min, max, step } = controls[key] ?? printMarginLimits;
    const attrs = `name="${name}"${id ? ` id="${id}"` : ''}`;
    const caption = `<span${translations ? ` data-t="${translation}"` : ''}>${label}</span>`;
    if (key === 'font') return `<label class="of-print-field">${caption}<select ${attrs}>${options}</select></label>`;
    return `<label class="of-print-field of-print-range">
      <span class="of-print-label">${caption}<output data-value="${name}"></output></span>
      <input type="range" ${attrs} min="${min}" max="${max}" step="${step}" data-unit="${unit}">
    </label>`;
  }).join('\n');
}

export function syncPrintRange(input, numbers) {
  const text = `${numbers.format(input.valueAsNumber)} ${input.dataset.unit}`;
  const output = input.closest('label')?.querySelector('output');
  if (output) output.value = text;
  input.setAttribute('aria-valuetext', text);
}
