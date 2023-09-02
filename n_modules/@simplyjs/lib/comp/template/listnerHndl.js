//event listner handler

import { checkcomp, checkfn, checkel, checkarr } from '../check.js';

var handleListen = (comp, el, fun, events = [], modifiers = [], ...args) => {
	//check
	checkcomp(comp, 'listen');
	checkel(el, 'listen');
	checkfn(fun, 'fn', 'listen');
	checkarr(events, 'events', 'listen');
	if (events.length === 0) comp.warn('listen: no specified events');
	checkarr(modifiers, 'modifiers', 'listen');
	
	//extract modifiers
	var preventD = modifiers.includes('preventdefaults'),
		once = modifiers.includes('once'),
		capture = modifiers.includes('capture'),
		passive = modifiers.includes('passive'),
		stopProp = modifiers.includes('stoppropagation'),
		self = modifiers.includes('self'),
		trusted = modifiers.includes('trusted');
	
	//handle function
	var fn = (e) => {
		if (trusted && !e.isTrusted) return;
		if (self && e.target !== el) return;
		if (preventD) e.preventDefault();
		if (stopProp) e.stopPropagation();
		fun(comp, el, e, ...args)
	}
	
	//add events
	events.forEach(e=>el.addEventListener(e, fn, {once, capture, passive}));
	return fn
}

export { handleListen }