//computed values

import { checkfn } from './check.js';
import { RValue } from './rvalue.js';
import { ReactiveError } from './error.js';

export class CValue extends RValue {
	constructor (vals, fn) {
		super();
		if (!Array.isArray(vals)) throw new ReactiveError('cvalue: rvalues of type (' + vals?.constructor?.name + '), expected (Array)');
		checkfn(fn);
		this.vals = vals;
		this.fn = fn;
		vals.forEach(v => v.addEffect(this.handle.bind(this)));
		this.handle()
	}
	get v () {
		return this._value
	}
	get value () {
		return this._value
	}
	set v (_) {
		throw new ReactiveError('cvalue: unable to manualy set computed value');
	}
	set value (_) {
		throw new ReactiveError('cvalue: unable to manualy set computed value');
	}
	handle () {
		var value = this.fn(...this.vals.map(v => v.v));
		this._value = value;
		this.effects.forEach(fn => fn(value, this))
	}
}