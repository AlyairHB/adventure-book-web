export interface Letter {
  char: string;
  color: string;
}

export interface TitleLine {
  letters: Letter[];
}

export interface Note {
  top: string;
  left: string;
  w: string;
  rot: string;
  text: string;
}

export interface Page {
  id: number;
  globe: boolean;
  notes: Note[];
}

export interface Photo {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  caption: string;
  src: string | null;
}

export interface ResizeHandleProps {
  dir: string;
  onMouseDown: (e: React.MouseEvent, dir: string) => void;
}

export interface PhotoFrameProps {
  photo: Photo;
  selected: boolean;
  pageRef: React.RefObject<HTMLDivElement>;
  onSelect: (id: number | null) => void;
  onUpdate: (id: number, changes: Partial<Photo>) => void;
  onDelete: (id: number) => void;
  show: boolean;
}

export interface PageNavProps {
  currentPage: number;
  totalPages: number;
  flipping: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAddPage: () => void;
  onDeletePage: () => void;
}

export interface TornNoteProps {
  note: Note;
  show: boolean;
  index: number;
}

export interface GlobeStampProps {
  show: boolean;
}

export interface BookCoverProps {
  hidden: boolean;
  onClick: () => void;
}

export interface PageContentProps {
  page: Page;
  photos: Photo[];
  show: boolean;
}

export interface ScrapPageProps {
  page: Page;
  photos: Photo[];
  onAdd: () => void;
  onUpdate: (id: number, changes: Partial<Photo>) => void;
  onDelete: (id: number) => void;
  show: boolean;
}

export interface PageFlipProps {
  flipping: boolean;
  fromPage: Page;
  fromPhotos: Photo[];
  toPage: Page;
  toPhotos: Photo[];
}
