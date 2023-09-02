//attribute manager
//defining and handling elements attributes

//propagAttrs: doesnt stop walking on hit
//unpropagAttrs: stop walking on hit

import { checkstr, checkcomp, checkel, checkarr } from '../check.js';
import { useCompHandler } from './useComp.js';
import { useBindHandler } from './useBind.js';
import { useSetHandler } from './useSet.js';
import { useOnHandler } from './useOn.js';

var attrManeger = {
	handlers: {
		'use:comp': useCompHandler,
		'use:bind': useBindHandler,
		'use:set': useSetHandler,
		'use:on': useOnHandler,
	},
	curEl: null, //for debugging purposes
	curAttr: null,
	add (name, handler) {
		checkstr(name, 'name', 'attrs');
		this.handlers[name] = handler
	},
	walk (comp, el, forceNS = []) {//walking through elemets and their attributes
		checkcomp(comp, 'attrs');
		checkel(el, 'attrs');
		checkarr(forceNS, 'forceNS', 'attrs');
		
		if (el.hasAttribute('is:static')) return;
		this.curEl = el;
		var attrs = el.getAttributeNames();
		var dowalkChilds = true; //walk through children
		forceNS.concat(attrs.filter(a=>a.startsWith('use') && !forceNS.includes(a))).forEach(attr => {
			let handler = this.handlers[attr];
			if (handler.handle) return dowalkChilds = (handler.handle(comp, el, attrs) || dowalkChilds);
			
			attrs.forEach(attr => {
				this.curAttr = attr;
				
				if (attr in handler.propagAttrs) {
					handler.propagAttrs[attr](comp, el, el.getAttribute(attr))
				}
				
				if (attr in handler.unpropagAttrs) {
					handler.unpropagAttrs[attr](comp, el, el.getAttribute(attr));
					dowalkChilds = false
				}
			})
		});
		
		if (dowalkChilds) {
			[...el.children].forEach(el => el.$comp ? el.$comp.walk() : this.walk(comp, el))
		}
	},
	clean (el) { //clean the dom from use:... attributes
		checkel(el, 'attrs');
		el.getAttributeNames().forEach(attr=>{
			if (attr.startsWith('use')) el.removeAttribute(attr)
		});
		[...el.children].forEach(el=>this.clean(el))
	}
};

export { attrManeger }