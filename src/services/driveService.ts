const API_URL = "http://localhost:3000";

export type DrivePhoto = {
  id: string;
  name: string;
  thumbnailUrl: string;
  directUrl: string;
};

export async function fetchPhotos(): Promise<DrivePhoto[]> {
  const res = await fetch(`${API_URL}/images`);

  if (!res.ok) {
    throw new Error("Error fetching photos");
  }

  return res.json();
}

export async function uploadPhoto(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/images/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}
