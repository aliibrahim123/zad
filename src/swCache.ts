import type { ContentPack } from "../scripts/generatePacks.ts";
import { cacheName } from "./sw.ts";

declare var self: ServiceWorkerGlobalScope;

export type SWCacheRequest = StatusReq | PackReq;
interface StatusReq {
	type: 'cache';
	action: 'query-status';
}
interface PackReq {
	type: 'cache';
	action: 'download' | 'delete';
	pack: ContentPack;
}

export type SWCacheResponse = StatusRes | StartRes | UnpackedRes | PackedRes | DeleteRes | FinishedRes;
interface StatusRes {
	type: 'cache';
	action: 'query-status';
	status: 'idle' | 'processing';
	packs?: ContentPack[];
}
interface StartRes {
	type: 'cache';
	action: 'download';
	pack: ContentPack;
	packType: 'packed' | 'unpacked';
	status: 'started';
}
interface UnpackedRes {
	type: 'cache';
	action: 'download';
	pack: ContentPack;
	packType: 'unpacked';
	status: 'caching';
	processed: number;
	fullCount: number;
}
type PackedRes = PackedStatusRes | PackedCachingRes;
interface PackedBaseRes {
	type: 'cache';
	action: 'download';
	pack: ContentPack;
	packType: 'packed';
	chunk: number;
	chunkCount: number;
}
interface PackedStatusRes extends PackedBaseRes {
	status: 'fetched' | 'finished-chunk';
}
interface PackedCachingRes extends PackedBaseRes {
	status: 'caching';
	processed: number;
	fileCount: number;
}
interface DeleteRes {
	type: 'cache';
	action: 'delete';
	pack: ContentPack;
	status: 'deleting';
}
interface FinishedRes {
	type: 'cache';
	action: 'download' | 'delete';
	pack: ContentPack;
	status: 'finished';
	nowIdle: boolean
}

interface Action {
	type: 'download' | 'delete';
	pack: ContentPack;
}		
const queue: Action[] = [];
export async function handleCache(request: SWCacheRequest, client: Client) {
	let startWork = false;
	//case query-status
	if (request.action === 'query-status') client.postMessage({
		type: 'cache', action: 'query-status',
		status: queue.length === 0 ? 'idle' : 'processing',
		packs: queue.length === 0 ? undefined : queue.map(action => action.pack)
	} satisfies StatusRes);

	//case delete
	else if (request.action === 'delete') {
		if (queue.length === 0) startWork = true;
		queue.push({ type: 'delete', pack: request.pack });
	}

	//case download
	else {
		if (queue.length === 0) startWork = true;
		queue.push({ type: 'download', pack: request.pack });
	}
	
	//start work if not under work
	if (!startWork) return;
	const cache = await self.caches.open(cacheName);
	const info = await (await fetch('./internal/contentPacks/info.json')).json() as 
		Record<ContentPack, {chunks?: number}>;
	
	while (queue.length) {
		const action = queue[0];
		const pack = action.pack;

		//delete
		if (action.type === 'delete') {
			//start
			client.postMessage({
				type: 'cache', action: 'delete', status: 'deleting', pack,
			} satisfies DeleteRes);
			await delay(250);

			//delete
			await handleDelete(pack);

			//finished
			await delay(500);
			client.postMessage({
				type: 'cache', action: 'delete', status: 'finished', pack, nowIdle: queue.length === 1
			} satisfies FinishedRes);
		}

		//downlaod
		else {
			//start
			const isPacked = !!info[pack].chunks;
			client.postMessage({
				type: 'cache', action: 'download', status: 'started', pack,
				packType: isPacked ? 'packed' : 'unpacked'
			} satisfies StartRes);
			await delay(250);

			//cache
			if (isPacked) await cachePacked(pack);
			else await cacheUnpacked(pack);

			//finished
			await delay(500);
			client.postMessage({
				type: 'cache', action: 'download', status: 'finished', pack, nowIdle: queue.length === 1
			} satisfies FinishedRes);
		}

		//remove action
		queue.shift();
	}

	async function cacheUnpacked (pack: ContentPack) {
		//fetch file list
		const files = await (await fetch(`./internal/contentPacks/${pack}.json`)).json() as string[];
		
		let cached = 1;
		for (const file of files) {
			//fetch file
			const response = await fetch(file, { headers: { accept: pathToMine(file) } });
			//add to cache
			await cache.put(file, response);
			//tell client
			client.postMessage({
				type: 'cache', action: 'download', status: 'caching', 
				pack, packType: 'unpacked',
				processed: cached++, fullCount: files.length
			} satisfies UnpackedRes)
		}
	}
	async function cachePacked (pack: ContentPack) {
		const chunkCount = info[pack].chunks as number;

		for (let chunkInd = 0; chunkInd < chunkCount; chunkInd++) {
			//load chunk
			const chunk = await (await fetch(
			  `./internal/contentPacks/${pack}_${chunkInd}.txt`,
			)).arrayBuffer();
			
			//tell client
			client.postMessage({
				type: 'cache', action: 'download', status: 'fetched',
				pack, packType: 'packed', chunk: chunkInd +1, chunkCount
			} satisfies PackedStatusRes)

			await delay(100);

			const buf = new Uint8Array(chunk);
			const view = new DataView(chunk);
			const UTF8Decoder = new TextDecoder();

			//decode main table
			const tableSize = view.getUint32(19);
			const tableEnd = 23 + tableSize;
			const table: Record<string, [offset: number, size: number]> = 
				JSON.parse(UTF8Decoder.decode(buf.slice(23, tableEnd)));
			const fileCount = Object.keys(table).length;
			
			let fileInd = 0;
			for (const file in table) {
				fileInd++;
				//extract file
				const [offset, size] = table[file];
				const content = buf.slice(tableEnd + offset, tableEnd + offset + size);

				//cache it
				await cache.put(file, new Response(content, { status: 200, headers: {
				  'Content-Type': pathToMine(file),
				  'Content-Length': String(content.length),
				  'Date': new Date().toUTCString()
				} }));

				//relax and till client every 25 files
				if (fileInd % 25 === 0) {
				  client.postMessage({
					type: 'cache', action: 'download', status: 'caching', 
					pack, packType: 'packed', chunk: chunkInd +1, chunkCount,
					 fileCount, processed: fileInd
				  } satisfies PackedCachingRes);
				  await delay(100)
				}
			}

			//till client about finish
			client.postMessage({
			  type: 'cache', action: 'download', status: 'finished-chunk',
			  pack, packType: 'packed', chunk: chunkInd +1, chunkCount
			} satisfies PackedStatusRes);
			await delay(100);
		}
	}
	async function handleDelete (pack: ContentPack) {
		//fetch file list
		const files = await (await fetch(`./internal/contentPacks/${pack}.json`)).json() as string[];

		for (const Chunk of chunk(files, 25)) {
			await Promise.all(Chunk.map(file => cache.delete(file)));
			await delay(100);
		}
	}
}

function delay (ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
function chunk<T> (array: T[], size: number): T[][] {
	const result: T[][] = [];
	const slices = Math.ceil(array.length / size);
	for (let i = 0; i < slices; i++) result.push(array.slice(i * size, (i + 1) * size));
	return result
}

export function pathToMine (path: string) {
	return MineTable[path.split('.').at(-1) as string] || ''
}
const MineTable: Record<string, string> = {
	'html': 'text/html',
	'css': 'text/css',
	'js': 'text/javascript',
	'ts': 'text/javascript',
	'json': 'application/json',
	'txt': 'text/plain',
	'ttf': 'font/ttf',
	'jpg': 'image/jpeg',
	'png': 'image/png',
	'svg': 'image/svg+xml',
}