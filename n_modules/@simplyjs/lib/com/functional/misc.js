//general utility

import { checkfn } from './check.js';

export var tap = (fn) => {
	checkfn(fn);
	return function (...args) {
		fn.apply(this, args);
		return args[0]
	}
}

export var constant = (value) => () => value;

export var identity = (value) => value;

export var defaultTo = (value, Default) => value || Default;

export var noop = () => {};
