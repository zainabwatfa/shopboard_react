import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Turns "./cart.html" into a full file path that works on Windows too
const page = (file: string) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  // Compiles .tsx (JSX) and gives fast refresh in `npm run dev`
  plugins: [react()],
  // Relative paths in the build, so the site works at any address
  // (GitHub Pages serves a project site under /<repo-name>/)
  base: "./",
  build: {
    rollupOptions: {
      // Vite builds only index.html by default: list every page
      input: {
        shop: page("./index.html"),
        cart: page("./cart.html"),
      },
    },
  },
});
