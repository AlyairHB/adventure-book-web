import React, { useState } from "react";
import { ImageItem } from "../services/imageService";

interface ImageGalleryModalProps {
  availableImages: ImageItem[];
  onUpload: (files: FileList) => Promise<void>;
  onSelectImage: (image: ImageItem) => void;
  onClose: () => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  availableImages,
  onUpload,
  onSelectImage,
  onClose,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFiles);
      setSelectedFiles(null);
      // Mostrar mensaje de éxito
      alert(`${selectedFiles.length} imagen(es) subida(s) correctamente`);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Error al subir las imágenes");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
  };

  const handleConfirmSelect = () => {
    if (selectedImage) {
      onSelectImage(selectedImage);
    }
  };

  // Filtrar imágenes por búsqueda de forma segura
  const filteredImages = availableImages.filter((img) => {
    // Si no hay término de búsqueda, mostrar todas
    if (!searchTerm) return true;

    // Asegurar que img.name existe antes de llamar a toLowerCase
    const imageName = img.name || "";
    return imageName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Función segura para obtener nombre de imagen
  const getImageName = (image: ImageItem): string => {
    return image.name || "Sin nombre";
  };

  // Función segura para obtener URL de imagen
  const getImageUrl = (image: ImageItem): string => {
    return (
      image.thumbnailUrl ||
      image.directUrl ||
      "https://via.placeholder.com/150?text=Sin+imagen"
    );
  };

  return (
    <div className="ab-modal-overlay" onClick={onClose}>
      <div
        className="ab-modal-content ab-gallery-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ab-modal-header">
          <h3>
            <span className="ab-gallery-icon">🖼️</span>
            Galería de Imágenes
          </h3>
          <button onClick={onClose}>×</button>
        </div>

        <div className="ab-modal-body">
          {/* Sección de subida */}
          <div className="ab-upload-section">
            <h4>Subir nuevas imágenes</h4>
            <div className="ab-upload-controls">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="ab-file-input"
              />
              {selectedFiles && selectedFiles.length > 0 && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="ab-upload-btn"
                >
                  {isUploading ? (
                    <>
                      <span className="ab-spin-small">⟳</span>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      📤 Subir {selectedFiles.length}{" "}
                      {selectedFiles.length === 1 ? "imagen" : "imágenes"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Buscador */}
          <div className="ab-search-section">
            <input
              type="text"
              placeholder="🔍 Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ab-search-input"
            />
          </div>

          {/* Grid de imágenes */}
          <div className="ab-gallery-section">
            <h4>
              Imágenes disponibles
              <span className="ab-image-count">({availableImages.length})</span>
            </h4>

            {availableImages.length > 0 ? (
              <>
                {filteredImages.length > 0 ? (
                  <div className="ab-image-grid">
                    {filteredImages.map((image) => (
                      <div
                        key={image.id || Math.random()}
                        className={`ab-image-item ${selectedImage?.id === image.id ? "selected" : ""}`}
                        onClick={() => handleImageClick(image)}
                      >
                        <div className="ab-image-preview">
                          <img
                            src={getImageUrl(image)}
                            alt={getImageName(image)}
                            loading="lazy"
                            onError={(e) => {
                              // Si la imagen falla, mostrar un placeholder
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150?text=Error";
                            }}
                          />
                        </div>
                        <div className="ab-image-details">
                          <span
                            className="ab-image-name"
                            title={getImageName(image)}
                          >
                            {getImageName(image).length > 20
                              ? getImageName(image).substring(0, 20) + "..."
                              : getImageName(image)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ab-empty-gallery">
                    <p>
                      No se encontraron imágenes que coincidan con "{searchTerm}
                      "
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="ab-empty-gallery">
                <p>No hay imágenes disponibles</p>
                <p className="ab-hint">
                  Sube imágenes usando el botón de arriba
                </p>
              </div>
            )}
          </div>

          {/* Vista previa de la imagen seleccionada */}
          {selectedImage && (
            <div className="ab-selected-preview">
              <h4>Imagen seleccionada:</h4>
              <div className="ab-preview-content">
                <img
                  src={getImageUrl(selectedImage)}
                  alt={getImageName(selectedImage)}
                  className="ab-preview-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/150?text=Error";
                  }}
                />
                <div className="ab-preview-info">
                  <p>
                    <strong>Nombre:</strong> {getImageName(selectedImage)}
                  </p>
                  {selectedImage.size && (
                    <p>
                      <strong>Tamaño:</strong> {selectedImage.size}
                    </p>
                  )}
                  {selectedImage.mimeType && (
                    <p>
                      <strong>Tipo:</strong> {selectedImage.mimeType}
                    </p>
                  )}
                  <button
                    onClick={handleConfirmSelect}
                    className="ab-confirm-btn"
                  >
                    ✓ Agregar esta foto al libro
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ab-modal-footer">
          <button onClick={onClose} className="ab-close-btn">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
