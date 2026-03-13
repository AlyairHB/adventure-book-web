import React from "react";
import { PageFlipProps } from "../types/types";
import { PageContent } from "./PageContent";

export const PageFlip: React.FC<PageFlipProps> = ({
  flipping,
  fromPage,
  fromPhotos,
  toPage,
  toPhotos,
}) => {
  return (
    <div className="ab-flip-wrap">
      <div className={`ab-flip-panel${flipping ? " flipping" : ""}`}>
        <div className="ab-flip-front">
          <div className="ab-flip-page">
            <PageContent page={fromPage} photos={fromPhotos} show={true} />
          </div>
        </div>
        <div className="ab-flip-back">
          <div className="ab-flip-page">
            <PageContent page={toPage} photos={toPhotos} show={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
