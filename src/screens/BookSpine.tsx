// BookSpine — red leather spine with gold lines and texture grain.
// Used both in the closed book and as the left bar of the open book.

export default function BookSpine({ open = false }) {
  return (
    <div className={open ? "ab-open-spine" : "ab-spine"}>
      <div className="ab-spine-grain" />
    </div>
  );
}
