import React from "react";
import { PageContentProps } from "../types/types";
import { GlobeStamp } from "./GlobeStamp";
import { BORDER } from "../types/constants";

export const PageContent: React.FC<PageContentProps> = ({
  page,
  photos,
  show,
}) => {
  return (
    <>
      <div className="ab-kraft" />
      {photos.map((ph) => (
        <div
          key={ph.id}
          style={{
            position: "absolute",
            left: ph.x,
            top: ph.y,
            width: ph.w,
            height: ph.h,
            transform: `rotate(${ph.rot}deg)`,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: `${BORDER}px ${BORDER}px 0 ${BORDER}px`,
            boxSizing: "border-box",
            boxShadow: "0 6px 24px rgba(0,0,0,0.30),0 2px 6px rgba(0,0,0,0.18)",
            zIndex: 10,
            opacity: show ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              position: "relative",
              background: ph.src
                ? "none"
                : "linear-gradient(145deg,#ddd8cc,#c8c0b0)",
            }}
          >
            {ph.src && (
              <img
                src={ph.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,0.09) 100%)",
              }}
            />
          </div>
          <div
            style={{
              height: Math.max(32, Math.round(ph.h * 0.22)),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 6px",
            }}
          >
            <span
              style={{
                fontFamily: "Caveat,cursive",
                fontSize: Math.max(11, Math.round(ph.h * 0.22) * 0.38),
                color: ph.caption ? "#2a2218" : "#ccc",
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {ph.caption || ""}
            </span>
          </div>
        </div>
      ))}
      {page.globe && <GlobeStamp show={show} />}
      <div className="ab-gutter" />
    </>
  );
};
