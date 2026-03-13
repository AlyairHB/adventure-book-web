// services/imageService.ts
const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

export interface ImageItem {
  id: string;
  name: string;
  mimeType: string;
  directUrl: string;
  thumbnailUrl: string;
}

class ImageService {
  // Obtener todas las imágenes
  async fetchImages(): Promise<ImageItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/images`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  }

  // Subir una nueva imagen
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

      return await response.json();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // Subir múltiples imágenes
  async uploadMultipleImages(files: File[]): Promise<ImageItem[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}

export const imageService = new ImageService();
