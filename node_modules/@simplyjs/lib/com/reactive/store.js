//store class
//storing reactive variables and firing effects

import { RValue } from './rvalue.js';
import { CValue } from './computed.js';
import { checkfn, checkarr } from './check.js';
import { ReactiveError } from './error.js';

var throwUPError = (name) => { throw new ReactiveError('store: undefined property (' + name + ')') }

export class Store {
	constructor (data = {}) {
		this.data = {};
		for (let p in data) {
			this.add(p, data[p])
		}
	}
	add (name, value, returnRValue = false) {
		if (name in this.data) console.warn('store: adding defined property (' + name + ')');
		this.data[name] = value instanceof RValue ? value : new RValue(value);
		return returnRValue ? this.data[name] : this
	}
	addC (name, values, fn, returnRValue = false) {
		checkarr(values, 'store', 'values');
		return this.add(name, new CValue(values.map(v => {
			if (!this.data[v]) throwUPError(v);
			return this.data[v]
		}), fn), returnRValue)
	}
	get (name, returnRValue = false) {
		var rvalue = this.data[name];
		return rvalue ? (returnRValue ? rvalue : rvalue.v) : undefined
	}
	set (name, value, returnRValue = false) {
		var rvalue = this.data[name];
		if (rvalue) {
			if (value instanceof RValue) rvalue = (this.data[name] = value);
			else rvalue.v = value
		} else rvalue = this.add(name, value, true)
		return returnRValue ? rvalue : this
	}
	delete (name) {
		if (!(name in this.data)) return false;
		delete this.data[name];
		return true
	}
	addEffect (names, fn) {
		checkfn(fn);
		if (!Array.isArray(names)) {
			var rvalue = this.data[names];
			if (!rvalue) throwUPError(names);
			rvalue.addEffect(fn);
			return fn
		}
		var nfn = () => fn(...rvalues.map(v => v.value), this);
		names.forEach(name => {
			if (name in this.data) this.data[name].addEffect(nfn);
			else throwUPError(name)
		});
		var rvalues = names.map(n => this.data[n]);
		return nfn
	}
	removeEffect (name, fn) {
		if (Array.isArray(name)) name.forEach(name => this.removeEffect(name, fn));
		else {
			var rvalue = this.data[name];
			if (rvalue) rvalue.removeEffect(fn);
			else throwUPError(name)
		}
		return this
	}
}