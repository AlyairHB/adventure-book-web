import React from "react";
import { PageNavProps } from "../types/types";

export const PageNav: React.FC<PageNavProps> = ({
  currentPage,
  totalPages,
  flipping,
  onPrev,
  onNext,
  onAddPage,
  onDeletePage,
}) => {
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
};
