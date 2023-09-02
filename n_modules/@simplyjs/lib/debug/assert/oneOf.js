//assert if one of

import { assert, deepEqHandler } from './helpers.js';

export var oneOf = (value, ...values) => assert(
	values.some(val => val === value),
	`expected (${value}) to be one of (${values.join(', ')})`
);

export var notOneOf = (value, ...values) => assert(
	!values.some(val => val === value),
	`expected (${value}) to not be one of (${values.join(', ')})`
);

export var deeplyOneOf = (value, strict = false, ...values) => assert(
	values.some(val => deepEqHandler(value, val, strict, false)),
	`expected (${value}) to be ${strict ? 'strictly ' : ''}deeply one of (${values.join(', ')})`
);

export var notDeeplyOneOf = (value, strict = false, ...values) => assert(
	!values.some(val => deepEqHandler(value, val, strict, false)),
	`expected (${value}) to not be ${strict ? 'strictly ' : ''}deeply one of (${values.join(', ')})`
);