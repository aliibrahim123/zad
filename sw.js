import { contentType } from './n_modules/@simplyjs/lib/dist/encode/mine.lite.js';
import { chunk } from './n_modules/@simplyjs/lib/dist/com/arr.js';
import { mapSeries } from './n_modules/@simplyjs/lib/dist/com/promise.js';
import assets from './assets.js';

var delay = (ms) => new Promise(r => setTimeout(r, ms));

var cacheName = 'zad';
var whenFinished = [];
globalThis.cacheVersion = '1.0.3.0';
globalThis.cacheFull = cacheName + '.v.' + cacheVersion;

self.addEventListener('install', (e) => {
	console.log('installed')
});


self.addEventListener('activate', (e) => {
	console.log('activated');
	e.waitUntil((async () => {
		//clean up old caches
		var keys = await caches.keys();
		await Promise.all(keys.map((key) => {
			if (key.startsWith(cacheName) && key !== globalThis.cacheFull) {
				console.log('removing old cache', key);
				return caches.delete(key);
			}
		}))
	})());
	return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
	e.respondWith((async () => {
		var bareUrl = new URL(e.request.url.match(/^[^#?]+/));
		
		var cache = await caches.open(globalThis.cacheFull);
	
		//try cache first
		var response = await cache.match(bareUrl);
		if (response) return response;
		
		//else fetch from internet
		if (navigator.onLine) return fetch(e.request);
		
		//else return not found
		return new Response('', { status: 404 })
	})())
});

onmessage = async (e) => {
	var client = e.source;
	var sub = e.data[0];
	var cache = await caches.open(globalThis.cacheFull);
	
	if (sub === 'assets') return cacheAssets(e, client, cache);
	
	//fetch content
	var content = await (await fetch('./cpacks/' + sub + '.txt')).text();
	client.postMessage(['c-fetched', sub]);
	
	//extract it
	await delay(2000);
	content = content.split('#[{[SEP]}]#').map(v => v.split(':://::'));
	client.postMessage(['c-extracted', sub]);
	
	//cache it
	var chunks = chunk(content, 250);
	await mapSeries(chunks, async (chunk, resolve, reject, i) => {
		//retry until done
		loop: while (true) {
			try { await cacheChunk(chunk, cache); break loop }
			catch (error) {}
		}
		client.postMessage(['c-process', sub, content.length, Math.min((i+1) * 250, content.length)]);
		await delay(500);
		resolve();
	})
	
	//finished
	client.postMessage(['c-finished', sub])
}

var cacheChunk = (chunk, cache) => Promise.all(chunk.map(async (data) => {
	var [path, content] = data;
	var response = new Response(content, { status: '200', headers: {
		'Content-Type': contentType(path),
		'Content-Length': content.length,
		'Date': new Date().toGMTString()
	} });
	await cache.put(path, response)
}))

var cacheAssets = async (e, client, cache) => {
	var finished = 0;
	await Promise.all(assets.map(async file => {
		await cache.add(file);
		client.postMessage(['c-process', 'assets', assets.length, ++finished])
	}));
	client.postMessage(['c-finished', 'assets'])
}