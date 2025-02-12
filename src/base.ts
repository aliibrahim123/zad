import { query, registry, ZRORouter } from "./libs.ts";
import * as libs from './libs.ts';
import { alert, prompt } from "./prompt.ts";
import { getFahras } from "./sections.ts";
import './settings.ts';
import './swInterface.ts';
import { setupStyle } from "./style.ts";
import * as globalState from './globalState.ts';

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
	//force reload between viewers
	if (url.pathname.endsWith('viewer.html') && router.lastURL.pathname.endsWith('viewer.html')) 
		router.lastURL = new URL('./force-reload', location.origin);
	
	//dispatch on route event on root comp
	if (url.pathname === router.lastURL.pathname) (registry.root as any)?.onRoute?.(url);
})
update();

declare global {
	var test: any
}
globalThis.test = { 
	setupStyle,
	getFahras,
	prompt, alert,
	globalState: {...globalState},
	libs: { ...libs }
}
 
export * from './globalState.ts';
export * from './settings.ts';
export * from './utils.ts';
export * from './sections.ts';
export * from './style.ts';
export * from './prompt.ts';
export * from './favorite.ts';
export * from './swInterface.ts';