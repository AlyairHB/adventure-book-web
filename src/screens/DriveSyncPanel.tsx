// components/DriveSyncPanel.tsx - Versión simplificada (sin backups)
import React, { useState, useEffect } from "react";
import { BookConfig } from "../types/bookConfig";
import { Page, Photo } from "../types/types";
import { bookSyncService } from "../services/bookSyncService";
import { driveConfigService } from "../services/driveService";

interface DriveSyncPanelProps {
  pages: Page[];
  photos: Photo[][];
  baseConfig: BookConfig;
  onLoadFromDrive: (
    pages: Page[],
    photos: Photo[][],
    config: BookConfig,
  ) => void;
  onClose: () => void;
}

export const DriveSyncPanel: React.FC<DriveSyncPanelProps> = ({
  pages,
  photos,
  baseConfig,
  onLoadFromDrive,
  onClose,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [configExists, setConfigExists] = useState<boolean | null>(null);
  const [configInfo, setConfigInfo] = useState<any>(null);

  useEffect(() => {
    checkConfigStatus();
    loadSyncHistory();
  }, []);

  const checkConfigStatus = async () => {
    const exists = await driveConfigService.hasConfig();
    setConfigExists(exists);

    // Aquí podrías obtener más info si tu backend lo soporta
    // const info = await fetch(`${API_BASE_URL}/images/config/info`);
    // setConfigInfo(await info.json());
  };

  const loadSyncHistory = () => {
    const saved = localStorage.getItem("last_drive_sync");
    if (saved) {
      setLastSync(new Date(JSON.parse(saved)).toLocaleString());
    }
  };

  const handleSaveToDrive = async () => {
    setIsSaving(true);
    setSyncStatus("idle");

    try {
      // Crear configuración completa
      const fullConfig = bookSyncService.createConfigFromBook(
        pages,
        photos,
        baseConfig,
      );

      // Guardar en Drive (siempre actualiza el mismo archivo)
      const success = await driveConfigService.saveToDrive(fullConfig);

      if (success) {
        setSyncStatus("success");
        setStatusMessage(
          configExists
            ? "✅ Configuración actualizada en Drive"
            : "✅ Configuración guardada en Drive",
        );

        // Actualizar timestamp
        const now = new Date().toISOString();
        localStorage.setItem("last_drive_sync", JSON.stringify(now));
        setLastSync(new Date(now).toLocaleString());

        // Actualizar estado
        setConfigExists(true);
      } else {
        setSyncStatus("error");
        setStatusMessage("❌ Error al guardar en Drive");
      }
    } catch (error) {
      console.error("Error saving to Drive:", error);
      setSyncStatus("error");
      setStatusMessage("❌ Error de conexión con Drive");
    } finally {
      setIsSaving(false);

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => {
        setSyncStatus("idle");
        setStatusMessage("");
      }, 5000);
    }
  };

  const handleLoadFromDrive = async () => {
    setIsLoading(true);
    setSyncStatus("idle");

    try {
      const loadedConfig = await driveConfigService.loadFromDrive();

      if (loadedConfig) {
        const { pages: newPages, photos: newPhotos } =
          bookSyncService.restoreFromConfig(loadedConfig);

        onLoadFromDrive(newPages, newPhotos, loadedConfig);

        setSyncStatus("success");
        setStatusMessage("📖 Configuración cargada desde Drive");

        // Actualizar timestamp
        const now = new Date().toISOString();
        localStorage.setItem("last_drive_sync", JSON.stringify(now));
        setLastSync(new Date(now).toLocaleString());
      } else {
        setSyncStatus("error");
        setStatusMessage("📭 No hay configuración guardada en Drive");
      }
    } catch (error) {
      console.error("Error loading from Drive:", error);
      setSyncStatus("error");
      setStatusMessage("❌ Error al cargar desde Drive");
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        setSyncStatus("idle");
        setStatusMessage("");
      }, 5000);
    }
  };

  // Calcular estadísticas
  const totalPhotos = photos.flat().length;
  const pagesWithPhotos = photos.filter((p) => p.length > 0).length;

  return (
    <div className="ab-modal-overlay" onClick={onClose}>
      <div
        className="ab-modal-content ab-drive-sync-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ab-modal-header">
          <h3>
            <span className="ab-drive-icon">☁️</span>
            Sincronizar con Google Drive
          </h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="ab-modal-body">
          {/* Estado de sincronización */}
          <div className="ab-sync-section">
            <h4>Estado</h4>
            <div className="ab-sync-status">
              {lastSync ? (
                <p className="ab-sync-info">
                  <span className="ab-label">Última sincronización:</span>
                  <span className="ab-value">{lastSync}</span>
                </p>
              ) : (
                <p className="ab-sync-info">No hay sincronización previa</p>
              )}

              {configExists !== null && (
                <p className="ab-sync-info">
                  <span className="ab-label">Configuración en Drive:</span>
                  <span className="ab-value">
                    {configExists ? "✅ Existe" : "❌ No existe"}
                  </span>
                </p>
              )}

              <div className="ab-sync-stats">
                <div className="ab-stat-item">
                  <span className="ab-stat-label">Páginas:</span>
                  <span className="ab-stat-value">{pages.length}</span>
                </div>
                <div className="ab-stat-item">
                  <span className="ab-stat-label">Fotos totales:</span>
                  <span className="ab-stat-value">{totalPhotos}</span>
                </div>
                <div className="ab-stat-item">
                  <span className="ab-stat-label">Páginas con fotos:</span>
                  <span className="ab-stat-value">{pagesWithPhotos}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de estado */}
          {statusMessage && (
            <div className={`ab-sync-message ${syncStatus}`}>
              {statusMessage}
            </div>
          )}

          {/* Acciones principales */}
          <div className="ab-sync-section">
            <h4>Acciones</h4>
            <div className="ab-sync-buttons">
              <button
                onClick={handleSaveToDrive}
                disabled={isSaving || isLoading}
                className="ab-sync-btn primary save"
              >
                {isSaving ? (
                  <>
                    <span className="ab-spin-small">⟳</span>
                    {configExists ? "Actualizando..." : "Guardando..."}
                  </>
                ) : (
                  <>
                    {configExists
                      ? "🔄 Actualizar en Drive"
                      : "💾 Guardar en Drive"}
                  </>
                )}
              </button>

              <button
                onClick={handleLoadFromDrive}
                disabled={isLoading || isSaving}
                className="ab-sync-btn primary load"
              >
                {isLoading ? (
                  <>
                    <span className="ab-spin-small">⟳</span>
                    Cargando...
                  </>
                ) : (
                  <>📂 Cargar desde Drive</>
                )}
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="ab-sync-info-box">
            <p className="ab-sync-note">
              <span className="ab-note-icon">ℹ️</span>
              <strong>Modo actualización:</strong> Siempre se actualiza el mismo
              archivo en Drive. No se crean versiones adicionales.
            </p>
            <p className="ab-sync-note">
              <span className="ab-note-icon">💡</span>
              La configuración incluye: {pages.length} páginas, {totalPhotos}{" "}
              fotos, y todas sus posiciones y rotaciones.
            </p>
          </div>
        </div>

        <div className="ab-modal-footer">
          <button onClick={onClose} className="ab-close-btn">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
