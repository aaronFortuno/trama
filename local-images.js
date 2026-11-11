export const rasterImagePattern = /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
export const tramaLogo = 'trama';
export const logoSource = value => value === tramaLogo ? 'assets/brand/trama-wordmark.svg' : value;

export async function imageFrom(source) {
  const image = new Image();
  image.src = source;
  await image.decode();
  return image;
}

export async function encodeImage(source, maxSide) {
  const image = await imageFrom(source);
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/webp', .92);
}
