import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { readings } from '../data/readings.js';
import { cycleCompletionAdaptations, cyclePublications } from '../data/cycle-completion.js';
import { families } from '../data/families.js';
import { annotationRange } from '../reading-annotations.js';
import { classificationFor } from '../reading-levels.js';
import { multipleChoice } from '../data/question-choices.js';
import { wordCount } from '../catalog.js';
import { defaultSettings } from '../worksheet-code.js';

const hash=value=>createHash('sha256').update(value).digest('hex');
const originals=JSON.parse(fs.readFileSync('docs/cycle-completion/originals.json','utf8'));
for(const original of originals){
  const reading=readings.find(reading=>reading.id===original.id);assert(reading);
  const choices=reading.questions.map(question=>multipleChoice(reading,question));
  assert.equal(hash(JSON.stringify({reading,choices})),original.sha256,`${reading.id}: existing content or identifier changed`);
}
const manifest=JSON.parse(fs.readFileSync('docs/cycle-completion/review.json','utf8'));
const added=new Set(cycleCompletionAdaptations.map(edition=>edition.source+edition.suffix));
assert.equal(manifest.readings.length,added.size*2);
for(const batch of cyclePublications){
  assert.equal(hash(fs.readFileSync(batch.source,'utf8').replace(/\r\n/g,'\n')),batch.sha256,`${batch.id}: approved source changed`);
  for(const edition of batch.adaptations)for(const language of ['es','ca']){
    const code=edition.source+edition.suffix;
    const reading=readings.find(reading=>reading.code===code&&reading.language===language);
    const original=readings.find(reading=>reading.code===edition.source&&reading.language===language);
    assert(reading&&original);
    assert.equal(reading.familyId,original.familyId);
    assert.deepEqual(reading.images.map(image=>image.src),original.images.map(image=>image.src));
    assert.deepEqual(classificationFor(reading),{level:edition.cycleLevel,difficulty:edition.cycleDifficulty});
    const family=families.find(family=>family.id===reading.familyId);
    assert(family.variantCodes.includes(code));
    assert(family.variantCodes.indexOf(code)<family.variantCodes.indexOf(edition.before));
    const record=manifest.readings.find(record=>record.id===reading.id);
    assert(record&&record.result==='independent-review-passed'&&record.author!==record.reviewer);
    assert.equal(hash(JSON.stringify(reading)),record.sha256);
    const count=wordCount(reading);
    if(edition.cycleLevel==='primary-cycle-1'){
      assert.equal(defaultSettings(reading.level).font,'massallera');
      if(edition.cycleDifficulty==='initial'){
        assert(count>=10&&count<=40,`${code}-${language}: very short initial text`);
        assert.equal(reading.questions.length,3);
        assert(reading.questions.every(question=>question.type==='literal'&&question.lines===1));
      }else{
        assert(count>=60&&count<=130,`${code}-${language}: controlled first-cycle extension`);
        assert.equal(reading.questions.length,5);
        assert(reading.questions.some(question=>['inference','structure'].includes(question.type)));
        const middle=readings.find(reading=>reading.code===edition.source+'A'&&reading.language===language);
        assert(wordCount(reading)>wordCount(middle),`${code}-${language}: extension must develop the middle reading`);
      }
    }else{
      assert(count>=210&&count<=330);
      assert(reading.questions.length>=8);
    }
    for(const question of reading.questions){
      assert(question.answer&&question.prompt&&question.lines>=1&&question.lines<=8);
      if(question.type!=='opinion')assert(question.evidence?.length);
      for(const evidence of question.evidence??[])assert(annotationRange(reading.paragraphs[evidence.paragraph-1],evidence),`${code}-${language} ${question.id}: exact evidence`);
      const choice=multipleChoice(reading,question);
      if(question.type==='opinion')assert(!choice);
      else{
        assert(choice);
        assert.equal(choice.options.length,4);
        assert.equal(new Set(choice.options.map(option=>option.text)).size,4);
        assert.equal(choice.options.filter(option=>option.id===choice.correct).length,1);
      }
    }
    for(const image of reading.images){assert(fs.existsSync(image.src));assert(image.afterParagraph>=1&&image.afterParagraph<=reading.paragraphs.length);}
  }
}
if(process.argv.includes('--complete')){
  assert.equal(cycleCompletionAdaptations.filter(edition=>edition.cycleLevel==='primary-cycle-1'&&edition.cycleDifficulty==='initial').length,15);
  assert.equal(cycleCompletionAdaptations.filter(edition=>edition.cycleLevel==='primary-cycle-1'&&edition.cycleDifficulty==='advanced').length,15);
  assert.equal(cycleCompletionAdaptations.filter(edition=>edition.cycleLevel==='primary-cycle-2').length,5);
}
console.log(JSON.stringify({publishedVariants:added.size,languageEditions:manifest.readings.length,originalsPreserved:originals.length,
  bilingual:'reviewed',choices:'reviewed',evidence:'exact',images:'local and shared',familyOrder:'extended without renumbering'}));
