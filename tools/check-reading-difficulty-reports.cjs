const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const local = 'http://127.0.0.1:4210';
const origin = 'https://trama.ortogra.fi';

(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4210' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const errors = [], reports = [];
    for (const language of ['ca', 'es']) for (const blocked of [false, true]) {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      await context.addInitScript(language => {
        localStorage.setItem('trama.language', language);
        localStorage.setItem('trama.question-format.v1', 'open');
      }, language);
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.pathname === '/script.js') return blocked ? route.abort() : route.fulfill({
          contentType: 'application/javascript', body: 'window.umami = { track() { return Promise.resolve(); } };',
        });
        if (url.pathname === '/api/send') {
          reports.push(route.request().postDataJSON().payload.data);
          return route.fulfill({ json: { cache: 'local-test-acknowledgement' } });
        }
        if (url.origin === origin) return route.fulfill({ response: await route.fetch({ url: local + url.pathname + url.search }) });
        if (url.origin === local || url.protocol === 'data:') return route.continue();
        return route.abort();
      });
      await page.goto(origin + '/#lectura=el-cartel-de-la-plaza-es');
      await page.locator('.of-preview-head-actions [data-of-report]').waitFor();
      for (const motiu of ['too_easy', 'too_difficult']) {
        const previous = reports.length;
        await page.locator('.of-preview-head-actions [data-of-report]').click();
        const dialog = page.locator('#reading-report-dialog');
        await dialog.locator('select[name="part"]').evaluate(node => {
          node.value = 'text'; node.dispatchEvent(new Event('change', { bubbles: true }));
        });
        const option = dialog.locator(`input[value="${motiu}"]`);
        assert((await option.locator('..').textContent()).includes(language === 'ca' ? 'nivell indicat' : 'nivel indicado'));
        await option.check();
        assert(await dialog.locator('[type="submit"]').isEnabled(), 'Blocked visitors can complete the report form');
        if (blocked) await dialog.locator('.report-warning').waitFor({ state: 'visible' });
        await dialog.locator('[type="submit"]').click();
        if (blocked) {
          assert.equal(reports.length, previous, 'Blocked tracker must not send a report');
          await dialog.locator('[type="submit"]').hover();
          assert(await dialog.locator('.report-submit-help [data-report-help]').isVisible());
        } else {
          await dialog.locator('.report-status').filter({ hasText: language === 'ca' ? 'Avís enviat' : 'Aviso enviado' }).waitFor();
          assert.deepEqual(reports.at(-1), { codi: 'L001', llengua: 'es', nivell: '5-primary', dificultat: 'initial', part: 'text', motiu });
        }
        await dialog.locator('[data-close-dialog]').first().click();
        await dialog.waitFor({ state: 'hidden' });
      }
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ languages: 2, reasons: 2, cases: 8, acknowledgedReports: reports.length, errors }));
  } finally { if (browser) await browser.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
