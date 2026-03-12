import { useState } from "react";
import { Photo } from "../types";

interface PhotoFrameProps {
  photo: Photo;
  selected: boolean;
  pageRef: React.RefObject<HTMLDivElement>;
  onSelect: (id: number | null) => void;
  onUpdate: (id: number, updates: Partial<Photo>) => void;
  onDelete: (id: number) => void;
  onUpload?: (file: File, id: number) => Promise<void>;
  show: boolean;
}

export function PhotoFrame({
  photo,
  selected,
  pageRef,
  onSelect,
  onUpdate,
  onDelete,
  onUpload,
  show,
}: PhotoFrameProps) {
  const { id, x, y, w, h, rot, caption, src, driveId, uploading } = photo;
  const [editing, setEditing] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const captionH = Math.max(32, Math.round(h * 0.22));

  // Tu lógica existente de drag & drop...
  const toLocal = (cx: number, cy: number) => {
    const r = pageRef.current?.getBoundingClientRect();
    return { lx: cx - (r?.left || 0), ly: cy - (r?.top || 0) };
  };

  const onDragStart = (e: React.MouseEvent) => {
    if (editing) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);

    const { lx: sx, ly: sy } = toLocal(e.clientX, e.clientY);
    const ox = x,
      oy = y;

    const move = (ev: MouseEvent) => {
      const { lx, ly } = toLocal(ev.clientX, ev.clientY);
      onUpdate(id, { x: ox + lx - sx, y: oy + ly - sy });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // Manejador de subida de archivos MODIFICADO
  const onDrop = async (
    e: React.DragEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();

    let file: File | null = null;

    if ("dataTransfer" in e) {
      file = e.dataTransfer?.files[0] || null;
    } else {
      file = e.target.files?.[0] || null;
    }

    if (!file || !file.type.startsWith("image/")) return;

    // Vista previa local inmediata
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdate(id, { src: ev.target?.result as string });
    };
    reader.readAsDataURL(file);

    // Subir a Google Drive si hay función de upload
    if (onUpload) {
      setLocalUploading(true);
      onUpdate(id, { uploading: true });

      try {
        await onUpload(file, id);
      } catch (error) {
        console.error("Error en upload:", error);
      } finally {
        setLocalUploading(false);
        onUpdate(id, { uploading: false });
      }
    }
  };

  // Si está subiendo, mostrar overlay
  const showUploading = uploading || localUploading;

  return (
    <div
      onMouseDown={onDragStart}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${rot}deg)`,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "10px 10px 0 10px",
        boxSizing: "border-box",
        boxShadow: selected
          ? "0 0 0 2px #6ab4f5,0 8px 28px rgba(0,0,0,0.38)"
          : "0 6px 24px rgba(0,0,0,0.30),0 2px 6px rgba(0,0,0,0.18)",
        cursor: editing ? "default" : "grab",
        userSelect: "none",
        zIndex: selected ? 40 : 10,
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease,box-shadow 0.15s",
        position: "relative",
      }}
    >
      {/* Overlay de carga */}
      {showUploading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontFamily: "Caveat, cursive",
              fontSize: 16,
              color: "#666",
            }}
          >
            <div style={{ marginBottom: 8 }}>✨</div>
            Subiendo a la nube...
          </div>
        </div>
      )}

      {/* Área de imagen */}
      <div
        style={{
          flex: 1,
          background: src ? "none" : "linear-gradient(145deg,#ddd8cc,#c8c0b0)",
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {src ? (
          <img
            src={src}
            alt={caption}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
            }}
          />
        ) : (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              gap: 6,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onDrop}
            />
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#aaa"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span
              style={{
                fontFamily: "Caveat,cursive",
                fontSize: 13,
                color: "#bbb",
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              Arrastra o toca
              <br />
              para agregar foto
            </span>
          </label>
        )}
      </div>

      {/* Caption */}
      <div
        style={{
          height: captionH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px 6px",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={() => setEditing(true)}
      >
        {editing ? (
          <input
            autoFocus
            defaultValue={caption}
            onBlur={(e) => {
              onUpdate(id, { caption: e.target.value });
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.target.blur();
            }}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: "Caveat,cursive",
              fontSize: Math.max(11, captionH * 0.38),
              color: "#2a2218",
              textAlign: "center",
            }}
          />
        ) : (
          <span
            title="Doble clic para editar"
            style={{
              fontFamily: "Caveat,cursive",
              fontSize: Math.max(11, captionH * 0.38),
              color: caption ? "#2a2218" : "#ccc",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              cursor: "text",
            }}
          >
            {caption || "doble clic para escribir…"}
          </span>
        )}
      </div>

      {/* Indicador de Drive */}
      {driveId && !showUploading && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            fontSize: 10,
            color: "#999",
            fontFamily: "Caveat, cursive",
          }}
        >
          ☁️
        </div>
      )}

      {/* Resto de tus controles (selección, rotación, eliminación) */}
      {selected && (
        <>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(id)}
            style={{
              position: "absolute",
              top: -14,
              right: -14,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#e74c3c",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
            }}
          >
            ×
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onUpdate(id, { rot: rot - 5 })}
            style={{
              position: "absolute",
              top: -14,
              left: -14,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#555",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ↺
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onUpdate(id, { rot: rot + 5 })}
            style={{
              position: "absolute",
              top: -14,
              left: 16,
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              background: "#555",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ↻
          </button>
        </>
      )}
    </div>
  );
}
