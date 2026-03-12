import { useState, useCallback } from "react";
import { driveService } from "../services/driveService";
import { Photo, DriveFile } from "../types";

// ID de tu carpeta en Google Drive
const DRIVE_FOLDER_ID = "ID_DE_TU_CARPETA_AQUI";

export const useDrive = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = useCallback(
    async (file: File): Promise<DriveFile | null> => {
      setUploading(true);
      setError(null);

      try {
        const result = await driveService.uploadImage(file, DRIVE_FOLDER_ID);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        return null;
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const loadPhotos = useCallback(async (): Promise<Photo[]> => {
    try {
      const files = await driveService.listImages(DRIVE_FOLDER_ID);

      // Convertir archivos de Drive al formato Photo
      return files.map((file, index) => ({
        id: Date.now() + index, // ID temporal para React
        x: 100 + Math.random() * 100,
        y: 60 + Math.random() * 80,
        w: 200,
        h: 240,
        rot: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        caption: file.name.split("_")[1] || "Foto de aventura",
        src: file.thumbnailUrl,
        driveId: file.id,
        driveUrl: file.thumbnailUrl,
      }));
    } catch (err) {
      console.error("Error cargando fotos:", err);
      return [];
    }
  }, []);

  const deletePhoto = useCallback(async (driveId?: string) => {
    if (!driveId) return;

    try {
      await driveService.deleteImage(driveId);
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  }, []);

  return {
    uploadPhoto,
    loadPhotos,
    deletePhoto,
    uploading,
    error,
  };
};
