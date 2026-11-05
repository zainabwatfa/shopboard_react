import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// getElementById can return null: check it instead of using `!`
const root = document.getElementById("root");
if (!(root instanceof HTMLElement)) {
  throw new Error("#root is missing from index.html");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
