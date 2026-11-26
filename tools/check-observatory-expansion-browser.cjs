const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:4215/';
const code = process.argv.find(arg => arg.startsWith('--code='))?.slice(7);
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4215' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('trama.question-format-seen.v1', '1'));
    page.on('pageerror', error => errors.push(error.stack));
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.goto(base); await page.locator('.reading-card').first().waitFor();
    const result = await page.evaluate(async code => {
      const { readings } = await import('./data/readings.js');
      const { observatoryPublications } = await import('./data/observatory-expansion.js');
      const { multipleChoice } = await import('./data/question-choices.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { renderWorksheet, decodeWorksheetImages } = await import('./worksheet.js');
      const { loadWorksheetFont } = await import('./worksheet-fonts.js');
      const { familyMembers, groupFamilyCards } = await import('./reading-families.js');
      const { indexCatalog, filterCatalog } = await import('./catalog.js');
      const selected = observatoryPublications.filter(entry => !code || entry.code === code);
      if (!selected.length) throw Error('No published families to check');
      for (const language of ['es', 'ca']) {
        const catalog = groupFamilyCards(filterCatalog(indexCatalog(readings), { language, universe: 'observatori-del-turo' }));
        if (catalog.length !== 6 + observatoryPublications.length) throw Error('Universe must count families once');
      }
      const host = document.createElement('div'); host.className = 'worksheet-export-layout'; document.body.append(host);
      let scenarios = 0, pages = 0;
      for (const publication of selected) for (const entry of publication.readings) {
        const reading = readings.find(reading => reading.id === entry.id);
        const family = familyMembers(readings, reading);
        if (family.map(member => member.code).join() !== [publication.code + 'A', publication.code, publication.code + 'B'].join()) throw Error('Wrong family order');
        const available = reading.questions.filter(question => multipleChoice(reading, question));
        for (const extreme of [false, true]) for (const mode of ['open', 'choice']) for (const answerKey of [false, true]) {
          const settings = { ...defaultSettings(reading.level), questionMode: mode, ...(extreme ? { fontSize: 18, leading: 4.8, marginTop: 28, marginBottom: 28, marginLeft: 28, marginRight: 28 } : {}) };
          await loadWorksheetFont(settings.font);
          renderWorksheet(host, reading, settings, { answerKey, interactive: false });
          const sheets = [...host.querySelectorAll('.worksheet-page')];
          await decodeWorksheetImages(sheets);
          if ([...host.querySelectorAll('img')].some(image => !image.complete || !image.naturalWidth)) throw Error('Image missing: ' + reading.id);
          const count = mode === 'choice' ? available.length : 0;
          if (host.querySelectorAll('.worksheet-choice').length !== count * 4) throw Error('Lost choices: ' + reading.id);
          if (host.querySelectorAll('.worksheet-choice.is-correct').length !== (answerKey ? count : 0)) throw Error('Wrong answer marks: ' + reading.id);
          if (host.querySelector('button')) throw Error('Interactive controls in export');
          if (host.querySelectorAll('.worksheet-question-block:not(.worksheet-question-continuation)').length !== reading.questions.length) throw Error('Lost question: ' + reading.id);
          for (const content of host.querySelectorAll('.worksheet-content')) if (content.scrollHeight > content.clientHeight + 2) throw Error('Page overflow: ' + reading.id);
          if (mode === 'choice') for (const question of available) {
            const block = host.querySelector(`[data-question-id="${CSS.escape(question.id)}"]`);
            if (block.dataset.responseMode !== 'choice' || block.querySelector('.worksheet-prompt').textContent !== multipleChoice(reading, question).prompt) throw Error('Wrong response form');
            if (block.querySelector('.worksheet-answer-line')) throw Error('Lines retained in ABCD');
          }
          scenarios++; pages += sheets.length;
        }
      }
      host.remove();
      return { families: selected.length, languageVersions: selected.length * 6, scenarios, pages, sampleId: selected[0].readings.find(reading => reading.code === selected[0].code && reading.language === 'ca').id };
    }, code);
    await page.goto(base + '#lectura=' + result.sampleId);
    await page.locator('#studio-pages .worksheet-page').first().waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('#studio-pages img')].every(image => image.complete && image.naturalWidth));
    await page.screenshot({ path: `imports/qa/observatory-${code ?? 'all'}-studio.png` });
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ...result, errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
