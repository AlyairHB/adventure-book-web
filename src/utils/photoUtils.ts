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

export function collageLayout(
  items: Array<{
    name?: string;
    directUrl?: string | null;
    thumbnailUrl?: string | null;
  }>,
): Photo[] {
  const count = items.length;
  if (count === 0) return [];

  const cols = count <= 1 ? 1 : count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);

  const cellW = PAGE_W / cols;
  const cellH = SAFE_H / rows;

  const photoW = Math.round(cellW * 0.72);
  const photoH = Math.round(photoW / 0.82);
  const finalH = Math.min(photoH, Math.round(cellH * 0.82));
  const finalW = Math.round(finalH * 0.82);

  return items.map((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = (Math.random() - 0.5) * cellW * 0.12;
    const jy = (Math.random() - 0.5) * cellH * 0.12;
    const cx = cellW * col + cellW / 2 + jx;
    const cy = cellH * row + cellH / 2 + jy;

    return {
      id: uid++,
      x: Math.round(cx - finalW / 2),
      y: Math.round(cy - finalH / 2),
      w: finalW,
      h: finalH,
      rot: parseFloat(((Math.random() - 0.5) * 6).toFixed(1)),
      caption: item.name || "",
      src: item.directUrl || item.thumbnailUrl || null,
    };
  });
}
