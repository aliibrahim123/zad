//assert if equal

import { assert, deepEqHandler } from './helpers.js';

export var eq = (a, b, msg) => assert(
	Object.is(a, b),
	msg || `expected (${a}) to be equal to (${b})`
);

export var notEq = (a, b, msg) => assert(
	!Object.is(a, b),
	msg || `expected value to not be equal to (${b})`
);

export var deepEq = (a, b, strict = false) => deepEqHandler(a, b, strict);

export var notDeepEq = (a, b, strict = false, msg) => assert(
	!deepEqHandler(a, b, strict, false),
	msg || `expected (${a}) to not be ${strict ? 'strictly ' : ''}deeply equal to (${b})`
);