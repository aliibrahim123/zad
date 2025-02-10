import { highRes, lowRes, meduimRes } from "../src/backgrounds.js";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";

/* pack format
	- magic code: "ZAD-CONTENT-PACK v1"
	- table length: 4 byte
	- table: JSON object Record<string, [offset: number, size: number]>
	- ...items: 
		- header: "Item:"
		- path: string
		- ":"
		- content: string
*/

const max_content_per_pack = 100000;
const UTF8Encoder = new TextEncoder();

interface Pack {
	type: 'packed' | 'unpacked',
	version: string,
	files: Record<string, RegExp | 'all' | string[] | ((files: string[]) => string[])>,
}

const packs = {
	base: {
		type: 'unpacked',
		version: '0.0.0',
		files: {
			'.': /[.]html/,
			'./styles': 'all',
			'./internal/entries': 'all',
			'./internal/entries/chunks': 'all',
			'./assets/fonts': 'all',
			'./assets/icons': 'all'
		}
	},
	backLow: {
		type: 'unpacked',
		version: '0.0.0',
		files: {
			'./assets/background': lowRes
		}
	},
	backMed: {
		type: 'unpacked',
		version: '0.0.0',
		files: {
			'./assets/background': meduimRes
		}
	},
	backHigh: {
		type: 'unpacked',
		version: '0.0.0',
		files: {
			'./assets/background': highRes
		}
	},
	quran: {
		type: 'packed',
		version: '0.0.0',
		files: {
			'./internal/entries/sections': ['quran.js'],
			'./data/quran': 'all'
		}
	}
} satisfies Record<string, Pack>
export type ContentPacks = keyof typeof packs | '';

const info: Record<string, { size: number, version: string, chunks?: number }> = {};

//reset folder
await rm('./internal/contentPacks', { force: true, recursive: true });
await mkdir('./internal/contentPacks');

for (const name in packs) {
	const pack = (packs as any)[name] as Pack;

	const files: string[] = [];
	//collect files
	for (const entry in pack.files) {
		const localFiles = (await readdir(entry, { withFileTypes: true }))
		  .filter(item => item.isFile()).map(file => file.name);

		//filter
		const filter = pack.files[entry];
		let filtered: string[];
		if (filter === 'all') filtered = localFiles;
		else if (Array.isArray(filter)) filtered = filter;
		else if (typeof(filter) === 'function') filtered = filter(localFiles);
		else filtered = localFiles.filter(file => filter.test(file));

		//add
		files.push(...filtered.map(file => `${entry}/${file}`))
	}
	
	//write file
	await writeFile(`./internal/contentPacks/${name}.json`, JSON.stringify(files));
	
	if (pack.type === 'unpacked') {
		//get size
		const size = (await Promise.all(
		  files.map(async file => (await stat(file)).size)
		)).reduce((a, b) => a + b);
		//add info
		info[name] = { version: pack.version, size };
	}
	
	//packed
	else {
		//load files
		const content: [string, Uint8Array][] = await Promise.all(
			files.map(async file => [file, await readFile(file)])
		);
		
		//group into chunks
		let curChunk: [string, Uint8Array][] = [], curLength = 0;
		const chunks = [curChunk];
		for (const item of content) {
			curChunk.push(item);
			curLength += item[1].length;
			if (curLength > max_content_per_pack) {
				curLength = 0;
				curChunk = [];
				chunks.push(curChunk);
			}
		}
		
		//create pack chunk
		let size = 0, chunkInd = 0;
		for (const chunk of chunks) {
			const buffer: Uint8Array[] = [
				UTF8Encoder.encode('ZAD-CONTENT-PACK v1'),
				undefined as any, //table size
				undefined as any //table
			];
			
			const table: Record<string, [offset: number, size: number]> = {};
			
			//create item
			let curInd = 0, tempBuffer: Uint8Array;
			for (const [path, content] of chunk) {
				//header
				curInd += 5;
				buffer.push(UTF8Encoder.encode('ITEM:'));
				
				//path
				tempBuffer = UTF8Encoder.encode(path);
				curInd += tempBuffer.length;
				buffer.push(tempBuffer);
				
				//':'
				curInd += 1;
				buffer.push(UTF8Encoder.encode(':'));
				
				//content
				const offest = curInd;
				curInd += content.length;
				buffer.push(content);

				//add to table
				table[path] = [offest, curInd - offest];
			}

			//create table
			const tableBuffer = UTF8Encoder.encode(JSON.stringify(table));
			buffer[1] = u32ToBuffer(tableBuffer.length);
			buffer[2] = tableBuffer;

			//write file
			const finalBuffer = joinBuffers(buffer);
			size += finalBuffer.length;
			await writeFile(`./internal/contentPacks/${name}_${chunkInd++}.txt`, finalBuffer);
		}
		//add info
		info[name] = { version: pack.version, size, chunks: chunks.length };
	}
}
//write info file
await writeFile('./internal/contentPacks/info.json', JSON.stringify(info));

function u32ToBuffer (num: number) {
	return new Uint8Array([
	  (num >> 24) & 0xff, (num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff
	]);
}
function joinBuffers (buffers: Uint8Array[]) {
	let len = 0;
	for (const buf of buffers) len += buf.length;

	const result = new Uint8Array(len);
  
	let offset = 0;
	for (const buf of buffers) {
	  result.set(buf, offset);
	  offset += buf.length;
	}
  
	return result;
}
  