//base functionality

import { randomBackground, changeBack } from './src/style.js';
import { fontMan } from './src/font.js';
import { toHijri, fromHijri } from './src/dateConv.js';
import './src/prompt.js';
import { register } from './src/handleSW.js';
import { getSalaTiming } from './src/sala.js';

globalThis.curPath = $el('#main')[0].getAttribute('path');
register();

globalThis.setting = JSON.parse(localStorage.getItem('z-setting'));
if (!setting) setting = {
	color: 'black',
	dateAdjustment: 0,
	sala: {
		method: 0,
		tune: [0,0,0,0,0,0,0,0,0],
		midnightMode: 0,
		latitudeAdjustmentMethod: 1,
		shafaq: 'general'
	}
}

globalThis.fontMan = fontMan;
var font = JSON.parse(localStorage.getItem('z-font'));
if (font) {
	fontMan.curSize = font.size;
	fontMan.curFont = font.type
}
//delay font changing to when root is inited
$comp.on('set-root', (comp) => comp instanceof $comp.Comp && fontMan.apply());

randomBackground();

globalThis.dateConverter = { toHijri, fromHijri };
globalThis.getSalaTiming = getSalaTiming;

$comp.attachRouter();
$comp.router.on('route', (router, url) => {
	if (router.lastUrl.pathname === url.pathname) $comp?.root?.callSafe('route', url)
})
$comp.router.on('before-update', (_, page) => {
	curPath = $el('#main', page)[0].getAttribute('path');
})
$comp.router.on('after-update', () => {
	randomBackground();
	changeBack();
});

$comp.setRoot($el('#main')[0], $el('#main')[0].getAttribute('comp-name'));

setTimeout(() => $comp.router.attachToDom(), 3000)