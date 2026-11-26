const assert = require('node:assert/strict');
const sharp = require('C:/Users/afortun8/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const arg = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const code = arg('code'), source = arg('source');
assert(/^L2[67]\d$/.test(code ?? '') && source);
sharp(source).resize(1100, 733, { fit: 'cover' }).webp({ quality: 88 })
  .toFile(`assets/readings/${code.toLowerCase()}-biblioteca.webp`)
  .then(info => console.log(JSON.stringify({ code, ...info })))
  .catch(error => { console.error(error); process.exitCode = 1; });
