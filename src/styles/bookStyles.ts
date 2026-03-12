const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,900&family=Caveat:wght@400;600&family=Lora:ital@1&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { width: 100%; height: 100%; overflow: hidden; }

/* ════════════════ SCENE ════════════════ */
.ab-scene {
  width: 100vw; height: 100vh;
  background: radial-gradient(ellipse at 50% 60%, #1e1006 0%, #080502 100%);
  display: flex; align-items: center; justify-content: center;
  perspective: 2200px; overflow: hidden;
}

/* ════════════════ STAGE ════════════════ */
.ab-stage {
  position: relative;
  width: 92vw; max-width: 1280px;
  height: 82vh; max-height: 760px;
  transform-style: preserve-3d;
  transition: transform 1.3s cubic-bezier(0.4,0,0.2,1);
}
.ab-stage.closed  { transform: rotateX(7deg) rotateY(-8deg); }
.ab-stage.opening { transform: rotateX(0deg) rotateY(0deg) scale(1.01); }
.ab-stage.open    { transform: rotateX(0deg) rotateY(0deg); }

/* ════════════════ CLOSED BOOK ════════════════ */
.ab-closed-book {
  position: absolute; inset: 0; display: flex;
  border-radius: 8px;
  box-shadow: 0 50px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,200,80,0.07);
  transition: opacity 0.55s ease, transform 0.55s ease;
  transform-origin: left center; cursor: pointer;
}
.ab-closed-book.hide {
  opacity: 0; pointer-events: none;
  transform: rotateY(-20deg) scaleX(0.9);
}

/* ── Spine ── */
.ab-spine {
  width: clamp(44px, 6.5vw, 90px); flex-shrink: 0;
  background: linear-gradient(90deg, #5a0d0d 0%, #8b1a1a 28%, #b92020 50%, #8b1a1a 72%, #5a0d0d 100%);
  border-radius: 8px 0 0 8px; position: relative; overflow: hidden;
}
.ab-spine::before, .ab-spine::after {
  content: ''; position: absolute; top: 8%; height: 84%; width: 1.5px;
  background: linear-gradient(to bottom, transparent, rgba(255,210,80,0.75) 20%, rgba(255,215,90,0.95) 50%, rgba(255,210,80,0.75) 80%, transparent);
}
.ab-spine::before { left: 33%; }
.ab-spine::after  { left: 56%; }
.ab-spine-grain {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(180deg, transparent 0, transparent 5px, rgba(0,0,0,0.08) 5px, rgba(0,0,0,0.08) 6px);
}

/* ── Cover ── */
.ab-cover {
  flex: 1;
  background:
    radial-gradient(ellipse at 28% 28%, rgba(110,65,22,0.65) 0%, transparent 58%),
    radial-gradient(ellipse at 72% 78%, rgba(0,0,0,0.55) 0%, transparent 52%),
    linear-gradient(140deg, #4e3318 0%, #301d0b 38%, #3f2710 68%, #27160a 100%);
  border-radius: 0 8px 8px 0; position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding-bottom: clamp(50px, 9vh, 110px);
}
.ab-cover:hover .ab-hint { opacity: 1; transform: translateY(0); }

.ab-noise {
  position: absolute; inset: 0; opacity: 0.04; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
}
.ab-border {
  position: absolute; inset: 10px;
  border: 1px solid rgba(190,140,55,0.14); border-radius: 4px;
  box-shadow: inset 0 0 44px rgba(0,0,0,0.42); pointer-events: none;
}
.ab-oval {
  position: absolute; width: 76%; height: 84%; border-radius: 50%;
  border: 1px solid rgba(190,150,65,0.1);
  box-shadow: inset 0 0 32px rgba(0,0,0,0.18); pointer-events: none;
}

/* ── Title letters ── */
.ab-title {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  gap: clamp(1px, 0.4vw, 6px);
}
.ab-line { display: flex; }
.ab-letter {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(30px, 7vw, 108px);
  font-weight: 900; font-style: italic; line-height: 1; letter-spacing: 1px;
  text-shadow: 1px 2px 0 rgba(0,0,0,0.8), 0 5px 16px rgba(0,0,0,0.5);
  opacity: 0; transform: translateY(14px) scale(0.8);
  transition: opacity 0.38s ease, transform 0.38s ease;
  display: inline-block;
}
.ab-letter.show { opacity: 1; transform: translateY(0) scale(1); }

/* ── Medal ── */
.ab-medal {
  position: absolute; bottom: clamp(10px, 2.8vh, 36px); left: 50%; transform: translateX(-50%);
  z-index: 3; width: clamp(42px, 6.5vw, 84px); height: clamp(42px, 6.5vw, 84px);
  border-radius: 50%;
  background: radial-gradient(circle at 34% 34%, #FFE266, #C89010 58%, #7A5400);
  border: 2px solid rgba(255,222,80,0.6);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 5px 16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,250,200,0.28);
  opacity: 0; transition: opacity 0.6s ease 1.4s;
}
.ab-medal.show { opacity: 1; }
.ab-medal-inner {
  width: clamp(30px, 4.8vw, 62px); height: clamp(30px, 4.8vw, 62px); border-radius: 50%;
  background: radial-gradient(circle at 40% 34%, #FFD700, #B8860B);
  border: 1px solid rgba(255,212,80,0.5);
  display: flex; align-items: center; justify-content: center;
  font-size: clamp(11px, 1.8vw, 26px); color: #5a3900;
}

/* ── Open hint ── */
.ab-hint {
  position: absolute; bottom: clamp(12px, 3vh, 44px); right: clamp(12px, 2.5vw, 36px); z-index: 5;
  color: rgba(255,218,120,0.7); font-family: 'Lora', serif; font-style: italic;
  font-size: clamp(9px, 1.1vw, 14px);
  display: flex; align-items: center; gap: 5px;
  opacity: 0; transform: translateY(6px);
  transition: opacity 0.4s, transform 0.4s; pointer-events: none;
}
.ab-hint span { animation: arrw 1.2s ease-in-out infinite; }
@keyframes arrw { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }

/* ════════════════ OPEN BOOK ════════════════ */
.ab-open-book {
  position: absolute; inset: 0; display: flex;
  opacity: 0; pointer-events: none;
  transition: opacity 0.7s ease 0.35s;
  border-radius: 8px;
  box-shadow: 0 50px 120px rgba(0,0,0,0.95);
  overflow: hidden;
}
.ab-open-book.show { opacity: 1; pointer-events: all; }

/* Open spine */
.ab-open-spine {
  width: clamp(44px, 6.5vw, 90px); flex-shrink: 0;
  background: linear-gradient(90deg, #5a0d0d 0%, #8b1a1a 28%, #b92020 50%, #8b1a1a 72%, #5a0d0d 100%);
  position: relative; overflow: hidden;
}
.ab-open-spine::before, .ab-open-spine::after {
  content: ''; position: absolute; top: 8%; height: 84%; width: 1.5px;
  background: linear-gradient(to bottom, transparent, rgba(255,210,80,0.75) 20%, rgba(255,215,90,0.95) 50%, rgba(255,210,80,0.75) 80%, transparent);
}
.ab-open-spine::before { left: 33%; }
.ab-open-spine::after  { left: 56%; }

/* ════════════════ SCRAPBOOK PAGE ════════════════ */
.ab-pages {
  flex: 1; position: relative; overflow: hidden;
  background: #c9b898;
}

/* Kraft paper texture */
.ab-kraft {
  position: absolute; inset: 0; pointer-events: none;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.4'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.22'/%3E%3C/svg%3E"),
    repeating-linear-gradient(88deg, transparent 0, transparent 3px, rgba(0,0,0,0.012) 3px, rgba(0,0,0,0.012) 4px),
    repeating-linear-gradient(178deg, transparent 0, transparent 5px, rgba(0,0,0,0.008) 5px, rgba(0,0,0,0.008) 6px);
}

/* Center binding shadow */
.ab-gutter {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 20px; height: 100%; z-index: 50; pointer-events: none;
  background: linear-gradient(90deg,
    transparent 0%, rgba(0,0,0,0.14) 30%, rgba(0,0,0,0.26) 50%,
    rgba(0,0,0,0.14) 70%, transparent 100%);
}

/* ════════════════ POLAROID PHOTO ════════════════ */
.ab-polaroid {
  position: absolute;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  /* thick bottom border = caption area, thin equal borders on the other 3 sides */
  padding: clamp(6px, 1.1vw, 14px) clamp(6px, 1.1vw, 14px) 0 clamp(6px, 1.1vw, 14px);
  box-shadow:
    0 6px 24px rgba(0,0,0,0.30),
    0 2px  6px rgba(0,0,0,0.18),
    inset 0 0 0 1px rgba(0,0,0,0.04);
  z-index: 10;
}

/* The actual photo area (fills available space above caption) */
.ab-polaroid-image {
  flex: 1;
  background: linear-gradient(145deg, #d8cfc0 0%, #c6baa8 50%, #b8ae9c 100%);
  overflow: hidden;
  position: relative;
  /* subtle inner vignette */
}
.ab-polaroid-image::after {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.10) 100%);
  pointer-events: none;
}

/* Caption strip */
.ab-polaroid-caption {
  width: 100%;
  padding: clamp(5px, 1vh, 10px) clamp(4px, 0.6vw, 8px) clamp(6px, 1.2vh, 12px);
  text-align: center;
  font-family: 'Caveat', cursive;
  font-size: clamp(9px, 1.3vw, 16px);
  color: #2a2218;
  line-height: 1.2;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Add-photo button tooltip hint ── */
.ab-add-hint {
  position: absolute; bottom: 68px; right: 16px; z-index: 70;
  background: rgba(40,22,6,0.88);
  border: 1px solid rgba(255,200,80,0.3);
  color: rgba(255,215,120,0.9);
  font-family: 'Caveat', cursive; font-size: 13px;
  padding: 5px 10px; border-radius: 6px;
  white-space: nowrap; pointer-events: none;
  opacity: 0; transition: opacity 0.2s;
}

.ab-tape {
  position: absolute;
  height: clamp(14px, 2.2vh, 26px);
  background: rgba(185,162,120,0.55);
  border-top: 1px solid rgba(255,255,255,0.25);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  z-index: 20; pointer-events: none;
}
.ab-tape-small {
  position: absolute;
  height: clamp(10px, 1.8vh, 20px);
  width: clamp(40px, 6vw, 80px);
  background: rgba(185,162,120,0.5);
  border-top: 1px solid rgba(255,255,255,0.2);
  border-bottom: 1px solid rgba(0,0,0,0.08);
  z-index: 20; pointer-events: none;
}

/* ── Globe stamp ── */
.ab-globe {
  position: absolute; top: 5%; right: 2%;
  width: clamp(50px, 8vw, 100px); height: clamp(50px, 8vw, 100px);
  z-index: 25;
  opacity: 0; transform: scale(0.7) rotate(-8deg);
  transition: opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s;
}
.ab-globe.show { opacity: 1; transform: scale(1) rotate(-4deg); }

/* ── Torn paper notes ── */
.ab-note {
  position: absolute;
  background: #f5f0d8;
  clip-path: polygon(
    1% 8%, 3% 2%, 7% 6%, 12% 1%, 17% 5%, 22% 0%, 28% 4%, 34% 1%, 40% 5%, 46% 0%,
    52% 4%, 58% 1%, 64% 5%, 70% 0%, 76% 4%, 82% 1%, 88% 5%, 94% 2%, 99% 6%, 100% 12%,
    98% 88%, 100% 93%, 96% 98%, 90% 95%, 84% 100%, 78% 96%, 72% 100%, 66% 95%, 60% 99%,
    54% 95%, 48% 100%, 42% 96%, 36% 100%, 30% 95%, 24% 99%, 18% 95%, 12% 99%, 6% 95%,
    0% 100%, 2% 92%
  );
  padding: clamp(14px, 3vh, 28px) clamp(10px, 2vw, 22px) clamp(16px, 3.5vh, 32px);
  z-index: 15;
  box-shadow: 2px 4px 12px rgba(0,0,0,0.18);
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.ab-note.show { opacity: 1; }
.ab-note-text {
  font-family: 'Caveat', cursive;
  font-size: clamp(10px, 1.5vw, 17px);
  color: #3a2e1a; line-height: 1.55;
}
.ab-note-tape {
  position: absolute;
  width: clamp(32px, 5vw, 60px); height: clamp(10px, 1.6vh, 18px);
  background: rgba(185,162,120,0.52);
  left: 50%; transform: translateX(-50%);
  top: -5px; z-index: 16;
}
.ab-note-tape.right { left: auto; right: 10%; transform: rotate(12deg); top: -4px; }
.ab-note-tape.left  { left: 10%; transform: rotate(-8deg); top: -4px; }

/* ════════════════ PAGE FLIP ════════════════ */
.ab-flip-wrap {
  position: absolute; inset: 0; pointer-events: none; z-index: 60; overflow: hidden;
}
.ab-flip-panel {
  position: absolute; top: 0; right: 0;
  width: 50%; height: 100%;
  transform-origin: left center; transform-style: preserve-3d;
  transform: rotateY(0deg);
  transition: transform 0.75s cubic-bezier(0.4,0,0.2,1);
}
.ab-flip-panel.flipping { transform: rotateY(-180deg); }
.ab-flip-front, .ab-flip-back {
  position: absolute; inset: 0;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background: #c9b898;
}
.ab-flip-back { transform: rotateY(180deg); background: #cfc0a2; }
.ab-flip-front::after, .ab-flip-back::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.1) 0%, transparent 25%);
}

/* ════════════════ NAV ════════════════ */
.ab-nav {
  position: absolute;
  bottom: clamp(10px, 2.2vh, 24px); left: 50%; transform: translateX(-50%);
  z-index: 80; display: flex; gap: clamp(8px, 1.8vw, 20px); align-items: center;
}
.ab-nav-btn {
  background: rgba(50,28,8,0.8);
  border: 1px solid rgba(255,200,80,0.32);
  color: rgba(255,210,120,0.9);
  font-family: 'Playfair Display', serif; font-style: italic;
  font-size: clamp(9px, 1.1vw, 13px); letter-spacing: 1px;
  padding: clamp(5px, 1vh, 9px) clamp(12px, 2.2vw, 24px);
  border-radius: 30px; cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
  backdrop-filter: blur(4px);
}
.ab-nav-btn:hover {
  background: rgba(80,44,10,0.95);
  border-color: rgba(255,210,80,0.65);
  transform: translateY(-1px);
}
.ab-nav-btn:disabled { opacity: 0.28; cursor: default; transform: none; }
.ab-nav-ind {
  color: rgba(255,200,80,0.55);
  font-family: 'Lora', serif; font-style: italic;
  font-size: clamp(9px, 1vw, 12px);
}
`;

export default css;
