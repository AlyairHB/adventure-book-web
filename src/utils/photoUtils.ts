import { Photo } from "../types/types";
import { PAGE_W, SAFE_H, PHOTOS_PER_PAGE, MAX_PAGES } from "../types/constants";

let uid = 1;

export const newPhoto = (): Photo => ({
  id: uid++,
  x: 100 + Math.random() * 100,
  y: 60 + Math.random() * 80,
  w: 200,
  h: 240,
  rot: parseFloat((Math.random() * 6 - 3).toFixed(1)),
  caption: "",
  src: null,
});

export const blankPage = () => ({
  id: uid++,
  globe: Math.random() > 0.5, // Alternar aleatoriamente si tiene globo
  notes: [],
});

// Función para calcular el número de páginas necesarias
export function calculateRequiredPages(totalPhotos: number): number {
  const requiredPages = Math.ceil(totalPhotos / PHOTOS_PER_PAGE);
  return Math.min(requiredPages, MAX_PAGES); // Aplicar límite máximo si existe
}

// Generar páginas automáticamente basadas en la cantidad de fotos
export function generatePagesFromPhotoCount(
  totalPhotos: number,
  existingPages: any[] = [],
) {
  const requiredPages = calculateRequiredPages(totalPhotos);

  // Si ya tenemos suficientes páginas, devolvemos las existentes
  if (existingPages.length >= requiredPages) {
    return existingPages.slice(0, requiredPages);
  }

  // Necesitamos crear más páginas
  const newPages = [...existingPages];
  for (let i = existingPages.length; i < requiredPages; i++) {
    newPages.push(blankPage());
  }

  return newPages;
}

// Versión mejorada de collageLayoutForPage
export function collageLayoutForPage(
  items: Array<{
    name?: string;
    directUrl?: string | null;
    thumbnailUrl?: string | null;
  }>,
  pageIndex: number,
  totalPhotosInPage: number,
): Photo[] {
  const count = Math.min(items.length, PHOTOS_PER_PAGE);
  if (count === 0) return [];

  // Configurar tamaño según cantidad de fotos - más grande con menos fotos
  const sizeConfig = {
    1: { cols: 1, rows: 1, sizeFactor: 0.65 }, // 1 foto: 65% de la celda
    2: { cols: 2, rows: 1, sizeFactor: 0.6 }, // 2 fotos: 60% de la celda
    3: { cols: 2, rows: 2, sizeFactor: 0.55 }, // 3 fotos: 55% de la celda
    4: { cols: 2, rows: 2, sizeFactor: 0.5 }, // 4 fotos: 50% de la celda
    5: { cols: 3, rows: 3, sizeFactor: 0.5 },
    6: { cols: 3, rows: 2, sizeFactor: 0.5 },
  };

  const config = sizeConfig[count];
  const cellW = PAGE_W / config.cols;
  const cellH = SAFE_H / config.rows;

  // Calcular tamaño basado en factor
  let photoW = Math.round(cellW * config.sizeFactor);
  let photoH = Math.round(photoW / 0.82);

  // Ajustar si es muy alto
  const maxH = Math.round(cellH * 0.95);
  if (photoH > maxH) {
    photoH = maxH;
    photoW = Math.round(photoH * 0.82);
  }

  return items.slice(0, count).map((item, i) => {
    const col = i % config.cols;
    const row = Math.floor(i / config.cols);

    // Usar pageIndex y i para generar posiciones únicas pero consistentes
    const seed = pageIndex * 100 + i;
    const jx = ((((seed * 13) % 100) - 50) / 100) * cellW * 0.05;
    const jy = ((((seed * 17) % 100) - 50) / 100) * cellH * 0.05;

    const cx = cellW * col + cellW / 2 + jx;
    const cy = cellH * row + cellH / 2 + jy;

    return {
      id: uid++,
      x: Math.round(cx - photoW / 2),
      y: Math.round(cy - photoH / 2),
      w: photoW,
      h: photoH,
      rot: parseFloat((((seed * 19) % 400) / 100 - 2).toFixed(1)),
      caption: item.name || "",
      src: item.directUrl || item.thumbnailUrl || null,
    };
  });
}

// Función principal mejorada para distribuir fotos
export function distributePhotosAcrossPages(
  items: Array<{
    name?: string;
    directUrl?: string | null;
    thumbnailUrl?: string | null;
  }>,
  existingPages: any[],
): { pages: any[]; photos: Photo[][] } {
  // Calcular cuántas páginas necesitamos
  const requiredPages = calculateRequiredPages(items.length);

  // Generar las páginas necesarias
  const pages = generatePagesFromPhotoCount(items.length, existingPages);

  // Inicializar array de fotos
  const photos: Photo[][] = Array(pages.length)
    .fill(null)
    .map(() => []);

  // Distribuir fotos en grupos de PHOTOS_PER_PAGE
  for (let i = 0; i < items.length; i += PHOTOS_PER_PAGE) {
    const pageIndex = Math.floor(i / PHOTOS_PER_PAGE);
    if (pageIndex < pages.length) {
      const pageItems = items.slice(i, i + PHOTOS_PER_PAGE);
      const pagePhotos = collageLayoutForPage(
        pageItems,
        pageIndex,
        pageItems.length,
      );
      photos[pageIndex] = pagePhotos;
    }
  }

  return { pages, photos };
}
