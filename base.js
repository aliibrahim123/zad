//base functionality

import { randomBackground } from './src/rand-bck.js';
import { fontMan } from './src/font.js';
import { toHijri, fromHijri } from './src/dateConv.js';
import './src/downloader.js'

globalThis.curPath = $el('#main')[0].getAttribute('path');
globalThis.lastFahrasPath = [''];
navigator.serviceWorker.register(curPath + 'sw.js', {type:'module'});

//handle cache
if (localStorage.getItem('downloadale') && localStorage.getItem('z-last-v') !== '1')
	downloadAll()
localStorage.setItem('z-last-v', '1');
localStorage.setItem('notFirstTime', 'true');

globalThis.fontMan = fontMan;
var font = JSON.parse(localStorage.getItem('z-font'));
if (font) {
	fontMan.curSize = font.size;
	fontMan.curFont = font.type
}
setTimeout(() => fontMan.apply(), 5000);

randomBackground();

globalThis.dateConverter = { toHijri, fromHijri };

$comp.attachRouter();
$comp.router.on('before-update', (_, page) => {
	curPath = $el('#main', page)[0].getAttribute('path');
})
$comp.router.on('after-update', () => {
	randomBackground()
});

$comp.setRoot($el('#main')[0], $el('#main')[0].getAttribute('comp-name'));

setTimeout(() => $comp.router.attachToDom(), 3000)