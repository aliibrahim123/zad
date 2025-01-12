import { ZRORouter } from "./libs.ts";
import './settings.ts';
import { setupStyle } from "./style.ts";

//router
declare global {
	var router: ZRORouter
}
globalThis.router = new ZRORouter({
	transitions: !!settings.style.core.transition
});

//updater
function update () {
	router.attachToDom();
	setupStyle();
}
router.onAftrerUpdate.on(update);
update();

declare global {
	var test: any
}
globalThis.test = { setupStyle }