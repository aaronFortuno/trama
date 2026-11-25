// Published raster replacements, shared by translations and family variants.
export const illustrationRenewals = {
  "assets/readings/l104-el-banco-mojado.svg": {
    "src": "assets/readings/l104-el-banco-mojado-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/l118-el-rincon-de-bruna.svg": {
    "src": "assets/readings/l118-el-rincon-de-bruna-illustration.webp",
    "width": 1100,
    "height": 733
  }
};

export function applyIllustrationRenewals(reading) {
  let changed = false;
  const images = reading.images.map(image => {
    if (!Object.hasOwn(illustrationRenewals, image.src)) return image;
    changed = true;
    return { ...image, ...illustrationRenewals[image.src] };
  });
  return changed ? { ...reading, images } : reading;
}
