import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readings } from '../data/readings.js';
import { families } from '../data/families.js';
import { cycleAssignments, cycleClassificationNotes } from '../data/cycle-classification.js';
import { classificationByCode, classificationFor, cycleForReference, readingLevel, readingDifficulty } from '../reading-levels.js';
import { indexCatalog, filterCatalog, labels } from '../catalog.js';
import { familyMembers, groupFamilyCards, countFacetResults } from '../reading-families.js';
import { defaultSettings, makeCode, readCode } from '../worksheet-code.js';
import { saveWorksheetLayout, readWorksheetLayout } from '../worksheet-layouts.js';
import { sanitizeAnalyticsEvent } from '../analytics.js';
import { multipleChoice } from '../data/question-choices.js';

const snapshot = JSON.stringify(readings);
const indexed = indexCatalog(readings);
const codes = new Set(readings.map(reading => reading.code));
assert.equal(cycleAssignments.flatMap(([, , codes]) => codes).length, classificationByCode.size, 'Each edition has one assignment');
assert.deepEqual([...classificationByCode.keys()].sort(), [...codes].sort(), 'Every published edition is classified');
for (const reading of readings) {
  const classification = classificationFor(reading);
  assert.equal(classification.level, cycleForReference(reading.level));
  assert(Object.hasOwn(labels.level, classification.level));
  assert(Object.hasOwn(labels.difficulty, classification.difficulty));
  const other = readings.find(entry => entry.code === reading.code && entry.language !== reading.language);
  assert.deepEqual(classification, classificationFor(other), `${reading.code}: translations share a demand band`);
  const item = indexed.find(item => item.reading === reading);
  assert.deepEqual(item.facets.level, [classification.level]);
  assert.deepEqual(item.facets.difficulty, [classification.difficulty]);
}
const cycleRank = ['primary-cycle-1','primary-cycle-2','primary-cycle-3','secondary-cycle-1','secondary-cycle-2'];
const bands = ['initial','intermediate','advanced'];
for (const family of families) for (const language of ['ca','es']) {
  const first = readings.find(reading => reading.familyId === family.id && reading.language === language);
  const members = familyMembers(readings, first);
  const ranks = members.map(reading => cycleRank.indexOf(readingLevel(reading)) * 3 + bands.indexOf(readingDifficulty(reading)));
  assert.deepEqual(ranks, [...ranks].sort((a,b)=>a-b), `${family.code}: family progression`);
}
const cases = { L143: 'intermediate', L021: 'intermediate', L027: 'intermediate', L038: 'advanced',
  L008A: 'intermediate', L035: 'intermediate', L057B: 'intermediate', L202: 'intermediate',
  L206: 'advanced', L280: 'intermediate', L314B: 'advanced', L315B: 'advanced', L104A: 'intermediate' };
for (const [code, difficulty] of Object.entries(cases)) assert.equal(readingDifficulty(readings.find(reading => reading.code === code)), difficulty);
for (const [code, note] of Object.entries(cycleClassificationNotes)) assert.equal(classificationByCode.get(code).difficulty, note.difficulty);
const es = indexed.filter(item => item.reading.language === 'es');
assert.equal(groupFamilyCards(es).length, 315);
const pilot = es.filter(item => item.reading.code.startsWith('L208'));
assert.equal(countFacetResults(pilot,'level').total,1);
assert.equal(countFacetResults(pilot,'level').counts.size,3);
assert.equal(filterCatalog(es,{level:'primary-cycle-2'}).some(item=>item.reading.level==='3-primary'),true);
assert.equal(filterCatalog(es,{level:'primary-cycle-2'}).some(item=>item.reading.level==='4-primary'),true);
assert.equal(filterCatalog(es,{level:'primary-cycle-2'}).some(item=>item.reading.level==='5-primary'),false);
assert.equal(filterCatalog(es,{level:'primary-cycle-2',difficulty:'advanced'}).some(item=>item.reading.code==='L035'),false);

// Classifying and filtering must not change content, format defaults or storage.
const storage = new Map();
globalThis.localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key,value) => storage.set(key,value) };
const reading = readings.find(reading=>reading.code==='L001'&&reading.language==='es');
const settings = { ...defaultSettings(reading.level), fontSize:17, classroomCode:'5.1.1',showClassroomCode:true, excluded:[reading.questions[0].id] };
assert(saveWorksheetLayout(reading,settings));
assert(saveWorksheetLayout(reading,{...settings,fontSize:13,classroomCode:'6.2.4'},'saved-collection'));
const saved = JSON.stringify([...storage]);
classificationFor(reading); filterCatalog(indexed,{level:'primary-cycle-3'});
assert.equal(JSON.stringify([...storage]),saved);
assert.equal(readWorksheetLayout(reading).classroomCode,'5.1.1');
assert.equal(readWorksheetLayout(reading,'saved-collection').classroomCode,'6.2.4');
assert.equal(defaultSettings('3-primary').fontSize,14);
assert.equal(defaultSettings('4-primary').fontSize,13);
assert.equal(readCode(makeCode(reading,settings),readings).reading.id,reading.id);
assert.equal(JSON.stringify(readings),snapshot,'The new editorial layer must not rewrite readings or reference fields');
const event = sanitizeAnalyticsEvent('obre_lectura',{codi:reading.code,llengua:reading.language,cicle:'primary-cycle-1',dificultat_cicle:'advanced'});
assert.equal(event.data.nivell,'5-primary');
assert.equal(event.data.cicle,'primary-cycle-3');
assert.equal(event.data.dificultat_cicle,'initial');
assert(sanitizeAnalyticsEvent('aplica_filtre',{filtre:'level',valor:'primary-cycle-2'}));
assert.equal(sanitizeAnalyticsEvent('aplica_filtre',{filtre:'level',valor:'4-primary'}),false);

const review = JSON.parse(fs.readFileSync('docs/cycle-classification-review-2026-11-27.json','utf8'));
for (const record of review.readings) {
  const reading = readings.find(reading=>reading.id===record.id);
  const choices = reading.questions.map(question=>multipleChoice(reading,question)??null);
  assert.equal(createHash('sha256').update(JSON.stringify({reading,choices})).digest('hex'),record.sha256,`${record.id}: calibration sample changed`);
  assert.deepEqual(classificationFor(reading),record.teacherClassification ?? record.classification);
}
const early=readings.filter(reading=>reading.level==='2-primary');
assert.equal(early.length,56);
assert(early.every(reading=>readingDifficulty(reading)==='intermediate'));
assert.equal(classificationFor({...reading,personal:true,level:'2-primary',difficulty:'initial'}).difficulty,'intermediate');
for(const reading of readings.filter(reading=>reading.level==='1-secondary')){
  assert.equal(readingLevel(reading),'secondary-cycle-1');
  assert.equal(readingDifficulty(reading),reading.difficulty);
}
assert.equal(cycleForReference('2-secondary'),'secondary-cycle-1');
console.log(JSON.stringify({classified:classificationByCode.size,languageEditions:readings.length,families:families.length,
  reviewedLanguageEditions:review.readings.length,content:'unchanged',layouts:'preserved',analytics:'cycles and reference metadata separated'}));
