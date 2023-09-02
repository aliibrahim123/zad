//constrol flow

import { checkfn, checkpInt } from './check.js';

export var attempt = (fn) => {
	checkfn(fn);
	return function (...args) {
		try {
			return fn.apply(this, args)
		} catch (error) {
			return error
		}
	}
}

export var times = (nb, fn) => {
	checkpInt(nb, 'count');
	checkfn(fn);
	for (let i = 0; i < nb; i++) {
		fn(i)
	}
}

export var until = (cond, fn, init) => {
	checkfn(fn);
	checkfn(cond, 'cond');
	var cur = init;
	while (cond(cur)) {
		cur = fn(cur)
	}
	return cur
}

export var when = (cond, fn) => {
	checkfn(cond, 'cond');
	checkfn(fn);
	return (value) => cond(value) ? fn(value) : value
}

export var unless = (cond, fn) => {
	checkfn(cond, 'cond');
	checkfn(fn);
	return (value) => cond(value) ? value : fn(value)
}

export var ifElese = (cond, ifFn, elseFn) => {
	checkfn(cond, 'cond');
	checkfn(ifFn, 'ifFn');
	checkfn(elseFn, 'elseFn');
	return (value) => cond(value) ? ifFn(value) : elseFn(value)
}

export var tryCatch = (fn, catcher) => {
	checkfn(fn);
	checkfn(catcher, 'catcher');
	return function (...args) {
		try {
			return fn.apply(this, args)
		} catch (error) {
			return catcher.call(this, error, ...args)
		}
	} 
}