export default function PageNav({
  currentPage,
  totalPages,
  flipping,
  onPrev,
  onNext,
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
    </div>
  );
}
