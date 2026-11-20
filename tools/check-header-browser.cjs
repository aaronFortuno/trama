const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:4212/';
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4212' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1450, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.goto(base);
    await page.locator('#reading-grid .reading-card').first().waitFor();
    const expected = await page.evaluate(async () => {
      const { readings } = await import('./data/readings.js'); const { groupFamilyCards } = await import('./reading-families.js');
      return groupFamilyCards(readings.filter(r => r.language === 'ca').map(reading => ({ reading }))).length;
    });
    assert.equal(await page.locator('#result-count').textContent(), `${expected} propostes`);
    assert(!await page.locator('#readings-title').isVisible());
    assert.equal(await page.locator('.site-header #search, .site-header #batch-open, .site-intro #result-count').count(), 3);
    const count = await page.locator('#result-count').boundingBox(); const motto = await page.locator('.site-label').boundingBox();
    assert(count.y >= motto.y + motto.height);
    assert(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#result-count')).fontSize) < parseFloat(getComputedStyle(document.querySelector('.site-label')).fontSize)));
    await page.locator('#search').fill('L123');
    assert.equal(await page.locator('#result-count').textContent(), '1 proposta');
    await page.locator('#reading-grid .card-open').click();
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert(await page.locator('#search').isVisible());
    await page.locator('#search').fill('L133');
    await page.locator('#catalog-view').waitFor({ state: 'visible' });
    assert.equal(await page.evaluate(() => document.activeElement.id), 'search');
    assert.equal(await page.evaluate(() => location.hash), '');
    assert.equal(await page.locator('#result-count').textContent(), '1 proposta');
    await page.evaluate(() => {
      localStorage.setItem('trama.collections.v1', JSON.stringify([{ id: 'header-test', name: 'La meva tria', readingIds: ['el-banco-mojado-ca', 'una-guirnalda-de-papel-ca'] }]));
      localStorage.setItem('trama.collection.active.v1', 'header-test');
    });
    await page.reload();
    await page.locator('#collection-exit').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#readings-title').textContent(), 'La meva tria');
    assert.equal(await page.locator('#result-count').textContent(), '2 fitxes');
    await page.locator('#collection-exit').click();
    assert(!await page.locator('#readings-title').isVisible());
    assert.equal(await page.evaluate(() => document.activeElement.id), 'search');
    assert.equal(await page.locator('#result-count').textContent(), `${expected} propostes`);
    await page.locator('.site-label').evaluate(node => { node.textContent = 'Llegir és tornar a un lloc que no existeix.'; });
    for (const width of [1450, 1000, 800, 790, 640, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: horizontal overflow`);
      const controls = await page.locator('.header-search, .header-tools').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
      for (const box of controls) assert(box.x >= 0 && box.x + box.width <= width + 1, `${width}: control outside viewport`);
      assert(controls[0].x + controls[0].width <= controls[1].x + 1 || controls[0].y >= controls[1].y + controls[1].height, `${width}: overlapping controls`);
      if (process.env.TRAMA_SCREENSHOTS && [1450, 390].includes(width)) await page.screenshot({ path: process.env.TRAMA_SCREENSHOTS + `/trama-header-${width}.png` });
    }
    await page.locator('#language-button').click();
    await page.locator('#language-menu [data-option="es"]').click();
    assert((await page.locator('#result-count').textContent()).includes('propuestas'));
    assert.equal(await page.locator('#batch-open').getAttribute('aria-label'), 'Imprimir un lote');
    await page.locator('#batch-open').click();
    await page.locator('#batch-dialog').waitFor({ state: 'visible' });
    assert(await page.locator('#batch-print').isEnabled());
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ count: expected, headerSearchFromReading: 'ok', collectionExit: 'ok', responsiveWidths: 7, languages: ['ca', 'es'], errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
