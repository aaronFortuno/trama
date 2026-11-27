// Integrate one visually reviewed image. No generation, network or Git.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { nextMaterialRelease, recordRelease } from './record-release.mjs';

const require = createRequire('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const sharp = require('sharp');
const jobPath = process.argv[2];
assert(jobPath, 'Pass a local JSON job file');
const job = JSON.parse(fs.readFileSync(jobPath, 'utf8'));
assert(job.visualReview && job.prompt && job.source);
const ledgerPath = 'docs/illustration-renewal-2026-11-25.json';
const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
const reading = ledger.readings.find(item => item.code === job.code);
assert(reading, 'Reading is outside the requested list');
const image = reading.images.find(item => item.id === job.imageId);
assert(image, 'Unknown illustration');
assert.equal(image.status, 'pending', 'Already integrated; review the existing record before replacing again');
const metadata = await sharp(job.source).metadata();
assert(metadata.width >= 1024 && metadata.height >= 640, 'The final source should have enough resolution for print');
const destination = path.resolve(image.src);
assert(destination.startsWith(path.resolve('assets/readings') + path.sep));
await sharp(job.source).rotate().resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 86, effort: 5 }).toFile(destination);
const final = await sharp(destination).metadata();
Object.assign(image, {
  status: 'complete', width: final.width, height: final.height,
  generated: job.date ?? '2026-11-25', generator: 'built-in image_gen',
  prompt: job.prompt, ...(job.editPrompt ? { editPrompt: job.editPrompt } : {}),
  visualReview: job.visualReview,
  sha256: createHash('sha256').update(fs.readFileSync(destination)).digest('hex'),
});
const mapping = {};
for (const item of ledger.readings) for (const asset of item.images.filter(asset => asset.status === 'complete')) {
  mapping[asset.previousSrc] = { src: asset.src, width: asset.width, height: asset.height };
}
const module = `// Published raster replacements, shared by translations and family variants.\nexport const illustrationRenewals = ${JSON.stringify(mapping, null, 2)};\n\nexport function applyIllustrationRenewals(reading) {\n  let changed = false;\n  const images = reading.images.map(image => {\n    if (!Object.hasOwn(illustrationRenewals, image.src)) return image;\n    changed = true;\n    return { ...image, ...illustrationRenewals[image.src] };\n  });\n  return changed ? { ...reading, images } : reading;\n}\n`;
fs.writeFileSync('data/illustration-renewals.js', module);
const completedReadings = ledger.readings.filter(item => item.images.every(asset => asset.status === 'complete'));
ledger.progress = {
  completedReadings: completedReadings.length, totalReadings: ledger.readings.length,
  completedImages: Object.keys(mapping).length,
  totalImages: ledger.readings.reduce((total, item) => total + item.images.length, 0),
};
const readingComplete = reading.images.every(asset => asset.status === 'complete');
if (readingComplete) {
  const version = nextMaterialRelease();
  reading.edition = 'v' + version;
  const amount = reading.images.length;
  recordRelease({ version, date: job.date ?? '2026-11-25',
    ca: `Renovades les ${amount === 1 ? 'il·lustracions de la' : 'il·lustracions de la'} ${reading.code} amb imatges pintades, compartides entre català, castellà i les variants de família. La renovació acumula ${completedReadings.length} de ${ledger.readings.length} lectures de la llista.`,
    es: `Renovadas las ilustraciones de ${reading.code} con imágenes pintadas, compartidas entre catalán, castellano y las variantes de familia. La renovación acumula ${completedReadings.length} de ${ledger.readings.length} lecturas de la lista.`,
  });
}
fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2) + '\n');
console.log(JSON.stringify({ code: job.code, imageId: job.imageId, src: image.src, width: image.width, height: image.height,
  readingComplete, edition: reading.edition, ...ledger.progress }));
