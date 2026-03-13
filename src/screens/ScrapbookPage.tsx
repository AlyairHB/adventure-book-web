import PhotoFrame from "./PhotoFrame";

export default function ScrapbookPage({ photos }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {photos.map((p) => (
        <PhotoFrame key={p.id} photo={p} />
      ))}
    </div>
  );
}
