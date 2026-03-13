import React, { useEffect, useState } from "react";

export const ApiDebug: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );

  useEffect(() => {
    // Detectar URL
    const baseUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : window.location.origin;

    setApiUrl(baseUrl);

    // Verificar si el backend responde
    fetch(`${baseUrl}/images`)
      .then((res) => setStatus(res.ok ? "online" : "offline"))
      .catch(() => setStatus("offline"));
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "#333",
        color: "white",
        padding: 10,
        borderRadius: 5,
        fontSize: 12,
        zIndex: 9999,
        fontFamily: "monospace",
      }}
    >
      <div>🌐 API: {apiUrl}</div>
      <div>
        📡 Status:
        <span style={{ color: status === "online" ? "#0f0" : "#f00" }}>
          {status === "online"
            ? " ✅ Online"
            : status === "offline"
              ? " ❌ Offline"
              : " ⏳ Checking..."}
        </span>
      </div>
      <div>🖥️ Host: {window.location.hostname}</div>
    </div>
  );
};
