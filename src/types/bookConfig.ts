export interface BookConfig {
  bookTitle: string;
  photosPerPage: number;
  maxPages: number;
  defaultPageBackground: string;
  allowUserToAddPages: boolean;
  allowUserToDeletePages: boolean;
  allowPhotoUpload: boolean;
  coverConfig: CoverConfig;
  pages: ConfigPage[];
  photoLayout: PhotoLayout;
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

export interface ConfigPage {
  id: number;
  globe: boolean;
  notes: Note[];
}

export interface Note {
  top: string;
  left: string;
  w: string;
  rot: string;
  text: string;
}

export interface PhotoLayout {
  sizeFactors: Record<number, number>;
  maxHeightFactor: number;
  jitterFactor: number;
  aspectRatio: number;
}
