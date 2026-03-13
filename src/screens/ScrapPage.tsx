import React, { useRef, useState } from "react";
import { ScrapPageProps } from "../types/types";
import { PhotoFrame } from "./PhotoFrame";
import { GlobeStamp } from "./GlobeStamp";

export const ScrapPage: React.FC<ScrapPageProps> = ({
  page,
  photos,
  onAdd,
  onUpdate,
  onDelete,
  show,
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const onBgMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target === pageRef.current ||
      target.classList.contains("ab-kraft") ||
      target.classList.contains("ab-gutter")
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
};
