import { gallerySearchFocusTarget } from './gallery-controls.js?v=0.8.0';

const copy = {
  ca: { filters: 'Filtres', search: 'Cerca per títol o codi', level: 'Curs', type: 'Tipologia', topicType: 'Temàtica', structure: 'Estructura', allLevels: 'Tots els cursos', allTypes: 'Totes les tipologies', allTopics: 'Totes les temàtiques', allStructures: 'Totes les estructures', reset: 'Esborra els filtres', empty: 'Cap resultat amb aquests filtres.', count: n => `${n} de mostra`, title: { trama: 'Lectures', sentit: 'Comprensions orals', 'mon-a-ma': 'Temes', 'fil-i-compte': 'Problemes' }, worksheet: 'Prepara la fitxa', listening: 'Obre la comprensió', topic: 'Obre el tema', solution: 'Detall del solucionari', region: 'Galeria de mostra' },
  es: { filters: 'Filtros', search: 'Busca por título o código', level: 'Curso', type: 'Tipo de texto', allLevels: 'Todos los cursos', allTypes: 'Todos los tipos', reset: 'Borra los filtros', empty: 'Ningún resultado con estos filtros.', count: n => `${n} de muestra`, title: { trama: 'Lecturas', sentit: 'Comprensiones orales' }, worksheet: 'Prepara la ficha', listening: 'Abre la comprensión', region: 'Galería de muestra' },
  gl: { filters: 'Filtros', search: 'Busca por título ou código', level: 'Curso', type: 'Tipoloxía', allLevels: 'Todos os cursos', allTypes: 'Todas as tipoloxías', reset: 'Borra os filtros', empty: 'Non hai resultados con estes filtros.', count: n => `${n} de mostra`, title: { trama: 'Lecturas' }, worksheet: 'Prepara a ficha', region: 'Galería de mostra' },
  eu: { filters: 'Iragazkiak', search: 'Bilatu izenburuaren edo kodearen arabera', level: 'Maila', type: 'Testu mota', allLevels: 'Maila guztiak', allTypes: 'Mota guztiak', reset: 'Garbitu iragazkiak', empty: 'Ez dago emaitzarik iragazki hauekin.', count: n => `${n} adibide`, title: { trama: 'Irakurgaiak' }, worksheet: 'Prestatu fitxa', region: 'Adibideen galeria' },
};
const normalise = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();

export function mountGalleryPreview(gallery) {
  const project = document.body.dataset.project;
  const labels = [...document.querySelectorAll('[data-gallery-label]')];
  const cards = [...gallery.querySelectorAll('[data-sample]')];
  const terms = cards.map(card => normalise(card.querySelector('h2').textContent + ' ' + (card.querySelector('.sample-code')?.textContent ?? card.querySelector('.sample-kicker span:last-child')?.textContent ?? '')));
  const selects = [...gallery.querySelectorAll('[data-filter]')];
  const search = document.querySelector('[data-of-search-panel] input');
  const reset = gallery.querySelector('.sample-reset');
  const empty = gallery.querySelector('.sample-empty');
  const counter = gallery.querySelector('#sample-count');
  const results = gallery.querySelector('.sample-results');
  const disclosure = gallery.querySelector('.sample-sidebar details');
  const compact = matchMedia('(max-width: 790px)');
  let text = copy.ca;

  const setDisclosure = () => { disclosure.open = !compact.matches; };
  compact.addEventListener('change', setDisclosure);
  setDisclosure();

  function filter() {
    let visible = 0;
    const query = normalise(search.value);
    for (const [index, card] of cards.entries()) {
      card.hidden = !terms[index].includes(query) || selects.some(select => select.value && card.dataset[select.dataset.filter] !== select.value);
      if (!card.hidden) visible++;
    }
    reset.hidden = !query && selects.every(select => !select.value);
    empty.hidden = visible !== 0;
    counter.value = text.count(visible);
  }
  search.addEventListener('input', filter);
  for (const select of selects) select.addEventListener('change', filter);
  reset.addEventListener('click', () => {
    search.value = '';
    for (const select of selects) select.value = '';
    gallerySearchFocusTarget(search).focus({ preventScroll: true });
    filter();
  });

  return locale => {
    text = copy[locale] ?? copy.ca;
    for (const node of labels) {
      let key = node.dataset.galleryLabel;
      if (project === 'mon-a-ma' && key === 'type') key = 'topicType';
      if (project === 'mon-a-ma' && key === 'allTypes') key = 'allTopics';
      if (project === 'fil-i-compte' && key === 'type') key = 'structure';
      if (project === 'fil-i-compte' && key === 'allTypes') key = 'allStructures';
      node.textContent = key === 'title' ? text.title[project] : text[key];
    }
    search.placeholder = text.search;
    results.setAttribute('aria-label', text.region);
    filter();
  };
}
