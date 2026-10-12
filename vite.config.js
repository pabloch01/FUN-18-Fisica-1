import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" hace que la página funcione desde cualquier ruta (por ejemplo, GitHub Pages en /nombre-del-repo/)
export default defineConfig({
  base: "./",
  plugins: [react()],
});
