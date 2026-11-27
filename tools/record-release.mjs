// Update the local changelog and both interface languages. No network or Git.
import assert from 'node:assert/strict';
import fs from 'node:fs';

export function recordRelease({ version, date, ca, es }) {
  assert(/^\d+\.\d+(?:\.\d+)?$/.test(version));
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date));
  assert(ca && es && !/[|`]/.test(ca + es));
  const edition = `v${version}`;
  let html = fs.readFileSync('index.html', 'utf8');
  const footerButton = /<button\b[^>]*\bid="changelog-open"[^>]*>[\s\S]*?<\/button>/.exec(html)?.[0];
  assert(footerButton);
  const current = /aria-label="(v[\d.]+) · Obre l’historial de canvis"/.exec(footerButton)?.[1];
  assert(current);
  if (current === edition) return;
  const next = version.split('.').map(Number), previous = current.slice(1).split('.').map(Number);
  assert([0, 1, 2].map(i => (next[i] ?? 0) - (previous[i] ?? 0)).find(n => n !== 0) > 0);
  assert(!html.includes(`<h3>${edition}</h3>`));
  const marker = '<div class="dialog-scroll" tabindex="0" role="region" aria-labelledby="changelog-title">';
  assert(html.includes(marker));
  const dateText = new Intl.DateTimeFormat('ca', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  assert(footerButton.includes(`>${current}<`));
  const newFooterButton = footerButton.replace(`aria-label="${current} ·`, `aria-label="${edition} ·`).replace(`>${current}<`, `>${edition}<`);
  html = html.replace(footerButton, newFooterButton);
  html = html.replace(marker, marker + `\n      <article class="release">\n        <header><h3>${edition}</h3><time datetime="${date}">${dateText}</time></header>\n        <p>${escape(ca)}</p>\n      </article>`);
  fs.writeFileSync('index.html', html);
  fs.writeFileSync('CHANGELOG.md', fs.readFileSync('CHANGELOG.md', 'utf8').replace(/^# Historial de Trama\r?\n/, `# Historial de Trama\n\n## ${version} · ${dateText}\n\n${ca}\n`));
  const prefix = 'export const es = Object.fromEntries(' + String.fromCharCode(96);
  const dictionary = fs.readFileSync('locales/es.js', 'utf8');
  assert(dictionary.startsWith(prefix));
  fs.writeFileSync('locales/es.js', dictionary.replace(prefix, prefix + `\n${edition} · Obre l’historial de canvis|${edition} · Abrir el historial de cambios\n${ca}|${es}`));
}
