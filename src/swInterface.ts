import type { SWCacheRequest, SWCacheResponse } from "./swCache.ts";

//install service worker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(
	  './sw.js', 
	  { scope: './', type: 'module' }
	);
}

navigator.serviceWorker.addEventListener('message', (event) => console.log(event.data))

export type SWRequest = SWCacheRequest;
export type SWResponse = SWCacheResponse;
