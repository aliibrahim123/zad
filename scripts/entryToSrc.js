import { entries } from "./entries.js";
import { writeFile } from "node:fs/promises";
for (const entry of entries) writeFile(
  `./internal/entries/${entry}.js`,
  `export * from '${entry.includes('sections') ? '../' : ''}../../src/${entry}.js'`
);
