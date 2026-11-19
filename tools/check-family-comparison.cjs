const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:4202/';

(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4202' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1450, height: 1000 }, reducedMotion: 'reduce' });
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.locator('#reading-grid .reading-card').first().waitFor();
    await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { writeWorksheetLayout } = await import('./worksheet-layouts.js');
      for (const reading of readings.filter(r => r.familyId && r.language === 'ca')) {
        writeWorksheetLayout(localStorage, reading.id, { ...defaultSettings(reading.level), showClassroomCode: true, classroomCode: 'AULA-' + reading.code });
      }
    });
    await page.goto(base + '#lectura=biblioteca-objetos-b-ca', { waitUntil: 'domcontentloaded' });
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    const snapshot = () => page.evaluate(() => Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('trama.worksheet-layout.') || key.startsWith('trama.collection-layout.'))));
    const before = await snapshot();
    const dialog = page.locator('#family-comparison-dialog');
    const rail = page.locator('#family-comparison-rail');
    const ready = () => page.waitForFunction(() => document.querySelector('#family-comparison-rail').getAttribute('aria-busy') === 'false' && document.querySelector('#family-comparison-rail .worksheet-page'));
    await page.locator('#studio-compare').click();
    await ready();
    assert.equal(await dialog.locator('.family-comparison-column').count(), 3);
    assert.deepEqual(await dialog.locator('.family-comparison-column').evaluateAll(nodes => nodes.map(node => node.dataset.reading)), ['biblioteca-objetos-a-ca', 'biblioteca-objetos-b-ca', 'la-biblioteca-de-objetos-ca']);
    assert.equal(await page.locator('#family-comparison-position').textContent(), '1–2 de 3');
    assert(await dialog.locator('[data-compare-step="previous"]').isDisabled());
    assert(!await dialog.locator('[data-compare-step="next"]').isDisabled());
    assert.equal(await dialog.locator('[data-reading="biblioteca-objetos-a-ca"] .worksheet-classroom-code').first().textContent(), 'AULA-L208A');
    assert.equal(await dialog.locator('[data-reading="biblioteca-objetos-b-ca"] .worksheet-classroom-code').first().textContent(), 'AULA-L208B');
    const verify = await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js');
      for (const column of document.querySelectorAll('.family-comparison-column')) {
        const reading = readings.find(r => r.id === column.dataset.reading);
        const text = [...column.querySelectorAll('.worksheet-paragraph')].map(node => {
          const clone = node.cloneNode(true); clone.querySelectorAll('sup').forEach(n => n.remove()); return clone.textContent;
        }).join('').replace(/[\u2060\u00ad]/g, '');
        if (text !== reading.paragraphs.join('')) throw Error('Lost comparison text: ' + reading.code);
        for (const page of column.querySelectorAll('.worksheet-content')) if (page.scrollHeight > page.clientHeight + 1) throw Error('Comparison page overflow');
        for (const image of column.querySelectorAll('img')) await image.decode();
      }
      return true;
    });
    assert(verify);
    if (process.env.TRAMA_SCREENSHOTS) await page.screenshot({ path: process.env.TRAMA_SCREENSHOTS + '/trama-family-comparison-desktop.png' });
    await dialog.locator('[data-compare-step="next"]').click();
    await page.waitForFunction(() => document.querySelector('#family-comparison-position').textContent === '2–3 de 3');
    assert.equal(await page.locator('#family-comparison-position').textContent(), '2–3 de 3');
    assert(await dialog.locator('[data-compare-step="next"]').isDisabled());
    await dialog.locator('[data-compare-step="previous"]').click();
    await page.waitForFunction(() => document.querySelector('#family-comparison-position').textContent === '1–2 de 3');
    await dialog.locator('.family-comparison-body').first().evaluate(node => { node.scrollTop = node.scrollHeight; });
    assert((await dialog.locator('.family-comparison-body').first().evaluate(node => node.scrollTop)) > 0);
    assert.equal(await dialog.locator('.family-comparison-body').nth(1).evaluate(node => node.scrollTop), 0);
    await dialog.locator('[data-compare-jump="questions"]').click();
    assert((await dialog.locator('.family-comparison-body').nth(1).evaluate(node => node.scrollTop)) > 0);
    await dialog.locator('[data-compare-jump="text"]').click();
    assert.equal(await dialog.locator('.family-comparison-body').first().evaluate(node => node.scrollTop), 0);
    await page.locator('#family-comparison-solution').check();
    await ready();
    assert.equal(await dialog.locator('.family-comparison-column').evaluateAll(columns => columns.filter(column => column.querySelector('.worksheet-solution') && column.querySelector('mark')).length), 3);
    assert(!await page.locator('#studio-solution').isChecked());
    assert.deepEqual(await snapshot(), before, 'Comparison must never save or overwrite layouts');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForFunction(() => document.querySelector('#family-comparison-position').textContent === '1 de 3');
    assert(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth));
    assert(await rail.evaluate(node => node.scrollWidth > node.clientWidth));
    if (process.env.TRAMA_SCREENSHOTS) await page.screenshot({ path: process.env.TRAMA_SCREENSHOTS + '/trama-family-comparison-mobile.png' });
    await page.keyboard.press('Escape');
    assert(!await dialog.isVisible());
    assert.equal(await page.locator('#studio-reading-code').textContent(), 'L208B');
    await page.setViewportSize({ width: 1450, height: 1000 });
    await page.locator('#studio-solution').check();
    if (await page.locator('.studio-family > summary').getAttribute('aria-expanded') === 'false') await page.locator('.studio-family > summary').click();
    await page.locator('#studio-family button').filter({ hasText: 'Compara les variants' }).click();
    await ready();
    assert(await page.locator('#family-comparison-solution').isChecked());
    await dialog.locator('[data-reading="la-biblioteca-de-objetos-ca"] .family-comparison-open').click();
    await page.waitForFunction(() => document.querySelector('#studio-reading-code').textContent === 'L208');
    assert(!await dialog.isVisible());
    assert(await page.locator('#studio-solution').isChecked());
    await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { writeWorksheetLayout } = await import('./worksheet-layouts.js');
      localStorage.setItem('trama.collections.v1', JSON.stringify([{ id: 'comparison-test', name: 'Comparació', readingIds: ['biblioteca-objetos-a-ca', 'biblioteca-objetos-b-ca'] }]));
      for (const reading of readings.filter(r => ['L208A', 'L208B'].includes(r.code) && r.language === 'ca')) {
        writeWorksheetLayout(localStorage, reading.id, { ...defaultSettings(reading.level), showClassroomCode: true, classroomCode: 'COL-' + reading.code }, 'comparison-test');
      }
    });
    await page.goto(base + '#lectura=biblioteca-objetos-b-ca&col=comparison-test', { waitUntil: 'domcontentloaded' });
    await page.locator('#studio-compare').click();
    await ready();
    assert.equal(await dialog.locator('[data-reading="biblioteca-objetos-a-ca"] .worksheet-classroom-code').first().textContent(), 'COL-L208A');
    assert.equal(await dialog.locator('[data-reading="biblioteca-objetos-b-ca"] .worksheet-classroom-code').first().textContent(), 'COL-L208B');
    assert.equal(await dialog.locator('[data-reading="la-biblioteca-de-objetos-ca"] .worksheet-classroom-code').first().textContent(), 'AULA-L208');
    assert((await dialog.locator('[data-reading="la-biblioteca-de-objetos-ca"] .family-comparison-open').textContent()).includes('fora de la col·lecció'));
    await page.keyboard.press('Escape');
    await page.goto(base + '#lectura=biblioteca-objetos-a-es', { waitUntil: 'domcontentloaded' });
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    await page.locator('#language-button').click();
    await page.locator('#language-menu [data-option="es"]').click();
    await page.locator('#studio-compare').click();
    await ready();
    assert.equal(await dialog.locator('#family-comparison-title').textContent(), 'Compara las variantes');
    assert.equal(await dialog.locator('.family-comparison-column').evaluateAll(columns => columns.filter(column => column.dataset.reading.endsWith('-es')).length), 3);
    await page.keyboard.press('Escape');
    await page.goto(base + '#lectura=quince-minutos-no-bastan-ca', { waitUntil: 'domcontentloaded' });
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert(!await page.locator('#studio-compare').isVisible());
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ degrees: 3, desktopVisible: 2, mobileVisible: 1, languages: 2, independentScroll: true, layoutsPreserved: true, answerKeys: true, errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
