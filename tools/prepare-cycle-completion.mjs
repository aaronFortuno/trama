// Records only a file whose final hash has been approved by an independent reviewer.
// It prepares local data and manifests; it never commits or publishes to GitHub.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const option=name=>process.argv.find(arg=>arg.startsWith(`--${name}=`))?.slice(name.length+3);
const id=option('batch'), version=option('version'), reviewer=option('reviewer'), expected=option('sha');
const exportsByBatch={'early-pilot':'earlyPilot','early-2':'earlySecond','early-3':'earlyThird','early-4':'earlyFourth','observatory':'observatoryCompletion'};
assert(Object.hasOwn(exportsByBatch,id),'Unknown batch');
assert(/^\d+\.\d+(?:\.\d+)?$/.test(version??''));
assert(reviewer&&reviewer!=='root');assert(/^[a-f\d]{64}$/i.test(expected??''));
const source=`data/cycle-completion/${id}.js`;
const hash=value=>createHash('sha256').update(value).digest('hex');
assert.equal(hash(fs.readFileSync(source,'utf8').replace(/\r\n/g,'\n')),expected.toLowerCase(),'The approved source changed: ask for independent revalidation');
const {cyclePublications}=await import('../data/cycle-completion-published.js');

if(!process.argv.includes('--record')){
  assert(!cyclePublications.some(batch=>batch.id===id),'Batch already registered');
  const specs=[...cyclePublications.map(({adaptations,...spec})=>spec),{id,edition:`v${version}`,date:'2026-11-27',reviewer,source,sha256:expected.toLowerCase()}];
  const code='// Published only after independent review of each language and response format.\n'
    +specs.map(spec=>`import { ${exportsByBatch[spec.id]} } from './cycle-completion/${spec.id}.js';`).join('\n')
    +'\n\nexport const cyclePublications = [\n'
    +specs.map(spec=>`  { ...${JSON.stringify(spec)}, adaptations: ${exportsByBatch[spec.id]} },`).join('\n')+'\n];\n';
  fs.writeFileSync('data/cycle-completion-published.js',code);
  execFileSync(process.execPath,[process.argv[1],...process.argv.slice(2),'--record'],{stdio:'inherit'});
}else{
  const {readings}=await import('../data/readings.js');
  const {multipleChoice,choiceReviewSnapshot}=await import('../data/question-choices.js');
  const {classificationFor}=await import('../reading-levels.js');
  const batch=cyclePublications.find(batch=>batch.id===id);
  assert(batch);
  const codes=new Set(batch.adaptations.map(edition=>edition.source+edition.suffix));
  const selected=readings.filter(reading=>codes.has(reading.code));
  assert.equal(selected.length,codes.size*2);
  fs.mkdirSync('docs/cycle-completion',{recursive:true});
  const manifestPath='docs/cycle-completion/review.json';
  const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{date:'2026-11-27',teacherValidation:'pending',readings:[]};
  const records=selected.map(reading=>({code:reading.code,id:reading.id,language:reading.language,
    edition:batch.edition,date:batch.date,author:'root',reviewer,result:'independent-review-passed',status:'provisional',teacherValidation:'pending',
    classification:classificationFor(reading),sha256:hash(JSON.stringify(reading)),source,sourceSha256:expected.toLowerCase()}));
  for(const record of records){
    const previous=manifest.readings.find(old=>old.id===record.id);
    if(previous)assert.equal(previous.sha256,record.sha256,'An existing approval cannot be regenerated for changed content');
    else manifest.readings.push(record);
  }
  fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  const choicesPath='docs/question-choices/cycle-completion-review.json';
  const approved=fs.existsSync(choicesPath)?JSON.parse(fs.readFileSync(choicesPath,'utf8')):[];
  for(const reading of selected)for(const question of reading.questions){
    if(!multipleChoice(reading,question))continue;
    const record={code:reading.code,language:reading.language,questionId:question.id,
      edition:batch.edition,date:batch.date,author:'root',reviewer,result:'independent-review-passed',status:'provisional',teacherValidation:'pending',
      sha256:hash(JSON.stringify(choiceReviewSnapshot(reading,question)))};
    const previous=approved.find(old=>old.code===record.code&&old.language===record.language&&old.questionId===record.questionId);
    if(previous)assert.equal(previous.sha256,record.sha256,'An existing choice approval cannot be regenerated for changed content');
    else approved.push(record);
  }
  fs.writeFileSync(choicesPath,JSON.stringify(approved,null,2)+'\n');
  const {firstCycleSources,observatoryCompletionSources}=await import('../data/cycle-completion-plan.js');
  const allAdaptations=cyclePublications.flatMap(publication=>publication.adaptations);
  const rows=sources=>sources.map(source=>{
    const original=readings.find(reading=>reading.code===source&&reading.language==='ca');
    const editions=allAdaptations.filter(edition=>edition.source===source).map(edition=>edition.source+edition.suffix);
    return `| ${source} · ${original.title} | ${editions.join(', ')||'—'} | ${editions.length?'Provisional ES/CA, revisió superada':'Previst'} |`;
  });
  fs.writeFileSync('docs/cycle-completion.md',[
    '# Compleció del catàleg per cicles',
    '\nTanda autoritzada el 27 de novembre del 2026: 30 variants per completar quinze històries de primer cicle i cinc ampliacions de segon cicle dins de l’Observatori. Es mantenen les 315 històries i les famílies existents. Les publicacions són progressives i la validació docent continua pendent.\n',
    '## Primer cicle de primària\n',
    'Les versions C són inicials: frases breus, poca informació simultània, unes 10–40 paraules i tres preguntes literals. Les D són avançades de primer cicle: lectura més sostinguda, unes 60–130 paraules i cinc preguntes amb connexions o inferències pròximes. Les versions A de 2n inicial ja publicades continuen com a intermèdies de cicle. Els intervals són orientatius; la revisió concreta comprova text, preguntes i il·lustracions.\n',
    'Ordre editorial: **C → A → D → original → B**. C, A i D ofereixen els tres trams del primer cicle; original i B continuen disponibles al segon cicle. Una família pot tenir cinc variants i cadascuna manté identitat i maquetat propis. Els sufixos no defineixen dificultat per si sols.\n',
    '| Família | Variants noves publicades | Estat |','| --- | --- | --- |',...rows(firstCycleSources),
    '\n## Segon cicle avançat · Observatori\n',
    'Cinc versions C amplien famílies existents de l’Observatori. S’ordenen entre l’original i B: **A → original → C → B**. La dificultat s’ha de construir amb integració de pistes, interpretacions i justificacions; allargar el text no és suficient.\n',
    '| Família | Variant nova publicada | Estat |','| --- | --- | --- |',...rows(observatoryCompletionSources),
    '\n## Revisió i compatibilitat\n',
    'Cada idioma i variant es revisa independentment, incloses totes les opcions ABCD, respostes, evidències i la compatibilitat de la il·lustració compartida. Les opinions mantenen resposta oberta. Es conserva una línia per a respostes breus i més espai quan cal explicar. Les inicials i avançades de primer cicle utilitzen Massallera de 15 punts i la plantilla existent del cicle.\n',
    'El [registre](cycle-completion/review.json) identifica la versió exacta, l’autor i el revisor. El [registre ABCD](question-choices/cycle-completion-review.json) conserva cada alternativa. No s’ha regenerat cap aprovació antiga. Les [empremtes anteriors](cycle-completion/originals.json) protegeixen 120 versions lingüístiques prèvies, amb preguntes i alternatives.\n',
    'La comprovació històrica `check-early-families.mjs` troba una empremta antiga de L104A diferent de la versió ja publicada abans d’aquesta tanda. Aquella aprovació no es reescriu: el control nou compara els originals amb la fotografia prèvia a la tanda i confirma que es conserven.\n',
    'Comprovacions: `node tools/check-cycle-completion.mjs --complete`, `node tools/check-question-choices.mjs`, `node tools/check-cycle-classification.mjs` i `node tools/check-cycle-completion-browser.cjs`. Durant la publicació progressiva s’omet `--complete`. La prova de navegador és local; producció la revisa l’usuari.\n',
  ].join('\n'));
  console.log(JSON.stringify({batch:id,edition:batch.edition,codes:[...codes],languageEditions:selected.length,reviewer}));
}
