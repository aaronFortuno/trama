import { reportAvailability, reportReasons, sendReadingReport } from './analytics.js';
import { icon } from './icons.js';
import { t } from './i18n.js';
import { openDialog } from './motion.js';
import { mountReportHelp, reportSubmitHelpMarkup, reportWarningMarkup } from './report-help.js';
import { syncSelects } from './select-menu.js';

const parts = { text: 'Text de la lectura', image: 'Imatge', question: 'Pregunta', solution: 'Solucionari' };

export const readingReportMarkup = `
  <dialog class="site-dialog report-dialog" id="reading-report-dialog" aria-labelledby="reading-report-title" aria-describedby="reading-report-context">
    <header class="dialog-heading">
      <div>
        <h2 id="reading-report-title" tabindex="-1">Notifica un error</h2>
        <p id="reading-report-context"></p>
      </div>
      <button class="button close-button" type="button" data-close-dialog aria-label="Tanca">${icon('x')}</button>
    </header>
    <form class="dialog-scroll report-form">
      ${reportWarningMarkup}
      <fieldset class="report-fields" aria-label="Detalls de l’avís">
        <label>Part afectada <select name="part" required></select></label>
        <label hidden>Element <select name="element"></select></label>
        <fieldset class="report-reasons" hidden>
          <legend>Motiu</legend>
          <div class="report-reason-options"></div>
        </fieldset>
      </fieldset>
      <p class="report-note">L’avís inclou el codi de la lectura, la llengua, la part afectada i el motiu.</p>
      <p class="report-status" role="status"></p>
      <div class="report-actions">
        <button class="button" type="button" data-close-dialog>Cancel·la</button>
        <div class="report-submit-wrap">
          <button class="button primary" type="submit" disabled>Envia l’avís</button>
          ${reportSubmitHelpMarkup}
        </div>
      </div>
    </form>
  </dialog>`;

export function mountReadingReport(dialog) {
  const heading = dialog.querySelector('h2');
  const context = dialog.querySelector('#reading-report-context');
  const form = dialog.querySelector('form');
  const fields = form.querySelector('.report-fields');
  const partField = form.elements.part;
  const elementField = form.elements.element;
  const reasons = form.querySelector('.report-reasons');
  const options = form.querySelector('.report-reason-options');
  const status = form.querySelector('.report-status');
  const submit = form.querySelector('[type="submit"]');
  const cancel = form.querySelector('.report-actions [data-close-dialog]');
  const help = mountReportHelp(dialog);
  let active;
  let deliveryFailed = false;

  function updateAvailability() {
    help.update(reportAvailability() || (deliveryFailed ? 'receiver' : ''));
  }

  for (const event of ['trama-analytics-change', 'focus', 'storage']) {
    window.addEventListener(event, () => { if (dialog.open) updateAvailability(); });
  }

  function targetsFor(part) {
    const { reading, questions } = active;
    if (part === 'text') return reading.paragraphs.map((_, index) =>
      new Option(t('Paràgraf {number}', { number: index + 1 }), String(index + 1)));
    if (part === 'image') return reading.images.map((image, index) =>
      new Option(t('Imatge {number}', { number: index + 1 }), image.id));
    return questions.flatMap((question, index) => (
      part === 'solution' && !question.answer ? [] :
        [new Option(t('Pregunta {number}', { number: index + 1 }), question.id)]
    ));
  }

  function updateSubmit() {
    submit.disabled = fields.disabled || !partField.value || !options.querySelector(':checked') ||
      (elementField.required && !elementField.value);
  }

  function updatePart(element = '') {
    const part = partField.value;
    const targets = part ? targetsFor(part) : [];
    const label = part === 'text' ? 'Tot el text' : 'Tria un element';
    elementField.replaceChildren(new Option(t(label), ''), ...targets);
    elementField.required = Boolean(part && part !== 'text');
    elementField.closest('label').hidden = !part;
    if (part !== 'text' && targets.length === 1) elementField.selectedIndex = 1;
    if (element && targets.some(option => option.value === element)) elementField.value = element;

    options.replaceChildren(...Object.entries(reportReasons[part] ?? {}).map(([value, message]) => {
      const label = document.createElement('label');
      const control = document.createElement('input');
      control.type = 'radio';
      control.name = 'motiu';
      control.value = value;
      label.append(control, t(message));
      return label;
    }));
    reasons.hidden = !part;
    syncSelects(dialog);
    updateSubmit();
  }

  form.addEventListener('change', event => {
    status.textContent = '';
    if (event.target === partField) updatePart();
    else updateSubmit();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!active || submit.disabled) return;
    const blocked = reportAvailability();
    if (blocked) {
      if (blocked !== 'loading') status.textContent = t('No s’ha pogut enviar l’avís.');
      updateAvailability();
      return;
    }
    const current = active;
    const data = Object.fromEntries(new FormData(form));
    fields.disabled = true;
    syncSelects(dialog);
    updateSubmit();
    status.textContent = t('Enviant l’avís…');
    const sent = await sendReadingReport(current.reading, data);
    deliveryFailed = !sent;
    if (active !== current || !dialog.open || dialog.classList.contains('is-closing')) return;
    updateAvailability();
    if (sent) {
      status.textContent = t('Avís enviat. Gràcies!');
      cancel.textContent = t('Tanca');
    } else {
      fields.disabled = false;
      syncSelects(dialog);
      status.textContent = t('No s’ha pogut enviar l’avís.');
      updateSubmit();
    }
  });

  return {
    open(reading, questions, { part, element }) {
      active = { reading, questions };
      help.reset();
      updateAvailability();
      fields.disabled = false;
      status.textContent = '';
      cancel.textContent = t('Cancel·la');
      context.textContent = `${reading.code}-${reading.language.toUpperCase()} · ${reading.title}`;
      context.lang = reading.language;
      const available = {
        text: true, image: reading.images.length > 0, question: questions.length > 0,
        solution: questions.some(question => question.answer),
      };
      partField.replaceChildren(new Option(t('Tria una part'), ''), ...Object.entries(parts)
        .filter(([value]) => available[value]).map(([value, label]) => new Option(t(label), value)));
      partField.value = available[part] ? part : '';
      updatePart(element);
      openDialog(dialog);
      form.scrollTop = 0;
      heading.focus({ preventScroll: true });
    },
    close() {
      active = undefined;
      if (dialog.open) dialog.close();
    },
  };
}
