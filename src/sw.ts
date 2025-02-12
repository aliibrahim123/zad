import { handleCache, pathToMine } from "./swCache.ts";
import type { SWRequest } from "./swInterface.ts";

declare var self: ServiceWorkerGlobalScope;

export const cacheName = 'zad-cache-v1';
const cacheNameSpace = 'zad-cache';

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
	//clean old caches
	for (const name of await self.caches.keys()) 
	  if (name.startsWith(cacheNameSpace) && name !== cacheName) 
		self.caches.delete(name);
	//create cache
	await self.caches.open(cacheName);
	//claim clients
	await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
	const request = event.request;
	//if not same origin or not get, dont touch
	if (new URL(request.url).origin !== self.location.origin || request.method !== 'GET') return;

	event.respondWith((async () => { 
		//try cache
		const cache = await self.caches.open(cacheName);
		const cachedResponse = await cache.match(request);
		if (cachedResponse) return cachedResponse;
		//else fetch
		if (self.navigator.onLine) return fetch(request, { headers: { accept: pathToMine(request.url) } });
		//else error
		return new Response('no internet', { status: 404 })
	})())
});

self.addEventListener('message', (event) => {
	const request = event.data as SWRequest;
	if (request.type === 'cache') handleCache(event.data, event.source as Client);
});

