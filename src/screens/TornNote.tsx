// TornNote — a torn sheet of paper with a handwritten note and masking tape.
// Props:
//   note  → { top, left, w, rot, text }
//   show  → bool (triggers fade-in)
//   index → number (0, 1, 2 — controls tape position + stagger delay)

const TAPE_VARIANTS = [
  { className: "ab-note-tape" }, // centered top
  { className: "ab-note-tape left" }, // left top
  { className: "ab-note-tape right" }, // right top
];

export default function TornNote({ note, show, index }) {
  const tape = TAPE_VARIANTS[index % TAPE_VARIANTS.length];

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
      <div className={tape.className} />
      <p className="ab-note-text">{note.text}</p>
    </div>
  );
}
