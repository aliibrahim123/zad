import { highRes, lowRes, meduimRes, pages } from "../src/backgrounds.js";
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

const max_content_per_pack = 250000;
const UTF8Encoder = new TextEncoder();

interface Pack {
	type: 'packed' | 'unpacked',
	version: string,
	arabicName: string,
	files: Record<string, RegExp | 'all' | string[] | ((files: string[]) => string[])>,
}

const packs = {
	base: {
		type: 'unpacked',
		version: '1.0.2',
		arabicName: 'أساس',
		files: {
			'.': /([.]html)|(manifest[.]json)/,
			'./styles': 'all',
			'./internal/entries': 'all',
			'./assets/fonts': 'all',
			'./assets/icons': 'all',
		}
	},
	monasabat: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'مناسبات دينية',
		files: {
			'./internal/entries/sections': ['monasabat.js'],
			'./data/monasabat': 'all'
		}
	},
	backPage: {
		type: 'unpacked',
		arabicName: 'خلفيات ورقية',
		version: '1.0.1',
		files: {
			'./assets/background': pages
		}
	},
	backLow: {
		type: 'unpacked',
		arabicName: 'خلفيات جودة منخفضة',
		version: '1.0.1',
		files: {
			'./assets/background': lowRes
		}
	},
	backMed: {
		type: 'unpacked',
		version: '1.0.1',
		arabicName: 'خلفيات جودة متوسطة',
		files: {
			'./assets/background': meduimRes
		}
	},
	backHigh: {
		type: 'unpacked',
		version: '1.0.1',
		arabicName: 'خلفيات جودة عالية',
		files: {
			'./assets/background': highRes
		}
	},
	quran: {
		type: 'packed',
		version: '1.0.2',
		arabicName: 'قرآن',
		files: {
			'./internal/entries/sections': ['quran.js'],
			'./data/quran': 'all'
		}
	},
	tafseer: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'تفسير',
		files: {
			'./internal/entries/sections': ['mobeen.js'],
			'./data/mobeen': 'all'
		}
	},
	quranTopics: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'موضوعات القران الكريم',
		files: {
			'./internal/entries/sections': ['quranTopics.js'],
			'./data/quranTopics': 'all'
		}
	},
	quranInfo: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'مقتطفات قرآنية',
		files: {
			'./internal/entries/sections': ['quranInfo.js'],
			'./data/quranInfo': 'all'
		}
	},
	amal: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'قسم الأعمال',
		files: {
			'./internal/entries/sections': ['saaat.js', 'osboa.js', 'months.js'],
			'./data/months': 'all',
			'./data/osboa': 'all',
			'./data/saaat': 'all',
		}
	},
	doaa: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'قسم الدعاء',
		files: {
			'./internal/entries/sections': ['doaa.js', 'sala.js'],
			'./data/doaa': 'all',
			'./data/sala': 'all'
		}
	},
	ziara: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'قسم الزيارات',
		files: {
			'./internal/entries/sections': ['ziara.js'],
			'./data/ziara': 'all'
		}
	},
	sera: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'سيرة أهل البيت',
		files: {
			'./internal/entries/sections': ['sera.js'],
			'./data/sera': 'all'
		}
	},
	aqwal: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'حكم وديوان',
		files: {
			'./internal/entries/sections': ['aliWord.js', 'shorts.js', 'dewan.js'],
			'./data/aliWord': 'all',
			'./data/shorts': 'all',
			'./data/dewan': 'all'
		}
	},
	ibooks: {
		type: 'packed',
		version: '1.0.1',
		arabicName: 'كتب اهل البيت',
		files: {
			'./internal/entries/sections': ['ibooks.js', 'nahij.js'],
			'./data/ibooks': 'all',
			'./data/nahij': 'all',
		}
	}
} satisfies Record<string, Pack>
export type ContentPack = keyof typeof packs | '';

const info: Record<string, { size: number, version: string, arabicName: string, chunks?: number }> = {};

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
		info[name] = { version: pack.version, size, arabicName: pack.arabicName };
	}
	
	//packed
	else {
		console.log(`packing ${name}`);
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
		info[name] = { version: pack.version, size, arabicName: pack.arabicName, chunks: chunks.length };
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
