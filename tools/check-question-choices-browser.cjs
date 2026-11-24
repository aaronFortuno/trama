const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { PDFDocument } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib');
const base = 'http://127.0.0.1:4206/';

(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4206' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1580, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.stack));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    const id = 'el-cartell-de-la-placa-ca';
    await page.goto(base + '#lectura=' + id, { waitUntil: 'domcontentloaded' });
    const question = number => page.locator(`#studio-pages [data-question-id="cartel-q${number}"]`);
    const globalChoice = page.locator('[name="questionMode"][value="choice"]');
    await question(1).waitFor();
    assert.equal(await page.locator('#studio-pages .worksheet-choice').count(), 0);
    await question(1).hover();
    await question(1).locator('[data-action="question-more"]').click();
    assert.equal(await question(1).locator('.worksheet-answer-line').count(), 2);
    await question(1).hover();
    await question(1).locator('[data-action="question-mode-choice"]').click();
    assert.equal(await question(1).locator('.worksheet-choice').count(), 4);
    assert.equal(await question(1).locator('.worksheet-answer-line').count(), 0);
    await question(1).locator('[data-action="question-mode-open"]').evaluate(node => node.click());
    assert.equal(await question(1).locator('.worksheet-answer-line').count(), 2, 'open response space is restored');
    await globalChoice.check();
    await page.waitForFunction(() => document.querySelectorAll('#studio-pages .worksheet-choice').length === 16);
    assert.equal(await question(5).getAttribute('data-response-mode'), 'open', 'opinion stays open');
    assert.equal(await question(6).getAttribute('data-response-mode'), 'open', 'unsupported question stays open');
    await question(2).locator('[data-action="question-mode-open"]').evaluate(node => node.click());
    assert.equal(await page.locator('#studio-pages .worksheet-choice').count(), 12);
    assert.equal(await globalChoice.isChecked(), false, 'mixed mode is not presented as all ABCD');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await question(1).waitFor();
    assert.equal(await page.locator('#studio-pages .worksheet-choice').count(), 12, 'layout survives reload');
    await page.locator('#studio-solution').check();
    assert.equal(await question(1).locator('.worksheet-solution-label').textContent().then(value => value.includes('Resposta correcta')), true);
    assert((await question(1).locator('.worksheet-solution p').textContent()).startsWith('B.'));
    assert.equal(await page.locator('#studio-pages .worksheet-choice.is-correct').count(), 3);
    await question(1).locator('.worksheet-solution-label .worksheet-report').evaluate(node => node.click());
    await page.locator('#reading-report-dialog').waitFor({ state: 'visible' });
    assert((await page.locator('#reading-report-dialog [name="element"] option:checked').textContent()).includes('ABCD'), 'report identifies the displayed format');
    await page.locator('#reading-report-dialog [data-close-dialog]').first().click();
    await page.locator('#reading-report-dialog').waitFor({ state: 'hidden' });

    const collections = await page.evaluate(async id => {
      const { readings } = await import('./data/readings.js');
      const { saveCollectionEntries } = await import('./collections.js');
      const { readWorksheetLayout, writeWorksheetLayout } = await import('./worksheet-layouts.js');
      const reading = readings.find(reading => reading.id === id);
      const layout = readWorksheetLayout(reading);
      const first = saveCollectionEntries('Prova ABCD', [reading]);
      const second = saveCollectionEntries('Prova oberta', [reading]);
      writeWorksheetLayout(localStorage, id, { ...layout, questionMode: 'choice', questionModes: {} }, first.id);
      writeWorksheetLayout(localStorage, id, { ...layout, questionMode: 'open', questionModes: {} }, second.id);
      return { first: first.id, second: second.id };
    }, id);
    for (const [scope, expected] of [[collections.first, 16], [collections.second, 0], ['', 12]]) {
      await page.goto(base + '#lectura=' + id + (scope ? '&col=' + scope : ''));
      await page.waitForFunction(expected => document.querySelectorAll('#studio-pages .worksheet-choice').length === expected, expected);
    }
    const backupDownload = page.waitForEvent('download');
    await page.evaluate(async () => { const { downloadBackup } = await import('./settings-backup.js'); downloadBackup((await import('./data/readings.js')).readings); });
    const backupFile = await backupDownload;
    const backupStream = await backupFile.createReadStream();
    const backupParts = [];
    for await (const chunk of backupStream) backupParts.push(chunk);
    const backup = Buffer.concat(backupParts).toString('utf8');
    const restored = await page.evaluate(async ({ backup, id, collections }) => {
      const { readings } = await import('./data/readings.js');
      const { prepareBackup, restoreBackup } = await import('./settings-backup.js');
      const { readWorksheetLayout } = await import('./worksheet-layouts.js');
      localStorage.clear();
      restoreBackup(await prepareBackup(new File([backup], 'config.json', { type: 'application/json' }), readings));
      const reading = readings.find(reading => reading.id === id);
      return { base: readWorksheetLayout(reading), first: readWorksheetLayout(reading, collections.first), second: readWorksheetLayout(reading, collections.second) };
    }, { backup, id, collections });
    assert.equal(restored.base.questionModes['cartel-q2'], 'open');
    assert.equal(restored.first.questionMode, 'choice');
    assert.equal(restored.second.questionMode, 'open');

    const rendering = await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { renderWorksheet, exportWorksheetPages, decodeWorksheetImages } = await import('./worksheet.js');
      const { multipleChoice } = await import('./data/question-choices.js');
      const host = document.createElement('div'); host.className = 'worksheet-export-layout'; document.body.append(host);
      let scenarios = 0;
      for (const reading of readings.filter(reading => /^L00[1-5]$/.test(reading.code))) {
        for (const extreme of [false, true]) for (const answerKey of [false, true]) {
          const settings = { ...defaultSettings(reading.level), questionMode: 'choice', ...(extreme ? { fontSize: 20, leading: 6, marginTop: 32, marginBottom: 32, marginLeft: 32, marginRight: 32, answerLines: 8 } : {}) };
          renderWorksheet(host, reading, settings, { answerKey, interactive: false });
          if (host.querySelectorAll('.worksheet-choice').length !== 16) throw Error('Lost choices: ' + reading.id);
          if (host.querySelector('button')) throw Error('Interactive control in export');
          for (const content of host.querySelectorAll('.worksheet-content')) if (content.scrollHeight > content.clientHeight + 2) throw Error('Page overflow: ' + reading.id);
          if (answerKey && host.querySelectorAll('.worksheet-choice.is-correct').length !== 4) throw Error('Wrong key marks');
          for (const question of reading.questions.filter(question => !multipleChoice(reading, question))) {
            const block = host.querySelector(`[data-question-id="${question.id}"]`);
            if (block?.dataset.responseMode !== 'open') throw Error('Unsupported choice mode');
          }
          scenarios++;
        }
      }
      const sample = readings.find(reading => reading.code === 'L002' && reading.language === 'ca');
      const printable = exportWorksheetPages(sample, { ...defaultSettings(sample.level), questionMode: 'choice' }, true);
      await decodeWorksheetImages(printable);
      host.remove();
      return { scenarios, printablePages: printable.length };
    });

    await page.goto(base + '#lectura=' + id, { waitUntil: 'domcontentloaded' });
    await question(1).waitFor();
    await page.locator('#studio-solution').check();
    if (process.env.TRAMA_SCREENSHOTS) {
      fs.mkdirSync(process.env.TRAMA_SCREENSHOTS, { recursive: true });
      await page.screenshot({ path: path.join(process.env.TRAMA_SCREENSHOTS, 'trama-abcd-desktop.png') });
    }
    await page.locator('#studio-print-trigger').click();
    const pdfDownload = page.waitForEvent('download');
    await page.locator('#studio-print-menu [data-option="pdf-key"]').click();
    const pdfFile = await pdfDownload;
    const pdfStream = await pdfFile.createReadStream(); const pdfParts = [];
    for await (const chunk of pdfStream) pdfParts.push(chunk);
    const pdf = await PDFDocument.load(Buffer.concat(pdfParts));
    assert(pdf.getPageCount() >= 1);

    await page.evaluate(() => {
      window.print = () => {
        window.dispatchEvent(new Event('beforeprint'));
        const outlet = document.querySelector('.worksheet-print-outlet');
        window.__choicePrint = { choices: outlet.querySelectorAll('.worksheet-choice').length, correct: outlet.querySelectorAll('.worksheet-choice.is-correct').length, tools: outlet.querySelectorAll('button').length };
        window.dispatchEvent(new Event('afterprint'));
      };
    });
    await page.locator('#studio [data-action="print"]').click();
    await page.waitForFunction(() => window.__choicePrint);
    assert.deepEqual(await page.evaluate(() => window.__choicePrint), { choices: 12, correct: 3, tools: 0 });
    await page.locator('#search').fill('-L005');
    await page.locator('#catalog-view').waitFor({ state: 'visible' });
    if (await page.locator('#collection-exit').isVisible()) await page.locator('#collection-exit').click();
    assert.equal(await page.locator('#reading-grid .reading-card').count(), 5);
    await page.locator('#batch-open').click();
    await page.locator('#batch-dialog').waitFor({ state: 'visible' });
    await page.evaluate(() => { delete window.__choicePrint; });
    await page.locator('#batch-print').click();
    await page.waitForFunction(() => window.__choicePrint, undefined, { timeout: 30000 });
    assert.deepEqual(await page.evaluate(() => window.__choicePrint), { choices: 12, correct: 0, tools: 0 }, 'batch respects saved mixed layout');
    await page.locator('#batch-dialog [data-close-dialog]').click();
    await page.locator('#language-button').click();
    await page.locator('#language-menu [data-option="es"]').click();
    await page.goto(base + '#lectura=el-cartel-de-la-plaza-es');
    await page.locator('.studio-question-formats summary').waitFor();
    assert((await page.locator('.studio-question-formats summary').textContent()).includes('Formato de las preguntas'));
    await page.setViewportSize({ width: 390, height: 844 });
    const mobile = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    assert(mobile, 'mobile page must not overflow horizontally');
    if (process.env.TRAMA_SCREENSHOTS) await page.screenshot({ path: path.join(process.env.TRAMA_SCREENSHOTS, 'trama-abcd-mobile.png') });
    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    touch.on('pageerror', error => errors.push(error.stack));
    await touch.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await touch.goto(base + '#lectura=el-cartel-de-la-plaza-es', { waitUntil: 'domcontentloaded' });
    const touchQuestion = touch.locator('#studio-pages [data-question-id="cartel-q1"]');
    await touchQuestion.locator('[data-action="question-tools"]').click();
    await touchQuestion.locator('[data-action="question-mode-choice"]').click();
    assert.equal(await touchQuestion.locator('.worksheet-choice').count(), 4, 'touch users can switch a question');
    await touch.close();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ...rendering, backup: 'ok', collectionLayouts: 'independent', individualPrint: 'ok', batchPrint: 'ok', pdfPages: pdf.getPageCount(), mobile: 'ok', errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
