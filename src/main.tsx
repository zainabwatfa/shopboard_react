// Starts React with App inside StrictMode.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import { getCurrentPage } from "./lib/page.ts";

const root = document.getElementById("root");
if (!(root instanceof HTMLElement)) {
  throw new Error(
    'The page has no <div id="root"></div> for React to draw in.',
  );
}

const page = getCurrentPage();

createRoot(root).render(
  <StrictMode>
    <App page={page ?? undefined} />
  </StrictMode>,
);
