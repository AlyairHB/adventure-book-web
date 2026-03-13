import React from "react";
import { TornNoteProps } from "../types/types";

export const TornNote: React.FC<TornNoteProps> = ({ note, show, index }) => {
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
};
