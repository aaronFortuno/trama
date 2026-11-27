import fs from 'node:fs';
import assert from 'node:assert/strict';
import { readings } from '../data/readings.js';
import { families } from '../data/families.js';
import { universes } from '../data/universes.js';
import { indexCatalog, filterCatalog, labels } from '../catalog.js';
import { groupFamilyCards } from '../reading-families.js';

const catalog = indexCatalog(readings.filter(reading => reading.language === 'ca'));
const levels = ['primary-cycle-1','primary-cycle-2','primary-cycle-3','secondary-cycle-1'];
const bands = ['initial','intermediate','advanced'];
const edition = /id="changelog-open"[^>]*aria-label="(v[\d.]+) /.exec(fs.readFileSync('index.html','utf8'))?.[1] ?? 'v1.65.1';
const unique = values => new Set(values).size;
const summarize = entries => ({ proposals:groupFamilyCards(entries).length, editions:entries.length,
  families:unique(entries.map(({reading})=>reading.familyId).filter(Boolean)) });
const matrix = facets => Object.fromEntries(levels.map(level=>[level,{
  ...summarize(filterCatalog(catalog,{...facets,level})),
  difficulties:Object.fromEntries(bands.map(difficulty=>[difficulty,summarize(filterCatalog(catalog,{...facets,level,difficulty}))])),
}]));
const report = {
  date:'2026-11-27', edition, classificationVersion:2,
  totals:{ ...summarize(catalog), languageEditions:readings.length, languages:['ca','es'],
    standalones:catalog.filter(({reading})=>!reading.familyId).length,
    universes:universes.length, universeProposals:groupFamilyCards(catalog.filter(({reading})=>reading.universeIds?.length)).length,
  },
  levels:matrix({}),
  universes:universes.map(world=>({id:world.id,name:world.name.ca,
    ...summarize(filterCatalog(catalog,{universe:world.id})),levels:matrix({universe:world.id})})),
  genres:Object.fromEntries(Object.entries(labels.genre).map(([genre,label])=>[genre,{label,...summarize(filterCatalog(catalog,{genre}))}])),
};
assert.equal(report.totals.families,families.length);
assert.equal(report.totals.editions*2,report.totals.languageEditions);
for(const reading of readings.filter(reading=>reading.language==='ca')) {
  const other = readings.find(entry=>entry.code===reading.code&&entry.language==='es');
  assert(other,`${reading.code}: missing Spanish edition`);
}
if(process.argv.includes('--write')) {
  fs.writeFileSync('docs/catalogue-balance.json',JSON.stringify(report,null,2)+'\n');
  const rows = levels.map(level=>`| ${labels.level[level]} | ${bands.map(band=>report.levels[level].difficulties[band].proposals).join(' | ')} | ${report.levels[level].proposals} |`);
  const worlds = report.universes.map(world=>`| ${world.name} | ${levels.map(level=>world.levels[level].proposals||'—').join(' | ')} | ${world.families}/15 |`);
  const detail = report.universes.flatMap(world=>[
    `\n## ${world.name}\n`, '| Cicle o etapa | Inicial | Intermèdia | Avançada |','| --- | ---: | ---: | ---: |',
    ...levels.filter(level=>world.levels[level].proposals).map(level=>`| ${labels.level[level]} | ${bands.map(band=>world.levels[level].difficulties[band].proposals).join(' | ')} |`),
  ]);
  const text = ['# Balanç del catàleg per cicles', `\nFotografia del 27 de novembre del 2026, versió ${edition}. Generada amb \`node tools/catalogue-balance.mjs --write\`.\n`,
    `${report.totals.proposals} històries diferents, ${report.totals.editions} fitxes graduades per idioma, ${report.totals.languageEditions} versions lingüístiques, ${families.length} famílies amb variants i ${report.totals.standalones} històries sense variants. Tot el catàleg està disponible en català i castellà.`,
    '\nCada casella compta una història una sola vegada, agrupant família i sense duplicar idiomes. Els totals de fila també dedupliquen famílies: no són necessàriament la suma de dificultats. Una família pot aparèixer en diversos cicles.\n',
    '| Cicle o etapa | Inicial | Intermèdia | Avançada | Històries diferents |','| --- | ---: | ---: | ---: | ---: |',...rows,
    '\n## Universos\n','| Univers | Primer cicle primària | Segon cicle primària | Tercer cicle primària | Primer cicle ESO | Amb variants |','| --- | ---: | ---: | ---: | ---: | ---: |',...worlds,
    '\nEls cinc universos tenen quinze històries cadascun. Els zeros indiquen absència en aquell tram, no una obligació de cobrir tots els universos en tots els cicles. Les 28 lectures de primer cicle de primària, originades com a 2n inicial, s’ubiquen a intermèdia de cicle. A ESO el primer cicle agrupa 1r i 2n.\n',
    ...detail,
    '\n## Lectura editorial del balanç\n',
    '- Segon cicle avançat és el bloc general amb menys marge. Cal completar-lo amb exigència real després de la revisió, sense promocionar peces només per omplir una quota.',
    '- Primer cicle de primària conserva 28 propostes intermèdies. Les variants inicials i avançades es completen sobre les mateixes històries, amb objectiu de quinze propostes per franja.',
    '- Els blocs d’univers es concentren en inicial/intermedi. Val la pena prioritzar variants exigents de mons existents abans d’afegir històries desconnectades.',
    '- Article d’opinió, ressenya i notícia continuen sent els gèneres menys abundants; adaptar peces existents pot reforçar diversitat i DUA alhora.',
    '\nEls criteris i el límit de la revisió independent es documenten a [cycle-classification.md](cycle-classification.md). El fitxer [catalogue-balance.json](catalogue-balance.json) conserva recomptes de fitxes i famílies per a una anàlisi posterior.\n',
  ].join('\n');
  fs.writeFileSync('docs/catalogue-balance.md',text);
}
console.log(JSON.stringify({totals:report.totals,levels:Object.fromEntries(levels.map(level=>[level,
  Object.fromEntries(bands.map(band=>[band,report.levels[level].difficulties[band].proposals]))]))}));
