const assert = require('node:assert/strict');
const fs = require('node:fs');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = 'http://127.0.0.1:4219';

(async () => {
  const server = fork('tools/serve.cjs', { env:{...process.env,PORT:'4219'}, stdio:['ignore','pipe','inherit','ipc'] });
  let browser;
  const errors=[], missing=[];
  try {
    await new Promise((resolve,reject)=>{server.once('error',reject);server.stdout.once('data',resolve);});
    browser=await chromium.launch({channel:'chrome'});
    const context=await browser.newContext({viewport:{width:1500,height:1000},reducedMotion:'reduce'});
    await context.addInitScript(()=>{
      if(!localStorage.getItem('qa-cycles-seeded')){
        localStorage.setItem('trama.language','ca');localStorage.setItem('trama.catalog-language','es');
        localStorage.setItem('trama.question-format-seen.v1','1');localStorage.setItem('qa-cycles-seeded','1');
      }
      window.__prints=[];
      window.print=()=>{window.dispatchEvent(new Event('beforeprint'));
        const outlet=document.querySelector('.worksheet-print-outlet');
        window.__prints.push({text:outlet.textContent,fonts:[...outlet.querySelectorAll('.worksheet-page')].map(page=>page.style.getPropertyValue('--sheet-font-size'))});
        window.dispatchEvent(new Event('afterprint'));};
    });
    const page=await context.newPage();page.setDefaultTimeout(12000);
    page.on('pageerror',error=>{errors.push(error.message);console.error(error);});
    page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400)missing.push(response.url());});
    await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    const change=async(selector,value,type='change')=>page.locator(selector).evaluate((node,{value,type})=>{
      node.value=value;node.dispatchEvent(new Event(type,{bubbles:true}));
    },{value,type});
    const search=async value=>{await page.locator('#search').fill(value);};
    const close=async id=>{await page.locator(`${id} [data-close-dialog]`).first().click();await page.locator(id).waitFor({state:'hidden'});};
    const locale=async value=>{await page.locator('#language-button').click();await page.locator(`#language-menu [data-option="${value}"]`).click();};
    await page.goto(origin);await page.locator('#reading-grid .reading-card').first().waitFor();
    assert.deepEqual(await page.locator('#filter-level option').evaluateAll(options=>options.map(option=>option.value)),['','primary-cycle-1','primary-cycle-2','primary-cycle-3','secondary-cycle-1']);
    await change('#filter-level','primary-cycle-1');await change('#filter-difficulty','intermediate');
    await page.waitForFunction(()=>document.querySelector('#result-count').textContent.startsWith('28 '));
    const additions=await page.evaluate(async()=>(await import('./data/cycle-completion.js')).cycleCompletionAdaptations.filter(edition=>edition.cycleLevel==='primary-cycle-1'));
    assert.equal(await page.locator('#filter-difficulty option[value="initial"]').evaluate(option=>option.disabled),!additions.some(edition=>edition.cycleDifficulty==='initial'));
    assert.equal(await page.locator('#filter-difficulty option[value="advanced"]').evaluate(option=>option.disabled),!additions.some(edition=>edition.cycleDifficulty==='advanced'));
    await change('#filter-level','secondary-cycle-1');await change('#filter-difficulty','advanced');
    await page.waitForFunction(()=>document.querySelector('#result-count').textContent.startsWith('26 '));
    const esoLabels={ca:'Primer cicle d’ESO · 1r–2n',es:'Primer ciclo de ESO · 1.º–2.º',gl:'Primeiro ciclo de ESO · 1.º–2.º',eu:'DBHko 1. zikloa · 1.–2.'};
    for(const [language,label]of Object.entries(esoLabels)){
      await locale(language);
      assert.equal(await page.locator('#filter-level option[value="secondary-cycle-1"]').getAttribute('data-label'),label);
    }
    await locale('ca');
    await change('#filter-level','primary-cycle-2');await change('#filter-difficulty','advanced');
    const secondCycleAdvanced=await page.evaluate(async()=>{
      const{cycleCompletionAdaptations}=await import('./data/cycle-completion.js');
      return 15+cycleCompletionAdaptations.filter(edition=>edition.cycleLevel==='primary-cycle-2'&&edition.cycleDifficulty==='advanced').length;
    });
    await page.waitForFunction(expected=>document.querySelector('#result-count').textContent.startsWith(expected+' '),secondCycleAdvanced);
    await search('L038');await page.locator('#reading-grid .card-code').filter({hasText:'L038'}).waitFor();
    assert((await page.locator('#reading-grid .card-level').textContent()).includes('Segon cicle'));
    assert.equal(await page.locator('#reading-grid .card-difficulty').textContent(),'Avançada');
    await search('L035');await page.locator('#catalog-empty').waitFor();
    await change('#filter-difficulty','intermediate');await page.locator('#reading-grid .card-code').filter({hasText:'L035'}).waitFor();
    assert.equal(await page.locator('#reading-grid .card-difficulty').textContent(),'Intermèdia');
    assert((await page.locator('#filter-length option').evaluateAll(options=>options.map(option=>option.label))).some(text=>text.includes('≤140')));
    await search('');await change('#filter-level','primary-cycle-3');await change('#filter-difficulty','advanced');
    await search('L206');await page.locator('#reading-grid .card-code').filter({hasText:/^L206$/}).waitFor();
    const source206=await page.evaluate(async()=>(await import('./data/readings.js')).readings.find(reading=>reading.code==='L206'&&reading.language==='es').id);
    await page.locator('#reading-grid .card-open').first().click();
    if(await page.locator('#family-dialog').isVisible())await page.locator(`.family-option[data-reading="${source206}"]`).click();
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert((await page.locator('#studio-meta').textContent()).includes('3r cicle · Avançada'));
    assert.equal(await page.locator('[name="fontSize"]').inputValue(),'11','Initial format still uses reference grade');

    // Seed layouts using the pre-cycle storage schema and stable reading IDs.
    const seeded=await page.evaluate(async()=>{
      const {readings}=await import('./data/readings.js');const {defaultSettings}=await import('./worksheet-code.js');
      const {saveWorksheetLayout}=await import('./worksheet-layouts.js');
      const entries=['L001','L038','L206'].map(code=>readings.find(reading=>reading.code===code&&reading.language==='es'));
      const first=entries[0];
      saveWorksheetLayout(first,{...defaultSettings(first.level),fontSize:17,leading:2.4,classroomCode:'GENERAL-1',showClassroomCode:true,
        excluded:[first.questions[0].id],questionModes:{[first.questions[1].id]:'choice'},questionLines:{[first.questions[2].id]:5}});
      localStorage.setItem('trama.collections.v1',JSON.stringify([{id:'qa-cycle-collection',name:'Col·lecció anterior',readingIds:entries.map(reading=>reading.id)}]));
      for(const [index,reading] of entries.entries())saveWorksheetLayout(reading,{...defaultSettings(reading.level),fontSize:13,classroomCode:['AULA-2','S2-A','S3-A'][index],showClassroomCode:true},'qa-cycle-collection');
      return {ids:entries.map(reading=>reading.id),storage:Object.fromEntries(Object.entries(localStorage).filter(([key])=>/trama\.(?:worksheet-layout|collection-layout|collections)/.test(key)))};
    });
    await page.goto(origin+'/#lectura='+seeded.ids[0]);await page.reload();await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('[name="fontSize"]').inputValue(),'17');
    assert.equal(await page.locator('[name="classroomCode"]').inputValue(),'GENERAL-1');
    assert.equal(await page.locator('#studio-pages [data-action="question-hide"]').count(),5);
    await page.locator('#studio-solution').check();await page.evaluate(()=>window.print());
    let printed=await page.evaluate(()=>window.__prints.at(-1));
    assert(printed.text.includes('Solucionario')&&printed.text.includes('GENERAL-1'));
    assert(printed.fonts.every(font=>font==='17pt'));
    await page.locator('.studio-compare:visible').first().click();
    await page.locator('#family-comparison-dialog').waitFor();
    assert((await page.locator('.family-comparison-column-heading h3').allTextContents()).every(text=>text.includes('cicle')));
    await close('#family-comparison-dialog');
    for(const language of ['es','gl','eu','ca']){
      await locale(language);assert.equal(await page.locator('[name="fontSize"]').inputValue(),'17');
      assert.equal(await page.locator('#studio-pages .worksheet-page').first().getAttribute('lang'),'es');
      assert.equal(await page.locator('[name="classroomCode"]').inputValue(),'GENERAL-1');
    }
    await page.locator('[data-action="catalog"]').click();
    await page.locator('#catalog-collection-panel summary').click();
    await change('#collection-select','qa-cycle-collection');
    await page.waitForFunction(()=>document.querySelectorAll('#reading-grid .card-open').length===3);
    assert.deepEqual(await page.locator('#reading-grid .card-open').evaluateAll(buttons=>buttons.map(button=>button.dataset.id)),seeded.ids);
    await page.locator('#reading-grid .card-open').first().click();await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('[name="fontSize"]').inputValue(),'13');
    assert.equal(await page.locator('[name="classroomCode"]').inputValue(),'AULA-2');
    await page.locator('#studio-solution').check();await page.locator('[data-action="reading-next"]').click();
    await page.waitForFunction(()=>document.querySelector('#studio-reading-code').textContent==='L038');
    assert.equal(await page.locator('#studio-reading-code').textContent(),'L038');
    assert.equal(await page.locator('#studio-solution').isChecked(),true);
    assert.equal(await page.locator('[name="classroomCode"]').inputValue(),'S2-A');
    await page.reload();await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('[name="classroomCode"]').inputValue(),'S2-A');
    await page.locator('[data-action="catalog"]').click();await page.locator('#batch-open').click();
    await page.locator('#batch-dialog').waitFor();await page.locator('#batch-print').click();
    await page.waitForFunction(()=>window.__prints.length>0);
    printed=await page.evaluate(()=>window.__prints.at(-1));
    assert(['AULA-2','S2-A','S3-A'].every(code=>printed.text.includes(code)));
    if(await page.locator('#batch-dialog').isVisible())await close('#batch-dialog');
    const after=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>/trama\.(?:worksheet-layout|collection-layout|collections)/.test(key))));
    assert.deepEqual(after,seeded.storage,'Navigation, locale, reload and batch print must preserve every old layout and collection');
    await page.locator('#collection-exit').click();
    await change('#filter-level','primary-cycle-2');await change('#filter-difficulty','intermediate');
    await search('L001');await page.locator('#reading-grid .card-open').first().click();
    await page.locator('#family-dialog').waitFor();
    assert((await page.locator('.family-option > strong').allTextContents()).every(text=>text.includes('cicle')));
    await close('#family-dialog');
    await page.locator('[aria-describedby="difficulty-help"]').click();await page.locator('#difficulty-help').waitFor();
    await page.keyboard.press('Escape');
    fs.mkdirSync('imports/qa',{recursive:true});
    await page.screenshot({path:'imports/qa/cycles-desktop.png'});
    await page.setViewportSize({width:390,height:844});
    await page.locator('#help-open').click();await page.locator('#help-dialog').waitFor();
    assert((await page.locator('#help-dialog').textContent()).includes('primer (1r–2n)'));
    assert(await page.locator('#help-dialog').evaluate(dialog=>dialog.scrollWidth<=dialog.clientWidth+1));
    await page.screenshot({path:'imports/qa/cycles-mobile-help.png'});
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    console.log(JSON.stringify({filters:'cycles and demand',cards:'recalibrated',families:'grouped and comparable',languages:4,
      referenceFormats:'preserved',oldLayouts:'byte-identical',collections:'order and independent layouts preserved',batchPrint:'uses saved classroom codes',pageErrors:errors,missingAssets:missing}));
    await context.close();
  }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
