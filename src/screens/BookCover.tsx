import React, { useState, useEffect } from "react";
import { BookCoverProps } from "../types/types";
import { TITLE_LINES } from "../types/constants";

export const BookCover: React.FC<BookCoverProps> = ({ hidden, onClick }) => {
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
        <div className="ab-noise" />
        <div className="ab-border" />
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
};
