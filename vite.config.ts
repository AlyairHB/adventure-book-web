import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar advertencias de tipos
        if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
        if (warning.message.includes("@types/")) return;
        warn(warning);
      },
    },
  },
  server: {
    port: 3001,
  },
});
