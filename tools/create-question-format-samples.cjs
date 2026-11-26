// Real, local-only worksheet crops. No synthesized example text or remote QA.
const { fork } = require('node:child_process');
const fs = require('node:fs');
const { chromium } = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const base = 'http://127.0.0.1:4211/';
(async () => {
  const server = fork('tools/serve.cjs', { env: { ...process.env, PORT: '4211' }, stdio: ['ignore', 'pipe', 'inherit', 'ipc'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.once('error', reject); server.stdout.once('data', resolve); });
    browser = await chromium.launch({ channel: 'chrome' });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    await page.route('**/*', route => route.request().url().startsWith(base) || route.request().url().startsWith('data:') ? route.continue() : route.abort());
    await page.goto(base); await page.locator('.reading-card').first().waitFor();
    fs.mkdirSync('assets/examples', { recursive: true });
    for (const language of ['ca', 'es']) for (const mode of ['open', 'choice']) {
      await page.evaluate(async ({ language, mode }) => {
        const { readings } = await import('./data/readings.js');
        const { renderWorksheet } = await import('./worksheet.js');
        const { defaultSettings } = await import('./worksheet-code.js');
        document.querySelector('#sample-capture')?.remove();
        const reading = readings.find(item => item.code === 'L001' && item.language === language);
        const root = document.createElement('div'); root.id = 'sample-capture';
        root.style.cssText = '--preview-scale:1;position:absolute;left:0;top:0;z-index:99999;width:210mm;background:white;color:black;display:grid;gap:16px';
        document.body.append(root);
        renderWorksheet(root, reading, { ...defaultSettings(reading.level), questionMode: mode }, { interactive: false });
        await document.fonts.ready;
      }, { language, mode });
      const png = await page.locator('#sample-capture .worksheet-question').first().screenshot();
      await sharp(png).resize({ width: 1440 }).webp({ quality: 90 }).toFile(`assets/examples/question-format-${mode}-${language}.webp`);
    }
    console.log('Four localized worksheet crops saved.');
  } finally { await browser?.close(); server.kill(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
