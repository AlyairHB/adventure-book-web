const API = "http://localhost:3000";

export async function fetchPhotos() {
  const res = await fetch(`${API}/images`);

  if (!res.ok) {
    throw new Error("Failed to fetch photos");
  }

  return res.json();
}
