const assert = require('node:assert/strict');
const fs = require('node:fs');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:4212/';
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4212' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const errors = [];
    for (const language of ['ca', 'es']) for (const mode of ['open', 'choice']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 980 }, reducedMotion: 'reduce' });
      await context.addInitScript(language => localStorage.setItem('trama.language', language), language);
      const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
      await page.goto(base); await page.locator('.reading-card').first().waitFor();
      const dialog = page.locator('#question-format-dialog');
      assert(!await dialog.isVisible(), 'No onboarding in the catalogue');
      const id = language === 'ca' ? 'el-cartell-de-la-placa-ca' : 'el-cartel-de-la-plaza-es';
      await page.goto(base + '#lectura=' + id); await dialog.waitFor({ state: 'visible' });
      assert((await dialog.locator('h2').textContent()).includes(language === 'ca' ? 'Com prefereixes' : 'Cómo prefieres'));
      assert.equal(await dialog.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
      assert(await dialog.locator('img').first().getAttribute('src').then(src => src.endsWith(`-${language}.webp`)));
      const bounds = await dialog.boundingBox(); assert(bounds.width <= 850 && bounds.height < 980);
      if (language === 'ca' && mode === 'choice') { fs.mkdirSync('imports/qa', { recursive: true }); await dialog.screenshot({ path: 'imports/qa/question-format-welcome-desktop.png' }); }
      await dialog.locator(`[data-preference-mode="${mode}"]`).click(); await dialog.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => localStorage.getItem('trama.question-format.v1')), mode);
      assert.equal(await page.evaluate(() => localStorage.getItem('trama.question-format-seen.v1')), '1');
      await page.waitForFunction(mode => document.querySelectorAll('#studio-pages .worksheet-choice').length === (mode === 'choice' ? 16 : 0), mode);
      if (mode === 'choice') {
        await page.locator('#studio-pages [data-question-id="cartel-q1"] [data-action="question-mode-open"]').evaluate(node => node.click());
        assert.equal(await page.locator('#studio-pages [data-question-id="cartel-q1"]').getAttribute('data-response-mode'), 'open');
      }
      await page.reload(); await page.locator('#studio-title').waitFor(); assert(!await dialog.isVisible(), 'Choice does not reappear on reload');
      if (mode === 'choice') assert.equal(await page.locator('#studio-pages [data-question-id="cartel-q1"]').getAttribute('data-response-mode'), 'open', 'Individual exception survives reload');
      const nextId = await page.evaluate(async language => (await import('./data/readings.js')).readings.find(r => r.code === 'L006' && r.language === language).id, language);
      await page.goto(base + '#lectura=' + nextId); await page.locator('#studio-reading-code').filter({ hasText: 'L006' }).waitFor();
      assert(!await dialog.isVisible(), 'Only first worksheet shows onboarding');
      assert.equal(await page.locator('#studio-pages .worksheet-choice').count() > 0, mode === 'choice', 'Global preference follows between readings');
      await page.locator('#response-preference-reset').evaluate(node => node.click()); await dialog.waitFor({ state: 'visible' });
      await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      await page.reload(); await page.locator('#studio-title').waitFor(); assert(!await dialog.isVisible(), 'Dismissal is remembered even without choosing');
      await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.goto(base + '#lectura=el-cartell-de-la-placa-ca'); await page.locator('#question-format-dialog').waitFor();
    const mobile = await page.locator('#question-format-dialog').boundingBox(); assert(mobile.width <= 390 && mobile.height <= 844 * .88 + 1);
    await page.locator('#question-format-dialog').screenshot({ path: 'imports/qa/question-format-welcome-mobile.png' });
    await page.locator('#question-format-dialog [data-close-dialog]').click(); await page.reload(); await page.locator('#studio-title').waitFor();
    assert(!await page.locator('#question-format-dialog').isVisible(), 'Closing with X persists across reloads');
    const result = await page.evaluate(async () => {
      const { createQuestionFormatPreference } = await import('./question-format-preference.js');
      const preference = createQuestionFormatPreference({ getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); }, removeItem() { throw Error('blocked'); } });
      preference.markSeen(); preference.set('choice');
      const settings = { excluded: ['q2'], questionModes: { q1: 'open' }, fontSize: 16 };
      return { seen: preference.seen(), settings: preference.apply(settings) };
    });
    assert.equal(result.seen, true); assert.equal(result.settings.questionMode, 'choice');
    assert.deepEqual(result.settings.questionModes, { q1: 'open' }); assert.deepEqual(result.settings.excluded, ['q2']); assert.equal(result.settings.fontSize, 16);
    assert.deepEqual(errors, []); await context.close();
    console.log('Welcome checked in CA/ES, both defaults, persisted dismissal, individual exceptions, navigation, mobile and blocked storage; all requests local.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
