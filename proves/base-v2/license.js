import { mountDialog } from './dialog.js?v=0.10.0';

export const licenseText = {
  ca: { title: 'Llicències', close: 'Tanca', code: 'Codi del projecte', contents: 'Continguts originals', credit: 'Creative Commons Reconeixement 4.0 Internacional.', resources: 'Els recursos de tercers tenen les llicències indicades als crèdits.', credits: 'Consulta els crèdits',
    mitSummary: 'Pots reutilitzar, modificar i distribuir el codi si conserves l’avís de copyright i el text de la llicència.',
    ccSummary: 'Pots compartir i adaptar els materials si reconeixes l’autoria, enllaces la llicència i indiques els canvis.',
    englishText: 'Text legal en anglès',
    projectFile: 'Fitxer de llicència',
    officialText: 'Text oficial',
    projectScope: 'Abast al projecte',
  },
  es: { title: 'Licencias', close: 'Cierra', code: 'Código del proyecto', contents: 'Contenidos originales', credit: 'Creative Commons Reconocimiento 4.0 Internacional.', resources: 'Los recursos de terceros tienen las licencias indicadas en los créditos.', credits: 'Consulta los créditos',
    mitSummary: 'Puedes reutilizar, modificar y distribuir el código si conservas el aviso de copyright y el texto de la licencia.',
    ccSummary: 'Puedes compartir y adaptar los materiales si reconoces la autoría, enlazas la licencia e indicas los cambios.',
    englishText: 'Texto legal en inglés',
    projectFile: 'Archivo de licencia',
    officialText: 'Texto oficial',
    projectScope: 'Alcance en el proyecto',
  },
  gl: { title: 'Licenzas', close: 'Pecha', code: 'Código do proxecto', contents: 'Contidos orixinais', credit: 'Creative Commons Recoñecemento 4.0 Internacional.', resources: 'Os recursos de terceiros teñen as licenzas indicadas nos créditos.', credits: 'Consulta os créditos',
    mitSummary: 'Podes reutilizar, modificar e distribuír o código se conservas o aviso de copyright e o texto da licenza.',
    ccSummary: 'Podes compartir e adaptar os materiais se recoñeces a autoría, enlazas a licenza e indicas os cambios.',
    englishText: 'Texto legal en inglés',
    projectFile: 'Ficheiro da licenza',
    officialText: 'Texto oficial',
    projectScope: 'Alcance no proxecto',
  },
  eu: { title: 'Lizentziak', close: 'Itxi', code: 'Proiektuaren kodea', contents: 'Jatorrizko edukiak', credit: 'Creative Commons Aitortu 4.0 Nazioartekoa.', resources: 'Hirugarrenen baliabideek kredituetan adierazitako lizentziak dituzte.', credits: 'Ikusi kredituak',
    mitSummary: 'Kodea berrerabili, aldatu eta banatu dezakezu copyright-oharra eta lizentziaren testua gordetzen badituzu.',
    ccSummary: 'Materialak partekatu eta moldatu ditzakezu egiletza aitortzen baduzu, lizentziarako esteka jartzen baduzu eta aldaketak adierazten badituzu.',
    englishText: 'Lege-testua ingelesez',
    projectFile: 'Lizentziaren fitxategia',
    officialText: 'Testu ofiziala',
    projectScope: 'Proiektuko esparrua',
  },
};

export function mountLicense(dialog, trigger) {
  const list = dialog.querySelector('.of-license-tabs');
  const tabs = Array.from(list?.querySelectorAll('[role="tab"]') ?? []);
  const panels = tabs.map(tab => dialog.querySelector(`#${tab.getAttribute('aria-controls')}`));

  function select(index) {
    for (const [position, tab] of tabs.entries()) {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    }
    const legal = panels[index]?.querySelector('.of-license-legal');
    if (legal) legal.scrollTop = 0;
  }

  for (const [index, tab] of tabs.entries()) {
    tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-selected') !== 'true') select(index);
    });
    tab.addEventListener('keydown', event => {
      const last = tabs.length - 1;
      const indexByKey = { ArrowLeft: index === 0 ? last : index - 1, ArrowRight: index === last ? 0 : index + 1, Home: 0, End: last };
      const next = indexByKey[event.key];
      if (next === undefined) return;
      event.preventDefault();
      if (next !== index) select(next);
      tabs[next].focus();
    });
  }

  mountDialog(dialog, trigger, { onOpen() {
    const text = licenseText[document.documentElement.lang.split('-')[0]] ?? licenseText.ca;
    for (const node of dialog.querySelectorAll('[data-of-license]')) node.textContent = text[node.dataset.ofLicense];
    const close = dialog.querySelector('[data-of-close]');
    close.setAttribute('aria-label', text.close);
    close.title = text.close;
    select(0);
  } });
}
