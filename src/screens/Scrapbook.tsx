import ScrapbookPage from "./ScrapbookPage";
import { usePhotos } from "../hooks/usePhotos";

export default function Scrapbook({ phase }) {
  const photos = usePhotos(phase);

  return (
    <div
      style={{
        width: "90vw",
        height: "80vh",
        background: "#f6f1e6",
        position: "relative",
      }}
    >
      <ScrapbookPage photos={photos} />
    </div>
  );
}
