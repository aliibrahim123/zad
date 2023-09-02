//models
//databases and triggers

//properties: reactive peice of data, acessed by data paths
//data path: property name + path to value sepatated by ','
//	example: obj.sub.val

//model functions: functions for handling data

import { CompError, checkDataProv, checkfn, checkarr } from '../check.js';
import { modelFns } from './modelFns.js';
import { createProxy } from './modelProxy.js';

class Model {
	class = this.constructor; //self class
	constructor (comp, opts = {}, data = {}) {
		checkDataProv(comp, 'model');
		this.comp = comp;
		this.funs = this.class.funs;
		
		//handle options
		this.opts = {
			...this.class.defaults,
			...opts
		};
		checkfn(this.opts.doPropagate, 'doPropagate', 'model');
		
		//handle data
		this.data = {};
		for (let name in data) {
			this.addLow(name, data[name])
		}
		
		this.deps = {}; //properties dependencies
		
		this.init();
		this.comp.trigger('init:model', this)
	}
	static defaults = {
		addDef: false, //add defined
		propObj: {
			$hasMeta: true,
			meta: {},
			isReactive: true,
			name: ''
		},
		propagate: true,
		doPropagate: (oldv, newv) => oldv !== newv,
		propagParent: false, //propagate parent
		propagDeps: true //propagate dependencies
	};
	static funs = modelFns;
	init () {}
	addLow (name, item) { //defining + initing
		//define prop
		if (item?.$hasMeta) {
			var prop = {
				...this.opts.propObj,
				...item,
				name: name
			}
		} else {
			var prop = {
				...this.opts.propObj,
				value: item,
				name: name
			}
		}
		prop.meta = {...prop.meta}; //copy
		
		//check
		if (prop.init) checkfn(prop.init, 'initFn', 'model');
		if (prop.setter) checkfn(prop.init, 'setter', 'model');
		if (prop.getter) checkfn(prop.init, 'getter', 'model');
		
		//add to data
		if (this.data[name]) {
			this.comp.warn('model: adding defined property (' + name + ')');
			if (this.opts.addDef) this.data[name] = prop;
			else return
		} else this.data[name] = prop;
		
		//trigger init and events
		if (prop.init) prop.init(this.comp, this);
		this.comp.trigger('model:add', this, name, prop);
		return prop
	}
	add (name, item, returnProp = false) {//low level + reactivity 
		var prop = this.addLow(name, item);
		if (prop && prop.isReactive && this.opts.propagate) this.propagate(name, prop);
		
		return returnProp ? prop : this
	}
	propagate (name, prop = this.data[name], oldValue, newValue = prop.value, meta = {}) {
		if (!prop) this.comp.warn('model: propagating undefined property (' + name + ')');
		else if (meta.force === true || this.opts.doPropagate(oldValue, newValue)) {
			//self
			this.comp.trigger('model:change', this, name, prop, oldValue, newValue, meta);
			
			//dependencies
			if (meta.propagDeps === true && this.deps[name]) 
				this.deps[name].forEach(p => this.propagate(p, undefined,undefined,undefined, {propagDeps: false, force: true}));
			
			//parent
			if (this.opts.propagParent && newValue !== prop.value) 
				this.propagate(prop.name, prop, undefined,undefined, {force: true, sinceChild: true}) 
		}
	}
	getLow (name, doset = false /* adding objects till end */) {//path name handling
		//return [value, prop, parObj, path, isNew]
		var path = String(name).split('.'), isNew = false;
		if (path.length === 0) return [];
		var prop = this.data[path[0]];
		
		//if prop is undefined
		//	case get: return undefined
		//	case set: add new
		if (!prop && doset === false) {
			this.comp.warn('model: stoped at path (' + path[0] + ')');
			return [undefined, undefined, undefined, path, undefined];
		}
		if (!prop && doset) {
			prop = this.addLow(path[0], {});
			isNew = true;
		}
		
		var curObj = prop.value, curPath;
		
		//if path length is 1 or value is undefined, return
		if (path.length === 1) return [curObj, prop, curObj, path, isNew];
		if (curObj === undefined || curObj === null) {
			this.comp.warn('model: stoped at path (' + path.join('.') + ')');
			return [undefined, prop, undefined, path, isNew]
		}
		
		for (let i = 0; i < path.length; i++) {
			if (i === 0) continue; //skip property name
			if (i === path.length -1) continue; //skip last path
			curPath = path[i];
			
			if (curObj[curPath] !== undefined && curObj[curPath] !== null) curObj = curObj[curPath];
			
			//if undefined:
			//	case set: add object
			//	case get: return undefined
			else if (doset && typeof curObj === 'object') {
				curObj[curPath] = {};
				curObj = curObj[curPath]
			} else {
				this.comp.warn('model: stoped at path (' + path.slice(0, i+1).join('.') + ')');
				return [undefined, prop, undefined, path, isNew]
			}
		}
		return [curObj[path[path.length -1]], prop, curObj, path, isNew]
	}
	setLow (name, value) {
		var prop = this.data[name];
		if (prop?.setter) return [prop, ...prop.setter(value, path, comp), true]
		
		var [oldVal, prop, parObj, path, isNew] = this.getLow(name, true);
		if (path.length === 1) prop.value = value;
		else if (parObj) parObj[path[path.length -1]] = value;
		else return [prop, undefined, undefined, false]

		return [prop, isNew ? undefined : oldVal, value, true]
	}
	set (name, value, returnProp = false, meta = {}) {
		if (typeof name === 'object') {
			for (let n in name) {
				this.set(n, name[n])
			}
			return this
		}
		var [prop, oldVal, newVal, propagate] = this.setLow(name, value);
		if (propagate && prop.isReactive && this.opts.propagate) this.propagate(name, prop, oldVal, newVal, meta);
		return returnProp ? prop : this
	}
	get (name, returnProp = false) {
		var prop = this.data[name];
		if (returnProp) return prop;
		
		if (prop?.getter) return prop.getter(path, comp);
		
		return this.getLow(name, false)[0];
	}
	getFn(name, fn, ...args) {
		var Fn = typeof fn === 'function' ? fn : this.funs[fn];
		if (!Fn) throw new CompError('model: undefined function (' + fn + ')');
		
		var fnVal = Fn(this, this.get(name), ...args);
		
		return fnVal?.$hasMeta ? fnVal.value : fnVal
	}
	setFn(name, fn, old = true, ...args) {
		var Fn = typeof fn === 'function' ? fn : this.funs[fn];
		if (!Fn) throw new CompError('model: undefined function (' + fn + ')');
		
		var fnVal = old ? Fn(this, this.get(name), ...args) : Fn(this, ...args);
		var value = fnVal?.$hasMeta ? fnVal.value : fnVal;
		
		this.set(name, value, false, fnVal?.meta);
		return this
	}
	has (name) {
		return !!this.data[String(name).split('.')[0]]
	}
	delete (name) {
		if (this.data[name] === undefined) return false;
		this.data[name] = undefined;
		this.comp.trigger('model:delete', this, name)
		return true
	}
	getAllKeys () {
		return Object.keys(this.data).filter(i=>this.data[i] !== undefined)
	}
	addDep (name, deps) {//add dependency
		checkarr(deps, 'dependencies', 'model');
		if (Array.isArray(name)) name.forEach(n => this.deps[n] ? this.deps[n].push(...deps) : this.deps[n] = [...deps]);
		else this.deps[name] ? this.deps[name].push(...deps) : this.deps[name] = [...deps]
		return this
	}
	toProxy () {
		return createProxy(this)
	}
	toObj () {
		var obj = {};
		for (let name in this.data) {
			obj[name] = this.get(name);
		}
		return obj
	}
	toJSON () {
		return JSON.stringify(this.toObj())
	}
}

export { Model }