const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { PDFDocument } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pdf-lib');
const base = 'http://127.0.0.1:4197/';
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4197' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1450, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.goto(base);
    await page.locator('#reading-grid .reading-card').first().waitFor();
    const expected = await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js'); const { groupFamilyCards } = await import('./reading-families.js');
      const members = readings.filter(r => r.language === 'ca' && r.universeIds?.includes('biblioteca-de-les-coses'));
      return { readings: members.length, cards: groupFamilyCards(members.map(reading => ({ reading }))).length };
    });
    const field = (selector, value) => page.locator(selector).evaluate((node, value) => { node.value = value; node.dispatchEvent(new Event('change', { bubbles: true })); }, value);
    await field('#filter-universe', 'biblioteca-de-les-coses');
    assert.equal(await page.locator('#reading-grid .reading-card').count(), expected.cards);
    assert((await page.locator('#active-filters').textContent()).includes('La biblioteca de les coses'));
    await page.locator('.card-open[data-id="quince-minutos-no-bastan-ca"]').click();
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    if (await page.locator('.studio-universes > summary').getAttribute('aria-expanded') === 'false') await page.locator('.studio-universes > summary').click();
    await page.locator('.studio-universe button').click();
    assert.equal(await page.locator('#filter-universe').inputValue(), 'biblioteca-de-les-coses');
    assert.equal(await page.locator('#filter-language').inputValue(), 'ca');
    await page.goto(base + '#lectura=quince-minutos-no-bastan-es');
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    if (await page.locator('.studio-universes > summary').getAttribute('aria-expanded') === 'false') await page.locator('.studio-universes > summary').click();
    await page.locator('.studio-universe button').click();
    assert.equal(await page.locator('#filter-language').inputValue(), 'es');
    assert.equal(await page.locator('#reading-grid .reading-card').count(), expected.cards);
    const rendered = await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { renderWorksheet } = await import('./worksheet.js');
      const { loadWorksheetFont } = await import('./worksheet-fonts.js');
      const entries = readings.filter(r => r.universeIds?.includes('biblioteca-de-les-coses') && +r.code.slice(1) >= 246);
      const host = document.createElement('div'); host.className = 'worksheet-export-layout'; document.body.append(host);
      let scenarios = 0;
      for (const reading of entries) {
        const settings = defaultSettings(reading.level);
        await loadWorksheetFont(settings.font);
        for (const image of reading.images) { const probe = new Image(); probe.src = image.src; await probe.decode(); }
        for (const answerKey of [false, true]) {
          renderWorksheet(host, reading, settings, { answerKey, interactive: false });
          for (const page of host.querySelectorAll('.worksheet-content')) if (page.scrollHeight > page.clientHeight + 1) throw Error(reading.id + ' overflow');
          const paragraphs = new Map();
          for (const node of host.querySelectorAll('.worksheet-paragraph')) {
            const clone = node.cloneNode(true); clone.querySelectorAll('sup').forEach(sup => sup.remove());
            const index = +node.dataset.paragraph;
            paragraphs.set(index, (paragraphs.get(index) ?? '') + clone.textContent.replace(/[\u2060\u00ad]/g, ''));
          }
          reading.paragraphs.forEach((text, index) => { if (paragraphs.get(index) !== text) throw Error(reading.id + ' lost paragraph ' + index); });
          if (answerKey && !host.querySelector('mark')) throw Error('Missing answer evidence');
          if (!answerKey && host.querySelector('mark')) throw Error('Evidence leaked to student view');
          scenarios++;
        }
      }
      host.remove(); return { versions: entries.length, scenarios };
    });
    await page.locator('.card-open[data-id="quince-minutos-no-bastan-es"]').click();
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    const downloading = page.waitForEvent('download');
    await page.locator('#studio-print-trigger').click();
    await page.locator('#studio-print-menu [data-option="pdf-key"]').click();
    const download = await downloading;
    const stream = await download.createReadStream(); const chunks = []; for await (const chunk of stream) chunks.push(chunk);
    const pdf = await PDFDocument.load(Buffer.concat(chunks)); assert(pdf.getPageCount() > 0);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ universeReadingsPerLanguage: expected.readings, universeCards: expected.cards, ...rendered, pdfPages: pdf.getPageCount(), errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
