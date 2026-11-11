import { embeddedFontStyles } from './worksheet-fonts.js';

const widthMm = 210;
const heightMm = 297;
const px = 96 / 25.4;
const pt = 72 / 25.4;
const svgNamespace = 'http://www.w3.org/2000/svg';
const htmlNamespace = 'http://www.w3.org/1999/xhtml';

async function fetchLocal(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load ${url}`);
  return response;
}

async function fileData(url) {
  const blob = await (await fetchLocal(url)).blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function rasterize(page, css, images) {
  const svg = document.createElementNS(svgNamespace, 'svg');
  const foreign = document.createElementNS(svgNamespace, 'foreignObject');
  const markup = document.createElementNS(htmlNamespace, 'div');
  const style = document.createElementNS(htmlNamespace, 'style');
  for (const node of [svg, foreign]) {
    node.setAttribute('width', String(widthMm * px));
    node.setAttribute('height', String(heightMm * px));
  }
  style.textContent = `*, *::before, *::after { box-sizing: border-box; }\n${css}`;
  await Promise.all(Array.from(page.querySelectorAll('img'), async image => {
    const url = image.src;
    if (url.startsWith('data:')) return;
    if (!images.has(url)) images.set(url, fileData(url));
    image.src = await images.get(url);
  }));
  markup.append(style, page);
  foreign.append(markup);
  svg.append(foreign);

  const bitmap = new Image();
  bitmap.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  await bitmap.decode();
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(widthMm * px * 2.5);
  canvas.height = Math.round(heightMm * px * 2.5);
  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  try {
    return canvas.toDataURL('image/png');
  } finally {
    canvas.width = canvas.height = 0;
  }
}

export async function downloadPdf(pages, { title, filename }) {
  const [, stylesheet, fonts] = await Promise.all([
    import('./assets/vendor/pdf-lib.min.js'),
    fetchLocal(new URL('studio.css', import.meta.url)).then(response => response.text()),
    embeddedFontStyles(pages.map(page => page.dataset.font), fileData),
  ]);
  const pdf = await globalThis.PDFLib.PDFDocument.create();
  pdf.setTitle(title);
  pdf.setCreator('Trama');
  const images = new Map();
  for (const sheet of pages) {
    const image = await pdf.embedPng(await rasterize(sheet, fonts + '\n' + stylesheet, images));
    const page = pdf.addPage([widthMm * pt, heightMm * pt]);
    page.drawImage(image, { x: 0, y: 0, width: widthMm * pt, height: heightMm * pt });
  }
  const url = URL.createObjectURL(new Blob([await pdf.save()], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
