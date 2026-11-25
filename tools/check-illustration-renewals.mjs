import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readings } from '../data/readings.js';
import { illustrationRenewals } from '../data/illustration-renewals.js';
const require = createRequire('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const sharp = require('sharp');
const ledger = JSON.parse(fs.readFileSync('docs/illustration-renewal-2026-11-25.json', 'utf8'));
assert.equal(ledger.readings.length, 66);
assert.equal(new Set(ledger.readings.map(item => item.code)).size, 66);
let complete = 0;
for (const item of ledger.readings) for (const image of item.images) {
  if (image.status !== 'complete') continue;
  complete++;
  assert(image.prompt && image.visualReview && image.generator === 'built-in image_gen');
  assert.deepEqual(illustrationRenewals[image.previousSrc], { src: image.src, width: image.width, height: image.height });
  const metadata = await sharp(image.src).metadata();
  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, image.width);
  assert.equal(metadata.height, image.height);
  assert.equal(createHash('sha256').update(fs.readFileSync(image.src)).digest('hex'), image.sha256);
  for (const language of ['ca', 'es']) {
    const reading = readings.find(reading => reading.code === item.code && reading.language === language);
    const actual = reading.images.find(actual => actual.id === image.id);
    assert(actual && actual.src === image.src, `${item.code}:${language}:${image.id}`);
    assert(actual.alt && actual.afterParagraph === image.afterParagraph, 'Keep descriptions and placement');
  }
}
for (const reading of readings) for (const image of reading.images) {
  assert(!Object.hasOwn(illustrationRenewals, image.src), `${reading.code}: outdated image reference`);
}
assert.equal(complete, Object.keys(illustrationRenewals).length);
assert.equal(complete, ledger.progress.completedImages);
const completedReadings = ledger.readings.filter(item => item.images.every(image => image.status === 'complete')).length;
assert.equal(completedReadings, ledger.progress.completedReadings);
if (process.argv.includes('--complete')) {
  assert.equal(completedReadings, ledger.readings.length);
  assert.equal(complete, ledger.progress.totalImages);
}
console.log(JSON.stringify({ ...ledger.progress, languages: ['ca', 'es'], resources: 'ok', references: 'ok' }));
