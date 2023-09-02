//assert by compare

import { assert } from './helpers.js';

export var gt = (a, b, msg) => assert(
	a > b,
	msg || `expected (${a}) to be greater than (${b})`
);

export var lt = (a, b, msg) => assert(
	a < b,
	msg || `expected (${a}) to be less than (${b})`
);

export var gte = (a, b, msg) => assert(
	a >= b,
	msg || `expected (${a}) to be greater than or equal (${b})`
);

export var lte = (a, b, msg) => assert(
	a <= b,
	msg || `expected (${a}) to be less than or equal (${b})`
);

export var between = (a, b, nb, msg) => assert(
	nb > a && nb < b,
	msg || `expected (${nb}) to be between (${a}) and (${b})`
);

export var notBetween = (a, b, nb, msg) => assert(
	nb < a || nb > b,
	msg || `expected (${nb}) to not be between (${a}) and (${b})`
);