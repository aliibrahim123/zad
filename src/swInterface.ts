import type { ContentPack } from "../scripts/generatePacks.ts";
import type { SWCacheRequest, SWCacheResponse } from "./swCache.ts";

//install service worker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(
	  './sw.js', 
	  { scope: './', type: 'module' }
	);
}

let listners: { type: string, fn: (res: SWResponse) => void }[] = [];
export function addListener (type: SWResponse['type'], fn: (res: SWResponse) => void) {
	listners.push({ type, fn });
}
export function removeListener (fn: (res: SWResponse) => void) {
	listners = listners.filter(listner => listner.fn !== fn);
}
navigator.serviceWorker.addEventListener('message', (event) => {
	const res = event.data as SWResponse;
	for (const { type, fn } of listners) {
		if (res.type === type) fn(res)
	}
});

export function sendRequest (req: SWRequest) {
	navigator.serviceWorker.controller?.postMessage(req);
}

const installedPacks: Partial<Record<string, string>> = 
	JSON.parse(localStorage.getItem('zad-installed-packs') as string) || {};

export type SWRequest = SWCacheRequest;
export type SWResponse = SWCacheResponse;
