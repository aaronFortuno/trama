const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { PDFDocument } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib');
const base = 'http://127.0.0.1:4198/';
const allCatalogue = process.argv.includes('--all');
const screenshot = process.argv.slice(2).find(arg => !arg.startsWith('--'));
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4198' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base+'#lectura=el-cartel-de-la-plaza-es');
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('#studio-pages mark').count(), 0);
    await page.locator('#studio-solution').check();
    await page.locator('#studio-pages mark').first().waitFor();
    if (screenshot) await page.locator('#studio-pages .worksheet-page').first().screenshot({ path: screenshot });
    const reference = page.locator('#studio-pages .worksheet-evidence-reference').first();
    assert.equal(await reference.textContent(), 'Ver en el texto');
    await reference.click();
    assert.equal(await page.evaluate(() => document.activeElement.tagName), 'MARK');
    await page.locator('#studio-pages [data-question-id="cartel-q1"] [data-action="question-hide"]').click({ force: true });
    assert.equal(await page.locator('#studio-pages [data-evidence-questions~="cartel-q1"]').count(), 0);
    assert.equal(await page.locator('#studio-pages [data-evidence-number-for="cartel-q2"]').first().textContent(), '1');
    await page.locator('.studio-evidence-controls summary').click();
    await page.locator('[name="showEvidence"]').uncheck();
    await page.waitForFunction(() => !document.querySelector('#studio-pages mark'));
    assert.equal(await page.locator('#studio-pages mark').count(), 0);
    assert.equal(await page.locator('#studio-pages .worksheet-evidence-reference').count(), 0);
    assert(await page.locator('#studio-pages .worksheet-underlined').count() > 0);
    await page.reload();
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('[name="showEvidence"]').isChecked(), false);
    await page.locator('#studio-solution').check();
    assert.equal(await page.locator('#studio-pages mark').count(), 0);
    await page.locator('.studio-evidence-controls summary').click();
    await page.locator('[name="showEvidence"]').check();
    await page.locator('#studio-pages mark').first().waitFor();
    const checks = await page.evaluate(async (allCatalogue) => {
      const { readings } = await import('./data/readings.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { renderWorksheet, exportWorksheetPages, decodeWorksheetImages } = await import('./worksheet.js');
      const variants = allCatalogue ? readings : readings.filter(r => +r.code.slice(1) <= 5);
      const host = document.createElement('div');
      host.className = 'worksheet-export-layout';
      document.body.append(host);
      let checked = 0;
      const inspect = (reading, config, key) => {
        renderWorksheet(host, reading, config, { answerKey: key, interactive: false });
        for (const content of host.querySelectorAll('.worksheet-content')) if (content.scrollHeight > content.clientHeight + 1) throw Error(reading.id+' overflow');
        const paragraphs = new Map();
        for (const node of host.querySelectorAll('.worksheet-paragraph')) {
          const clone = node.cloneNode(true);
          clone.querySelectorAll('sup').forEach(n => n.remove());
          const index = +node.dataset.paragraph;
          paragraphs.set(index, (paragraphs.get(index) ?? '') + clone.textContent.replace(/[\u2060\u00ad]/g, ''));
        }
        reading.paragraphs.forEach((text, index) => { if (paragraphs.get(index) !== text) throw Error(reading.id+' altered passage '+index); });
        if (!key || !config.showEvidence) {
          if (host.querySelector('mark, .worksheet-evidence-reference')) throw Error('leaked answer evidence');
        } else {
          if (!host.querySelector('mark')) throw Error('missing answer evidence');
          const refs = [...host.querySelectorAll('.worksheet-evidence-reference')];
          if (refs.some(ref => ref.tagName !== 'SPAN')) throw Error('interactive control in print');
          const first = host.querySelector('mark');
          if (!getComputedStyle(first).backgroundColor && !getComputedStyle(first).backgroundImage) throw Error('missing color');
        }
        checked++;
      };
      for (const reading of variants) {
        inspect(reading, defaultSettings(reading.level), true);
        if (!allCatalogue || +reading.code.slice(1) <= 5 || +reading.code.slice(1) % 25 === 0) {
          inspect(reading, defaultSettings(reading.level), false);
          inspect(reading, { ...defaultSettings(reading.level), showEvidence: false }, true);
        }
      }
      const text = 'Una clau antiga obre la porta. '.repeat(45).trim();
      const fixture = { id: 'fixture', code: 'T001', title: 'Prova', language: 'ca', level: '1-secondary', images: [], paragraphs: [text], annotations: [{ paragraph: 1, text: 'antiga', occurrence: 1, questionId: 'first' }, { paragraph: 1, text: 'porta', occurrence: 1, definition: 'Entrada.' }], questions: [{ id: 'first', prompt: 'Què obre?', answer: 'La clau.', lines: 1, evidence: [{ paragraph: 1, text: text.slice(0, 1199).trim(), occurrence: 1 }] }, { id: 'second', prompt: 'Quina clau?', answer: 'L’antiga.', lines: 1, evidence: [{ paragraph: 1, text: 'clau antiga obre', occurrence: 1 }] }] };
      fixture.questions[0].evidence[0].text = text.slice(0, text.lastIndexOf('porta.', 1190) + 6);
      inspect(fixture, { ...defaultSettings('1-secondary'), fontSize: 20, leading: 4, showImages: false }, true);
      const markedPages = [...host.querySelectorAll('.worksheet-page')].filter(p => p.querySelector('mark'));
      if (markedPages.length < 2 || markedPages.some(p => !p.querySelector('.worksheet-evidence-number'))) throw Error('lost evidence across page break');
      const reading = variants.find(r => r.language === 'es');
      const pdfPages = exportWorksheetPages(reading, defaultSettings(reading.level), true);
      await decodeWorksheetImages(pdfPages);
      host.remove();
      return { checked, pdfPages: pdfPages.length };
    }, allCatalogue);
    const download = page.waitForEvent('download');
    await page.locator('#studio-print-trigger').click();
    await page.locator('#studio-print-menu [data-option="pdf-key"]').click();
    const file = await download;
    const stream = await file.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const pdf = await PDFDocument.load(Buffer.concat(chunks));
    assert(pdf.getPageCount() >= 1);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ...checks, pdf: file.suggestedFilename(), pdfPages: pdf.getPageCount(), errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
