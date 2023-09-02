//curring

import { checkfn, checkpInt } from './check.js';

export var partial = (fn, ...partails) => {
	checkfn(fn);
	return function (...args) {
		return fn.call(this, ...partails, ...args)
	}
}

export var partialRight = (fn, ...partails) => {
	checkfn(fn);
	return function (...args) {
		return fn.call(this, ...args, ...partails)
	}
}

var createCurry = (fn, arity, ...iargs) => function (...args) {
	if (iargs.length + args.length >= arity) return fn.call(this, ...iargs, ...args);
	return createCurry(fn, arity, ...iargs, ...args)
}

var createCurryRight = (fn, arity, ...iargs) => function (...args) {
	if (iargs.length + args.length >= arity) return fn.call(this, ...args, ...iargs);
	return createCurry(fn, arity, ...args, ...iargs)
}

export var curry = (fn, arity = fn?.length) => {
	checkfn(fn);
	checkpInt(arity, 'arity');
	return createCurry(fn, arity)
}

export var curryRight = (fn, arity = fn?.length) => {
	checkfn(fn);
	checkpInt(arity, 'arity');
	return createCurryRight(fn, arity)
}

export var curryFirstFirstly = (fn) => {
	checkfn(fn);
	return (fisrt) => function (...args) {
		return fn.call(this, fisrt, ...args)
	}
}

export var curryFirstLastly = (fn) => {
	checkfn(fn);
	return (...args) => function (fisrt) {
		return fn.call(this, fisrt, ...args)
	}
}