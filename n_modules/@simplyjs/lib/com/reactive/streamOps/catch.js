//stream catching operation

import { checkfn } from '../check.js';
import { drop } from './filter.js';

export var catchError = (fn) => {
	checkfn(fn, 'stream op (catchError)');
	var toreturn = (value, stream) => value instanceof Error ? fn(value, stream) : value;
	toreturn.$isCatcher = true;
	return toreturn
}

export var dropError = (value) => value instanceof Error ? drop : value;
dropError.$isCatcher = true;