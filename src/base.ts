import { query, registry, ZRORouter } from "./libs.ts";
import * as libs from './libs.ts';
import './settings.ts';
import { setupStyle } from "./style.ts";

//router
declare global {
	var router: ZRORouter
}
globalThis.router = new ZRORouter({
	transitions: !!settings.style.core.animationSpeed
});

//updater
function update () {
	const main = query('main')[0];
	const root = new (registry.get(main.getAttribute('comp:name') as string))(main);
	registry.setRoot(root);
	router.attachToDom(); 
	setupStyle();
}
router.onAftrerUpdate.on(update); 
router.onRoute.on((_, url) => {
	if (url.pathname === location.pathname) (registry.root as any)?.onRoute?.(url);
})
update();

declare global {
	var test: any
}
globalThis.test = { 
	setupStyle,
	libs: { ...libs }
}
 
export * from './utils.ts'