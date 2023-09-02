//result manipulation

import { checkfn } from './check.js';

export var wrap = (fn, before = v => v, after = v => v) => {
	checkfn(fn);
	checkfn(before, 'before');
	checkfn(after, 'after');
	return function (value, ...args) {
		return after.call(this, 
			fn.call(this, 
				before.call(this, value, ...args),
			...args),
		...args)
	}
}

export var negate = (fn) => {
	checkfn(fn);
	return function (...args) {
		return !fn.apply(this, args)
	}
}