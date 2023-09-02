//assert if is

import { assert } from './helpers.js';
import { ofType, notOfType } from './ofType.js';
import { eq, notEq } from './equal.js';

export var isString = (value, msg) => ofType('string', value, msg);
export var isNotString = (value, msg) => notOfType('string', value, msg);

export var isNumber = (value, msg) => ofType('number', value, msg);
export var isNotNumber = (value, msg) => notOfType('number', value, msg);

export var isBoolean = (value, msg) => ofType('boolean', value, msg);
export var notBoolean = (value, msg) => notOfType('boolean', value, msg);

export var isBigint = (value, msg) => ofType('bigint', value, msg);
export var isNotBigint = (value, msg) => notOfType('bigint', value, msg);

export var isSymbol = (value, msg) => ofType('symbol', value, msg);
export var isNotSymbol = (value, msg) => notOfType('symbol', value, msg);

export var isFunction = (value, msg) => ofType('function', value, msg);
export var isNotFunction = (value, msg) => notOfType('function', value, msg);

export var isObject = (value, msg) => assert(
	typeof value === 'object' && value !== null,
	msg || `value of type (${value === null ? null : typeof value}), expected (object)`
);
export var isNotObject = (value, msg) => assert(
	typeof value === 'object' && value !== null,
	msg || `value of type (object), expected not (object)`
);

export var isArray = (value, msg) => ofType(Array, value, msg);
export var isNotArray = (value, msg) => notOfType(Array, value, msg);

export var isTrue = (value, msg) => eq(value, true, msg);
export var isFalse = (value, msg) => eq(value, false, msg);

export var isUndefined = (value, msg) => eq(value, undefined, msg);
export var isDefined = (value, msg) => notEq(value, undefined, msg);

export var isNull = (value, msg) => eq(value, null, msg);
export var isNotNull = (value, msg) => notEq(value, null, msg);

export var isPrimitive = (value, msg) => assert(
	value === null || !(typeof value === 'object' || typeof value === 'function'),
	msg || `value of type (${value?.constructor?.name}), expected primitive`
);
export var isNotPrimitive = (value, msg) => assert(
	value !== null && (typeof value === 'object' || typeof value === 'function'),
	msg || `expected (${value}) to not be primitive`
);

export var isTruthy = (value, msg) => assert(
	!!value,
	msg || `expected (${value}) to be truthy`
);
export var isFalsy = (value, msg) => assert(
	!value,
	msg || `expected (${value}) to be truthy`
);

export var isNill = (value, msg) => {
	assert(
		value === null || value === undefined,
		msg || `value of type (${value?.constructor?.name}), expected nill`
	)
}

export var isNotNill = (value, msg) => {
	assert(
		value !== null && value !== undefined,
		msg || `expected (${value}) to not be nill`
	)
}

export var isDate = (value, msg) => ofType(Date, value, msg);
export var isNotDate = (value, msg) => notOfType(Date, value, msg);

export var isRegExp = (value, msg) => ofType(RegExp, value, msg);
export var isNotRegExp = (value, msg) => notOfType(RegExp, value, msg);

export var isMap = (value, msg) => ofType(Map, value, msg);
export var isNotMap = (value, msg) => notOfType(Map, value, msg);

export var isSet = (value, msg) => ofType(Set, value, msg);
export var isNotSet = (value, msg) => notOfType(Set, value, msg);

export var isWeakMap = (value, msg) => ofType(WeakMap, value, msg);
export var isNotWeakMap = (value, msg) => notOfType(WeakMap, value, msg);

export var isWeakSet = (value, msg) => ofType(WeakSet, value, msg);
export var isNotWeakSet = (value, msg) => notOfType(WeakSet, value, msg);

export var isPromise = (value, msg) => ofType(Promise, value, msg);
export var isNotPromise = (value, msg) => notOfType(Promise, value, msg);

export var isError = (value, msg) => ofType(Error, value, msg);
export var isNotError = (value, msg) => notOfType(Error, value, msg);

export var isArrayBuffer = (value, msg) => ofType(ArrayBuffer, value, msg);
export var isNotArrayBuffer = (value, msg) => notOfType(ArrayBuffer, value, msg);

export var isTypedArray = (value, msg) => ofType(TypedArray, value, msg);
export var isNotTypedArray = (value, msg) => notOfType(TypedArray, value, msg);

export var isNaN = (value, msg) => eq(value, NaN, msg);
export var isNotNaN = (value, msg) => notEq(value, NaN, msg);

export var isInt = (value, msg) => assert(
	Number.isInteger(value),
	msg || `expected (${value}) to be integer`
);
export var isFloat = (value, msg) => assert(
	!Number.isInteger(value),
	msg || `expected (${value}) to be float`
);

export var isFinite = (value, msg) => assert (
	Number.isFinite(value),
	msg || `expected (${value}) to be finite`
);

export var isInfinite = (value, msg) => assert (
	!Number.isFinite(value),
	msg || `expected (${value}) to be infinite`
);

export var isFrozen = (value, msg) => assert(
	Object.isFrozen(value),
	msg || `expected (${value}) to be frozen`
);
export var isNotFrozen = (value, msg) => assert(
	!Object.isFrozen(value),
	msg || `expected (${value}) to not be frozen`
);

export var isSealed = (value, msg) => assert(
	Object.isSealed(value),
	msg || `expected (${value}) to be sealed`
);
export var isNotSealed = (value, msg) => assert(
	!Object.isSealed(value),
	msg || `expected (${value}) to not be sealed`
);