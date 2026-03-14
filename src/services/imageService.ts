// services/imageService.ts
// services/imageService.ts
import { IMAGES_ENDPOINT } from "../types/constants";
const API_BASE_URL = IMAGES_ENDPOINT || "http://localhost:3000";

export interface ImageItem {
  id: string;
  name: string;
  mimeType: string;
  directUrl: string;
  thumbnailUrl: string;
  size?: string;
  createdTime?: string;
}

class ImageService {
  async fetchImages(): Promise<ImageItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/images`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Verificar que data es un array
      if (!Array.isArray(data)) {
        console.warn("La respuesta no es un array:", data);
        return [];
      }

      // Asegurar que cada imagen tenga los campos necesarios
      return data.map((item: any) => ({
        id: item?.id || `img-${Date.now()}-${Math.random()}`,
        name: item?.name || "Sin nombre",
        mimeType: item?.mimeType || "image/jpeg",
        directUrl: item?.directUrl || item?.webViewLink || "",
        thumbnailUrl: item?.thumbnailUrl || item?.iconLink || "",
        size: item?.size || "Desconocido",
        createdTime: item?.createdTime || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
      return []; // Retornar array vacío en caso de error
    }
  }

  async uploadImage(file: File): Promise<ImageItem> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      return {
        id: data?.id || `upload-${Date.now()}`,
        name: data?.name || file.name,
        mimeType: data?.mimeType || file.type,
        directUrl: data?.directUrl || "",
        thumbnailUrl: data?.thumbnailUrl || "",
        size: data?.size || this.formatFileSize(file.size),
        createdTime: data?.createdTime || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async uploadMultipleImages(files: File[]): Promise<ImageItem[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  // Utilidad para formatear tamaño de archivo
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

export const imageService = new ImageService();
