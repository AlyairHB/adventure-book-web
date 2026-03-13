import { useEffect, useState } from "react";
import { fetchPhotos } from "../services/driveService";
import { collageLayout } from "../utils/collageLayout";

export function usePhotos(phase: string) {
  const [photos, setPhotos] = useState([]);
  const [state, setState] = useState("idle");

  useEffect(() => {
    if (phase !== "open" || state !== "idle") return;

    async function load() {
      try {
        setState("loading");

        const data = await fetchPhotos();
        const layout = collageLayout(data);

        setPhotos(layout);
        setState("done");
      } catch {
        setState("error");
      }
    }

    load();
  }, [phase, state]);

  return photos;
}
