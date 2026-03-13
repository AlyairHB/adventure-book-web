import React from "react";
import { ResizeHandleProps } from "../types/types";
import { CURSOR_MAP } from "../types/constants";

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  dir,
  onMouseDown,
}) => {
  const corner = dir.length === 2;
  const size = corner ? 12 : 8;

  const pos: React.CSSProperties = {};

  if (dir.includes("n")) pos.top = -size / 2;
  if (dir.includes("s")) pos.bottom = -size / 2;
  if (dir.includes("e")) pos.right = -size / 2;
  if (dir.includes("w")) pos.left = -size / 2;
  if (!dir.includes("e") && !dir.includes("w")) {
    pos.left = "50%";
    pos.marginLeft = -size / 2;
  }
  if (!dir.includes("n") && !dir.includes("s")) {
    pos.top = "50%";
    pos.marginTop = -size / 2;
  }

  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e, dir);
      }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        background: "white",
        border: "1.5px solid #aaa",
        borderRadius: corner ? 2 : "50%",
        cursor: CURSOR_MAP[dir],
        zIndex: 30,
        ...pos,
      }}
    />
  );
};
