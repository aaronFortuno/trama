const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const local = 'http://127.0.0.1:4199';
const origin = 'https://trama.ortogra.fi';
const canary = 'PRIVATE-CANARY-9381';
const stub = `window.umami = { track(name, data) { const payload = {name, data}; window.__rawEvents.push(payload); const clean = window.tramaBeforeSend('event', payload); if (clean) window.__events.push(clean); return Promise.resolve(); } }; window.umami.track();`;

(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4199' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const errors = [];
    async function openPage(restriction = '', hash = '') {
      const context = await browser.newContext({ viewport: { width: 1500, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
      await context.addInitScript(restriction => {
        window.__events = []; window.__rawEvents = []; window.__prints = 0;
        localStorage.setItem('trama.question-format-seen.v1', '1');
        window.print = () => { window.dispatchEvent(new Event('beforeprint')); window.__prints++; window.dispatchEvent(new Event('afterprint')); };
        if (restriction === 'dnt') Object.defineProperty(Navigator.prototype, 'doNotTrack', { get: () => '1' });
        if (restriction === 'gpc') Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { get: () => true });
        if (restriction === 'disabled') localStorage.setItem('umami.disabled', '1');
      }, restriction);
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      let scripts = 0;
      // The production-looking URL is served entirely from the local checkout.
      // Nothing, including the tracker or collector, reaches a remote server.
      await page.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.href === 'https://maquestria.tail72bc84.ts.net:8443/script.js') {
          scripts++;
          if (restriction === 'blocked') return route.abort();
          return route.fulfill({ contentType: 'application/javascript', body: stub });
        }
        if (url.origin === origin) return route.fulfill({ response: await route.fetch({ url: local + url.pathname + url.search }) });
        if (url.origin === local) return route.continue();
        return route.abort();
      });
      await page.goto((restriction === 'local' ? local : origin) + '/' + hash);
      await page.locator('#reading-grid .reading-card:visible, #studio-pages .worksheet-page:visible').first().waitFor();
      return { page, context, scripts: () => scripts };
    }
    const main = await openPage('', '#lectura=el-cartel-de-la-plaza-es');
    const { page } = main;
    const events = name => page.evaluate(name => window.__events.filter(e => e.name === name), name);
    const waitEvent = (name, count = 1) => page.waitForFunction(({ name, count }) => window.__events.filter(e => e.name === name).length >= count, { name, count });
    const input = (selector, value, type = 'input') => page.locator(selector).evaluate((node, { value, type }) => {
      if (node.type === 'checkbox') node.checked = value; else node.value = value;
      node.dispatchEvent(new Event(type, { bubbles: true }));
    }, { value, type });
    const select = (selector, value) => input(selector, value, 'change');
    await waitEvent('obre_lectura');
    assert.equal((await events('obre_lectura')).length, 1);
    assert.equal((await events('obre_lectura'))[0].data.origen, 'enllac');
    assert.equal((await events('obre_lectura'))[0].data.llengua, 'es');
    await page.locator('#studio-solution').check();
    await waitEvent('canvia_vista');
    await page.locator('#studio-pages .worksheet-evidence-reference').first().click();
    await input('[name="fontSize"]', '13');
    await input('[name="fontSize"]', '14');
    await input('[name="headerTitle"]', canary);
    await input('[name="headerDetail"]', canary);
    await input('[name="classroomCode"]', canary);
    await input('[name="classroomCodeSize"]', '25');
    const edits = await events('personalitza_fitxa');
    assert.equal(edits.filter(e => e.data.bloc === 'text').length, 1, 'Slider must not emit on every tick');
    assert.equal(edits.filter(e => e.data.bloc === 'encapcalament').length, 1);
    assert.equal(edits.filter(e => e.data.bloc === 'codi_aula').length, 1);
    const hide = page.locator('#studio-pages [data-action="question-hide"]').first();
    await hide.click({ force: true });
    await page.locator('[data-action="question-undo"]').click();
    await page.locator('#studio-solution').uncheck();
    await page.locator('#studio-pages [data-action="question-more"]').first().click({ force: true });
    await page.locator('#studio-solution').check();
    assert((await events('personalitza_fitxa')).some(e => e.data.accio === 'recupera'));

    // Native browser print must also reflect the current solution view.
    await page.evaluate(() => window.print());
    await waitEvent('genera_document');
    assert.equal((await events('genera_document'))[0].data.contingut, 'solucionari');
    assert.equal((await events('prepara_lectura')).length, 1);
    assert.equal((await events('prepara_lectura'))[0].data.codi, 'L001');
    await page.locator('#studio-print-trigger').click();
    const downloading = page.waitForEvent('download');
    await page.locator('#studio-print-menu [data-option="pdf-key"]').click();
    const pdf = await downloading;
    assert(pdf.suggestedFilename().endsWith('.pdf'));
    await waitEvent('genera_document', 2);
    assert.equal((await events('genera_document'))[1].data.format, 'pdf');
    assert.equal((await events('prepara_lectura')).length, 2);
    assert.equal((await events('prepara_lectura'))[1].data.contingut, 'solucionari');

    // Templates must report only the action and whether they are personal.
    await page.locator('.studio-template-picker summary').click();
    await page.locator('[data-action="templates"]').click();
    await page.locator('#template-new').click();
    await page.locator('#template-dialog [name="name"]').fill(canary);
    await page.locator('#template-dialog button[type="submit"]').click();
    await waitEvent('plantilla');
    await page.locator('#template-list [data-template-apply]').last().click();
    assert((await events('plantilla')).some(e => e.data.accio === 'aplica' && e.data.tipus === 'personal'));
    if (await page.locator('#template-dialog').isVisible()) await page.locator('#template-dialog [data-close-dialog]').click();
    const variant = await page.locator('#studio-variant').evaluate(node => [...node.options].find(option => option.value !== node.value).value);
    await select('#studio-variant', variant);
    await waitEvent('obre_lectura', 2);
    assert.equal((await events('obre_lectura')).at(-1).data.origen, 'idioma');
    const direction = await page.locator('[data-action="reading-next"]').isEnabled() ? 'next' : 'previous';
    await page.locator(`[data-action="reading-${direction}"]`).click();
    if (await page.locator('#family-dialog').isVisible()) await page.locator('#family-options button').first().click();
    await waitEvent('obre_lectura', 3);
    assert.equal((await events('obre_lectura')).at(-1).data.origen, direction === 'next' ? 'seguent' : 'anterior');
    await page.locator('[data-action="catalog"]').click();
    await select('#filter-language', 'es');
    await page.locator('#search').fill(canary);
    await waitEvent('cerca_cataleg');
    assert.deepEqual((await events('cerca_cataleg')).at(-1).data, { tipus: 'text', resultats: '0', llengua: 'es', variants: false, abast: 'cataleg' });
    await page.locator('#search').fill('L001');
    await waitEvent('cerca_cataleg', 2);
    assert.deepEqual((await events('cerca_cataleg')).at(-1).data, { tipus: 'codi', resultats: '1', llengua: 'es', variants: false, abast: 'cataleg' });
    await page.locator('#filters-reset').click();
    await select('#filter-level', 'primary-cycle-3');
    await page.locator('#filter-level').evaluate(node => node.closest('.filter-field').querySelector('button.filter-clear').click());
    assert((await events('neteja_filtres')).some(e => e.data.filtre === 'level'));

    await page.locator('#catalog-collection-panel summary').click();
    await page.locator('#collection-save').click();
    const cards = page.locator('#reading-grid .reading-card');
    const firstChoice = cards.nth(0).locator('.card-open');
    const readingOpenings = (await events('obre_lectura')).length;
    const toggleCard = async (card, part) => {
      const box = await card.locator(part).boundingBox();
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    };
    // Use pointer coordinates: the full-card button also covers text and images.
    await toggleCard(cards.nth(0), '.card-art');
    assert.equal(await firstChoice.getAttribute('aria-pressed'), 'true');
    assert.equal(await cards.nth(0).locator('.card-selection').isVisible(), true);
    await toggleCard(cards.nth(0), '.card-selection');
    assert.equal(await firstChoice.getAttribute('aria-pressed'), 'false');
    await toggleCard(cards.nth(0), '.card-title');
    assert.equal(await firstChoice.getAttribute('aria-pressed'), 'true');
    await toggleCard(cards.nth(1), '.card-summary');
    const secondChoice = cards.nth(1).locator('.card-open');
    await secondChoice.focus();
    await page.keyboard.press('Space');
    assert.equal(await secondChoice.getAttribute('aria-pressed'), 'false');
    await page.keyboard.press('Enter');
    assert.equal(await secondChoice.getAttribute('aria-pressed'), 'true');
    assert.equal((await events('obre_lectura')).length, readingOpenings, 'Selection must not open a worksheet');
    assert.equal(await page.locator('#catalog-view').isVisible(), true);
    assert.equal(await page.locator('#reading-grid input[type="checkbox"]').count(), 0);
    await page.locator('#selection-save').click();
    await page.locator('#collection-name').fill(canary);
    await page.locator('#collection-submit').click();
    await waitEvent('colleccio', 2);
    assert((await events('colleccio')).some(e => e.data.accio === 'crea' && e.data.quantitat === '2-5'));
    assert.equal(await page.locator('#reading-grid [aria-pressed]').count(), 0, 'Saving must restore normal card navigation');
    const beforeDrag = await page.locator('#reading-grid .card-open').evaluateAll(buttons => buttons.map(button => button.dataset.id));
    const source = await cards.nth(0).boundingBox();
    const target = await cards.nth(1).boundingBox();
    await page.mouse.move(source.x + source.width / 2, source.y + 70);
    await page.mouse.down();
    await page.mouse.move(source.x + source.width / 2 + 12, source.y + 70);
    await page.waitForFunction(() => document.body.classList.contains('is-catalog-dragging'));
    await page.mouse.move(target.x + target.width * .8, target.y + 70, { steps: 12 });
    await page.waitForTimeout(180);
    await page.mouse.up();
    await page.waitForFunction(before => document.querySelector('#reading-grid .card-open').dataset.id !== before, beforeDrag[0]);
    assert.deepEqual(await page.locator('#reading-grid .card-open').evaluateAll(buttons => buttons.map(button => button.dataset.id)), beforeDrag.toReversed());
    assert((await events('colleccio')).some(e => e.data.accio === 'reordena'));
    assert.equal(await page.locator('#catalog-view').isVisible(), true);

    // A job is counted once; its public editions are counted once each separately.
    await page.locator('#batch-open').click();
    await waitEvent('obre_lot');
    assert.equal((await events('obre_lot')).length, 1, 'One event per dialog opening');
    assert.deepEqual((await events('obre_lot'))[0].data, { origen: 'capcalera', vista: 'cataleg', quantitat: '2-5', colleccio: true });
    const selectionCodes = await page.locator('#batch-list input:checked').evaluateAll(inputs => inputs.map(input =>
      input.closest('label').querySelector('code').textContent.replace(/-(?:CA|ES)$/, '')));
    const beforeResources = (await events('prepara_lectura')).length;
    await page.locator('#batch-print').click();
    await waitEvent('genera_document', 3);
    const batch = (await events('genera_document')).at(-1).data;
    assert.equal(batch.abast, 'lot');
    assert.equal(batch.quantitat, '2-5');
    assert.equal(batch.doble_cara, true);
    assert.equal(batch.colleccio, true);
    assert.equal((await events('genera_document')).length, 3, 'No duplicate beforeprint event');
    const batchResources = (await events('prepara_lectura')).slice(beforeResources);
    assert.equal(batchResources.length, selectionCodes.length);
    assert(batchResources.every(event => event.data.abast === 'lot' && event.data.format === 'impressio'));
    assert.equal(new Set(batchResources.map(event => event.data.codi + ':' + event.data.llengua)).size, selectionCodes.length);
    assert.deepEqual(batchResources.map(event => event.data.codi).sort(), [...selectionCodes].sort());
    for (const action of ['pdf-key', 'zip']) {
      const documentCount = (await events('genera_document')).length;
      const resourceCount = (await events('prepara_lectura')).length;
      await page.locator('#batch-print-trigger').click();
      const download = page.waitForEvent('download');
      await page.locator(`#batch-print-menu [data-option="${action}"]`).click();
      assert((await download).suggestedFilename().endsWith(action === 'zip' ? '.zip' : '.pdf'));
      await waitEvent('genera_document', documentCount + 1);
      const resources = (await events('prepara_lectura')).slice(resourceCount);
      assert.equal(resources.length, selectionCodes.length);
      assert(resources.every(event => event.data.format === (action === 'zip' ? 'zip' : 'pdf') &&
        event.data.contingut === (action.endsWith('-key') ? 'solucionari' : 'alumnat')));
    }
    const countsBeforeCancel = [(await events('genera_document')).length, (await events('prepara_lectura')).length];
    await page.evaluate(() => {
      document.querySelector('#batch-print').click();
      document.querySelector('#batch-dialog [data-close-dialog]').click();
    });
    await page.locator('#batch-dialog').waitFor({ state: 'hidden' });
    assert.deepEqual([(await events('genera_document')).length, (await events('prepara_lectura')).length], countsBeforeCancel,
      'An aborted preparation must not count the job or any of its readings');
    await page.locator('#batch-open').click();
    await page.locator('.batch-layout-tools > summary').click();
    const backupDownload = page.waitForEvent('download');
    await page.locator('#batch-export-backup').click();
    const backup = await backupDownload;
    await waitEvent('copia_configuracio');
    await page.locator('#batch-backup-file').setInputFiles(await backup.path());
    await page.locator('#batch-restore-backup').click();
    await waitEvent('copia_configuracio', 2);
    await page.locator('#batch-dialog [data-close-dialog]').click();
    await page.locator('#language-button').click();
    await page.locator('#language-menu [data-option="es"]').click();
    await waitEvent('canvia_idioma');

    await page.locator('#collection-exit').click();
    if (await page.locator('#catalog-filter-panel > summary').getAttribute('aria-expanded') === 'false') await page.locator('#catalog-filter-panel > summary > span').click();
    await select('#filter-level', 'primary-cycle-3');
    await select('#filter-difficulty', 'advanced');
    await select('#filter-length', 'long');
    const lengthFilter = (await events('aplica_filtre')).at(-1).data;
    assert.equal(lengthFilter.filtre, 'length');
    assert.equal(lengthFilter.cicle, 'primary-cycle-3');
    assert.equal(lengthFilter.dificultat_cicle, 'advanced');
    assert.equal(lengthFilter.extensio, 'long');
    assert.equal(lengthFilter.llengua, 'es');
    assert.equal(lengthFilter.abast, 'cataleg');
    assert.equal(lengthFilter.origen, 'selector');
    assert(['0', '1', '2-5', '6-15', '16-50', '51+'].includes(lengthFilter.resultats));
    await page.locator('#filters-reset').click();
    await select('#filter-universe', 'biblioteca-de-les-coses');
    const universeFilter = (await events('aplica_filtre')).at(-1).data;
    assert.equal(universeFilter.valor, 'biblioteca-de-les-coses');
    assert.equal(universeFilter.univers, 'biblioteca-de-les-coses');
    assert.equal(universeFilter.resultats, '6-15');
    await page.locator('#filter-family').check();
    const familyFilter = (await events('aplica_filtre')).at(-1).data;
    assert.equal(familyFilter.filtre, 'family');
    assert.equal(familyFilter.variants, true);
    assert.equal(familyFilter.resultats, '6-15');
    const familyCount = (await events('familia')).length;
    await page.locator('[data-family-id="biblioteca-objectes"] .card-open').click();
    await waitEvent('familia', familyCount + 1);
    assert.equal((await events('familia')).at(-1).data.familia, 'biblioteca-objectes');
    assert.equal((await events('familia')).at(-1).data.accio, 'obre');
    await page.locator('#family-options [data-reading="biblioteca-objetos-a-es"]').click();
    await page.waitForFunction(() => document.querySelector('#studio-reading-code').textContent === 'L208A');
    assert.equal((await events('obre_lectura')).at(-1).data.familia, 'biblioteca-objectes');
    await page.evaluate(() => window.print());
    const familyResource = (await events('prepara_lectura')).at(-1).data;
    assert.equal(familyResource.codi, 'L208A');
    assert.equal(familyResource.codi_base, 'L208');
    assert.equal(familyResource.variant, 'A');
    assert.equal(familyResource.univers, 'biblioteca-de-les-coses');
    await page.locator('.studio-compare:visible').first().click();
    await waitEvent('familia', familyCount + 2);
    assert.equal((await events('familia')).at(-1).data.accio, 'compara');
    await page.locator('#family-comparison-dialog [data-close-dialog]').click();
    if (await page.locator('.studio-universes > summary').getAttribute('aria-expanded') === 'false') await page.locator('.studio-universes > summary').click();
    await page.locator('.studio-universe button').click();
    assert.equal((await events('aplica_filtre')).at(-1).data.origen, 'lectura');
    await page.locator('#search').fill(canary);
    await waitEvent('cerca_cataleg', 3);
    const worldSearch = (await events('cerca_cataleg')).at(-1).data;
    assert.equal(worldSearch.univers, 'biblioteca-de-les-coses');
    assert.equal(worldSearch.resultats, '0');
    await page.locator('#filters-reset').click();

    await page.locator('#about-open').click();
    const about = page.locator('#about-dialog');
    await about.waitFor({ state: 'visible' });
    for (const image of await about.locator('img').all()) await image.evaluate(node => node.decode());
    const aboutLayout = await about.evaluate(dialog => Object.fromEntries(['v4v', 'author', 'privacy', 'sources'].map(id => {
      const node = dialog.querySelector('#about-' + id); const box = node.getBoundingClientRect(); return [id, { top: box.top, left: box.left }];
    })));
    assert(Math.abs(aboutLayout.v4v.top - aboutLayout.author.top) < 1);
    assert(Math.abs(aboutLayout.privacy.top - aboutLayout.sources.top) < 1);
    assert(aboutLayout.privacy.top > aboutLayout.v4v.top);
    assert(aboutLayout.privacy.left < aboutLayout.sources.left);
    if (process.env.TRAMA_SCREENSHOTS) await page.screenshot({ path: process.env.TRAMA_SCREENSHOTS + '/trama-v4v-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await about.evaluate(dialog => dialog.scrollWidth <= dialog.clientWidth));
    if (process.env.TRAMA_SCREENSHOTS) await page.screenshot({ path: process.env.TRAMA_SCREENSHOTS + '/trama-v4v-mobile.png' });
    await about.locator('[data-close-dialog]').click();

    const captured = await page.evaluate(() => ({ events: window.__events, raw: window.__rawEvents }));
    assert(!JSON.stringify(captured).includes(canary), 'No private field may reach the tracker');
    for (const event of captured.events) {
      assert.equal(event.url, '/');
      assert.equal(event.title, 'Trama');
      assert.equal(event.referrer, undefined);
    }
    const kinds = [...new Set(captured.events.map(e => e.name).filter(Boolean))];
    await main.context.close();
    for (const restriction of ['local', 'gpc', 'dnt', 'disabled', 'blocked']) {
      const check = await openPage(restriction, '#lectura=el-cartel-de-la-plaza-es');
      await check.page.locator('#studio-solution').check();
      await check.page.evaluate(() => window.print());
      assert.equal(await check.page.evaluate(() => window.__events.length), 0);
      assert.equal(check.scripts(), restriction === 'blocked' ? 1 : 0);
      assert(await check.page.locator('#studio-pages .worksheet-evidence-reference').count() > 0, 'Blocked analytics must not break the worksheet');
      await check.context.close();
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ events: captured.events.length, kinds, restrictions: 5, errors, network: 'local files and simulated tracker only' }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
