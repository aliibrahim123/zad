//base functionality

import { randomBackground } from './src/rand-bck.js';
import { fontMan } from './src/font.js';

globalThis.curPath = $el('#main')[0].getAttribute('path');

globalThis.fontMan = fontMan;
var font = JSON.parse(localStorage.getItem('z-font'));
if (font) {
	fontMan.curSize = font.size;
	fontMan.curFont = font.type
}
fontMan.apply();

randomBackground();

$comp.attachRouter();
$comp.router.on('before-update', (_, page) => {
	curPath = $el('#main', page)[0].getAttribute('path');
})
$comp.router.on('after-update', () => {
	randomBackground()
});

$comp.setRoot($el('#main')[0], $el('#main')[0].getAttribute('comp-name'));

setTimeout(() => $comp.router.attachToDom(), 3000)