// Update the local changelog and both interface languages. No network or Git.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { changelogLabels, releaseGroups } from '../ortografi-base/changelog.js';
import { escapeHTML, renderRelease } from '../ortografi-base/changelog-template.mjs';
import { checkVersion, nextVersion } from '../ortografi-base/release-version.mjs';

function readFooter(html) {
  const button = /<button\b[^>]*\bid="changelog-open"[^>]*>[\s\S]*?<\/button>/.exec(html)?.[0];
  assert(button);
  const version = /aria-label="v([\d.]+) · Obre l’historial de canvis"/.exec(button)?.[1];
  assert(version);
  return { button, version };
}

export function checkMaterialRelease(version) {
  const current = readFooter(fs.readFileSync('index.html', 'utf8')).version;
  if (version !== current) checkVersion(current, version, { kind: 'patch' });
}

export function nextMaterialRelease() {
  return nextVersion(readFooter(fs.readFileSync('index.html', 'utf8')).version, 'patch');
}

export function recordRelease({ version, date, ca, es, kind = 'patch', reason, changes = { materials: [{ ca, es }] } }) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(date));
  const releaseDate = new Date(date + 'T12:00:00Z');
  assert.equal(releaseDate.toISOString().slice(0, 10), date);
  const groups = releaseGroups.filter(type => changes[type]?.length);
  assert(groups.length && Object.keys(changes).every(type => releaseGroups.includes(type)));
  for (const type of groups) {
    assert(Array.isArray(changes[type]));
    for (const item of changes[type]) assert(item.ca?.trim() && item.es?.trim() && !/[|`\r\n]/.test(item.ca + item.es));
  }
  const edition = `v${version}`;
  let html = fs.readFileSync('index.html', 'utf8');
  const { button: footerButton, version: currentVersion } = readFooter(html);
  const current = `v${currentVersion}`;
  if (current === edition) return;
  checkVersion(current.slice(1), version, { kind, reason });
  assert(!html.includes(`<h3>${edition}</h3>`));
  const marker = '<div class="of-v4v-scroll of-changelog-list" data-of-releases tabindex="0" role="region" aria-labelledby="changelog-title">';
  assert(html.includes(marker));
  const dateText = new Intl.DateTimeFormat('ca', { dateStyle: 'long', timeZone: 'UTC' }).format(releaseDate);
  assert(footerButton.includes(`>${current}<`));
  const newFooterButton = footerButton.replace(`aria-label="${current} ·`, `aria-label="${edition} ·`).replace(`>${current}<`, `>${edition}<`);
  html = html.replace(footerButton, newFooterButton);
  const items = Object.fromEntries(groups.map(type => [type, changes[type].map(item => escapeHTML(item.ca))]));
  const entry = renderRelease({ version: edition, date, groups: items }).replace(`>${date}</time>`, `>${dateText}</time>`);
  html = html.replace(marker, () => marker + '\n      ' + entry);
  const notes = groups.map(type => `### ${changelogLabels.ca[type]}\n\n${changes[type].map(item => `- ${item.ca}`).join('\n')}`).join('\n\n');
  const history = fs.readFileSync('CHANGELOG.md', 'utf8').replace(/^# Historial de Trama\r?\n/, () => `# Historial de Trama\n\n## ${version} · ${dateText}\n\n${notes}\n`);
  const prefix = 'export const es = Object.fromEntries(' + String.fromCharCode(96);
  const dictionary = fs.readFileSync('locales/es.js', 'utf8');
  assert(dictionary.startsWith(prefix));
  const translations = groups.flatMap(type => changes[type].map(item => `${item.ca}|${item.es}`)).join('\n');
  fs.writeFileSync('index.html', html);
  fs.writeFileSync('CHANGELOG.md', history);
  fs.writeFileSync('locales/es.js', dictionary.replace(prefix, () => prefix + `\n${edition} · Obre l’historial de canvis|${edition} · Abrir el historial de cambios\n${translations}`));
}
