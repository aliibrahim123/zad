//transform OOP mothods into functional functions
//(auto-curried data-last functions)

import { curry } from '../function/curry.js';
import { rotateArg1 } from '../function/args.js';

var handle = (fn, isOOP) => {
	if (isOOP) return curry(function (...args) {
		return fn.apply(args[args.length -1], args.slice(0, args.length -1))
	}, fn.length +1);
	else return curry(rotateArg1(fn))
}

export var toFunc = (obj, config = {}) => {
	var { pick, omit, isOOP } = {
		pick: [], //empty = all
		omit: [],
		isOOP: true,
		...config
	}
	if (!Array.isArray(pick)) throw new TypeError('functional: pick of type (' + pick?.constructor?.name + '), expected (Array)');
	if (!Array.isArray(omit)) throw new TypeError('functional: omit of type (' + omit?.constructor?.name + '), expected (Array)');
	var result = {};
	if (pick.length === 0) Object.getOwnPropertyNames(obj).forEach(prop => {
		if (typeof obj[prop] === 'function' && !omit.includes(prop)) result[prop] = handle(obj[prop], isOOP)
	});
	else Object.getOwnPropertyNames(obj).forEach(prop => {
		if (typeof obj[prop] === 'function' && pick.includes(prop)) result[prop] = handle(obj[prop], isOOP)
	});
	return result
}

export var fromString = (config) => toFunc(String.prototype, config);
export var fromNumber = (config) => toFunc(Number.prototype, config);
export var fromArray = (config) => toFunc(Array.prototype, config);
export var fromFunction = (config) => toFunc(Function.prototype, config);
export var fromObject = (config) => toFunc(Object.prototype, config);
export var fromBigInt = (config) => toFunc(BigInt.prototype, config);
export var fromRegExp = (config) => toFunc(RegExp.prototype, config);
export var fromDate = (config) => toFunc(Date.prototype, config);
export var fromBoolean = (config) => toFunc(Boolean.prototype, config);