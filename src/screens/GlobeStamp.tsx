// GlobeStamp — vintage hand-drawn globe stamp that appears on select pages.
// Props: show → bool (triggers fade-in + scale animation via CSS class)

export default function GlobeStamp({ show }) {
  return (
    <div className={`ab-globe${show ? " show" : ""}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="#b8a080"
          stroke="#7a6040"
          strokeWidth="3"
        />
        {/* Globe surface */}
        <circle cx="50" cy="50" r="40" fill="#9e8a64" />

        {/* Simplified continent shapes */}
        <ellipse
          cx="38"
          cy="40"
          rx="14"
          ry="18"
          fill="#6e5a38"
          opacity="0.85"
        />
        <ellipse
          cx="62"
          cy="52"
          rx="10"
          ry="14"
          fill="#6e5a38"
          opacity="0.85"
        />
        <ellipse cx="50" cy="28" rx="8" ry="6" fill="#6e5a38" opacity="0.70" />
        <ellipse cx="30" cy="62" rx="6" ry="5" fill="#6e5a38" opacity="0.65" />

        {/* Latitude lines */}
        {[25, 40, 55, 70].map((y) => (
          <line
            key={y}
            x1="10"
            y1={y}
            x2="90"
            y2={y}
            stroke="#7a6040"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}

        {/* Longitude lines */}
        {[30, 50, 70].map((x) => (
          <line
            key={x}
            x1={x}
            y1="10"
            x2={x}
            y2="90"
            stroke="#7a6040"
            strokeWidth="0.6"
            opacity="0.5"
          />
        ))}

        {/* Dashed outer decorative ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#7a6040"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      </svg>
    </div>
  );
}
