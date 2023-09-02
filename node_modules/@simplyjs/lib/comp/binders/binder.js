//binder class
//bind properties to elements

//handlers: handle the bind
//prehandlers: prehandle the bind by type

//binds: fire on property change
//sets: fire on define and on call

import { checkDataProv, checkel, CompError } from '../check.js';
import { handlers } from './binderHndls.js';
import { prehandlers } from './binderPrehndls.js';

class Binder {
	constructor (comp, opts, binds = {}, sets = {}) {
		checkDataProv(comp, 'binder');
		this.comp = comp;
		this.opts = {
			...this.constructor.defaults,
			...opts
		};
		
		//handle handlers
		this.handlers = handlers;
		this.prehandlers = prehandlers;
		
		//handle binds and sets
		this.binds = {};
		this.sets = {};
		for (let prop in binds) {
			binds[prop].forEach(obj => this.addB(prop, obj))
		}
		for (let prop in sets) {
			sets[prop].forEach(obj => this.addS(prop, obj))
		}
		
		comp.on('model:change', this.patch.bind(this));
		if (this.opts.setOnInit) comp.on('init', () => this.fireSet())
	}
	static defaults = {
		setOnDefine: true,
		setOnInit: true,
		prehandle: true
	}
	patch (comp, model, name, prop, oldv, newv, meta) {
		if (this.binds[name]) {
			if ((meta.prehandle === undefined && this.opts.prehandle) || meta.prehandle) (meta = this.prehandle(prop, oldv, newv, meta));
			this.binds[name].forEach(b=>this.handlers[b.type] (b, newv, this.comp, oldv, prop, name, meta))
		}
	}
	prehandle (prop, oldv, newv, meta) {
		if (newv?.constructor?.name in this.prehandlers) return this.prehandlers[newv?.constructor?.name](this.comp, prop, oldv, newv, meta);
		else return meta
	}
	addB (prop, obj, set = true, prehandle = this.opts.prehandle) {//add bind
		var val, Prop, meta;
		
		//check
		checkel(obj.el, 'binder');
		if (!(obj?.type in this.handlers)) throw new CompError('binder: undefined bind type (' + obj.type +')');
		
		//storing obj in this.binds
		if (Array.isArray(prop)) prop.forEach(p=>this.binds[p] ? this.binds[p].push(obj) : this.binds[p] = [obj]);
		else this.binds[prop] ? this.binds[prop].push(obj) : this.binds[prop] = [obj];
		
		if (!Array.isArray(prop)) [val, Prop] = this.comp.model.getLow(prop);
		
		//set if possible
		if (set && this.opts.setOnDefine) {
			if (prehandle) meta = this.prehandle(prop, val, val, {});
			this.handlers[obj.type] (obj, val, this.comp, val, Prop, prop, {...meta, set:true});
		}
		
		return this
	}
	addS (prop, obj, set = true, prehandle = this.opts.prehandle) {//add set
		var val, Prop, meta;
		
		//check
		checkel(obj.el, 'binder');
		if (!(obj?.type in this.handlers)) throw new CompError('binder: undefined bind type (' + obj.type +')');
		
		//storing obj in this.sets
		if (Array.isArray(prop)) prop.forEach(p=>this.sets[p] ? this.sets[p].push(obj) : this.sets[p] = [obj]);
		else this.sets[prop] ? this.sets[prop].push(obj) : this.sets[prop] = [obj];
		
		if (!Array.isArray(prop)) [val, Prop] = this.comp.model.getLow(prop);

		//set if possible
		if (set && this.opts.setOnDefine) {
			if (prehandle) meta = this.prehandle(prop, val, val, {});
			this.handlers[obj.type] (obj, val, this.comp, val, Prop, prop, {set:true});
		}
		
		return this
	}
	remove (el, prop) {
		if (!el) {
			this.binds[prop] = [];
			this.sets[prop] = []
		}
		
		checkel(el, 'binder');
		
		if (prop !== undefined) {
			this.binds[prop] = this.binds[prop].filter(i=>i.el !== el);
			this.sets[prop] = this.sets[prop].filter(i=>i.el !== el)
		} else {
			for (let prop in this.binds) {
				this.binds[prop] = this.binds[prop].filter(i=>i.el !== el)
			}
			for (let prop in this.sets) {
				this.sets[prop] = this.sets[prop].filter(i=>i.el !== el)
			}
		}
		return this
	}
	fireSet (name, meta = {}, prehandle = this.opts.prehandle) {
		if (name === undefined) {
			for (let s in this.sets) {
				this.fireSet(s, meta, prehandle)
			}
			return
		}
		
		var [val, prop] = this.comp.model.getLow(name);
		if (name in this.sets) {
			if (prehandle) meta = this.prehandle(prop, val, val, meta);
			this.sets[name].forEach(s=> this.handlers[s.type] (s, val, this.comp, undefined, prop, name, {...meta, set:true, reset: true}))
			
		} else this.comp.warn('binder: undefined property (' + name +')');
		return this
	}
	clean () {//filter the binds of element not in document
		for (let name in this.binds) {
			this.binds[name] = this.binds[name].filter(b => document.contains(b.el))
		}
		for (let name in this.sets) {
			this.sets[name] = this.sets[name].filter(s => document.contains(s.el))
		}
		return this
	}
}

export { Binder }