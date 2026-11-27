import { mountDialog } from './dialog.js';

export const licenseText = {
  ca: { title: 'Llicències', close: 'Tanca', code: 'Codi del projecte', contents: 'Continguts originals', credit: 'Creative Commons Reconeixement 4.0 Internacional.', resources: 'Els recursos de tercers tenen les llicències indicades als crèdits.', credits: 'Consulta els crèdits' },
  es: { title: 'Licencias', close: 'Cierra', code: 'Código del proyecto', contents: 'Contenidos originales', credit: 'Creative Commons Reconocimiento 4.0 Internacional.', resources: 'Los recursos de terceros tienen las licencias indicadas en los créditos.', credits: 'Consulta los créditos' },
  gl: { title: 'Licenzas', close: 'Pecha', code: 'Código do proxecto', contents: 'Contidos orixinais', credit: 'Creative Commons Recoñecemento 4.0 Internacional.', resources: 'Os recursos de terceiros teñen as licenzas indicadas nos créditos.', credits: 'Consulta os créditos' },
  eu: { title: 'Lizentziak', close: 'Itxi', code: 'Proiektuaren kodea', contents: 'Jatorrizko edukiak', credit: 'Creative Commons Aitortu 4.0 Nazioartekoa.', resources: 'Hirugarrenen baliabideek kredituetan adierazitako lizentziak dituzte.', credits: 'Ikusi kredituak' },
};

export function mountLicense(dialog, trigger) {
  mountDialog(dialog, trigger, { onOpen() {
    const text = licenseText[document.documentElement.lang] ?? licenseText.ca;
    for (const node of dialog.querySelectorAll('[data-of-license]')) node.textContent = text[node.dataset.ofLicense];
    const close = dialog.querySelector('[data-of-close]');
    close.setAttribute('aria-label', text.close);
    close.title = text.close;
  } });
}
