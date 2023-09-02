//stream utility operations

import { checkfn } from '../check.js';

export var tap = (fn) => {
	checkfn(fn, 'stream op (tap)');
	return (value) => {
		fn(value);
		return value
	}
}

export var log = (value) => {
	console.log(value);
	return result
}

