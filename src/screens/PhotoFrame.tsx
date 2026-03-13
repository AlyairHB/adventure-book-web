import React, { useState } from "react";
import { PhotoFrameProps } from "../types/types";
import { ResizeHandle } from "./ResizeHandle";
import { BORDER, HANDLES, MIN_SIZE } from "../types/constants";

export const PhotoFrame: React.FC<PhotoFrameProps> = ({
  photo,
  selected,
  pageRef,
  onSelect,
  onUpdate,
  onDelete,
  show,
}) => {
  const { id, x, y, w, h, rot, caption, src } = photo;
  const [editing, setEditing] = useState(false);
  const captionH = Math.max(32, Math.round(h * 0.22));

  const toLocal = (cx: number, cy: number) => {
    const r = pageRef.current!.getBoundingClientRect();
    return { lx: cx - r.left, ly: cy - r.top };
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

  const onResizeStart = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    const { lx: sx, ly: sy } = toLocal(e.clientX, e.clientY);
    const ox = x,
      oy = y,
      ow = w,
      oh = h;

    const move = (ev: MouseEvent) => {
      const { lx, ly } = toLocal(ev.clientX, ev.clientY);
      const dx = lx - sx,
        dy = ly - sy;
      let nx = ox,
        ny = oy,
        nw = ow,
        nh = oh;

      if (dir.includes("e")) nw = Math.max(MIN_SIZE, ow + dx);
      if (dir.includes("s")) nh = Math.max(MIN_SIZE, oh + dy);
      if (dir.includes("w")) {
        nw = Math.max(MIN_SIZE, ow - dx);
        if (nw > MIN_SIZE) nx = ox + dx;
      }
      if (dir.includes("n")) {
        nh = Math.max(MIN_SIZE, oh - dy);
        if (nh > MIN_SIZE) ny = oy + dy;
      }
      onUpdate(id, { x: nx, y: ny, w: nw, h: nh });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const onDrop = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file =
      "dataTransfer" in e
        ? e.dataTransfer?.files[0]
        : (e.target as HTMLInputElement).files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => onUpdate(id, { src: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

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
        padding: `${BORDER}px ${BORDER}px 0 ${BORDER}px`,
        boxSizing: "border-box",
        boxShadow: selected
          ? "0 0 0 2px #6ab4f5,0 8px 28px rgba(0,0,0,0.38)"
          : "0 6px 24px rgba(0,0,0,0.30),0 2px 6px rgba(0,0,0,0.18)",
        cursor: editing ? "default" : "grab",
        userSelect: "none",
        zIndex: selected ? 40 : 10,
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease,box-shadow 0.15s",
      }}
    >
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
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.09) 100%)",
          }}
        />
      </div>
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
              letterSpacing: "0.02em",
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
              letterSpacing: "0.02em",
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
      {selected && (
        <>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
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
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            ×
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(id, { rot: rot - 5 });
            }}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            ↺
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(id, { rot: rot + 5 });
            }}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            ↻
          </button>
          {HANDLES.map((dir) => (
            <ResizeHandle key={dir} dir={dir} onMouseDown={onResizeStart} />
          ))}
        </>
      )}
    </div>
  );
};
