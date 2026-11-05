import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Compiles .tsx (JSX) and gives fast refresh in `npm run dev`
  plugins: [react()],
  // Relative paths in the build, so the site works at any address
  // (GitHub Pages serves a project site under /<repo-name>/)
  base: "./",
});
