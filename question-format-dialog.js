import { questionFormatPreference } from './question-format-preference.js';
import { closeDialog, openDialog } from './motion.js';
import { language, t } from './i18n.js';

export function mountQuestionFormatDialog({ onChoose }) {
  const dialog = document.querySelector('#question-format-dialog');
  let pending = false;
  function translate() {
    for (const image of dialog.querySelectorAll('[data-response-sample]')) {
      image.src = `assets/examples/question-format-${image.dataset.responseSample}-${language()}.webp`;
      image.lang = language();
      image.alt = t(image.dataset.responseSample === 'open'
        ? 'Retall d’una pregunta del full imprimible amb línies per escriure la resposta.'
        : 'La mateixa pregunta amb quatre opcions ABCD i caselles sense marcar.');
    }
  }
  function show() {
    translate(); questionFormatPreference.markSeen(); openDialog(dialog);
    dialog.querySelector('.dialog-scroll').scrollTop = 0;
    dialog.querySelector('[data-preference-mode="open"]').focus({ preventScroll: true });
  }
  for (const button of dialog.querySelectorAll('[data-preference-mode]')) button.addEventListener('click', () => {
    const mode = button.dataset.preferenceMode;
    questionFormatPreference.set(mode); onChoose(mode); closeDialog(dialog);
  });
  return {
    translate,
    maybeShow() {
      if (questionFormatPreference.seen() || pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; if (!document.querySelector('#studio').hidden && !questionFormatPreference.seen()) show(); });
    },
    reopen() { questionFormatPreference.clear(); show(); },
    close() { if (dialog.open) closeDialog(dialog); },
  };
}
