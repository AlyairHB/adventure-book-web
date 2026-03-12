import { useRef, useState } from "react";
import { PhotoFrame } from "./PhotoFrame";
import { Photo } from "../types";

interface ScrapPageProps {
  page: any;
  photos: Photo[];
  onAdd: () => void;
  onUpdate: (id: number, updates: Partial<Photo>) => void;
  onDelete: (id: number) => void;
  onUpload?: (file: File, id: number) => Promise<void>;
  show: boolean;
}

export function ScrapPage({
  page,
  photos,
  onAdd,
  onUpdate,
  onDelete,
  onUpload,
  show,
}: ScrapPageProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const onBgMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === pageRef.current ||
      (e.target as HTMLElement).classList.contains("ab-kraft") ||
      (e.target as HTMLElement).classList.contains("ab-gutter")
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

      {photos.map((photo) => (
        <PhotoFrame
          key={photo.id}
          photo={photo}
          selected={selectedId === photo.id}
          pageRef={pageRef}
          onSelect={setSelectedId}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onUpload={onUpload}
          show={show}
        />
      ))}

      {page.globe && <>{/* Tus globos y cintas existentes */}</>}

      <div className="ab-gutter" />

      {show && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onAdd}
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
          }}
        >
          +
        </button>
      )}
    </div>
  );
}
