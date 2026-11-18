const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:4200/';

(async () => {
  const { readings } = await import('../data/readings.js');
  const sample = readings.filter(r => r.language === 'es').slice(0, 5);
  const ids = sample.map(r => r.id);
  const hidden = readings.find(r => r.code === sample[0].code && r.language === 'ca').id;
  const seed = [{ id: 'gestures-main', name: 'Principal', readingIds: [...ids, hidden] }, { id: 'gestures-other', name: 'Una altra', readingIds: [ids[4]] }];
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4200' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    async function start(options = {}) {
      const context = await browser.newContext({ viewport: { width: 1500, height: 1000 }, reducedMotion: 'reduce', ...options });
      await context.addInitScript(seed => {
        if (localStorage.getItem('gestures-test-seeded')) return;
        localStorage.setItem('trama.collections.v1', JSON.stringify(seed));
        localStorage.setItem('trama.collection.active.v1', seed[0].id);
        localStorage.setItem('trama.catalog-language', 'es');
        localStorage.setItem('gestures-test-seeded', '1');
      }, seed);
      const page = await context.newPage();
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
      await page.goto(base);
      await page.locator('#reading-grid .reading-card').first().waitFor();
      return { context, page };
    }
    const { page, context } = await start();
    const order = () => page.evaluate(() => JSON.parse(localStorage.getItem('trama.collections.v1'))[0].readingIds);
    const visible = () => page.locator('#reading-grid .reading-card').evaluateAll(cards => cards.map(card => card.dataset.id));
    const button = id => page.locator(`.card-open[data-id="${id}"]`);
    const field = (selector, value) => page.locator(selector).evaluate((node, value) => { node.value = value; node.dispatchEvent(new Event('change', { bubbles: true })); }, value);
    const back = () => page.locator('[data-action="catalog"]').click();
    assert.equal(await page.locator('#collection-manage, #collection-library').count(), 0);
    const layoutKey = `trama.collection-layout.v1:gestures-main:${ids[0]}`;
    const layout = await page.evaluate(async ({ id, key }) => {
      const { readings } = await import('./data/readings.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { writeWorksheetLayout } = await import('./worksheet-layouts.js');
      const reading = readings.find(r => r.id === id);
      writeWorksheetLayout(localStorage, id, { ...defaultSettings(reading.level), classroomCode: '5.2.7', showClassroomCode: true, fontSize: 14 }, 'gestures-main');
      return localStorage.getItem(key);
    }, { id: ids[0], key: layoutKey });

    // A short click opens the worksheet in its collection with its own format.
    await button(ids[0]).click();
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    assert.equal(await page.locator('[name="classroomCode"]').inputValue(), '5.2.7');
    await back();

    async function drag(fromId, toId) {
      const from = await button(fromId).evaluate(node => node.closest('.reading-card').getBoundingClientRect().toJSON());
      const to = await button(toId).evaluate(node => node.closest('.reading-card').getBoundingClientRect().toJSON());
      await page.mouse.move(from.x + from.width / 2, from.y + 65);
      await page.mouse.down();
      await page.mouse.move(from.x + from.width / 2 + 12, from.y + 65);
      await page.waitForFunction(() => document.body.classList.contains('is-catalog-dragging'));
      await page.mouse.move(to.x + to.width * .8, to.y + 65, { steps: 15 });
      await page.waitForTimeout(180);
      await page.mouse.up();
    }
    await drag(ids[0], ids[2]);
    await page.waitForFunction(id => JSON.parse(localStorage.getItem('trama.collections.v1'))[0].readingIds[2] === id, ids[0]);
    assert.deepEqual(await order(), [ids[1], ids[2], ids[0], ids[3], ids[4], hidden]);
    assert.deepEqual(await visible(), [ids[1], ids[2], ids[0], ids[3], ids[4]]);
    assert.equal(await page.locator('#catalog-view').isVisible(), true);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), layoutKey), layout);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('trama.collections.v1'))[1].readingIds), seed[1].readingIds);
    // Dropping after the last visible item must not jump past the hidden language.
    await drag(ids[0], ids[4]);
    await page.waitForFunction(id => JSON.parse(localStorage.getItem('trama.collections.v1'))[0].readingIds[4] === id, ids[0]);
    assert.deepEqual(await order(), [ids[1], ids[2], ids[3], ids[4], ids[0], hidden]);
    await button(ids[0]).focus();
    await page.keyboard.press('Alt+ArrowLeft');
    await page.keyboard.press('Alt+ArrowLeft');
    assert.deepEqual(await order(), [ids[1], ids[2], ids[0], ids[3], ids[4], hidden]);
    await page.reload();
    await button(ids[1]).waitFor();
    assert.equal((await visible())[0], ids[1]);
    await button(ids[1]).click();
    await page.locator('[data-action="reading-next"]').click();
    await page.waitForFunction(id => new URLSearchParams(location.hash.slice(1)).get('lectura') === id, ids[2]);
    await back();

    // Keyboard reordering uses the same persistent collection order.
    await button(ids[1]).focus();
    await page.keyboard.press('Alt+ArrowRight');
    assert.deepEqual((await order()).slice(0, 3), [ids[2], ids[1], ids[0]]);
    assert.equal(await page.evaluate(() => document.activeElement.dataset.id), ids[1]);
    await page.keyboard.press('Shift+F10');
    await page.waitForFunction(() => document.querySelector('#card-context-menu').matches(':popover-open'));
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.id), ids[1]);

    // Failed persistence restores the DOM, not just the stored ordering.
    const beforeFailure = await order();
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      window.restoreStorage = () => { Storage.prototype.setItem = original; };
      Storage.prototype.setItem = function (key, value) {
        if (key === 'trama.collections.v1') throw new DOMException('Full', 'QuotaExceededError');
        return original.call(this, key, value);
      };
    });
    await button(ids[1]).focus();
    await page.keyboard.press('Alt+ArrowRight');
    assert.deepEqual(await order(), beforeFailure);
    assert.deepEqual(await visible(), beforeFailure.filter(id => id !== hidden));
    assert((await page.locator('#collection-status').textContent()).includes('desar'));
    await page.evaluate(() => window.restoreStorage());

    // Holding opens actions; releasing must never navigate to the worksheet.
    const held = await button(ids[0]).evaluate(node => node.closest('.reading-card').getBoundingClientRect().toJSON());
    await page.mouse.move(held.x + held.width / 2, held.y + 65);
    await page.mouse.down();
    await page.waitForFunction(() => document.querySelector('#card-context-menu').matches(':popover-open'));
    await page.mouse.up();
    assert.equal(await page.locator('#catalog-view').isVisible(), true);
    await page.locator('[data-card-option="remove"]').click();
    assert(!(await order()).includes(ids[0]));
    assert.equal(await page.evaluate(key => localStorage.getItem(key), layoutKey), layout, 'Removal must retain the private layout');

    // From the general catalogue, add the same reading back to an existing collection.
    await field('#collection-select', '');
    await page.locator('#search').fill(sample[0].code);
    await button(ids[0]).click({ button: 'right' });
    assert.equal(await page.locator('[data-card-option="remove"]').isVisible(), false);
    await page.locator('[data-card-option="add"]').click();
    await page.locator('[data-collection-target="gestures-main"]').click();
    assert((await order()).includes(ids[0]));
    assert.equal(await page.locator('#collection-dialog').isVisible(), false);
    assert.equal(await page.locator('#collection-select').inputValue(), '', 'Direct add must keep the current catalogue view');
    assert.equal(await page.locator('[data-collection-target="gestures-main"]').isDisabled(), true);
    assert((await page.locator('.card-collection-status').textContent()).includes('Principal'));
    assert.equal(await page.evaluate(key => localStorage.getItem(key), layoutKey), layout);

    // Create inline, preserve validation errors, and copy the scoped format.
    await field('#collection-select', 'gestures-main');
    await button(ids[0]).click({ button: 'right' });
    await page.locator('[data-card-option="add"]').click();
    assert.equal(await page.locator('[data-collection-target="gestures-main"]').isDisabled(), true);
    await page.locator('[data-card-collection-new]').click();
    await page.locator('#card-collection-name').fill('Principal');
    await page.locator('#card-collection-name').press('Enter');
    assert.equal(await page.locator('#card-collection-name').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('trama.collections.v1')).length), 2);
    await page.locator('#card-collection-name').fill('Nova selecció');
    await page.locator('#card-collection-name').press('Enter');
    const created = await page.evaluate(() => JSON.parse(localStorage.getItem('trama.collections.v1')).find(entry => entry.name === 'Nova selecció'));
    assert.deepEqual(created.readingIds, [ids[0]]);
    assert.equal(await page.locator('#collection-dialog').isVisible(), false);
    assert.equal(await page.locator('#collection-select').inputValue(), 'gestures-main');
    assert.equal(await page.evaluate(({ id, readingId }) => localStorage.getItem(`trama.collection-layout.v1:${id}:${readingId}`), { id: created.id, readingId: ids[0] }), layout);
    await page.mouse.click(20, 20);

    // Selection mode disables drag and long-press options while keeping card clicks.
    const summary = page.locator('#catalog-collection-panel > summary');
    if (await summary.getAttribute('aria-expanded') === 'false') await summary.click();
    await page.locator('#collection-save').click();
    const selectionOrder = await order();
    const choice = page.locator('#reading-grid .card-open').first();
    const heldSelection = await choice.boundingBox();
    await page.mouse.move(heldSelection.x + 20, heldSelection.y + 12);
    await page.mouse.down();
    await page.waitForTimeout(650);
    await page.mouse.up();
    assert.equal(await choice.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#card-context-menu').evaluate(node => node.matches(':popover-open')), false);
    assert.deepEqual(await order(), selectionOrder);
    await page.locator('#selection-cancel').click();
    await context.close();

    async function touch(client, type, x, y) {
      await client.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1, radiusX: 2, radiusY: 2, force: 1 }] });
    }
    // A quick vertical gesture on a phone scrolls, rather than grabbing a card.
    const phone = await start({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const client = await phone.context.newCDPSession(phone.page);
    const art = phone.page.locator('#reading-grid .card-art').first();
    await art.scrollIntoViewIfNeeded();
    const artBox = await art.boundingBox();
    const scrollBefore = await phone.page.evaluate(() => document.querySelector('#contingut').scrollTop + document.querySelector('.catalog-results-scroll').scrollTop);
    await touch(client, 'touchStart', artBox.x + 100, artBox.y + 75);
    for (let step = 1; step <= 8; step++) {
      await touch(client, 'touchMove', artBox.x + 100, artBox.y + 75 - step * 12);
      await phone.page.waitForTimeout(12);
    }
    await touch(client, 'touchEnd');
    await phone.page.waitForTimeout(200);
    const scrollAfter = await phone.page.evaluate(() => document.querySelector('#contingut').scrollTop + document.querySelector('.catalog-results-scroll').scrollTop);
    assert(scrollAfter > scrollBefore, 'Phone scrolling must remain usable');
    assert.deepEqual(await phone.page.evaluate(() => JSON.parse(localStorage.getItem('trama.collections.v1'))[0].readingIds), seed[0].readingIds);
    await art.scrollIntoViewIfNeeded();
    const holdBox = await art.boundingBox();
    await touch(client, 'touchStart', holdBox.x + 100, holdBox.y + 65);
    await phone.page.waitForFunction(() => document.querySelector('#card-context-menu').matches(':popover-open'));
    await touch(client, 'touchEnd');
    assert.equal(await phone.page.locator('#catalog-view').isVisible(), true);
    await phone.page.locator('[data-card-option="add"]').tap();
    await phone.page.locator('[data-card-collection-new]').tap();
    await phone.page.locator('#card-collection-name').fill('Tàctil');
    await phone.page.locator('.card-collection-form button[type="submit"]').tap();
    assert.equal(await phone.page.locator('#collection-dialog').isVisible(), false);
    assert(await phone.page.evaluate(() => JSON.parse(localStorage.getItem('trama.collections.v1')).some(entry => entry.name === 'Tàctil')));
    await phone.page.keyboard.press('Escape');
    await phone.context.close();

    // After a short hold, a deliberate touch drag can reorder on a tablet.
    const tablet = await start({ viewport: { width: 1100, height: 1000 }, hasTouch: true });
    const tabletClient = await tablet.context.newCDPSession(tablet.page);
    const from = await tablet.page.locator('#reading-grid .reading-card').nth(0).boundingBox();
    const to = await tablet.page.locator('#reading-grid .reading-card').nth(1).boundingBox();
    await touch(tabletClient, 'touchStart', from.x + from.width / 2, from.y + 65);
    await tablet.page.waitForTimeout(270);
    await touch(tabletClient, 'touchMove', from.x + from.width / 2 + 15, from.y + 65);
    await tablet.page.waitForFunction(() => document.body.classList.contains('is-catalog-dragging'));
    await touch(tabletClient, 'touchMove', to.x + to.width * .85, to.y + 65);
    await tablet.page.waitForTimeout(180);
    await touch(tabletClient, 'touchEnd');
    await tablet.page.waitForFunction(id => JSON.parse(localStorage.getItem('trama.collections.v1'))[0].readingIds[0] !== id, ids[0]);
    assert.equal(await tablet.page.locator('#catalog-view').isVisible(), true);
    await tablet.context.close();
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ mouseDrag: true, keyboard: true, persistence: true, scopedLayouts: true, failureRecovery: true, contextActions: true, selection: true, phoneScrollAndHold: true, touchDrag: true, errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
