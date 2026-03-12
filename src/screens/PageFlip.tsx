export default function PageFlip({ flipping }) {
  return (
    <div className="ab-flip-wrap">
      <div className={`ab-flip-panel${flipping ? " flipping" : ""}`}>
        <div className="ab-flip-front" />
        <div className="ab-flip-back" />
      </div>
    </div>
  );
}
