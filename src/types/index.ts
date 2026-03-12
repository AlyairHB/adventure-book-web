export interface Photo {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  caption: string;
  src: string | null;
  driveId?: string;
  driveUrl?: string;
  uploading?: boolean;
}

export interface DriveFile {
  id: string;
  name: string;
  thumbnailUrl: string;
  webViewLink: string;
}
