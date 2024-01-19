//attribute manager
//defining and handling elements attributes

//propagAttrs: doesnt stop walking on hit
//unpropagAttrs: stop walking on hit

import { checkstr, checkcomp, checkel, checkarr } from '../check.js';
import { compHandler } from './comp.js';
import { bindHandler } from './bind.js';
import { setHandler } from './set.js';
import { onHandler } from './on.js';

var attrManeger = {
	handlers: [
		compHandler,
		bindHandler,
		setHandler,
		onHandler
	],
	curEl: null, //for debugging purposes
	curAttr: null,
	add (name, handler) {
		checkstr(name, 'name', 'attrs');
		this.handlers[name] = handler
	},
	walk (comp, el) {//walking through elemets and their attributes
		checkcomp(comp, 'attrs');
		checkel(el, 'attrs');
		
		if (el.hasAttribute('is:static')) return;
		this.curEl = el;
		var walkThroughChildren = true;
		
		if (el.hasAttribute('r:on')) {
			var attrs = el.getAttributeNames();
			this.handlers.forEach(handler => {
				if (handler.handle) return walkThroughChildren = (handler.handle(comp, el, attrs) || walkThroughChildren);
				
				attrs.forEach(attr => {
					this.curAttr = attr;
				
					if (attr in handler.propagAttrs) {
						handler.propagAttrs[attr](comp, el, el.getAttribute(attr))
					}
				
					if (attr in handler.unpropagAttrs) {
						handler.unpropagAttrs[attr](comp, el, el.getAttribute(attr));
						walkThroughChildren = false
					}
				})
			})
		}
		
		if (walkThroughChildren) {
			[].forEach.call(el.children, el => el.$comp ? el.$comp.walk() : this.walk(comp, el))
		}
	}
};

export { attrManeger }