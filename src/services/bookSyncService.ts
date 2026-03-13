// services/bookSyncService.ts
import { BookConfig, SavedPage, SavedPhoto } from "../types/bookConfig";
import { Page, Photo } from "../types/types";

class BookSyncService {
  private currentConfig: BookConfig | null = null;
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private onAutoSaveCallback?: (success: boolean) => void;

  // Crear configuración a partir del estado actual del libro
  createConfigFromBook(
    pages: Page[],
    photos: Photo[][],
    baseConfig: BookConfig,
  ): BookConfig {
    // Convertir páginas a formato guardable
    const savedPages: SavedPage[] = pages.map((page, index) => ({
      ...page,
      photos: (photos[index] || []).map((photo) => ({
        ...photo,
        pageIndex: index,
      })),
    }));

    return {
      ...baseConfig,
      pages: savedPages,
      lastSaved: new Date().toISOString(),
      version: baseConfig.version || "1.0.0",
    };
  }

  // Restaurar estado del libro desde configuración
  restoreFromConfig(config: BookConfig): {
    pages: Page[];
    photos: Photo[][];
  } {
    // Extraer páginas (sin las fotos)
    const pages: Page[] = config.pages.map(
      ({ photos, ...page }) => page as Page,
    );

    // Extraer fotos organizadas por página
    const photosArray: Photo[][] = config.pages.map((savedPage) =>
      savedPage.photos.map(({ pageIndex, ...photo }) => ({
        ...photo,
        id: photo.id || Date.now() + Math.random(), // Asegurar ID único si no existe
      })),
    );

    // Asegurar que todas las páginas tengan un array de fotos
    while (photosArray.length < pages.length) {
      photosArray.push([]);
    }

    return { pages, photos: photosArray };
  }

  // Comparar dos configuraciones para ver si hay cambios
  hasChanges(config1: BookConfig, config2: BookConfig): boolean {
    return JSON.stringify(config1.pages) !== JSON.stringify(config2.pages);
  }

  // Obtener estadísticas del libro
  getBookStats(config: BookConfig): {
    totalPages: number;
    totalPhotos: number;
    pagesWithPhotos: number;
    averagePhotosPerPage: number;
    lastSaved: string;
  } {
    const totalPhotos = config.pages.reduce(
      (acc, page) => acc + page.photos.length,
      0,
    );
    const pagesWithPhotos = config.pages.filter(
      (page) => page.photos.length > 0,
    ).length;

    return {
      totalPages: config.pages.length,
      totalPhotos,
      pagesWithPhotos,
      averagePhotosPerPage: totalPhotos / config.pages.length || 0,
      lastSaved: config.lastSaved,
    };
  }

  // Iniciar auto-guardado
  startAutoSave(
    pages: Page[],
    photos: Photo[][],
    baseConfig: BookConfig,
    intervalMinutes: number = 5,
    onSave?: (success: boolean) => void,
  ) {
    if (this.autoSaveInterval) {
      this.stopAutoSave();
    }

    this.onAutoSaveCallback = onSave;

    this.autoSaveInterval = setInterval(
      async () => {
        console.log("🔄 Auto-guardando libro...");

        try {
          const fullConfig = this.createConfigFromBook(
            pages,
            photos,
            baseConfig,
          );

          // Aquí puedes implementar el guardado real (localStorage, Drive, etc.)
          localStorage.setItem("autosave_backup", JSON.stringify(fullConfig));

          console.log(
            "✅ Auto-guardado completado:",
            new Date().toLocaleTimeString(),
          );

          if (this.onAutoSaveCallback) {
            this.onAutoSaveCallback(true);
          }
        } catch (error) {
          console.error("❌ Error en auto-guardado:", error);

          if (this.onAutoSaveCallback) {
            this.onAutoSaveCallback(false);
          }
        }
      },
      intervalMinutes * 60 * 1000,
    );

    console.log(`⏰ Auto-guardado activado (cada ${intervalMinutes} minutos)`);
  }

  // Detener auto-guardado
  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log("⏹️ Auto-guardado detenido");
    }
  }

  // Crear backup manual
  createManualBackup(
    pages: Page[],
    photos: Photo[][],
    baseConfig: BookConfig,
  ): {
    backup: BookConfig;
    timestamp: string;
  } {
    const backup = this.createConfigFromBook(pages, photos, baseConfig);
    const timestamp = new Date().toISOString();

    // Guardar en localStorage como backup manual
    const backups = this.getBackupList();
    backups.push({
      timestamp,
      name: `Backup manual ${new Date().toLocaleString()}`,
      config: backup,
    });

    // Mantener solo los últimos 10 backups
    if (backups.length > 10) {
      backups.shift();
    }

    localStorage.setItem("manual_backups", JSON.stringify(backups));

    return { backup, timestamp };
  }

  // Obtener lista de backups
  getBackupList(): Array<{
    timestamp: string;
    name: string;
    config: BookConfig;
  }> {
    try {
      const saved = localStorage.getItem("manual_backups");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Restaurar desde backup
  restoreFromBackup(timestamp: string): BookConfig | null {
    const backups = this.getBackupList();
    const backup = backups.find((b) => b.timestamp === timestamp);
    return backup?.config || null;
  }

  // Exportar configuración a JSON string
  exportToJson(
    pages: Page[],
    photos: Photo[][],
    baseConfig: BookConfig,
  ): string {
    const fullConfig = this.createConfigFromBook(pages, photos, baseConfig);
    return JSON.stringify(fullConfig, null, 2);
  }

  // Importar desde JSON string
  importFromJson(jsonString: string): {
    config: BookConfig;
    pages: Page[];
    photos: Photo[][];
  } | null {
    try {
      const config = JSON.parse(jsonString) as BookConfig;
      const { pages, photos } = this.restoreFromConfig(config);
      return { config, pages, photos };
    } catch (error) {
      console.error("Error importando JSON:", error);
      return null;
    }
  }

  // Migrar configuración de versión anterior
  migrateConfig(oldConfig: any): BookConfig {
    // Detectar versión y migrar si es necesario
    if (!oldConfig.version) {
      // Migrar desde versión 0 (sin versión)
      return {
        ...oldConfig,
        version: "1.0.0",
        lastSaved: new Date().toISOString(),
        photoLayout: oldConfig.photoLayout || {
          sizeFactors: { "1": 0.65, "2": 0.6, "3": 0.55, "4": 0.5 },
          maxHeightFactor: 0.95,
          jitterFactor: 0.05,
          aspectRatio: 0.82,
        },
      };
    }

    return oldConfig as BookConfig;
  }

  // Validar configuración
  validateConfig(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config) {
      errors.push("Configuración no existe");
      return { valid: false, errors };
    }

    if (!config.pages) errors.push('Falta propiedad "pages"');
    if (!config.photosPerPage) errors.push('Falta propiedad "photosPerPage"');
    if (!config.coverConfig) errors.push('Falta propiedad "coverConfig"');

    if (config.pages && !Array.isArray(config.pages)) {
      errors.push('"pages" debe ser un array');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const bookSyncService = new BookSyncService();
