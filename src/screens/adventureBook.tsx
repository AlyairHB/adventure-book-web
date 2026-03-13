import React, { useEffect, useState, useCallback } from "react";
import "../styles/styles.css";

import { BookCover } from "./BookCover";
import { ScrapPage } from "./ScrapPage";
import { PageFlip } from "./PageFlip";
import { PageNav } from "./PageNav";
import { PAGES, IMAGES_ENDPOINT } from "../types/constants";
import { Page, Photo } from "../types/types";
import {
  newPhoto,
  blankPage,
  distributePhotosAcrossPages,
} from "../utils/photoUtils";

export default function AdventureBook() {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(1);
  const [contentShow, setContentShow] = useState(false);
  const [fetchState, setFetchState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [pages, setPages] = useState<Page[]>(() => [...PAGES]);
  const [photos, setPhotos] = useState<Photo[][]>(() => PAGES.map(() => []));
  const [totalImagesLoaded, setTotalImagesLoaded] = useState(0);

  const totalPages = pages.length;
  const targetPage = Math.min(
    Math.max(currentPage + (flipping ? flipDir : 0), 0),
    totalPages - 1,
  );

  useEffect(() => {
    if (phase === "open") {
      const t = setTimeout(() => setContentShow(true), 350);
      return () => clearTimeout(t);
    }
    setContentShow(false);
  }, [phase, currentPage]);

  useEffect(() => {
    if (phase !== "open" || fetchState !== "idle") return;

    let cancelled = false;

    async function loadImages() {
      try {
        setFetchState("loading");

        const res = await fetch(IMAGES_ENDPOINT);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.images)
              ? data.images
              : [];

        setTotalImagesLoaded(items.length);

        if (items.length === 0) {
          if (!cancelled) setFetchState("done");
          return;
        }

        // Distribuir las fotos entre las páginas disponibles
        const distributedPhotos = distributePhotosAcrossPages(
          items,
          pages.length,
        );

        if (cancelled) {
          setPhotos(distributedPhotos);
          setFetchState("done");

          // Mostrar en consola cuántas fotos se cargaron por página
          console.log("Fotos cargadas por página:");
          distributedPhotos.forEach((pagePhotos, index) => {
            console.log(`Página ${index + 1}: ${pagePhotos.length} fotos`);
          });
        }
      } catch (err) {
        console.error("Error fetching images:", err);
        if (!cancelled) {
          setFetchState("error");
        }
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [phase, fetchState, pages.length]);

  const handleOpen = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1200);
  };

  const handlePageChange = (dir: number) => {
    const next = currentPage + dir;
    if (next < 0 || next >= totalPages || flipping) return;
    setContentShow(false);
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage(next);
      setFlipping(false);
    }, 750);
  };

  const handleAddPage = useCallback(() => {
    if (flipping) return;
    const insertAt = currentPage + 1;
    setPages((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, blankPage());
      return next;
    });
    setPhotos((prev) => {
      const next = [...prev];
      next.splice(insertAt, 0, []);
      return next;
    });
    setContentShow(false);
    setFlipDir(1);
    setFlipping(true);
    setTimeout(() => {
      setCurrentPage(insertAt);
      setFlipping(false);
    }, 750);
  }, [currentPage, flipping]);

  const handleDeletePage = useCallback(() => {
    if (flipping || totalPages <= 1) return;
    const pi = currentPage;
    const goTo = pi > 0 ? pi - 1 : 0;
    setContentShow(false);
    setFlipDir(-1);
    setFlipping(true);
    setTimeout(() => {
      setPages((prev) => prev.filter((_, i) => i !== pi));
      setPhotos((prev) => prev.filter((_, i) => i !== pi));
      setCurrentPage(goTo);
      setFlipping(false);
    }, 750);
  }, [currentPage, flipping, totalPages]);

  const handleAddPhoto = useCallback((pi: number) => {
    // Verificar si ya hay 4 fotos en la página
    setPhotos((prev) => {
      const currentPhotos = prev[pi] || [];
      if (currentPhotos.length >= 4) {
        alert("Solo puedes tener máximo 4 fotos por página");
        return prev;
      }
      return prev.map((list, i) => (i === pi ? [...list, newPhoto()] : list));
    });
  }, []);

  const handleUpdatePhoto = useCallback(
    (pi: number, id: number, changes: Partial<Photo>) => {
      setPhotos((prev) =>
        prev.map((list, i) =>
          i === pi
            ? list.map((p) => (p.id === id ? { ...p, ...changes } : p))
            : list,
        ),
      );
    },
    [],
  );

  const handleDeletePhoto = useCallback((pi: number, id: number) => {
    setPhotos((prev) =>
      prev.map((list, i) =>
        i === pi ? list.filter((p) => p.id !== id) : list,
      ),
    );
  }, []);

  const pi = currentPage;

  return (
    <>
      <div className="ab-scene">
        <div className={`ab-stage ${phase}`}>
          <BookCover hidden={phase !== "closed"} onClick={handleOpen} />

          <div className={`ab-open-book${phase === "open" ? " show" : ""}`}>
            <div className="ab-open-spine">
              <div className="ab-spine-grain" />
            </div>
            <div className="ab-pages">
              <ScrapPage
                page={pages[pi]}
                photos={photos[pi] || []}
                onAdd={() => handleAddPhoto(pi)}
                onUpdate={(id, ch) => handleUpdatePhoto(pi, id, ch)}
                onDelete={(id) => handleDeletePhoto(pi, id)}
                show={contentShow && !flipping}
              />

              {fetchState === "loading" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 70,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 90,
                    background: "rgba(30,15,4,0.9)",
                    border: "1px solid rgba(255,200,80,0.3)",
                    borderRadius: 20,
                    padding: "7px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "rgba(255,210,120,0.93)",
                    fontFamily: "Caveat,cursive",
                    fontSize: 15,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      animation: "ab-spin 0.9s linear infinite",
                    }}
                  >
                    ⟳
                  </span>
                  Cargando imágenes desde Drive...
                </div>
              )}

              {fetchState === "done" && totalImagesLoaded > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 70,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 90,
                    background: "rgba(20,50,20,0.9)",
                    border: "1px solid rgba(100,210,100,0.38)",
                    borderRadius: 20,
                    padding: "7px 20px",
                    color: "rgba(160,255,160,0.93)",
                    fontFamily: "Caveat,cursive",
                    fontSize: 15,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    transition: "opacity 2s ease",
                    opacity: 0.8,
                  }}
                >
                  ✓ {totalImagesLoaded} imágenes cargadas -{" "}
                  {Math.min(4, photos[pi]?.length || 0)}/4 fotos en esta página
                </div>
              )}

              {fetchState === "error" && (
                <div
                  onClick={() => setFetchState("idle")}
                  style={{
                    position: "absolute",
                    bottom: 70,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 90,
                    background: "rgba(40,8,8,0.92)",
                    border: "1px solid rgba(210,80,80,0.38)",
                    borderRadius: 20,
                    padding: "7px 20px",
                    color: "rgba(255,140,140,0.93)",
                    fontFamily: "Caveat,cursive",
                    fontSize: 15,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.55)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                  title="Clic para reintentar"
                >
                  ✕ Error al cargar — clic para reintentar
                </div>
              )}

              {flipping && (
                <PageFlip
                  flipping={flipping}
                  fromPage={pages[currentPage]}
                  fromPhotos={photos[currentPage] ?? []}
                  toPage={pages[targetPage] ?? pages[currentPage]}
                  toPhotos={photos[targetPage] ?? []}
                />
              )}
            </div>
          </div>

          {phase === "open" && (
            <PageNav
              currentPage={currentPage}
              totalPages={totalPages}
              flipping={flipping}
              onPrev={() => handlePageChange(-1)}
              onNext={() => handlePageChange(+1)}
              onAddPage={handleAddPage}
              onDeletePage={handleDeletePage}
            />
          )}
        </div>
      </div>
    </>
  );
}
