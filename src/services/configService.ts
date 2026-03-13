// services/configService.ts
import { BookConfig } from "../types/bookConfig";

// Configuración por defecto (fallback)
const DEFAULT_CONFIG: BookConfig = {
  bookTitle: "Nuestro Libro de Aventuras",
  photosPerPage: 6,
  maxPages: 20,
  defaultPageBackground: "kraft",
  allowUserToAddPages: true,
  allowUserToDeletePages: true,
  allowPhotoUpload: true,
  coverConfig: {
    titleLines: [
      {
        letters: [
          { char: "O", color: "#E8B84B" },
          { char: "u", color: "#C0392B" },
          { char: "R", color: "#2ECC71" },

          { char: "A", color: "#E8B84B" },
          { char: "D", color: "#3498DB" },
          { char: "V", color: "#E67E22" },
          { char: "E", color: "#9B59B6" },
          { char: "N", color: "#2ECC71" },
          { char: "T", color: "#E8B84B" },
          { char: "U", color: "#C0392B" },
          { char: "R", color: "#3498DB" },
          { char: "E", color: "#E67E22" },
          { char: "\u00a0", color: "transparent" },

          { char: "B", color: "#C0392B" },
          { char: "O", color: "#E8B84B" },
          { char: "O", color: "#2ECC71" },
          { char: "K", color: "#3498DB" },
        ],
      },

      // ... resto de líneas del título
    ],
    medalIcon: "✦",
    showHint: true,
  },
  pages: [], // Se llenará después
  photoLayout: {
    sizeFactors: {
      "1": 0.65,
      "2": 0.6,
      "3": 0.55,
      "4": 0.5,
    },
    maxHeightFactor: 0.95,
    jitterFactor: 0.05,
    aspectRatio: 0.82,
  },
  lastSaved: new Date().toISOString(),
  version: "1.0.0",
};

const CONFIG_STORAGE_KEY = "adventure-book-config";
const LOCAL_CONFIG_PATH = "../config/book-config.json";

class ConfigService {
  private config: BookConfig | null = null;

  // Cargar configuración local del proyecto
  async loadLocalConfig(): Promise<BookConfig> {
    try {
      const response = await fetch(LOCAL_CONFIG_PATH);
      if (!response.ok) {
        console.warn(
          "No se encontró book-config.json, usando configuración por defecto",
        );
        return DEFAULT_CONFIG;
      }
      const config = await response.json();
      this.config = config;
      return config;
    } catch (error) {
      console.warn("Error cargando configuración local:", error);
      return DEFAULT_CONFIG;
    }
  }

  // Guardar en localStorage
  saveConfigToStorage(config: BookConfig): void {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      this.config = config;
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
    }
  }

  // Cargar desde localStorage
  loadConfigFromStorage(): BookConfig | null {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        this.config = JSON.parse(saved);
        return this.config;
      }
    } catch (error) {
      console.error("Error cargando desde localStorage:", error);
    }
    return null;
  }

  // Obtener configuración actual
  getConfig(): BookConfig | null {
    return this.config;
  }

  // Actualizar configuración
  updateConfig(updates: Partial<BookConfig>): BookConfig {
    if (!this.config) {
      this.config = { ...DEFAULT_CONFIG, ...updates };
    } else {
      this.config = { ...this.config, ...updates };
    }
    return this.config;
  }
}

export const configService = new ConfigService();
