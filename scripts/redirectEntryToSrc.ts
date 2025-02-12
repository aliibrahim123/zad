//turn internal/entries into reexports to src/...

import { entries } from "./entries.ts";
import { writeFile } from "node:fs/promises";

for (const entry of entries) writeFile(`./internal/entries/${entry}.js`, 
	`export * from '../../src/${entry}.${'ts'}'`
)
writeFile('./sw.js', `export * from './src/sw${'.ts'}'`);