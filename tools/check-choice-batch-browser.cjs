const assert = require('node:assert/strict');
const { fork } = require('node:child_process');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = 'http://127.0.0.1:4207/';
const batch = process.argv.find(arg => arg.startsWith('--batch='))?.slice(8);
assert(/^\d{3}$/.test(batch ?? ''), 'Use --batch=001');
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4207' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  const errors = [];
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1450, height: 1000 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.stack));
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    const result = await page.evaluate(async batch => {
      const { readings } = await import('./data/readings.js');
      const { choiceBatches } = await import('./data/question-choices-batches.js');
      const { multipleChoice } = await import('./data/question-choices.js');
      const { defaultSettings } = await import('./worksheet-code.js');
      const { renderWorksheet } = await import('./worksheet.js');
      const { loadWorksheetFont } = await import('./worksheet-fonts.js');
      const selected = choiceBatches.find(entry => entry.id === batch);
      if (!selected) throw Error('Batch is not registered');
      const host = document.createElement('div'); host.className = 'worksheet-export-layout'; document.body.append(host);
      let scenarios = 0;
      for (const entry of selected.readings) {
        const reading = readings.find(reading => reading.code === entry.code && reading.language === entry.language);
        const available = reading.questions.filter(question => multipleChoice(reading, question));
        for (const extreme of [false, true]) for (const mode of ['open', 'choice']) for (const answerKey of [false, true]) {
          const settings = { ...defaultSettings(reading.level), questionMode: mode, ...(extreme ? { fontSize: 20, leading: 6, marginTop: 32, marginBottom: 32, marginLeft: 32, marginRight: 32 } : {}) };
          await loadWorksheetFont(settings.font);
          renderWorksheet(host, reading, settings, { answerKey, interactive: false });
          const count = mode === 'choice' ? available.length : 0;
          if (host.querySelectorAll('.worksheet-choice').length !== count * 4) throw Error('Lost choices: ' + reading.id);
          if (host.querySelectorAll('.worksheet-choice.is-correct').length !== (answerKey ? count : 0)) throw Error('Wrong answer marks: ' + reading.id);
          if (host.querySelector('button')) throw Error('Interactive controls in export');
          for (const content of host.querySelectorAll('.worksheet-content')) if (content.scrollHeight > content.clientHeight + 2) throw Error('Page overflow: ' + reading.id);
          if (mode === 'choice') for (const question of available) {
            const block = host.querySelector(`[data-question-id="${CSS.escape(question.id)}"]`);
            const alternative = multipleChoice(reading, question);
            if (block.dataset.responseMode !== 'choice' || block.querySelector('.worksheet-prompt').textContent !== alternative.prompt) throw Error('Wrong response form: ' + reading.id);
            if (block.querySelector('.worksheet-answer-line')) throw Error('Lines retained in ABCD: ' + reading.id);
            if (answerKey && !host.textContent.includes(alternative.correct.toUpperCase() + '. ')) throw Error('Answer letter missing');
          }
          scenarios++;
        }
      }
      host.remove();
      return { batch, languageVersions: selected.readings.length, scenarios };
    }, batch);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ ...result, errors }));
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
