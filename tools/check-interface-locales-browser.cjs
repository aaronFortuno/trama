const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const fs = require('node:fs');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = 'http://127.0.0.1:4218';

(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4218' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [], missing = [], results = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    fs.mkdirSync('imports/qa', { recursive: true });
    for (const locale of ['gl', 'eu']) {
      const context = await browser.newContext({ viewport: { width: 1500, height: 1000 }, reducedMotion: 'reduce' });
      await context.addInitScript(locale => {
        if (!localStorage.getItem('locale-test-seeded')) {
          localStorage.setItem('trama.language', locale);
          localStorage.setItem('locale-test-seeded', '1');
        }
        window.print = () => {
          window.dispatchEvent(new Event('beforeprint'));
          window.__printed = document.querySelector('.worksheet-print-outlet').innerHTML;
          window.dispatchEvent(new Event('afterprint'));
        };
      }, locale);
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => { errors.push(`${locale}: ${error.message}`); console.error(error); });
      page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) missing.push(response.url()); });
      await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const changeLanguage = async target => {
        await page.locator('#language-button').click();
        await page.locator(`#language-menu [data-option="${target}"]`).click();
        assert.equal(await page.locator('html').getAttribute('lang'), target);
      };
      const input = async (selector, value, type = 'input') => page.locator(selector).evaluate((node, { value, type }) => {
        if (node.type === 'checkbox') node.checked = value; else node.value = value;
        node.dispatchEvent(new Event(type, { bubbles: true }));
      }, { value, type });
      const close = async id => {
        await page.locator(`${id} [data-close-dialog]`).first().click();
        await page.locator(id).waitFor({ state: 'hidden' });
      };
      const noPageOverflow = async () => assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${locale}: page overflow`);

      await page.goto(origin);
      await page.locator('#reading-grid .reading-card').first().waitFor();
      assert.equal(await page.locator('#filter-language').inputValue(), 'es', 'New UI languages default to available Spanish readings');
      assert.deepEqual(await page.locator('#filter-language option').evaluateAll(options => options.map(option => option.value).sort()), ['ca', 'es']);
      assert.deepEqual(await page.locator('#language-menu [data-option]').allTextContents().then(names => names.map(name => name.trim())), ['Català', 'Español', 'Galego', 'Euskara']);
      const placeholder = await page.locator('#search').getAttribute('placeholder');
      assert.equal(placeholder, locale === 'gl' ? 'Busca por título, código ou tema' : 'Bilatu izenburuaren, kodearen edo gaiaren arabera');
      await noPageOverflow();
      await page.screenshot({ path: `imports/qa/interface-${locale}-catalogue.png` });

      await page.goto(origin + '/#lectura=el-cartel-de-la-plaza-es');
      await page.locator('#question-format-dialog').waitFor();
      assert.equal(await page.locator('#question-format-dialog h2').textContent(), locale === 'gl' ? 'Como prefires as preguntas?' : 'Nolako galderak nahiago dituzu?');
      const samples = await page.locator('[data-response-sample]').evaluateAll(async images => Promise.all(images.map(async image => { await image.decode(); return { src: image.getAttribute('src'), lang: image.lang }; })));
      assert(samples.every(image => image.lang === 'es' && image.src.endsWith('-es.webp')));
      await page.locator('[data-preference-mode="choice"]').click();
      await page.locator('#question-format-dialog').waitFor({ state: 'hidden' });
      await page.locator('#studio-pages .worksheet-page').first().waitFor();
      assert.equal(await page.locator('#studio-title').textContent(), 'El cartel de la plaza');
      assert.equal(await page.locator('#studio-pages .worksheet-page').first().getAttribute('lang'), 'es');
      assert.equal(await page.locator('#studio-pages .worksheet-kind').first().textContent(), 'Comprensión lectora');
      await input('[name="fontSize"]', '14');
      await input('[name="classroomCode"]', 'USER-CODE');
      await input('[name="showClassroomCode"]', true);
      await page.locator('[data-of-preview-mode="answers"]').click();
      await page.locator('#studio-pages .worksheet-classroom-code').first().waitFor();
      const layoutBefore = await page.evaluate(() => localStorage.getItem('trama.worksheet-layout.v1:el-cartel-de-la-plaza-es'));
      assert(layoutBefore.includes('USER-CODE'));
      await page.evaluate(() => window.print());
      assert(await page.evaluate(() => window.__printed.includes('Solucionario') && window.__printed.includes('USER-CODE')));

      // A name matching an interface source must remain the user's own name.
      await page.locator('.studio-template-picker summary').click();
      await page.locator('[data-action="templates"]').click();
      await page.locator('#template-new').click();
      await page.locator('#template-dialog [name="name"]').fill('Plantilles');
      await page.locator('#template-dialog button[type="submit"]').click();
      assert((await page.locator('#template-list strong').allTextContents()).includes('Plantilles'));
      await close('#template-dialog');

      for (const target of ['ca', 'es', 'gl', 'eu', locale]) {
        await changeLanguage(target);
        assert.equal(await page.locator('#studio-title').textContent(), 'El cartel de la plaza');
        assert.equal(await page.locator('#studio-pages .worksheet-kind').first().textContent(), 'Comprensión lectora');
        assert.equal(await page.locator('[data-of-preview-mode="answers"]').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('[name="classroomCode"]').inputValue(), 'USER-CODE');
        assert.equal(await page.evaluate(() => localStorage.getItem('trama.worksheet-layout.v1:el-cartel-de-la-plaza-es')), layoutBefore);
      }
      await page.reload();
      await page.locator('#studio-pages .worksheet-page').first().waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'), locale);
      assert.equal(await page.locator('#question-format-dialog').isVisible(), false, 'First-use guide stays dismissed across languages');
      assert.equal(await page.locator('[name="fontSize"]').inputValue(), '14');
      assert.equal(await page.locator('[name="classroomCode"]').inputValue(), 'USER-CODE');
      await page.locator('.studio-template-picker summary').click();
      assert((await page.locator('.studio-template-picker strong').allTextContents()).includes('Plantilles'));
      await page.screenshot({ path: `imports/qa/interface-${locale}-studio.png` });

      await page.locator('[data-action="catalog"]').click();
      await page.locator('#catalog-collection-panel summary').click();
      await page.locator('#collection-save').click();
      await page.locator('#reading-grid .card-open').first().click();
      await page.locator('#selection-save').click();
      await page.locator('#collection-name').fill('Plantilles');
      await page.locator('#collection-submit').click();
      await page.locator('#collection-dialog').waitFor({ state: 'hidden' });
      const collectionBefore = await page.evaluate(() => localStorage.getItem('trama.collections.v1'));
      assert.equal(JSON.parse(collectionBefore)[0].name, 'Plantilles');
      await changeLanguage(locale === 'gl' ? 'eu' : 'gl');
      assert.equal(await page.evaluate(() => localStorage.getItem('trama.collections.v1')), collectionBefore);
      await changeLanguage(locale);

      // Reading-language preference is independent and survives reload and UI changes.
      await page.locator('#collection-exit').click();
      await input('#filter-language', 'ca', 'change');
      await changeLanguage('es');
      await changeLanguage(locale);
      assert.equal(await page.locator('#filter-language').inputValue(), 'ca');
      await page.reload();
      await page.locator('#reading-grid').waitFor();
      assert.equal(await page.locator('#filter-language').inputValue(), 'ca');
      assert.equal(await page.evaluate(() => localStorage.getItem('trama.collections.v1')), collectionBefore);

      await page.locator('#changelog-open').click();
      assert.equal(await page.locator('#changelog-language-note').isVisible(), true);
      assert.equal(await page.locator('.release').nth(0).getAttribute('lang'), locale);
      assert.equal(await page.locator('.release').nth(2).getAttribute('lang'), 'ca');
      await close('#changelog-dialog');
      await changeLanguage('es');
      await page.locator('#changelog-open').click();
      assert.equal(await page.locator('#changelog-language-note').isVisible(), false);
      assert.equal(await page.locator('.release').nth(2).getAttribute('lang'), 'es');
      await close('#changelog-dialog');
      await changeLanguage(locale);

      for (const [button, dialog] of [['#help-open', '#help-dialog'], ['#about-open', '#about-dialog'], ['#batch-open', '#batch-dialog']]) {
        await page.locator(button).click();
        await page.locator(dialog).waitFor();
        assert(await page.locator(dialog).evaluate(node => node.scrollWidth <= node.clientWidth + 1), `${locale}: dialog overflow ${dialog}`);
        await close(dialog);
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await noPageOverflow();
      await page.locator('#help-open').click();
      await page.locator('#help-dialog').waitFor();
      assert(await page.locator('#help-dialog').evaluate(node => node.scrollWidth <= node.clientWidth + 1), `${locale}: mobile help overflow`);
      await page.screenshot({ path: `imports/qa/interface-${locale}-mobile-help.png` });
      await close('#help-dialog');
      results.push({ locale, catalogue: 'ok', readingLanguage: 'independent', welcomeImages: 'ok', print: 'Spanish', layouts: 'preserved', templates: 'preserved', collections: 'preserved', mobile: 'ok' });
      await context.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(missing, []);
    console.log(JSON.stringify({ results, pageErrors: errors, missingAssets: missing }));
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
