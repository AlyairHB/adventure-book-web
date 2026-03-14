export interface BookConfig {
  bookTitle: string;
  photosPerPage: number;
  maxPages: number;
  defaultPageBackground: string;
  allowUserToAddPages: boolean;
  allowUserToDeletePages: boolean;
  allowPhotoUpload: boolean;
  coverConfig: CoverConfig;
  pages: SavedPage[];
  photoLayout: PhotoLayout;
  lastSaved: string;
  version: string;
}

export interface CoverConfig {
  titleLines: TitleLine[];
  medalIcon: string;
  showHint: boolean;
}

export interface TitleLine {
  letters: Letter[];
}

export interface Letter {
  char: string;
  color: string;
}

export interface SavedPage {
  id: number;
  globe: boolean;
  notes: Note[];
  photos: SavedPhoto[];
}

export interface Note {
  top: string;
  left: string;
  w: string;
  rot: string;
  text: string;
}

export interface SavedPhoto {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  caption: string;
  src: string | null;
  driveId?: string;
  fileName?: string;
}

export interface PhotoLayout {
  sizeFactors: Record<number, number>;
  maxHeightFactor: number;
  jitterFactor: number;
  aspectRatio: number;
}
