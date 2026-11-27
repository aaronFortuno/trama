const assert=require('node:assert/strict');
const fs=require('node:fs');
const{fork}=require('node:child_process');
const{chromium}=require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin='http://127.0.0.1:4220';
(async()=>{
  const server=fork('tools/serve.cjs',{env:{...process.env,PORT:'4220'},stdio:['ignore','pipe','inherit','ipc']});let browser;
  try{
    await new Promise((resolve,reject)=>{server.once('error',reject);server.stdout.once('data',resolve);});
    browser=await chromium.launch({channel:'chrome'});
    const context=await browser.newContext({viewport:{width:1500,height:1000},reducedMotion:'reduce'});
    await context.addInitScript(()=>{
      localStorage.setItem('trama.language','ca');localStorage.setItem('trama.catalog-language','es');localStorage.setItem('trama.question-format-seen.v1','1');
      window.print=()=>{window.dispatchEvent(new Event('beforeprint'));window.__printed=document.querySelector('.worksheet-print-outlet').textContent;window.dispatchEvent(new Event('afterprint'));};
    });
    const page=await context.newPage();page.setDefaultTimeout(12000);const errors=[],missing=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.url().startsWith(origin)&&response.status()>=400)missing.push(response.url());});
    await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
    await page.goto(origin);await page.locator('#reading-grid .reading-card').first().waitFor();
    const render=await page.evaluate(async()=>{
      const{readings}=await import('./data/readings.js');const{cycleCompletionAdaptations}=await import('./data/cycle-completion.js');
      const{exportWorksheetPages,decodeWorksheetImages}=await import('./worksheet.js');const{defaultSettings}=await import('./worksheet-code.js');
      const{loadWorksheetFont}=await import('./worksheet-fonts.js');
      const codes=new Set(cycleCompletionAdaptations.map(edition=>edition.source+edition.suffix));const results=[];
      for(const reading of readings.filter(reading=>codes.has(reading.code))){
        const settings=defaultSettings(reading.level);await loadWorksheetFont(settings.font);
        for(const answerKey of[false,true]){
          const pages=exportWorksheetPages(reading,settings,answerKey);await decodeWorksheetImages(pages);
          if(!pages.length||pages.some(page=>page.lang!==reading.language))throw Error(reading.code+': missing page or wrong language');
          if(!pages[0].textContent.includes(reading.title))throw Error(reading.code+': title missing');
          const questions=pages.flatMap(page=>[...page.querySelectorAll('.worksheet-question')]);
          if(questions.length!==reading.questions.length)throw Error(reading.code+': lost questions');
          if(pages.some(page=>page.querySelector('[data-action]')))throw Error(reading.code+': editing controls in export');
          results.push({code:reading.code,language:reading.language,answerKey,pages:pages.length});
        }
      }
      return results;
    });
    await page.locator('#search').fill('L104');await page.locator('#reading-grid .is-family').first().waitFor();
    assert.equal(await page.locator('#reading-grid .card-difficulty').textContent(),'5 variants');
    await page.locator('#reading-grid .card-open').click();await page.locator('#family-dialog').waitFor();
    const familyOrder=await page.locator('.family-option').evaluateAll(buttons=>buttons.map(button=>button.dataset.reading));
    const expected=await page.evaluate(async()=>{const{readings}=await import('./data/readings.js');return['L104C','L104A','L104D','L104','L104B'].map(code=>readings.find(reading=>reading.code===code&&reading.language==='es').id);});
    assert.deepEqual(familyOrder,expected);
    await page.locator(`.family-option[data-reading="${expected[0]}"]`).click();
    await page.waitForFunction(()=>document.querySelector('#studio-reading-code').textContent==='L104C');
    assert((await page.locator('#studio-meta').textContent()).includes('1r cicle · Inicial'));
    assert.equal(await page.locator('[name="fontSize"]').inputValue(),'15');
    assert.equal(await page.locator('[name="font"]').inputValue(),'massallera');
    await page.locator('#studio-solution').check();await page.evaluate(()=>window.print());
    assert((await page.evaluate(()=>window.__printed)).includes('Solucionario'));
    await page.locator('.studio-compare:visible').first().click();await page.locator('#family-comparison-dialog').waitFor();
    assert.equal(await page.locator('.family-comparison-column').count(),5);
    await page.locator('#family-comparison-dialog [data-close-dialog]').click();await page.locator('#family-comparison-dialog').waitFor({state:'hidden'});
    fs.mkdirSync('imports/qa',{recursive:true});await page.screenshot({path:'imports/qa/early-cycle-pilot.png'});
    const original=await page.evaluate(async()=>{
      const{readings}=await import('./data/readings.js');const{saveWorksheetLayout}=await import('./worksheet-layouts.js');const{defaultSettings}=await import('./worksheet-code.js');
      const reading=readings.find(reading=>reading.code==='L104A'&&reading.language==='es');
      saveWorksheetLayout(reading,{...defaultSettings(reading.level),fontSize:16,showClassroomCode:true,classroomCode:'2.1.1'});
      return reading.id;
    });
    await page.goto(origin+'/#lectura='+original);await page.reload();await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('[name="classroomCode"]').inputValue(),'2.1.1');assert.equal(await page.locator('[name="fontSize"]').inputValue(),'16');
    assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
    console.log(JSON.stringify({renderedDocuments:render.length,languageEditions:render.length/2,fiveVariantFamily:'ordered and comparable',
      format:'Massallera 15pt',oldLayout:'preserved',print:'solution in reading language',missingAssets:missing,errors}));
    await context.close();
  }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
