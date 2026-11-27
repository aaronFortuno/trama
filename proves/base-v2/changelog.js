import { mountDialog } from './dialog.js?v=0.5.0';

export const changelogLabels = {
  ca: { title: 'Historial de versions', full: 'Historial complet', close: 'Tanca l’historial', compatibility: 'Compatibilitat', added: 'Novetats', improved: 'Millores', fixed: 'Correccions', materials: 'Materials' },
  es: { title: 'Historial de versiones', full: 'Historial completo', close: 'Cierra el historial', compatibility: 'Compatibilidad', added: 'Novedades', improved: 'Mejoras', fixed: 'Correcciones', materials: 'Materiales' },
  gl: { title: 'Historial de versións', full: 'Historial completo', close: 'Pecha o historial', compatibility: 'Compatibilidade', added: 'Novidades', improved: 'Melloras', fixed: 'Correccións', materials: 'Materiais' },
  eu: { title: 'Bertsioen historia', full: 'Historia osoa', close: 'Itxi historia', compatibility: 'Bateragarritasuna', added: 'Nobedadeak', improved: 'Hobekuntzak', fixed: 'Zuzenketak', materials: 'Materialak' },
};

export const releaseGroups = ['compatibility', 'added', 'improved', 'fixed', 'materials'];

export function mountChangelog(dialog, trigger, { onOpen } = {}) {
  mountDialog(dialog, trigger, { onOpen() {
    const locale = document.documentElement.lang.split('-')[0];
    const messages = changelogLabels[locale] ?? changelogLabels.ca;
    for (const node of dialog.querySelectorAll('[data-of-changelog]')) node.textContent = messages[node.dataset.ofChangelog];
    const close = dialog.querySelector('[data-of-close]');
    close.setAttribute('aria-label', messages.close);
    close.title = messages.close;
    const formatter = new Intl.DateTimeFormat(locale || 'ca', { dateStyle: 'long', timeZone: 'UTC' });
    for (const date of dialog.querySelectorAll('time[datetime]')) date.textContent = formatter.format(new Date(date.dateTime));
    onOpen?.();
  } });
}
