import { Photo } from "../types/types";
import { PAGE_W, SAFE_H } from "../types/constants";

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

export const blankPage = () => ({ id: uid++, globe: false, notes: [] });

// Función para crear layout de collage para una sola página (máximo 4 fotos)
export function collageLayoutForPage(
  items: Array<{
    name?: string;
    directUrl?: string | null;
    thumbnailUrl?: string | null;
  }>,
  pageIndex: number,
): Photo[] {
  const count = Math.min(items.length, 4); // Máximo 4 fotos por página
  if (count === 0) return [];

  const cols = count <= 1 ? 1 : count <= 2 ? 2 : 2; // Para 3-4 fotos usamos 2 columnas
  const rows = Math.ceil(count / cols);

  const cellW = PAGE_W / cols;
  const cellH = SAFE_H / rows;

  const photoW = Math.round(cellW * 0.72);
  const photoH = Math.round(photoW / 0.82);
  const finalH = Math.min(photoH, Math.round(cellH * 0.82));
  const finalW = Math.round(finalH * 0.82);

  return items.slice(0, 4).map((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Diferente semilla de aleatoriedad por página para que no todas las páginas tengan el mismo layout
    const seed = pageIndex * 100 + i;
    const jx = ((((seed * 13) % 100) - 50) / 100) * cellW * 0.12;
    const jy = ((((seed * 17) % 100) - 50) / 100) * cellH * 0.12;
    const cx = cellW * col + cellW / 2 + jx;
    const cy = cellH * row + cellH / 2 + jy;

    // Rotación basada en seed para que sea consistente pero diferente por foto
    const rotSeed = (seed * 19) % 100;
    const rot = parseFloat(((rotSeed / 100) * 6 - 3).toFixed(1));

    return {
      id: uid++,
      x: Math.round(cx - finalW / 2),
      y: Math.round(cy - finalH / 2),
      w: finalW,
      h: finalH,
      rot: rot,
      caption: item.name || "",
      src: item.directUrl || item.thumbnailUrl || null,
    };
  });
}

// Función principal para distribuir fotos entre páginas
export function distributePhotosAcrossPages(
  items: Array<{
    name?: string;
    directUrl?: string | null;
    thumbnailUrl?: string | null;
  }>,
  totalPages: number,
): Photo[][] {
  const photosPerPage: Photo[][] = Array(totalPages)
    .fill(null)
    .map(() => []);

  // Dividir items en grupos de 4
  for (let i = 0; i < items.length; i += 4) {
    const pageIndex = Math.floor(i / 4);
    if (pageIndex < totalPages) {
      const pageItems = items.slice(i, i + 4);
      const pagePhotos = collageLayoutForPage(pageItems, pageIndex);
      photosPerPage[pageIndex] = pagePhotos;
    } else {
      // Si hay más páginas de las que tenemos, las ignoramos
      break;
    }
  }

  return photosPerPage;
}
