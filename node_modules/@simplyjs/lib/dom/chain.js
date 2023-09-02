//chained dom operation

import $el from './base.js';
import { checkstr, checkfn, checkint, checkel } from './check.js';

export class ChainedDom {
	constructor (a, b, c) {
		this.elements = $el(a, b, c);
	}
	
	static extend (obj) {
		Object.assign(ChainedDom.prototype, obj)
	}
	
	add (sel) {
		this.elements.push(...$el(sel));
		return this
	}
	
	without (sel) {
		checkstr(sel, 'selector');
		this.elements = this.elements.filter(
			el => !el.matches(sel)
		);
		return this
	}
	
	each (fn) {
		checkfn(fn, 'fn');
		this.elements.forEach((el, i) => fn(new ChainedDom(el), i, this));
		return this
	}
	eachEl (fn) {
		checkfn(fn, 'fn');
		this.elements.forEach(fn);
		return this
	}
	
	map (fn) {
		checkfn(fn, 'mapper');
		return new ChainedDom(this.elements.map(fn))
	}
	filter (fn) {
		checkfn(fn, 'predicate');
		return new ChainedDom(this.elements.filter(fn))
	}
	
	get cloned () {
		return new ChainedDom(this.elements.concat())
	}
	get cloneElements () {
		return new ChainedDom(this.elements.map(
			el => el.cloneNode(true)
		));
	}
	
	slice (start, end) {
		checkint(start, 'start');
		checkint(end, 'end');
		return new ChainedDom(this.elements.slice(start, end))
	}
	
	get first () {
		return new ChainedDom(this.elements[0] || [])
	}
	get last () {
		return new ChainedDom(this.elements[this.elements.length -1] || [])
	}
	at (ind) {
		checkint(ind, 'index');
		return new ChainedDom(this.elements[ind] || [])
	}
	
	find (sel) {
		checkstr(sel, 'selector');
		return new ChainedDom(this.elements.filter(
			el => el.matches(sel)
		))
	}
	has (sel) {
		checkstr(sel, 'selector');
		return this.elements.some(el => el.matches(sel));
	}
	all (sel) {
		checkstr(sel, 'selector');
		return this.elements.every(el => el.matches(sel));
	}
	indexOf (sel) {
		checkstr(sel, 'selector');
		return this.elements.findIndex(el => el.matches(sel));
	}
	select (sel) {
		checkstr(sel, 'selector');
		if (!this.elements[0]) return new CainedDom([]);
		return new ChainedDom(this.elements[0].querySelectorAll(sel))
	}
	
	get uniq () {
		return new ChainedDom(Array.from(new Set(this.elements)))
	}
	get cleaned () {
		return new ChainedDom(this.elements.filter(
			el => document.contains(el)
		))
	}
	get reversed () {
		return new ChainedDom(this.elements.concat().reverse())
	}
	
	get isInDom () {
		if (!this.elements[0]) return;
		return document.contains(this.elements[0])
	}
	get isEmpty () {
		if (!this.elements[0]) return;
		return this.elements[0].childNodes.length === 0
	}
	get isHidden () {
		if (!this.elements[0]) return;
		return this.elements[0].style.display === 'none'
	}
	
	get parent () {
		return new ChainedDom(this.elements[0]?.parentElement || [])
	}
	get parents () {
		var els = [], curEl = this.elements[0]?.parentNode;
		while (curEl) {
			els.push(curEl);
			curEl = curEl.parentElement
		}
		return new ChainedDom(els)
	}
	
	get children () {
		return new ChainedDom(this.elements[0]?.children || [])
	}
	get content () {
		return new ChainedDom(this.elements[0]?.childNodes || [])
	}
	
	get next () {
		return new ChainedDom(this.elements[0]?.nextElementSibling || [])
	}
	get prev () {
		return new ChainedDom(this.elements[0]?.previousElementSibling || [])
	}
	get siblings () {
		return new ChainedDom(
			Array.from(this.elements[0]?.parentElement?.children || [])
			  .filter(el => el !== this.elements[0])
		)
	}
	get nextSiblings () {
		var els = [], curEl = this.elements[0]?.nextElementSibling;
		while (curEl) {
			els.push(curEl);
			curEl = curEl.nextElementSibling
		}
		return new ChainedDom(els)
	}
	get prevSiblings () {
		var els = [], curEl = this.elements[0]?.previousElementSibling;
		while (curEl) {
			els.push(curEl);
			curEl = curEl.previousElementSibling
		}
		return new ChainedDom(els)
	}
	
	html (str) {
		//get
		if (str === undefined) return this.elements[0]?.innerHTML;
		
		//set
		checkstr(str, 'html string');
		this.elements.forEach(el => el.innerHTML = str);
		
		return this
	}
	empty () {
		this.elements.forEach(el => el.innerHTML = ''); 
		return this
	}
	text (str) {
		//get
		if (str === undefined) return this.elements[0]?.innerText; 
		
		//set
		checkstr(str, 'text string');
		this.elements.forEach(el => el.innerText = str);
		
		return this
	}
	
	addClass (name) {
		//case multiple
		if (Array.isArray(name)) this.elements.forEach(
			el => el.className += name.join(' ')
		);
		
		//case single
		else {
			checkstr(name, 'class name');
			this.elements.forEach(el => el.classList.add(name))
		}
		
		return this
	}
	removeClass (name) {
		//case multiple
		if (Array.isArray(name)) name.forEach(name => this.removeClass(name));
		
		//case single
		else {
			checkstr(name, 'class name');
			this.elements.forEach(el => el.classList.remove(name))
		}
		
		return this
	}
	toggleClass (name) {
		checkstr(name, 'class name');
		this.elements.forEach(el => el.classList.toggle(name));
		return this
	}
	hasClass (name) {
		checkstr(name, 'class name');
		return this.elements[0]?.classList?.contains?.(name)
	}
	
	attr (name, value) {
		//case single
		if (typeof name === 'string') {
			//get
			if (value === undefined) return this.elements[0]?.getAttribute?.(name);
			
			//remove
			if (value === null) this.elements.forEach(el => el.removeAttribute(name));
			
			//set
			else this.elements.forEach(el => el.setAttribute(name, value));
		}
		
		//case multiple
		else if (name) {
			for (let attr in name) {
				this.elements.forEach(el => el.setAttribute(attr, name[attr]))
			}
		}
		
		//case get all
		else {
			return Array.from(this.elements[0]?.attributes || [])
			  .reduce((obj, attr) => {
				  obj[attr.name] = attr.value;
				  return obj
			  }, {})
		}
		
		return this
	}
	
	prop (name, value) {
		//case single
		if (typeof name === 'string') {
			//case get
			if (value === undefined) return this.elements[0]?.[name];
			
			//case set
			this.elements.forEach(el => el[name] = value)
		} 
		
		//case multiple
		else {
			for (let key in name) {
				this.elements.forEach(el => el[key] = name[key])
			}
		}
		
		return this
	}
	
	call (prop, ...args) {
		checkstr(prop, 'prop');
		this.elements.forEach(el => el[prop](...args));
		return this
	}
	callr (prop, ...args) {
		checkstr(prop, 'prop');
		return this.elements.map(el => el[prop](...args));
	}
	
	css (name, value) {
		//case single
		if (typeof name === 'string') {
			//case get
			if (value === undefined) return this.elements[0]?.style?.getPropertyValue?.(name)
			
			//case set
			this.elements.forEach(el => el.style.setProperty(name, value));
			
		} 
		
		//case multiple
		else if (name) {
			for (let prop in name) {
				this.elements.forEach(el => el.style.setProperty(prop, name[prop]))
			}
		}
		
		//case get all
		else {
			let style = this.elements[0]?.style
			return Array.from(style || [])
			  .reduce((obj, prop) => {
				  obj[prop] = style.getPropertyValue(prop);
				  return obj
			  }, {})
		}
		
		return this
	}
	
	data (name, value) {
		//case single
		if (typeof name === 'string') {
			//case get
			if (value === undefined) return this.elements[0]?.dataset?.[name];
			
			//case remove
			if (value === null) this.elements.forEach(el => delete el.dataset[name]);
			
			//case set
			else this.elements.forEach(el => el.dataset[name] = value);
			
		} 
		
		//case multiple
		else if (name) {
			for (let key in name) {
				this.elements.forEach(el => el.dataset[name[key]] = name[key])
			}
		}
		
		//case get all
		else return { ...this.elements[0]?.dataset }
		
		return this
	}
	
	append (el, clone = true) {
		var nodes = $el(el);
		if (clone) this.elements.forEach(
			el => el.append(...nodes.map(el => el.cloneNode(true)))
		);
		else this.elements[0]?.append?.(...nodes);
		return this
	}
	prepend (el, clone = true) {
		var node = $el(el);
		if (clone) this.elements.forEach(
			el => el.prepend(...node.map(el => el.cloneNode(true)))
		);
		else this.elements[0]?.prepend?.(...nodes);
		return this
	}
	before (el, clone = true) {
		var node = $el(el);
		if (clone) this.elements.forEach(
			el => el.before(...node.map(el => el.cloneNode(true)))
		);
		else this.elements[0]?.before?.(...nodes);
		return this
	}
	after (el, clone = true) {
		var node = $el(el);
		if (clone) this.elements.forEach(
			el => el.after(...node.map(el => el.cloneNode(true)))
		);
		else this.elements[0]?.after?.(...nodes);
		return this
	}
	
	appendTo (el) {
		checkel(el, 'destination');
		el.append(...this.elements);
		return this
	}
	prependTo (el) {
		checkel(el, 'destination');
		el.prepend(...this.elements);
		return this
	}
	insertBefore (el) {
		checkel(el, 'destination');
		el.before(...this.elements);
		return this
	}
	insertAfter (el) {
		checkel(el, 'destination');
		el.after(...this.elements);
		return this
	}
	
	replaceWith (el, clone = true) {
		var node = $el(el);
		if (clone) this.elements.forEach(
			el => el.replaceWith(...node.map(el => el.cloneNode(true)))
		);
		else this.elements[0]?.replaceWith?.(...node);
		return this
	}
	
	on (type, fn, options) {
		checkstr(type, 'type');
		checkfn(fn, 'listner');
		this.elements.forEach(
			el => el.addEventListener(type, fn, options)
		);
		return this
	}
	off (type, fn, options) {
		checkstr(type, 'type');
		checkfn(fn, 'listner');
		this.elements.forEach(
			el => el.removeEventListener(type, fn, options)
		);
		return this
	}
	once (type, fn, options) {
		checkstr(type, 'type');
		checkfn(fn, 'listner');
		this.elements.forEach(
			el => el.addEventListener(type, fn, { once: true, ...options })
		);
		return this
	}
	trigger (type, opts ={}) {
		var event = typeof type === 'string' ? new Event(type, opts) : type;
		this.elements.forEach(el => el.dispatchEvent(event));
		return this
	}
	
	get position () {
		return this.elements[0]?.getBoundingClientRect?.()
	}
	
	scrollInto (opts) {
		this.elements[0]?.scrollIntoView?.(opts);
		return this
	}
	
	animate (...args) {
		return this.elements[0]?.animate?.(...args)
	}
	animateAll (...args) {
		this.elements.forEach(el => el.animate(...args));
		return this
	}
	
	
	hide () {
		this.elements.forEach(
			el => el.style.display = 'none'
		);
		return this
	}
	show () {
		this.elements.forEach(
			el => el.style.display = ''
		);
		return this
	}
	toggle () {
		this.elements.forEach(
			el => el.style.display = el.style.display === 'none' ? '' : 'none'
		);
		return this
	}
	
	wrapEach (el) {
		var node = $el(el)[0];
		this.elements.forEach(el => {
			var sibl = el.previousElementSibling;
			var par = node.cloneNode(true);
			
			//handle hierarchy
			if (sibl) sibl.after(par);
			else if (el.parentNode) el.parentNode.append(par)
			par.append(el);
		});
		return this
	}
	wrapAll (el) {
		var node = $el(el)[0];
		node.append(...this.elements);
		return this
	}
	unwrap () {
		this.elements.forEach(
			el => el.parentNode ? el.parentNode.after(el) : undefined
		);
		return this
	}
}

export default (a, b, c) => new ChainedDom(a, b, c);