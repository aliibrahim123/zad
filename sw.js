import assets from './assets.js';
import { contentType } from './n_modules/@simplyjs/lib/dist/encode/mine.lite.js';

var cacheName = 'zad';
var cacheVersion = '1';
var cacheFull = cacheName + '.v.' + cacheVersion;

self.addEventListener('install', (e) => {
	console.log('installed')
});


self.addEventListener('activate', (e) => {
	console.log('activated');
	e.waitUntil((async () => {
		//clean up old caches
		var keys = await caches.keys();
		return Promise.all(keys.map(async (key) => {
			if (key.startsWith(cacheName) && key !== cacheFull) {
				console.log('removing old cache', key);
				return caches.delete(key);
			}
		}))
	})());
	return self.clients.claim();
});


self.addEventListener('fetch', (e) => {
	//stip from search field
	var url = new URL(e.request.url.replace(/\?.*/, ''));
	e.respondWith((async () => {
		var cache = await caches.open(cacheFull);
	
		//try cache first
		var response = await cache.match(url);
		if (response) return response;
	
		//else fetch from internet
		return await fetch(e.request);
	})())
});

onmessage = async (e) => {
	var client = e.source;
	var cache = await caches.open(cacheFull);
	
	//fetch content
	var content = await (await fetch('./content.txt')).text();
	client.postMessage(['c-fetched']);
	
	//extract it
	await new Promise((r) => setTimeout(() => {
		content = content.split('/#$:[separator]#/')
		r()
	}, 2000));
	client.postMessage(['c-extracted']);
	
	//cache it
	var added = 0, current = 0;
	var resolve;
	var interval = setInterval(async () => {
		var chunk = content.slice(current * 500, (current +1) * 500);
		await Promise.all(chunk.map(async v => {
			var [path, file] = v.split(':://::');
			if (path.includes('.html') && !path.includes('sera')) {
				await cache.add(path);
				added++;
				return
			}
			var response = new Response(file);
			response.headers.set('Content-Type', contentType(path));
			await cache.put(path, response);
			added++
		}));
		current++;
		client.postMessage(['c-process', content.length, added]);
		if (chunk.length === 0 || added > content.length) resolve();
	}, 500);
	await new Promise((r) => resolve = r);
	
	//cache assets
	client.postMessage(['c-p2'])
	await Promise.all(assets.map(async v => {
		await cache.add('./assests/' + v, await fetch('./assests/' + v))
	}));
	
	//finished
	clearInterval(interval);
	client.postMessage(['c-finished'])
}
