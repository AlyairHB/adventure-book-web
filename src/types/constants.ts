import { TitleLine, Page, Note } from "./types";

export const TITLE_LINES: TitleLine[] = [
  {
    letters: [
      { char: "O", color: "#E8B84B" },
      { char: "u", color: "#C0392B" },
      { char: "R", color: "#2ECC71" },
    ],
  },
  {
    letters: [
      { char: "A", color: "#E8B84B" },
      { char: "D", color: "#3498DB" },
      { char: "V", color: "#E67E22" },
      { char: "E", color: "#9B59B6" },
      { char: "N", color: "#2ECC71" },
      { char: "T", color: "#E8B84B" },
      { char: "U", color: "#C0392B" },
      { char: "R", color: "#3498DB" },
      { char: "E", color: "#E67E22" },
      { char: "\u00a0", color: "transparent" },
    ],
  },
  {
    letters: [
      { char: "B", color: "#C0392B" },
      { char: "O", color: "#E8B84B" },
      { char: "O", color: "#2ECC71" },
      { char: "K", color: "#3498DB" },
    ],
  },
];

export const PAGES: Page[] = [
  {
    id: 1,
    globe: true,
    notes: [
      {
        top: "72%",
        left: "2%",
        w: "36%",
        rot: "-0.8deg",
        text: "El primer día fue mágico. El sol se asomó entre las montañas y todo cobró vida.",
      },
      {
        top: "72%",
        left: "40%",
        w: "28%",
        rot: "1.2deg",
        text: "¡Nunca olvidaré ese momento!",
      },
      {
        top: "72%",
        left: "70%",
        w: "27%",
        rot: "-1.5deg",
        text: "Guardamos este recuerdo para siempre.",
      },
    ],
  },
  {
    id: 2,
    globe: false,
    notes: [
      {
        top: "72%",
        left: "3%",
        w: "34%",
        rot: "0.5deg",
        text: "El camino nos llevó a lugares que no estaban en ningún mapa.",
      },
      {
        top: "72%",
        left: "39%",
        w: "30%",
        rot: "-1deg",
        text: "Nos perdimos... y fue lo mejor que pudimos hacer.",
      },
      {
        top: "72%",
        left: "71%",
        w: "26%",
        rot: "1.8deg",
        text: "La aventura nos une.",
      },
    ],
  },
  {
    id: 3,
    globe: true,
    notes: [
      {
        top: "72%",
        left: "2%",
        w: "37%",
        rot: "1deg",
        text: "El tesoro no estaba al final… estaba en cada paso del camino.",
      },
      {
        top: "72%",
        left: "41%",
        w: "28%",
        rot: "-0.5deg",
        text: "Cada momento, un diamante.",
      },
      {
        top: "72%",
        left: "71%",
        w: "26%",
        rot: "-2deg",
        text: "Hasta la próxima aventura 🌍",
      },
    ],
  },
];

export const HANDLES = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
export const CURSOR_MAP: Record<string, string> = {
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
  nw: "nwse-resize",
};

export const MIN_SIZE = 200;
export const BORDER = 10;
export const PAGE_W = 900;
export const PAGE_H = 600;
export const SAFE_H = PAGE_H * 0.9;
export const IMAGES_ENDPOINT = "http://localhost:3000/images";
