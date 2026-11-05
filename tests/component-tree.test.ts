// Keeps the component tree in README.md in step with the code, file for file:
// every component file in src/ must appear in the tree, and every component
// named in the tree must have a file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const start = readme.indexOf("## Component tree");
const end = readme.indexOf("### Who owns each piece of state");
const section = readme.slice(start, end);
// Only the two code blocks that draw the trees, not the prose around them
const trees = [...section.matchAll(/```\n([\s\S]*?)```/g)]
  .map((match) => match[1])
  .join("\n");

// Component names from file names: App.tsx, components/*.tsx, pages/*.tsx
const src = new URL("../src/", import.meta.url);
const fromFolder = (folder: string): string[] =>
  readdirSync(new URL(folder, src))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""));
const componentFiles = [
  "App",
  ...fromFolder("components/"),
  ...fromFolder("pages/"),
];

// Names drawn as tree nodes: the first word after the tree lines
const treeNames = new Set(
  [...trees.matchAll(/^[\s│├└─]*([A-Z][A-Za-z]+)(?:\.Provider)?\s/gm)].map(
    (match) => match[1],
  ),
);

test("the README has a component tree section", () => {
  assert.ok(start >= 0 && end > start);
});

test("every component file appears in the README tree", () => {
  const missing = componentFiles.filter((name) => !treeNames.has(name));
  assert.deepEqual(missing, []);
});

test("every component in the README tree has a file (the context aside)", () => {
  const extra = [...treeNames].filter(
    (name) => name !== "CartContext" && !componentFiles.includes(name),
  );
  assert.deepEqual(extra, []);
});

test("App is at the top of both trees", () => {
  const firstNodes = [...section.matchAll(/```\n(\w+)/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(firstNodes, ["App", "App"]);
});
