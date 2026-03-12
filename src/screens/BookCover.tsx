import { useEffect, useState } from "react";
import { TITLE_LINES } from "../data/bookData";

// ── Animated colorful title ───────────────────────────────────
function BookTitle({ show }) {
  let gIdx = 0;
  return (
    <div className="ab-title">
      {TITLE_LINES.map((line, li) => {
        const start = gIdx;
        gIdx += line.letters.length;
        return (
          <div className="ab-line" key={li}>
            {line.letters.map((l, i) => (
              <span
                key={i}
                className={`ab-letter${show ? " show" : ""}`}
                style={{
                  color: l.color,
                  transitionDelay: `${(start + i) * 55}ms`,
                }}
              >
                {l.char}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Gold medal badge ──────────────────────────────────────────
function Medal({ show }) {
  return (
    <div className={`ab-medal${show ? " show" : ""}`}>
      <div className="ab-medal-inner">✦</div>
    </div>
  );
}

// ── Main cover ────────────────────────────────────────────────
// Props:
//   hidden   → bool  — applies .hide class (fades out when book opens)
//   onClick  → fn    — triggered when user clicks to open
export default function BookCover({ hidden, onClick }) {
  const [letterShow, setLetterShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLetterShow(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`ab-closed-book${hidden ? " hide" : ""}`} onClick={onClick}>
      {/* Spine rendered inline so the closed book is self-contained */}
      <div className="ab-spine">
        <div className="ab-spine-grain" />
      </div>

      {/* Front cover surface */}
      <div className="ab-cover">
        <div className="ab-noise" />
        <div className="ab-border" />
        <div className="ab-oval" />

        <BookTitle show={letterShow} />
        <Medal show={letterShow} />

        <div className="ab-hint">
          Abrir libro <span>▶</span>
        </div>
      </div>
    </div>
  );
}
