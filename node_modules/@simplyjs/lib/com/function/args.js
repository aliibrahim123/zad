//arguments manipulation

import { checkfn, checkpInt } from './check.js';

export var ary = (fn, nb = fn?.length) => {
	checkfn(fn);
	checkpInt(nb, 'count', true);
	return function (...args) {
		return fn.apply(this, args.slice(0, nb))
	}
}

export var unary = (fn) => ary(fn, 1);

export var rotateArg1 = (fn) => {
	checkfn(fn);
	return function (...args) {
		return fn.call(this, args[args.length -1], ...args.slice(0, args.length -1))
	}
}

export var flipArgs = (fn) => {
	checkfn(fn);
	return function (...args) {
		return fn.apply(this, args.reverse())
	}
}

export var mapArgs = (fn, mapper) => {
	checkfn(fn);
	checkfn(mapper, 'mapper');
	return function (...args) {
		return fn.apply(this, args.map(mapper))
	}
}

export var overArgs = (fn, transforms) => {
	checkfn(fn);
	if (!Array.isArray(transforms)) throw new TypeError('fn: transforms of type (' + transforms?.constructor?.name + '), expected (Array)');
	transforms.forEach((fn, ind) => {
		if (typeof fn !== 'function') throw new TypeError('fn: fn at index (' + ind + ') of type (' + fn?.constructor?.name + '), expected (Function)');
	});
	return function (...args) {
		return fn.apply(this, args.map((arg, i) => transforms[i] ? transforms[i](arg) : arg))
	}
}

export var rearg = (fn, indexes) => {
	if (!Array.isArray(indexes)) throw new TypeError('fn: indexes of type (' + indexes?.constructor?.name + '), expected (Array)');
	indexes.forEach((i, ind) => checkpInt(i, 'index at index (' + ind + ')', true))
	return function (...args) {
		return fn.apply(this, indexes.map(i => args[i]))
	}
}