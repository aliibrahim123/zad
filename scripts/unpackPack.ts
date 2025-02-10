import { readFile, writeFile } from "node:fs/promises";

const path = './internal/contentPacks/quran_0.txt';
const UTF8Decoder = new TextDecoder('utf8');

const buf = await readFile(path) as Uint8Array;
const view = new DataView(buf.buffer);
const tableSize = view.getUint32(19);
console.log(tableSize);
const tableEnd = 23 + tableSize;
const table: Record<string, [offset: number, size: number]> = 
	JSON.parse(UTF8Decoder.decode(buf.slice(23, tableEnd)));

for (const file in table) {
	const [offset, size] = table[file];
	const content = buf.slice(tableEnd + offset, tableEnd + offset + size);
	writeFile('./internal/contentPacks/test/' + file.split('/').at(-1) as string, content);
}
