//reactive value, with effect support

import { checkfn } from './check.js';

export class RValue {
	constructor (value) {
		this._value = value;
		this.effects = [];
	}
	get v () {
		return this._value
	}
	set v (value) {
		if (this._value === value) return;
		this._value = value;
		this.effects.forEach(fn => fn(value, this))
	}
	get value () {
		return this._value
	}
	set value (value) {
		if (this._value === value) return;
		this._value = value;
		this.effects.forEach(fn => fn(value, this))
	}
	addEffect (fn) {
		checkfn(fn, 'rvalue');
		this.effects.push(fn);
		return this
	}
	removeEffect (fn) {
		checkfn(fn, 'rvalue');
		this.effects = this.effects.filter(f => f !== fn);
		return this
	}
}