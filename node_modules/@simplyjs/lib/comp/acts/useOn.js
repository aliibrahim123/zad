//on:... actions handlers

import { handleListen } from '../template/listnerHndl.js';

var useOnActs = {
	'on:call' (comp, act) {
		var { el, fun, args } = act;
		el = el[0];
		handleListen(comp, el, 
			(e) => comp.call(fun, el, ...args), 
		act.events, act.modifs)
	},
	'on:set' (comp, act) {
		var { prop, value } = act;
		handleListen(comp, act.el[0], 
			(e) => comp.set(prop, value), 
		act.events, act.modifs)
	},
	'on:set-fun' (comp, act) {
		var { prop, fun, value, args } = act;
		handleListen(comp, act.el[0], 
			(e) => comp.model.setFn(prop, fun, true, ...args), 
		act.events, act.modifs)
	},
	'on:set-attr' (comp, act) {
		var { prop, attr, el } = act;
		el = el[0];
		handleListen(comp, el, 
			(e) => comp.set(prop, comp.view.attr(el, attr)),
		act.events, act.modifs)
	},
	'on:set-attr-fun' (comp, act) {
		var { prop, attr, el, fun, args } = act;
		el = el[0];
		handleListen(comp, el, 
			(e) => comp.model.setFn(prop, fun, false, comp.view.attr(el, attr), ...args), 
		act.events, act.modifs)
	}
};

export { useOnActs }