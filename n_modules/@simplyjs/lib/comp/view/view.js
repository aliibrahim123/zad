//view class
//elements handling

//templates: reusable blockes of ui, one for each componnt
//subs: reusable blockes of elements: many for many components

//view functions: functions for handling elements

import { checkel, checkcomp, checkstr, checkpInt, CompError } from '../check.js';
import { attrs } from './viewAttrs.js';
import { viewFns } from './viewFns.js';
import $el from '../../dom/base.js';

class View {
	class = this.constructor; //self class
	constructor(comp, opts = {}, el) {
		//handle component and options
		checkcomp(comp, 'view');
		this.comp = comp
		var Opts = this.opts = {
			...this.class.defaults,
			...opts
		}
		checkstr(Opts.tempAppendMode, 'tempAppendMode', 'view');
		
		//handle el
		el = el?.nodeType === 1 ? el : this.$(Opts.el)[0]; //if not element, constuct it
		el.$comp = comp; //mark element as component element
		this.el = el;
		this.comp.el = el;
		
		//handle attrs and funs
		this.attrs = this.class.attrs;
		this.funs = this.class.funs;
		
		//handle subs
		this.subs = Opts.subs;
		this.subs = {};
		for (let name in Opts.subs) {
			let sub = Opts.subs[name];
			this.subs[name] = sub.$isSub ? sub : this.$(sub)[0] //construct if needed
		}
		
		//handle references
		this.refs = {}; //references to elements
		var refs = Opts.refs
		for (let ref in refs) {
			this.refs[ref] = this.$(refs[ref])
		}
		this.comp.refs = this.refs;
		
		//handle rendering
		if (Opts.lazyTemp) {
			this.comp.waitingNb++;
			$comp.temps.getLazy(this, Opts.temp);
		}
		else this.render();
		comp.trigger('init:view', this)
	}
	static defaults = {
		tempAppendMode: 'append',
		temp: '<span></span>',
		lazyTemp: false,
		el: '<div></div>', //core element
		subs: {},
		refs: {}
	}
	static attrs = attrs;
	static funs = viewFns;
	$ (a, root = this.el) { //element query and creation
		return $el(a, root)
	}
	render () {
		var temp = this.opts.temp, el = this.el, tels, // template elements 
		  acts = [], appendM = this.opts.tempAppendMode;
		
		//construct template 
		if (typeof temp === 'string') {
			//construct from html string
			if (temp[0] === '<') tels =  this.$(temp); 
			
			//get from template manager
			else ({els: tels, acts = []} = $comp.temps.get(temp)(this)); 
		} 
		
		//clone from node
		else if (temp.nodeType === 1) tels = temp.cloneNode(true).childNodes; 
		
		else ({els: tels = '', acts = []} = temp(this));
		
		//append it
		if (appendM === 'replace') el.replaceChildren(...tels);
		else if (appendM === 'append') el.append(...tels);
		else if (appendM === 'prepend') el.prepend(...tels);
		else throw new CompError('view: undefined append mode (' + appendM + ')');
		
		//fire acts and render event
		acts.forEach(act => this.comp.doAct(act));
		this.comp.trigger('render', this);
		return this
	}
	walk (el, forceNS = []) { 
		$comp.attrs.walk(this.comp, el, forceNS);
		return this
	}
	addRef (name, el) {//add reference
		checkstr(name, 'name', 'view');
		var els = this.$(el);
		
		if (els.length === 0) this.comp.warn('view: no element with specific selector (' + el + ')');
		else this.refs[name] ? this.refs[name].push(...els) : this.refs[name] = els;
		
		return this
	}
	attr (el, name, val) {
		checkstr(name, 'name', 'view');
		var els = this.$(el);
		
		//get
		if (val === undefined) { 
			if (name in this.attrs) return this.attrs[name](els[0]);
			else if (name in els[0]) return els[0][name];
			else return els[0].getAttribute(name)
			
		} 
		
		//set
		else {els.forEach(el => { 
			if (name in this.attrs) this.attrs[name](el, val);
			else if (name in el) el[name] = val;
			else el.setAttribute(name, val)
		})}
	}
	call (el, name, ...args) { //call view function
		checkstr(name, 'name', 'view');
		if (name in this.funs) return this.funs[name](this.$(el), ...args);
		else this.comp.warn('view: undefined function (' + name + ')');
		return;
	}
	createSub (name, ...args) {
		checkstr(name, 'name', 'view');
		var sub = this.subs[name], el, acts = [];
		if (!sub) throw new CompError('view: undefined sub (' + name + ')');
		
		//construct element
		if (sub.$isSub) ({el, acts} = sub.fn(this, 0, ...args)); //call if sub
		else el = sub[0].cloneNode(true); //clone else
		
		//handle actions and walking
		if (!('dowalk' in sub) || sub.dowalk) this.walk(el);
		acts?.forEach?.(act => this.comp.doAct(act));
		
		return el
	}
	appendSub (el, name, ind = -1, ...args) {
		checkpInt(ind, 'ind', 'view', -1);
		
		this.$(el).forEach(el => {
			//construct sub
			var subEl = this.createSub(name, ...args)
			
			//mark element as sub element
			el.$isSub = true; 
			
			//append it
			if (ind === -1 || ind === el.children.length) el.append(subEl); 
			else if (ind === 0) el.prepend(subEl);
			else el.children[ind].before(subEl);
		});
		return this
	}
	setSub (el, name, appendMode = 'append', ...args) {
		checkstr(name, 'name', 'view');
		checkstr(appendMode, 'appendMode', 'view');
		var sub = this.subs[name], childs, acts = [], tempEl;
		if (!sub) throw new CompError('view: undefined sub (' + name + ')');
		
		this.$(el).forEach(el => {
			//construct elements
			if (sub.$isSub) ({el: tempEl, acts} = sub.fn(this, 1, el, ...args)); //call if sub
			else tempEl = sub.cloneNode(true); //else clone node
			var childs = tempEl.children;
			
			//append them
			if (appendMode === 'append') el.append(...childs);
			else if (appendMode === 'prepend') el.prepend(...childs);
			else if (appendMode === 'replace') el.replaceChildren(...childs);
			else throw new CompError('view: undefined append mode (' + appendMode + ')');
			
			//handle actions and walking
			if (!('dowalk' in sub) || sub.dowalk) Array.from(el.children).forEach(el => this.walk(el));
			acts?.forEach?.(act => this.comp.doAct(act))
		});
		return this
	}
}

export { View }