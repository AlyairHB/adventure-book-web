import React, { useEffect, useState, useCallback, useRef } from "react";
import "../styles/styles.css";

// Componentes
import { BookCover } from "./BookCover";
import { ScrapPage } from "./ScrapPage";
import { PageFlip } from "./PageFlip";
import { PageNav } from "./PageNav";
import { ImageGalleryModal } from "./ImageGalleryModal";
import { DriveSyncPanel } from "./DriveSyncPanel";
import { ApiDebug } from "./ApiDebug";

// Servicios
import { configService } from "../services/configService";
import { driveConfigService } from "../services/driveService";
import { imageService, ImageItem } from "../services/imageService";
import { bookSyncService } from "../services/bookSyncService";

// Tipos
import { Page, Photo } from "../types/types";
import { BookConfig } from "../types/bookConfig";

// Constantes y utilidades
import { PAGES } from "../types/constants";
import {
  newPhoto,
  blankPage,
  distributePhotosAcrossPages,
  calculateRequiredPages,
} from "../utils/photoUtils";

export default function AdventureBook() {
  // Estados del libro
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const [currentPage, setCurrentPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState(1);
  const [contentShow, setContentShow] = useState(false);

  // Estados de datos
  const [pages, setPages] = useState<Page[]>(() => [...PAGES]);
  const [photos, setPhotos] = useState<Photo[][]>(() => PAGES.map(() => []));
  const [config, setConfig] = useState<BookConfig | null>(null);

  // Estados de UI
  const [fetchState, setFetchState] = useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showDriveSync, setShowDriveSync] = useState(false);
  const [availableImages, setAvailableImages] = useState<ImageItem[]>([]);
  const [totalImagesLoaded, setTotalImagesLoaded] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  // Nuevo estado para controlar la carga de configuración de Drive
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [configLoadError, setConfigLoadError] = useState<string | null>(null);

  // Refs
  const bookRef = useRef<HTMLDivElement>(null);
  const hasLoadedConfig = useRef(false);

  // Cargar configuración al iniciar (local primero, luego intentar Drive)
  useEffect(() => {
    async function loadInitialConfig() {
      // Intentar desde localStorage primero
      const storedConfig = configService.loadConfigFromStorage();
      if (storedConfig) {
        console.log("📖 Configuración cargada desde localStorage");
        setConfig(storedConfig);
        if (storedConfig.pages && storedConfig.pages.length > 0) {
          setPages(storedConfig.pages);
        }
      } else {
        // Si no, cargar del archivo local
        console.log("📖 Cargando configuración local por defecto");
        const localConfig = await configService.loadLocalConfig();
        setConfig(localConfig);
        if (localConfig.pages && localConfig.pages.length > 0) {
          setPages(localConfig.pages);
        }
      }
    }

    loadInitialConfig();
  }, []);

  // Cuando el libro se abre, intentar cargar configuración de Drive
  useEffect(() => {
    if (phase === "open" && !hasLoadedConfig.current) {
      loadConfigFromDrive();
    }
  }, [phase]);

  // Función para cargar configuración desde Drive
  const loadConfigFromDrive = async () => {
    if (isLoadingConfig) return;

    setIsLoadingConfig(true);
    setConfigLoadError(null);

    try {
      console.log("☁️ Intentando cargar configuración desde Drive...");

      // Verificar si hay configuración en Drive
      const hasConfig = await driveConfigService.hasConfig();

      if (hasConfig) {
        const loadedConfig = await driveConfigService.loadFromDrive();

        if (loadedConfig) {
          console.log("✅ Configuración cargada desde Drive:", {
            pages: loadedConfig.pages?.length,
            lastSaved: loadedConfig.lastSaved,
          });

          // Restaurar el estado del libro
          const { pages: newPages, photos: newPhotos } =
            bookSyncService.restoreFromConfig(loadedConfig);

          setPages(newPages);
          setPhotos(newPhotos);
          setConfig(loadedConfig);

          // Guardar en localStorage para futuras sesiones
          configService.saveConfigToStorage(loadedConfig);

          showNotification("📖 Configuración cargada desde Drive");
        }
      } else {
        console.log("📭 No hay configuración guardada en Drive");
      }
    } catch (error) {
      console.error("Error cargando configuración de Drive:", error);
      setConfigLoadError("Error al cargar configuración de Drive");
    } finally {
      setIsLoadingConfig(false);
      hasLoadedConfig.current = true;
    }
  };

  // Función para forzar la recarga desde Drive (útil después de guardar)
  const reloadFromDrive = async () => {
    await loadConfigFromDrive();
  };

  // Control de contenido visible durante flips
  useEffect(() => {
    if (phase === "open") {
      const t = setTimeout(() => setContentShow(true), 350);
      return () => clearTimeout(t);
    }
    setContentShow(false);
  }, [phase, currentPage]);

  // Cargar imágenes desde el backend
  useEffect(() => {
    if (phase !== "open" || fetchState !== "idle" || !config) return;

    let cancelled = false;

    async function loadImages() {
      try {
        setFetchState("loading");

        const items = await imageService.fetchImages();

        setTotalImagesLoaded(items.length);
        setAvailableImages(items);

        if (items.length === 0) {
          if (!cancelled) setFetchState("done");
          return;
        }

        // Distribuir las fotos entre páginas (solo si no hay fotos ya cargadas)
        const hasPhotos = photos.some((pagePhotos) => pagePhotos.length > 0);

        if (!hasPhotos) {
          console.log("🖼️ Distribuyendo imágenes en el libro...");

          const { pages: newPages, photos: newPhotos } =
            distributePhotosAcrossPages(
              items.map((img) => ({
                name: img.name,
                directUrl: img.directUrl,
                thumbnailUrl: img.thumbnailUrl,
              })),
              pages,
              config?.photosPerPage || 4,
            );

          if (cancelled) {
            setPages(newPages);
            setPhotos(newPhotos);

            // Guardar en localStorage después de cargar
            if (config) {
              const updatedConfig = {
                ...config,
                pages: newPages,
                lastSaved: new Date().toISOString(),
              };
              configService.saveConfigToStorage(updatedConfig);
            }
          }
        }

        if (!cancelled) setFetchState("done");
      } catch (err) {
        console.error("Error fetching images:", err);
        if (!cancelled) setFetchState("error");
      }
    }

    loadImages();

    return () => {
      cancelled = true;
    };
  }, [phase, fetchState, config]);

  const totalPages = pages.length;
  const targetPage = Math.min(
    Math.max(currentPage + (flipping ? flipDir : 0), 0),
    totalPages - 1,
  );

  // Manejadores de eventos
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

  // Manejadores de páginas
  const handleAddPage = useCallback(() => {
    if (flipping || !config?.allowUserToAddPages) return;

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
  }, [currentPage, flipping, config]);

  const handleDeletePage = useCallback(() => {
    if (flipping || totalPages <= 1 || !config?.allowUserToDeletePages) return;

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
  }, [currentPage, flipping, totalPages, config]);

  // Manejadores de fotos
  const handleAddPhoto = useCallback(
    (pageIndex: number) => {
      if (!config?.allowPhotoUpload) return;

      setPhotos((prev) => {
        const currentPhotos = prev[pageIndex] || [];
        if (currentPhotos.length >= (config?.photosPerPage || 4)) {
          alert(`Máximo ${config?.photosPerPage} fotos por página`);
          return prev;
        }
        return prev.map((list, i) =>
          i === pageIndex ? [...list, newPhoto()] : list,
        );
      });
    },
    [config],
  );

  const handleUpdatePhoto = useCallback(
    (pageIndex: number, id: number, changes: Partial<Photo>) => {
      setPhotos((prev) =>
        prev.map((list, i) =>
          i === pageIndex
            ? list.map((p) => (p.id === id ? { ...p, ...changes } : p))
            : list,
        ),
      );
    },
    [],
  );

  const handleDeletePhoto = useCallback((pageIndex: number, id: number) => {
    setPhotos((prev) =>
      prev.map((list, i) =>
        i === pageIndex ? list.filter((p) => p.id !== id) : list,
      ),
    );
  }, []);

  const handleAddImageToCurrentPage = useCallback(
    (image: ImageItem) => {
      if (!config) return;

      // Verificar límite de fotos por página
      const currentPhotos = photos[currentPage] || [];
      if (currentPhotos.length >= (config?.photosPerPage || 4)) {
        alert(`Máximo ${config?.photosPerPage} fotos por página`);
        return;
      }

      // Calcular posición aleatoria pero dentro de la página
      const maxX = 600;
      const maxY = 400;

      const newX = Math.max(
        50,
        Math.min(maxX - 250, 100 + Math.random() * 200),
      );
      const newY = Math.max(50, Math.min(maxY - 300, 60 + Math.random() * 150));

      // Crear nueva foto
      const newPhotoItem: Photo = {
        id: Date.now() + Math.random(),
        x: newX,
        y: newY,
        w: 220,
        h: 280,
        rot: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        caption: image.name || "Foto de Drive",
        src: image.directUrl || image.thumbnailUrl,
        driveId: image.id,
        fileName: image.name,
      };

      console.log("📸 Agregando foto:", newPhotoItem);

      setPhotos((prev) => {
        const newPhotos = [...prev];
        if (!newPhotos[currentPage]) {
          newPhotos[currentPage] = [];
        }
        newPhotos[currentPage] = [...newPhotos[currentPage], newPhotoItem];
        return newPhotos;
      });

      setShowImageGallery(false);
      showNotification(`✅ Foto agregada a la página ${currentPage + 1}`);
    },
    [currentPage, photos, config],
  );

  // Manejadores de imágenes
  const handleUploadImages = async (files: FileList) => {
    try {
      const uploadedImages = await imageService.uploadMultipleImages(
        Array.from(files),
      );
      setAvailableImages((prev) => [...prev, ...uploadedImages]);
      showNotification(`✅ ${uploadedImages.length} imágenes subidas`);
      return uploadedImages;
    } catch (error) {
      console.error("Error uploading images:", error);
      showNotification("❌ Error al subir imágenes");
      throw error;
    }
  };

  // Manejadores de configuración
  const handleSaveToDrive = async () => {
    if (!config) return;

    try {
      const fullConfig = bookSyncService.createConfigFromBook(
        pages,
        photos,
        config,
      );

      const success = await driveConfigService.saveToDrive(fullConfig);

      if (success) {
        // Actualizar timestamp en localStorage
        const updatedConfig = {
          ...config,
          pages: pages,
          lastSaved: new Date().toISOString(),
        };
        configService.saveConfigToStorage(updatedConfig);
        setConfig(updatedConfig);

        showNotification("✅ Configuración guardada en Drive");

        // Opcional: recargar para confirmar
        // await reloadFromDrive();
      }
    } catch (error) {
      console.error("Error saving to Drive:", error);
      showNotification("❌ Error al guardar en Drive");
    }
  };

  const handleLoadFromDrive = async () => {
    await loadConfigFromDrive();
  };

  const handleLoadFromDriveManual = async () => {
    await loadConfigFromDrive();
    setShowDriveSync(false);
  };

  const handleSaveLocalConfig = useCallback(() => {
    if (!config) return;

    const updatedConfig = {
      ...config,
      pages: pages,
      lastSaved: new Date().toISOString(),
    };

    configService.saveConfigToStorage(updatedConfig);
    setConfig(updatedConfig);
    showNotification("💾 Configuración guardada localmente");
  }, [config, pages]);

  // Utilidad para mostrar notificaciones
  const showNotification = (message: string) => {
    const notification = document.createElement("div");
    notification.className = "ab-notification";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const pi = currentPage;

  return (
    <>
      <div className="ab-scene" ref={bookRef}>
        <div className={`ab-stage ${phase}`}>
          {/* Botones de control */}
          {phase === "closed" && (
            <>
              <button
                className="ab-config-btn"
                onClick={() => setShowDebug(!showDebug)}
                title="Debug"
              >
                🐛
              </button>
              <button
                className="ab-config-btn"
                onClick={() => setShowDriveSync(true)}
                title="Sincronizar con Drive"
                style={{ right: "80px" }}
              >
                ☁️
              </button>
            </>
          )}

          {phase === "open" && (
            <div className="ab-controls">
              <button
                className="ab-control-btn gallery"
                onClick={() => setShowImageGallery(true)}
                title="Galería de imágenes"
              >
                🖼️
              </button>
              <button
                className="ab-control-btn upload"
                onClick={() => setShowImageGallery(true)}
                title="Subir imágenes"
              >
                📤
              </button>
              <button
                className="ab-control-btn save"
                onClick={handleSaveLocalConfig}
                title="Guardar localmente"
              >
                💾
              </button>
              <button
                className="ab-control-btn drive"
                onClick={() => setShowDriveSync(true)}
                title="Sincronizar con Drive"
              >
                ☁️
              </button>
            </div>
          )}

          {/* Indicador de carga de Drive */}
          {phase === "open" && isLoadingConfig && (
            <div className="ab-loading-config">
              <span className="ab-spin">⟳</span>
              Cargando configuración desde Drive...
            </div>
          )}

          {/* Error de configuración */}
          {configLoadError && (
            <div
              className="ab-config-error"
              onClick={() => setConfigLoadError(null)}
            >
              ⚠️ {configLoadError} (clic para cerrar)
            </div>
          )}

          {/* Portada del libro */}
          <BookCover hidden={phase !== "closed"} onClick={handleOpen} />

          {/* Libro abierto */}
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
                maxPhotos={config?.photosPerPage || 4}
              />

              {fetchState === "done" && totalImagesLoaded > 0 && (
                <div className="ab-success-message">
                  ✓ {totalImagesLoaded} imágenes disponibles
                  <br />
                  <small>
                    {pages.length} páginas · {photos[pi]?.length || 0}/
                    {config?.photosPerPage || 4} fotos
                  </small>
                </div>
              )}

              {fetchState === "error" && (
                <div
                  className="ab-error-message"
                  onClick={() => setFetchState("idle")}
                >
                  ✕ Error al cargar imágenes — clic para reintentar
                </div>
              )}

              {/* Animación de flip de página */}
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

          {/* Navegación de páginas */}
          {phase === "open" && (
            <PageNav
              currentPage={currentPage}
              totalPages={totalPages}
              flipping={flipping}
              onPrev={() => handlePageChange(-1)}
              onNext={() => handlePageChange(+1)}
              onAddPage={handleAddPage}
              onDeletePage={handleDeletePage}
              canAddPages={config?.allowUserToAddPages}
              canDeletePages={config?.allowUserToDeletePages}
            />
          )}
        </div>
      </div>

      {/* Modales */}
      {showImageGallery && (
        <ImageGalleryModal
          availableImages={availableImages}
          onUpload={handleUploadImages}
          onClose={() => setShowImageGallery(false)}
          onSelectImage={handleAddImageToCurrentPage}
        />
      )}

      {showDriveSync && config && (
        <DriveSyncPanel
          pages={pages}
          photos={photos}
          baseConfig={config}
          onLoadFromDrive={(loadedPages, loadedPhotos, loadedConfig) => {
            setPages(loadedPages);
            setPhotos(loadedPhotos);
            setConfig(loadedConfig);
            setShowDriveSync(false);
            showNotification("📖 Configuración cargada desde Drive");
          }}
          onClose={() => setShowDriveSync(false)}
        />
      )}

      {/* Debug panel */}
      {showDebug && <ApiDebug onClose={() => setShowDebug(false)} />}
    </>
  );
}
