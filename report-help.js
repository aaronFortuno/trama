import { allowAnalytics, startAnalytics } from './analytics.js';
import { t } from './i18n.js';
import { setDisclosure } from './motion.js';

const messages = {
  local: 'Els avisos només es poden enviar des del web públic.',
  gpc: 'Global Privacy Control (GPC) està actiu. Trama respecta aquest senyal i els avisos queden desactivats.',
  dnt: 'Do Not Track està actiu. Trama respecta aquest senyal i els avisos queden desactivats.',
  disabled: 'Umami està desactivat per a Trama en aquest navegador. Els avisos queden desactivats.',
  loading: 'S’està comprovant la connexió amb Umami…',
  script: 'Umami no s’ha pogut carregar. Els avisos queden desactivats.',
  receiver: 'Umami no ha confirmat la recepció de l’avís.',
};

const browserGuides = {
  brave: {
    shields: 'A Brave, obre la icona del lleó a la barra d’adreces. Als controls avançats, desactiva el bloqueig de rastrejadors i anuncis només per a trama.ortogra.fi.',
    source: 'https://support.brave.app/hc/en-us/articles/360023646212-How-do-I-configure-global-and-site-specific-Shields-settings',
  },
  firefox: {
    shields: 'A Firefox, obre l’escut al costat de l’adreça i permet una excepció a la protecció contra el seguiment només per a Trama.',
    source: 'https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop',
  },
  edge: {
    shields: 'A Edge, obre els ajustos de prevenció del seguiment i afegeix trama.ortogra.fi a les excepcions.',
    source: 'https://learn.microsoft.com/en-us/microsoft-edge/web-platform/tracking-prevention#exceptions',
  },
};

const helpLink = `<button type="button" class="studio-text-button report-help-link" data-report-help aria-expanded="false" aria-controls="report-delivery-guide">Com permetre els avisos</button>`;
export const reportWarningMarkup = `
  <div class="report-warning" hidden>
    <p id="report-delivery-warning" role="status"></p>
    ${helpLink}
  </div>
  <section class="report-delivery-guide" id="report-delivery-guide" aria-labelledby="report-guide-title" hidden>
    <h3 id="report-guide-title" tabindex="-1">Com permetre els avisos</h3>
    <div data-report-instructions></div>
    <div class="report-guide-actions">
      <a data-report-source target="_blank" rel="noopener noreferrer" hidden>Ajuda del navegador ↗</a>
      <a href="https://trama.ortogra.fi/" data-report-public hidden>Obre Trama ↗</a>
      <button class="button" type="button" data-report-recheck hidden>Torna a comprovar</button>
      <button class="button" type="button" data-report-allow hidden>Permet Umami a Trama</button>
    </div>
  </section>`;
export const reportSubmitHelpMarkup = `
  <div class="report-submit-help" hidden>
    <p></p>
    ${helpLink}
  </div>`;

function guide(reason) {
  const ua = navigator.userAgent;
  const browser = navigator.brave || /Brave\//.test(ua) ? 'brave' :
    /Firefox|FxiOS/.test(ua) ? 'firefox' : /Edg\/|EdgA\/|EdgiOS\//.test(ua) ? 'edge' : '';
  if (reason === 'local') return [['Obre la lectura a trama.ortogra.fi per enviar l’avís.']];
  if (reason === 'disabled') return [['Si vols tornar a activar Umami per a Trama en aquest navegador, prem «Permet Umami a Trama».']];
  if (reason === 'gpc') {
    let step = 'Si vols canviar aquest senyal, busca Global Privacy Control als ajustos de privadesa del navegador.';
    let source;
    if (browser === 'brave') {
      const ios = /iPhone|iPad|iPod/.test(ua) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
      step = ios ? 'A Brave per a iOS, obre Configuració → Brave Shields i privadesa → Global Privacy Control.' :
        'A Brave, obre brave://flags/#brave-global-privacy-control-enabled a la barra d’adreces, tria «Disabled» i reinicia el navegador.';
      source = 'https://support.brave.app/hc/en-us/articles/360017989132-How-do-I-change-my-Privacy-Settings#disabling-global-privacy-control';
    } else if (browser === 'firefox') {
      source = 'https://support.mozilla.org/en-US/kb/global-privacy-control#w_disable-global-privacy-control';
    }
    return [[step, 'Aquest canvi pot afectar altres webs. Recarrega Trama després del canvi.'], source];
  }
  if (reason === 'dnt') return [
    ['Si vols canviar aquest senyal, busca Do Not Track als ajustos de privadesa del navegador. Aquest canvi pot afectar altres webs. Recarrega Trama després del canvi.'],
    browser === 'brave' ? 'https://support.brave.app/hc/en-us/articles/360017905612-How-do-I-turn-Do-Not-Track-on-or-off' : '',
  ];
  const settings = browserGuides[browser];
  const blocker = 'Si fas servir una extensió de bloqueig, obre’n el menú i permet Umami només a trama.ortogra.fi.';
  const next = reason === 'receiver' ? 'Revisa la connexió i torna a prémer «Envia l’avís».' :
    'Després, prem «Torna a comprovar». Si el navegador et demana que recarreguis la pàgina, torna a obrir el formulari.';
  return [[settings?.shields, blocker, next].filter(Boolean), settings?.source];
}

export function mountReportHelp(dialog) {
  const warning = dialog.querySelector('.report-warning');
  const message = warning.querySelector('p');
  const helper = dialog.querySelector('.report-submit-help');
  const helperMessage = helper.querySelector('p');
  const submit = dialog.querySelector('[type="submit"]');
  const panel = dialog.querySelector('.report-delivery-guide');
  const heading = panel.querySelector('h3');
  const instructions = panel.querySelector('[data-report-instructions]');
  const links = dialog.querySelectorAll('[data-report-help]');
  const source = panel.querySelector('[data-report-source]');
  const publicSite = panel.querySelector('[data-report-public]');
  const recheck = panel.querySelector('[data-report-recheck]');
  const allow = panel.querySelector('[data-report-allow]');
  let open = false;

  function setOpen(expanded, animated = true) {
    open = expanded;
    for (const link of links) link.setAttribute('aria-expanded', String(open));
    setDisclosure(panel, open, { animated });
  }

  for (const link of links) link.addEventListener('click', () => {
    setOpen(!open);
    if (open) {
      heading.focus({ preventScroll: true });
      panel.scrollIntoView({ block: 'nearest' });
    }
  });
  recheck.addEventListener('click', startAnalytics);
  allow.addEventListener('click', allowAnalytics);

  return {
    reset() { setOpen(false, false); },
    update(reason) {
      const canHelp = Boolean(reason && reason !== 'loading');
      warning.hidden = !reason;
      warning.dataset.loading = String(reason === 'loading');
      const notice = reason ? t(messages[reason]) : '';
      if (message.textContent !== notice) {
        message.textContent = notice;
        helperMessage.textContent = notice;
      }
      links[0].hidden = !canHelp;
      helper.hidden = !canHelp;
      if (reason) submit.setAttribute('aria-describedby', message.id);
      else submit.removeAttribute('aria-describedby');
      if (!reason) {
        if (open && panel.contains(document.activeElement)) {
          (submit.disabled ? dialog.querySelector('[name="part"] + .select-trigger, select[name="part"]:not([hidden])') : submit)?.focus({ preventScroll: true });
        }
        setOpen(false);
        return;
      }
      if (reason === 'loading') {
        recheck.disabled = true;
        return;
      }
      const [steps, documentation] = guide(reason);
      instructions.replaceChildren(...steps.map(step => {
        const paragraph = document.createElement('p');
        paragraph.textContent = t(step);
        return paragraph;
      }));
      if (documentation) source.href = documentation;
      else source.removeAttribute('href');
      source.hidden = !documentation;
      publicSite.hidden = reason !== 'local';
      allow.hidden = reason !== 'disabled';
      recheck.hidden = reason !== 'script';
      recheck.disabled = false;
    },
  };
}
