// services/driveConfigService.ts
// services/driveConfigService.ts
import { BookConfig } from "../types/bookConfig";
import { IMAGES_ENDPOINT } from "../types/constants";
const API_BASE_URL = IMAGES_ENDPOINT || "http://localhost:3000";
const CONFIG_FILE_NAME = "book-config.json";

class DriveConfigService {
  private accessToken: string | null = null;
  private currentConfigId: string | null = null;

  // Autenticación (simplificada - tu backend maneja la autenticación)
  async authenticate(): Promise<boolean> {
    // Como tu backend maneja la autenticación, siempre retornamos true
    return true;
  }

  // Guardar configuración (siempre actualiza el mismo archivo)
  async saveToDrive(config: BookConfig): Promise<boolean> {
    try {
      const formData = new FormData();
      const configBlob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });

      const configFile = new File(
        [configBlob],
        CONFIG_FILE_NAME, // Siempre el mismo nombre
        { type: "application/json" },
      );

      formData.append("config", configFile);

      const response = await fetch(`${API_BASE_URL}/images/config`, {
        method: "POST", // El backend manejará si es crear o actualizar
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Guardar el ID del archivo para referencia futura
      if (result.fileId) {
        this.currentConfigId = result.fileId;
        localStorage.setItem("drive_config_id", result.fileId);
      }

      return true;
    } catch (error) {
      console.error("Error actualizando en Drive:", error);
      return false;
    }
  }

  // Cargar la última configuración desde Drive
  async loadFromDrive(): Promise<BookConfig | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/images/config/latest`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Guardar el ID del archivo cargado
      if (data._metadata?.id) {
        this.currentConfigId = data._metadata.id;
        localStorage.setItem("drive_config_id", data._metadata.id);
      }

      return data;
    } catch (error) {
      console.error("Error cargando desde Drive:", error);
      return null;
    }
  }

  // Obtener el ID de la configuración actual
  getCurrentConfigId(): string | null {
    if (this.currentConfigId) return this.currentConfigId;

    const saved = localStorage.getItem("drive_config_id");
    if (saved) {
      this.currentConfigId = saved;
    }
    return this.currentConfigId;
  }

  // Verificar si existe configuración en Drive
  async hasConfig(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/images/config/latest`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Eliminar configuración de Drive (opcional)
  async deleteFromDrive(): Promise<boolean> {
    try {
      const configId = this.getCurrentConfigId();
      if (!configId) return false;

      const response = await fetch(
        `${API_BASE_URL}/images/config/${configId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        localStorage.removeItem("drive_config_id");
        this.currentConfigId = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error eliminando configuración:", error);
      return false;
    }
  }
}

export const driveConfigService = new DriveConfigService();
