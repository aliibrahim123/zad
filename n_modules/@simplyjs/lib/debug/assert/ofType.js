//assert of type

import { assert } from './helpers.js';
import { throwNotStrOrFun } from './check.js';

export var ofType = (type, value, msg) => {
	if (typeof type === 'string') assert(
		typeof value === type, 
		msg || `value of type (${typeof value}), expected (${type})`
	);
		
	else if (typeof type === 'function') assert(
		value instanceof type,
		msg || `value of type (${value?.constructor?.name}), expected (${type.name})`
	);
	
	else throwNotStrOrFun(type, 'type');
}

export var notOfType = (type, value, msg) => {
	if (typeof type === 'string') assert(
		!(typeof value === type), 
		msg || `value of type (${typeof value}), expected not (${type})`
	);
		
	else if (typeof type === 'function') assert(
		!(value instanceof type),
		msg || `value of type (${value?.constructor?.name}), expected not (${type.name})`
	);
	
	else throwNotStrOrFun(type, 'type');
}