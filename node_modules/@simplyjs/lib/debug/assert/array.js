//assert array operations

import { assert } from './helpers.js';
import { checkpInt } from './check.js';
import { ofType } from './ofType.js';

export var includes = (value, ...values) => {
	ofType(Array, value);
	assert(
		values.every(i => value.includes(i)),
		`expected ([${value}]) to include (${values.join(', ')})`
	)
}

export var notIncludes = (value, ...values) => {
	ofType(Array, value);
	assert(
		!values.some(i => value.includes(i)),
		`expected ([${value}]) not to include (${values.join(', ')})`
	)
}

export var ofLength = (length, value, msg) => {
	checkpInt(length, 'length');
	assert(
		value?.length === length,
		msg || `(${value}) of length (${value?.length}), expected (${length})`
	);
}

export var notOfLength = (length, value, msg) => {
	checkpInt(length, 'length');
	assert(
		value?.length !== length,
		msg || `(${value}) of length (${value?.length}), expected not (${length})`
	);
}

export var isEmpty = (value, msg) => ofLength(0, value, msg);
export var isNotEmpty = (value, msg) => notOfLength(0, value, msg);