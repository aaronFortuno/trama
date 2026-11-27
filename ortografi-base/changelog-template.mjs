import { changelogLabels, releaseGroups } from './changelog.js';

export const escapeHTML = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const closeIcon = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>';
const labels = changelogLabels.ca;

export function renderRelease({ version, date, groups }) {
  for (const type of Object.keys(groups)) {
    if (!releaseGroups.includes(type)) throw new Error(`Categoria del changelog desconeguda: ${type}`);
  }
  return `<article class="of-release">
        <header><h3>${escapeHTML(version)}</h3><time datetime="${date}">${date}</time></header>
        ${releaseGroups.filter(type => groups[type]?.length).map(type => `<section><h4 data-of-changelog="${type}">${labels[type]}</h4><ul>${groups[type].map(item => `<li>${item}</li>`).join('')}</ul></section>`).join('\n        ')}
      </article>`;
}

export function changelogDialog({ id, titleId, project, releases, note = '' }) {
  return `<dialog id="${id}" class="of-dialog of-changelog" data-of-dialog aria-labelledby="${titleId}">
    <div class="of-v4v-heading">
      <div class="of-changelog-heading">
        <h2 id="${titleId}" data-of-changelog="title">${labels.title}</h2>
        <a href="https://github.com/aaronFortuno/${project}/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer"><span data-of-changelog="full">${labels.full}</span> <span aria-hidden="true">↗</span></a>
      </div>
      <button type="button" data-of-close aria-label="${labels.close}" title="${labels.close}">${closeIcon}</button>
    </div>${note ? '\n    ' + note : ''}
    <div class="of-v4v-scroll of-changelog-list" data-of-releases tabindex="0" role="region" aria-labelledby="${titleId}">
      ${releases}
    </div>
  </dialog>`;
}
