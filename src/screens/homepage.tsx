import { useEffect, useState, useCallback, useRef } from "react";

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const TITLE_LINES = [
  {
    letters: [
      { char: "N", color: "#E8B84B" },
      { char: "u", color: "#C0392B" },
      { char: "e", color: "#2ECC71" },
      { char: "s", color: "#E8B84B" },
      { char: "t", color: "#3498DB" },
      { char: "r", color: "#E67E22" },
      { char: "o", color: "#9B59B6" },
    ],
  },
  {
    letters: [
      { char: "L", color: "#2ECC71" },
      { char: "i", color: "#E8B84B" },
      { char: "b", color: "#C0392B" },
      { char: "r", color: "#3498DB" },
      { char: "o", color: "#E67E22" },
      { char: "\u00a0", color: "transparent" },
      { char: "D", color: "#9B59B6" },
      { char: "e", color: "#E8B84B" },
    ],
  },
  {
    letters: [
      { char: "A", color: "#C0392B" },
      { char: "v", color: "#E8B84B" },
      { char: "e", color: "#2ECC71" },
      { char: "n", color: "#3498DB" },
      { char: "t", color: "#9B59B6" },
      { char: "u", color: "#E67E22" },
      { char: "r", color: "#C0392B" },
      { char: "a", color: "#E8B84B" },
      { char: "s", color: "#2ECC71" },
    ],
  },
];

const PAGES = [
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

// ══════════════════════════════════════════════════════════════
// CSS
// ══════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,900&family=Caveat:wght@400;600&family=Lora:ital@1&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width:100%; height:100%; overflow:hidden; }

.ab-scene {
  width:100vw; height:100vh;
  background: radial-gradient(ellipse at 50% 60%, #1e1006 0%, #080502 100%);
  display:flex; align-items:center; justify-content:center;
  perspective:2200px; overflow:hidden;
}
.ab-stage {
  position:relative; width:92vw; max-width:1280px;
  height:82vh; max-height:760px;
  transform-style:preserve-3d;
  transition:transform 1.3s cubic-bezier(0.4,0,0.2,1);
}
.ab-stage.closed  { transform:rotateX(7deg) rotateY(-8deg); }
.ab-stage.opening { transform:rotateX(0deg) rotateY(0deg) scale(1.01); }
.ab-stage.open    { transform:rotateX(0deg) rotateY(0deg); }

/* ── Closed book ── */
.ab-closed-book {
  position:absolute; inset:0; display:flex; border-radius:8px;
  box-shadow:0 50px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,200,80,0.07);
  transition:opacity 0.55s ease, transform 0.55s ease;
  transform-origin:left center; cursor:pointer;
}
.ab-closed-book.hide { opacity:0; pointer-events:none; transform:rotateY(-20deg) scaleX(0.9); }

/* ── Spine ── */
.ab-spine, .ab-open-spine {
  width:clamp(44px,6.5vw,90px); flex-shrink:0;
  background:linear-gradient(90deg,#5a0d0d 0%,#8b1a1a 28%,#b92020 50%,#8b1a1a 72%,#5a0d0d 100%);
  position:relative; overflow:hidden;
}
.ab-spine { border-radius:8px 0 0 8px; }
.ab-spine::before,.ab-spine::after,
.ab-open-spine::before,.ab-open-spine::after {
  content:''; position:absolute; top:8%; height:84%; width:1.5px;
  background:linear-gradient(to bottom,transparent,rgba(255,210,80,0.75) 20%,rgba(255,215,90,0.95) 50%,rgba(255,210,80,0.75) 80%,transparent);
}
.ab-spine::before,.ab-open-spine::before { left:33%; }
.ab-spine::after,.ab-open-spine::after   { left:56%; }
.ab-spine-grain {
  position:absolute; inset:0;
  background:repeating-linear-gradient(180deg,transparent 0,transparent 5px,rgba(0,0,0,0.08) 5px,rgba(0,0,0,0.08) 6px);
}

/* ── Cover ── */
.ab-cover {
  flex:1;
  background:
    radial-gradient(ellipse at 28% 28%,rgba(110,65,22,0.65) 0%,transparent 58%),
    radial-gradient(ellipse at 72% 78%,rgba(0,0,0,0.55) 0%,transparent 52%),
    linear-gradient(140deg,#4e3318 0%,#301d0b 38%,#3f2710 68%,#27160a 100%);
  border-radius:0 8px 8px 0; position:relative; overflow:hidden;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding-bottom:clamp(50px,9vh,110px);
}
.ab-cover:hover .ab-hint { opacity:1; transform:translateY(0); }
.ab-noise {
  position:absolute; inset:0; opacity:0.04; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ab-border {
  position:absolute; inset:10px; border:1px solid rgba(190,140,55,0.14); border-radius:4px;
  box-shadow:inset 0 0 44px rgba(0,0,0,0.42); pointer-events:none;
}
.ab-oval {
  position:absolute; width:76%; height:84%; border-radius:50%;
  border:1px solid rgba(190,150,65,0.1); box-shadow:inset 0 0 32px rgba(0,0,0,0.18); pointer-events:none;
}
.ab-title { position:relative; z-index:2; display:flex; flex-direction:column; align-items:center; gap:clamp(1px,0.4vw,6px); }
.ab-line  { display:flex; }
.ab-letter {
  font-family:'Playfair Display',Georgia,serif;
  font-size:clamp(30px,7vw,108px); font-weight:900; font-style:italic; line-height:1; letter-spacing:1px;
  text-shadow:1px 2px 0 rgba(0,0,0,0.8),0 5px 16px rgba(0,0,0,0.5);
  opacity:0; transform:translateY(14px) scale(0.8);
  transition:opacity 0.38s ease,transform 0.38s ease; display:inline-block;
}
.ab-letter.show { opacity:1; transform:translateY(0) scale(1); }
.ab-medal {
  position:absolute; bottom:clamp(10px,2.8vh,36px); left:50%; transform:translateX(-50%);
  z-index:3; width:clamp(42px,6.5vw,84px); height:clamp(42px,6.5vw,84px); border-radius:50%;
  background:radial-gradient(circle at 34% 34%,#FFE266,#C89010 58%,#7A5400);
  border:2px solid rgba(255,222,80,0.6);
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 5px 16px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,250,200,0.28);
  opacity:0; transition:opacity 0.6s ease 1.4s;
}
.ab-medal.show { opacity:1; }
.ab-medal-inner {
  width:clamp(30px,4.8vw,62px); height:clamp(30px,4.8vw,62px); border-radius:50%;
  background:radial-gradient(circle at 40% 34%,#FFD700,#B8860B);
  border:1px solid rgba(255,212,80,0.5);
  display:flex; align-items:center; justify-content:center;
  font-size:clamp(11px,1.8vw,26px); color:#5a3900;
}
.ab-hint {
  position:absolute; bottom:clamp(12px,3vh,44px); right:clamp(12px,2.5vw,36px); z-index:5;
  color:rgba(255,218,120,0.7); font-family:'Lora',serif; font-style:italic;
  font-size:clamp(9px,1.1vw,14px); display:flex; align-items:center; gap:5px;
  opacity:0; transform:translateY(6px); transition:opacity 0.4s,transform 0.4s; pointer-events:none;
}
.ab-hint span { animation:arrw 1.2s ease-in-out infinite; }
@keyframes arrw { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
@keyframes ab-spin { to { transform: rotate(360deg); } }

/* ── Open book ── */
.ab-open-book {
  position:absolute; inset:0; display:flex;
  opacity:0; pointer-events:none;
  transition:opacity 0.7s ease 0.35s;
  border-radius:8px; box-shadow:0 50px 120px rgba(0,0,0,0.95); overflow:hidden;
}
.ab-open-book.show { opacity:1; pointer-events:all; }

/* ── Pages container ── */
.ab-pages {
  flex:1; position:relative; overflow:hidden; background:#c9b898;
  transform-style:preserve-3d;
}

/* Kraft paper texture */
.ab-kraft {
  position:absolute; inset:0; pointer-events:none;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.4'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.22'/%3E%3C/svg%3E"),
    repeating-linear-gradient(88deg,transparent 0,transparent 3px,rgba(0,0,0,0.012) 3px,rgba(0,0,0,0.012) 4px),
    repeating-linear-gradient(178deg,transparent 0,transparent 5px,rgba(0,0,0,0.008) 5px,rgba(0,0,0,0.008) 6px);
}
.ab-gutter {
  position:absolute; top:0; left:50%; transform:translateX(-50%);
  width:20px; height:100%; z-index:50; pointer-events:none;
  background:linear-gradient(90deg,transparent 0%,rgba(0,0,0,0.14) 30%,rgba(0,0,0,0.26) 50%,rgba(0,0,0,0.14) 70%,transparent 100%);
}

/* ── Globe stamp ── */
.ab-globe {
  position:absolute; top:5%; right:2%;
  width:clamp(50px,8vw,100px); height:clamp(50px,8vw,100px); z-index:25;
  opacity:0; transform:scale(0.7) rotate(-8deg);
  transition:opacity 0.5s ease 0.4s,transform 0.5s ease 0.4s;
}
.ab-globe.show { opacity:1; transform:scale(1) rotate(-4deg); }

/* ── Tape ── */
.ab-tape-small {
  position:absolute; height:clamp(10px,1.8vh,20px); width:clamp(40px,6vw,80px);
  background:rgba(185,162,120,0.5);
  border-top:1px solid rgba(255,255,255,0.2); border-bottom:1px solid rgba(0,0,0,0.08);
  z-index:20; pointer-events:none;
}

/* ── Torn notes ── */
.ab-note {
  position:absolute; background:#f5f0d8;
  clip-path:polygon(
    1% 8%,3% 2%,7% 6%,12% 1%,17% 5%,22% 0%,28% 4%,34% 1%,40% 5%,46% 0%,
    52% 4%,58% 1%,64% 5%,70% 0%,76% 4%,82% 1%,88% 5%,94% 2%,99% 6%,100% 12%,
    98% 88%,100% 93%,96% 98%,90% 95%,84% 100%,78% 96%,72% 100%,66% 95%,60% 99%,
    54% 95%,48% 100%,42% 96%,36% 100%,30% 95%,24% 99%,18% 95%,12% 99%,6% 95%,
    0% 100%,2% 92%
  );
  padding:clamp(14px,3vh,28px) clamp(10px,2vw,22px) clamp(16px,3.5vh,32px);
  z-index:15; box-shadow:2px 4px 12px rgba(0,0,0,0.18);
  opacity:0; transition:opacity 0.5s ease;
}
.ab-note.show { opacity:1; }
.ab-note-text { font-family:'Caveat',cursive; font-size:clamp(10px,1.5vw,17px); color:#3a2e1a; line-height:1.55; }
.ab-note-tape {
  position:absolute; width:clamp(32px,5vw,60px); height:clamp(10px,1.6vh,18px);
  background:rgba(185,162,120,0.52); left:50%; transform:translateX(-50%); top:-5px; z-index:16;
}
.ab-note-tape.right { left:auto; right:10%; transform:rotate(12deg); top:-4px; }
.ab-note-tape.left  { left:10%; transform:rotate(-8deg); top:-4px; }

/* ══ PAGE FLIP — the panel covers the RIGHT half and rotates around its LEFT edge ══
   Front face = the page being left (current page right half, mirrored).
   Back face  = the page being arrived at (next page right half, normal).
   overflow:hidden on .ab-pages clips the panel while it sweeps.             */

.ab-flip-wrap {
  position:absolute; inset:0; pointer-events:none; z-index:60;
  overflow:hidden; transform-style:preserve-3d;
}

/* The flipping "leaf" — right half of the book, pivots at its left edge */
.ab-flip-panel {
  position:absolute; top:0; right:0;
  width:50%; height:100%;
  transform-origin:left center;
  transform-style:preserve-3d;
  transform:rotateY(0deg);
  transition:transform 0.75s cubic-bezier(0.4,0,0.2,1);
}
.ab-flip-panel.flipping { transform:rotateY(-180deg); }

/* Both faces share the same kraft background */
.ab-flip-front, .ab-flip-back {
  position:absolute; inset:0;
  backface-visibility:hidden; -webkit-backface-visibility:hidden;
  background:#c9b898; overflow:hidden;
}

/* Back face is rotated 180° so it shows when the panel has flipped */
.ab-flip-back { transform:rotateY(180deg); }

/* Shadow that sweeps across the panel during flip */
.ab-flip-front::after {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:5;
  background:linear-gradient(90deg, rgba(0,0,0,0.18) 0%, transparent 30%);
}
.ab-flip-back::after {
  content:''; position:absolute; inset:0; pointer-events:none; z-index:5;
  background:linear-gradient(270deg, rgba(0,0,0,0.18) 0%, transparent 30%);
}

/* The ScrapPage inside each flip face must be clipped to the right half.
   We shift the inner page left by 100% so its right half aligns with the panel. */
.ab-flip-front .ab-flip-page,
.ab-flip-back  .ab-flip-page {
  position:absolute; top:0; left:-100%; width:200%; height:100%;
  pointer-events:none;
}
/* The back face content is already mirrored by the rotateY(180deg) on the panel,
   so we counter-mirror it so the page text reads correctly. */
.ab-flip-back .ab-flip-page {
  left:0; width:200%;
  transform:scaleX(-1);
  transform-origin:right center;
}

/* ── Nav ── */
.ab-nav {
  position:absolute; bottom:clamp(10px,2.2vh,24px); left:50%; transform:translateX(-50%);
  z-index:80; display:flex; gap:clamp(8px,1.8vw,20px); align-items:center;
}
.ab-nav-btn {
  background:rgba(50,28,8,0.8); border:1px solid rgba(255,200,80,0.32);
  color:rgba(255,210,120,0.9); font-family:'Playfair Display',serif; font-style:italic;
  font-size:clamp(9px,1.1vw,13px); letter-spacing:1px;
  padding:clamp(5px,1vh,9px) clamp(12px,2.2vw,24px);
  border-radius:30px; cursor:pointer; transition:background 0.2s,border-color 0.2s,transform 0.15s;
  backdrop-filter:blur(4px);
}
.ab-nav-btn:hover { background:rgba(80,44,10,0.95); border-color:rgba(255,210,80,0.65); transform:translateY(-1px); }
.ab-nav-btn:disabled { opacity:0.28; cursor:default; transform:none; }
.ab-nav-ind { color:rgba(255,200,80,0.55); font-family:'Lora',serif; font-style:italic; font-size:clamp(9px,1vw,12px); }
`;

// ══════════════════════════════════════════════════════════════
// SMALL COMPONENTS
// ══════════════════════════════════════════════════════════════
function GlobeStamp({ show }) {
  return (
    <div className={`ab-globe${show ? " show" : ""}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#b8a080"
          stroke="#7a6040"
          strokeWidth="3"
        />
        <circle cx="50" cy="50" r="40" fill="#9e8a64" />
        <ellipse
          cx="38"
          cy="40"
          rx="14"
          ry="18"
          fill="#6e5a38"
          opacity="0.85"
        />
        <ellipse
          cx="62"
          cy="52"
          rx="10"
          ry="14"
          fill="#6e5a38"
          opacity="0.85"
        />
        <ellipse cx="50" cy="28" rx="8" ry="6" fill="#6e5a38" opacity="0.70" />
        <ellipse cx="30" cy="62" rx="6" ry="5" fill="#6e5a38" opacity="0.65" />
        {[25, 40, 55, 70].map((y) => (
          <line
            key={y}
            x1="10"
            y1={y}
            x2="90"
            y2={y}
            stroke="#7a6040"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
        {[30, 50, 70].map((x) => (
          <line
            key={x}
            x1={x}
            y1="10"
            x2={x}
            y2="90"
            stroke="#7a6040"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#7a6040"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      </svg>
    </div>
  );
}

function TornNote({ note, show, index }) {
  const tapes = ["ab-note-tape", "ab-note-tape left", "ab-note-tape right"];
  return (
    <div
      className={`ab-note${show ? " show" : ""}`}
      style={{
        top: note.top,
        left: note.left,
        width: note.w,
        transform: `rotate(${note.rot})`,
        transitionDelay: `${280 + index * 90}ms`,
      }}
    >
      <div className={tapes[index % 3]} />
      <p className="ab-note-text">{note.text}</p>
    </div>
  );
}

function PageNav({
  currentPage,
  totalPages,
  flipping,
  onPrev,
  onNext,
  onAddPage,
  onDeletePage,
}) {
  return (
    <div className="ab-nav">
      <button
        className="ab-nav-btn"
        onClick={onPrev}
        disabled={currentPage === 0 || flipping}
      >
        ← Anterior
      </button>
      <span className="ab-nav-ind">
        {currentPage + 1} / {totalPages}
      </span>
      <button
        className="ab-nav-btn"
        onClick={onNext}
        disabled={currentPage === totalPages - 1 || flipping}
      >
        Siguiente →
      </button>
      <button
        className="ab-nav-btn"
        onClick={onAddPage}
        disabled={flipping}
        style={{
          background: "rgba(20,55,20,0.85)",
          borderColor: "rgba(100,210,100,0.38)",
          color: "rgba(160,255,160,0.92)",
        }}
      >
        + Página
      </button>
      {totalPages > 1 && (
        <button
          className="ab-nav-btn"
          onClick={onDeletePage}
          disabled={flipping}
          style={{
            background: "rgba(55,15,15,0.85)",
            borderColor: "rgba(210,80,80,0.38)",
            color: "rgba(255,150,150,0.92)",
          }}
        >
          ✕ Página
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// BOOK COVER
// ══════════════════════════════════════════════════════════════
function BookCover({ hidden, onClick }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 120);
    return () => clearTimeout(t);
  }, []);
  let gi = 0;
  return (
    <div className={`ab-closed-book${hidden ? " hide" : ""}`} onClick={onClick}>
      <div className="ab-spine">
        <div className="ab-spine-grain" />
      </div>
      <div className="ab-cover">
        <div className="ab-noise" /> <div className="ab-border" />{" "}
        <div className="ab-oval" />
        <div className="ab-title">
          {TITLE_LINES.map((line, li) => {
            const s = gi;
            gi += line.letters.length;
            return (
              <div className="ab-line" key={li}>
                {line.letters.map((l, i) => (
                  <span
                    key={i}
                    className={`ab-letter${show ? " show" : ""}`}
                    style={{
                      color: l.color,
                      transitionDelay: `${(s + i) * 55}ms`,
                    }}
                  >
                    {l.char}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
        <div className={`ab-medal${show ? " show" : ""}`}>
          <div className="ab-medal-inner">✦</div>
        </div>
        <div className="ab-hint">
          Abrir libro <span>▶</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RESIZE HANDLE + PHOTO FRAME
// ══════════════════════════════════════════════════════════════
const HANDLES = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
const CURSOR_MAP = {
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
  nw: "nwse-resize",
};
const MIN_SIZE = 100;
const BORDER = 10;

function ResizeHandle({ dir, onMouseDown }) {
  const corner = dir.length === 2,
    size = corner ? 12 : 8;
  const pos = {};
  if (dir.includes("n")) pos.top = -size / 2;
  if (dir.includes("s")) pos.bottom = -size / 2;
  if (dir.includes("e")) pos.right = -size / 2;
  if (dir.includes("w")) pos.left = -size / 2;
  if (!dir.includes("e") && !dir.includes("w")) {
    pos.left = "50%";
    pos.marginLeft = -size / 2;
  }
  if (!dir.includes("n") && !dir.includes("s")) {
    pos.top = "50%";
    pos.marginTop = -size / 2;
  }
  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e, dir);
      }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: "white",
        border: "1.5px solid #aaa",
        borderRadius: corner ? 2 : "50%",
        cursor: CURSOR_MAP[dir],
        zIndex: 30,
        ...pos,
      }}
    />
  );
}

function PhotoFrame({
  photo,
  selected,
  pageRef,
  onSelect,
  onUpdate,
  onDelete,
  show,
}) {
  const { id, x, y, w, h, rot, caption, src } = photo;
  const [editing, setEditing] = useState(false);
  const captionH = Math.max(32, Math.round(h * 0.22));

  const toLocal = (cx, cy) => {
    const r = pageRef.current.getBoundingClientRect();
    return { lx: cx - r.left, ly: cy - r.top };
  };

  const onDragStart = (e) => {
    if (editing) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);
    const { lx: sx, ly: sy } = toLocal(e.clientX, e.clientY);
    const ox = x,
      oy = y;
    const move = (ev) => {
      const { lx, ly } = toLocal(ev.clientX, ev.clientY);
      onUpdate(id, { x: ox + lx - sx, y: oy + ly - sy });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const onResizeStart = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    const { lx: sx, ly: sy } = toLocal(e.clientX, e.clientY);
    const ox = x,
      oy = y,
      ow = w,
      oh = h;
    const move = (ev) => {
      const { lx, ly } = toLocal(ev.clientX, ev.clientY);
      const dx = lx - sx,
        dy = ly - sy;
      let nx = ox,
        ny = oy,
        nw = ow,
        nh = oh;
      if (dir.includes("e")) nw = Math.max(MIN_SIZE, ow + dx);
      if (dir.includes("s")) nh = Math.max(MIN_SIZE, oh + dy);
      if (dir.includes("w")) {
        nw = Math.max(MIN_SIZE, ow - dx);
        if (nw > MIN_SIZE) nx = ox + dx;
      }
      if (dir.includes("n")) {
        nh = Math.max(MIN_SIZE, oh - dy);
        if (nh > MIN_SIZE) ny = oy + dy;
      }
      onUpdate(id, { x: nx, y: ny, w: nw, h: nh });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => onUpdate(id, { src: ev.target.result });
    reader.readAsDataURL(file);
  };

  return (
    <div
      onMouseDown={onDragStart}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${rot}deg)`,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: `${BORDER}px ${BORDER}px 0 ${BORDER}px`,
        boxSizing: "border-box",
        boxShadow: selected
          ? "0 0 0 2px #6ab4f5,0 8px 28px rgba(0,0,0,0.38)"
          : "0 6px 24px rgba(0,0,0,0.30),0 2px 6px rgba(0,0,0,0.18)",
        cursor: editing ? "default" : "grab",
        userSelect: "none",
        zIndex: selected ? 40 : 10,
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease,box-shadow 0.15s",
      }}
    >
      <div
        style={{
          flex: 1,
          background: src ? "none" : "linear-gradient(145deg,#ddd8cc,#c8c0b0)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {src ? (
          <img
            src={src}
            alt={caption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
            }}
          />
        ) : (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              gap: 6,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onDrop}
            />
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#aaa"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span
              style={{
                fontFamily: "Caveat,cursive",
                fontSize: 13,
                color: "#bbb",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Arrastra o toca
              <br />
              para agregar foto
            </span>
          </label>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.09) 100%)",
          }}
        />
      </div>
      <div
        style={{
          height: captionH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 6px",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={() => setEditing(true)}
      >
        {editing ? (
          <input
            autoFocus
            defaultValue={caption}
            onBlur={(e) => {
              onUpdate(id, { caption: e.target.value });
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.target.blur();
            }}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Caveat,cursive",
              fontSize: Math.max(11, captionH * 0.38),
              color: "#2a2218",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}
          />
        ) : (
          <span
            title="Doble clic para editar"
            style={{
              fontFamily: "Caveat,cursive",
              fontSize: Math.max(11, captionH * 0.38),
              color: caption ? "#2a2218" : "#ccc",
              textAlign: "center",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              cursor: "text",
            }}
          >
            {caption || "doble clic para escribir…"}
          </span>
        )}
      </div>
      {selected && (
        <>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            style={{
              position: "absolute",
              top: -14,
              right: -14,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#e74c3c",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            ×
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(id, { rot: rot - 5 });
            }}
            style={{
              position: "absolute",
              top: -14,
              left: -14,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#555",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            ↺
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(id, { rot: rot + 5 });
            }}
            style={{
              position: "absolute",
              top: -14,
              left: 16,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#555",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            ↻
          </button>
          {HANDLES.map((dir) => (
            <ResizeHandle key={dir} dir={dir} onMouseDown={onResizeStart} />
          ))}
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCRAP PAGE CONTENT (pure display, no interaction state)
// ══════════════════════════════════════════════════════════════
// This version is used inside the flip panel faces (read-only snapshot).
function PageContent({ page, photos, show }) {
  return (
    <>
      <div className="ab-kraft" />
      {photos.map((ph) => (
        <div
          key={ph.id}
          style={{
            position: "absolute",
            left: ph.x,
            top: ph.y,
            width: ph.w,
            height: ph.h,
            transform: `rotate(${ph.rot}deg)`,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: `${BORDER}px ${BORDER}px 0 ${BORDER}px`,
            boxSizing: "border-box",
            boxShadow: "0 6px 24px rgba(0,0,0,0.30),0 2px 6px rgba(0,0,0,0.18)",
            zIndex: 10,
            opacity: show ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              background: ph.src
                ? "none"
                : "linear-gradient(145deg,#ddd8cc,#c8c0b0)",
            }}
          >
            {ph.src && (
              <img
                src={ph.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.09) 100%)",
              }}
            />
          </div>
          <div
            style={{
              height: Math.max(32, Math.round(ph.h * 0.22)),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 6px",
            }}
          >
            <span
              style={{
                fontFamily: "Caveat,cursive",
                fontSize: Math.max(11, Math.round(ph.h * 0.22) * 0.38),
                color: ph.caption ? "#2a2218" : "#ccc",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {ph.caption || ""}
            </span>
          </div>
        </div>
      ))}
      {page.globe && <GlobeStamp show={show} />}
      <div className="ab-gutter" />
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SCRAP PAGE (interactive — used for the visible current page)
// ══════════════════════════════════════════════════════════════
function ScrapPage({ page, photos, onAdd, onUpdate, onDelete, show }) {
  const [selectedId, setSelectedId] = useState(null);
  const pageRef = useRef(null);

  const onBgMouseDown = (e) => {
    if (
      e.target === pageRef.current ||
      e.target.classList.contains("ab-kraft") ||
      e.target.classList.contains("ab-gutter")
    ) {
      setSelectedId(null);
    }
  };

  return (
    <div
      ref={pageRef}
      onMouseDown={onBgMouseDown}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: show ? "all" : "none",
      }}
    >
      <div className="ab-kraft" />
      {photos.map((ph) => (
        <PhotoFrame
          key={ph.id}
          photo={ph}
          selected={selectedId === ph.id}
          pageRef={pageRef}
          onSelect={setSelectedId}
          onUpdate={onUpdate}
          onDelete={onDelete}
          show={show}
        />
      ))}
      {page.globe && (
        <>
          <GlobeStamp show={show} />
          <div
            className="ab-tape-small"
            style={{
              position: "absolute",
              top: "32%",
              right: "1.5%",
              transform: "rotate(-1deg)",
              opacity: show ? 0.7 : 0,
              transition: "opacity 0.5s ease 300ms",
            }}
          />
          <div
            className="ab-tape-small"
            style={{
              position: "absolute",
              top: "41%",
              right: "1.5%",
              width: "clamp(50px,8vw,90px)",
              transform: "rotate(1.5deg)",
              opacity: show ? 0.7 : 0,
              transition: "opacity 0.5s ease 380ms",
            }}
          />
        </>
      )}
      <div className="ab-gutter" />
      {show && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          title="Agregar foto"
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 70,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(60,35,10,0.85)",
            border: "1.5px solid rgba(255,200,80,0.45)",
            color: "rgba(255,215,120,0.95)",
            fontSize: 24,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          +
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE FLIP — front shows current page, back shows target page
// ══════════════════════════════════════════════════════════════
function PageFlip({ flipping, fromPage, fromPhotos, toPage, toPhotos }) {
  return (
    <div className="ab-flip-wrap">
      <div className={`ab-flip-panel${flipping ? " flipping" : ""}`}>
        {/* Front: snapshot of the page we're leaving */}
        <div className="ab-flip-front">
          <div className="ab-flip-page">
            <PageContent page={fromPage} photos={fromPhotos} show={true} />
          </div>
        </div>
        {/* Back: the page we're arriving at */}
        <div className="ab-flip-back">
          <div className="ab-flip-page">
            <PageContent page={toPage} photos={toPhotos} show={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════

// ─── ✏️  Cambia esta URL por tu endpoint real ─────────────────
const IMAGES_ENDPOINT = "http://localhost:3000/images";

let uid = 1;
const newPhoto = () => ({
  id: uid++,
  x: 100 + Math.random() * 100,
  y: 60 + Math.random() * 80,
  w: 200,
  h: 240,
  rot: parseFloat((Math.random() * 6 - 3).toFixed(1)),
  caption: "",
  src: null,
});

// A blank page the user can add
const blankPage = () => ({ id: uid++, globe: false, notes: [] });

// ── Collage layout ────────────────────────────────────────────
// Distributes N images in a grid-like collage with slight random
// offsets and rotations so it looks handmade, not mechanical.
// PAGE_W / PAGE_H are the logical dimensions we lay out against;
// real pixels scale proportionally via the CSS clamp sizing.
const PAGE_W = 900;
const PAGE_H = 600;
// Leave bottom 28% for notes area
const SAFE_H = PAGE_H * 0.68;

function collageLayout(items) {
  const count = items.length;
  if (count === 0) return [];

  // Choose columns: 1 → 1col, 2 → 2col, 3-4 → 2col, 5+ → 3col
  const cols = count <= 1 ? 1 : count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);

  const cellW = PAGE_W / cols;
  const cellH = SAFE_H / rows;

  // Photo size: fill ~72% of cell, keep polaroid aspect ~0.82
  const photoW = Math.round(cellW * 0.72);
  const photoH = Math.round(photoW / 0.82);
  // If photo is too tall for cell, shrink
  const finalH = Math.min(photoH, Math.round(cellH * 0.82));
  const finalW = Math.round(finalH * 0.82);

  return items.map((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Center of the cell + small random jitter
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

export default function AdventureBook() {
  const [phase, setPhase] = useState("closed");
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(1);
  const [contentShow, setContentShow] = useState(false);
  const [fetchState, setFetchState] = useState("idle"); // idle | loading | done | error

  // Dynamic page list — starts with the 3 preset pages
  const [pages, setPages] = useState(() => [...PAGES]);
  // photos[i] = Photo[] for pages[i]
  const [photos, setPhotos] = useState(() => PAGES.map(() => []));

  const totalPages = pages.length;
  const targetPage = Math.min(
    Math.max(currentPage + (flipping ? flipDir : 0), 0),
    totalPages - 1,
  );

  useEffect(() => {
    if (phase === "open") {
      const t = setTimeout(() => setContentShow(true), 350);
      return () => clearTimeout(t);
    }
    setContentShow(false);
  }, [phase, currentPage]);

  // ── Fetch images when the book opens (runs once) ──────────
  useEffect(() => {
    if (phase !== "open" || fetchState !== "idle") return;

    let cancelled = false;

    async function loadImages() {
      try {
        setFetchState("loading");

        const res = await fetch(IMAGES_ENDPOINT);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.images)
              ? data.images
              : [];

        if (items.length === 0) {
          if (!cancelled) setFetchState("done");
          return;
        }

        const laid = collageLayout(items);
        if (cancelled) {
          setPhotos((prev) =>
            prev.map((list, i) => (i === 0 ? [...list, ...laid] : list)),
          );

          setFetchState("done");
        }
      } catch (err) {
        console.error("Error fetching images:", err);

        if (!cancelled) {
          setFetchState("error");
        }
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [phase, fetchState, IMAGES_ENDPOINT, collageLayout]);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1200);
  };

  const handlePageChange = (dir) => {
    const next = currentPage + dir;
    if (next < 0 || next >= totalPages || flipping) return;
    setContentShow(false);
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage(next);
      setFlipping(false);
    }, 750);
  };

  // ── Add a new blank page after the current one ────────────
  const handleAddPage = useCallback(() => {
    if (flipping) return;
    const insertAt = currentPage + 1;
    setPages((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, blankPage());
      return next;
    });
    setPhotos((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, []);
      return next;
    });
    // Navigate to the new page with a flip
    setContentShow(false);
    setFlipDir(1);
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage(insertAt);
      setFlipping(false);
    }, 750);
  }, [currentPage, flipping]);

  // ── Delete the current page ───────────────────────────────
  const handleDeletePage = useCallback(() => {
    if (flipping || totalPages <= 1) return;
    const pi = currentPage;
    const goTo = pi > 0 ? pi - 1 : 0;
    setContentShow(false);
    setFlipDir(-1);
    setFlipping(true);
    setTimeout(() => {
      setPages((prev) => prev.filter((_, i) => i !== pi));
      setPhotos((prev) => prev.filter((_, i) => i !== pi));
      setCurrentPage(goTo);
      setFlipping(false);
    }, 750);
  }, [currentPage, flipping, totalPages]);

  // ── Photo CRUD ────────────────────────────────────────────
  const handleAddPhoto = useCallback((pi) => {
    setPhotos((prev) =>
      prev.map((list, i) => (i === pi ? [...list, newPhoto()] : list)),
    );
  }, []);

  const handleUpdatePhoto = useCallback((pi, id, changes) => {
    setPhotos((prev) =>
      prev.map((list, i) =>
        i === pi
          ? list.map((p) => (p.id === id ? { ...p, ...changes } : p))
          : list,
      ),
    );
  }, []);

  const handleDeletePhoto = useCallback((pi, id) => {
    setPhotos((prev) =>
      prev.map((list, i) =>
        i === pi ? list.filter((p) => p.id !== id) : list,
      ),
    );
  }, []);

  const pi = currentPage;

  return (
    <>
      <style>{CSS}</style>
      <div className="ab-scene">
        <div className={`ab-stage ${phase}`}>
          <BookCover hidden={phase !== "closed"} onClick={handleOpen} />

          <div className={`ab-open-book${phase === "open" ? " show" : ""}`}>
            <div className="ab-open-spine">
              <div className="ab-spine-grain" />
            </div>
            <div className="ab-pages">
              <ScrapPage
                page={pages[pi]}
                photos={photos[pi]}
                onAdd={() => handleAddPhoto(pi)}
                onUpdate={(id, ch) => handleUpdatePhoto(pi, id, ch)}
                onDelete={(id) => handleDeletePhoto(pi, id)}
                show={contentShow && !flipping}
              />

              {fetchState === "loading" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 70,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 90,
                    background: "rgba(30,15,4,0.9)",
                    border: "1px solid rgba(255,200,80,0.3)",
                    borderRadius: 20,
                    padding: "7px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(255,210,120,0.93)",
                    fontFamily: "Caveat,cursive",
                    fontSize: 15,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      animation: "ab-spin 0.9s linear infinite",
                    }}
                  >
                    ⟳
                  </span>
                  Cargando imágenes…
                </div>
              )}
              {fetchState === "error" && (
                <div
                  onClick={() => setFetchState("idle")}
                  style={{
                    position: "absolute",
                    bottom: 70,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 90,
                    background: "rgba(40,8,8,0.92)",
                    border: "1px solid rgba(210,80,80,0.38)",
                    borderRadius: 20,
                    padding: "7px 20px",
                    color: "rgba(255,140,140,0.93)",
                    fontFamily: "Caveat,cursive",
                    fontSize: 15,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                  title="Clic para reintentar"
                >
                  ✕ Error al cargar — clic para reintentar
                </div>
              )}

              {flipping && (
                <PageFlip
                  flipping={flipping}
                  fromPage={pages[currentPage]}
                  fromPhotos={photos[currentPage] ?? []}
                  toPage={pages[targetPage] ?? pages[currentPage]}
                  toPhotos={photos[targetPage] ?? []}
                />
              )}
            </div>
          </div>

          {phase === "open" && (
            <PageNav
              currentPage={currentPage}
              totalPages={totalPages}
              flipping={flipping}
              onPrev={() => handlePageChange(-1)}
              onNext={() => handlePageChange(+1)}
              onAddPage={handleAddPage}
              onDeletePage={handleDeletePage}
            />
          )}
        </div>
      </div>
    </>
  );
}
