import { query, registry, ZRORouter } from "./libs.ts";
import * as libs from './libs.ts';
import { getFahras } from "./sections.ts";
import './settings.ts';
import { setupStyle } from "./style.ts";

//router
declare global {
	var router: ZRORouter
}
globalThis.router = new ZRORouter({
	transitions: !!settings.style.core.animationSpeed,
	scrollToHash: false
});

//updater
function update () {
	const main = query('main')[0];
	if (registry.root) registry.removeRoot();
	const root = new (registry.get(main.getAttribute('comp:name') as string))(main);
	registry.setRoot(root);
	router.attachToDom(); 
	setupStyle();
}
router.onAftrerUpdate.on(update); 
router.onRoute.on((_, url) => {
	if (url.pathname === router.lastURL.pathname) (registry.root as any)?.onRoute?.(url);
})
update();

declare global {
	var test: any
}
globalThis.test = { 
	setupStyle,
	getFahras,
	libs: { ...libs }
}
 
export * from './utils.ts';
export * from './sections.ts';