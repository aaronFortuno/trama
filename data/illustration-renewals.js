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
  },
  "assets/readings/mapa-escucha.svg": {
    "src": "assets/readings/mapa-escucha-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/mapa-plano.svg": {
    "src": "assets/readings/mapa-plano-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/l107-una-guirnalda-de-papel.svg": {
    "src": "assets/readings/l107-una-guirnalda-de-papel-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/l109-a-la-sombra-del-puente.svg": {
    "src": "assets/readings/l109-a-la-sombra-del-puente-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/l114-la-sombra-del-titere.svg": {
    "src": "assets/readings/l114-la-sombra-del-titere-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/l137-gotas-que-se-juntan.svg": {
    "src": "assets/readings/l137-gotas-que-se-juntan-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/l108-la-caja-de-los-dibujos.svg": {
    "src": "assets/readings/l108-la-caja-de-los-dibujos-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/ballena-cola.svg": {
    "src": "assets/readings/ballena-cola-illustration.webp",
    "width": 1100,
    "height": 733
  },
  "assets/readings/ballena-fotos.svg": {
    "src": "assets/readings/ballena-fotos-illustration.webp",
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
