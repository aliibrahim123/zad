//functional utility

import { 
	TypeOf, Instanceof, In, New, eq, eqs, neq, neqs, gt, lt, gte, lte, add, sub, mult, div, exp, mod, inc, dec, neg, lshift, rshift, urshift,
	not, and, or, xor, lnot, land, lor, nullCoal
} from './functional/langOps.js';
import { tap, identity, constant, defaultTo, noop } from './functional/misc.js';
import { pluck, pluckDeep, propertyOf, callMethod, callMethodSafe, callMethodOf, callMethodOfSafe } from './functional/pathOps.js';
import { attempt, times, until, when, unless, ifElese, tryCatch } from './functional/controlFlow.js';
import { toFunc, fromString, fromNumber, fromArray, fromObject, fromFunction, fromBigInt, fromRegExp, fromDate, fromBoolean } from './functional/toFunc.js';

export {
	TypeOf, Instanceof, In, New, eq, eqs, neq, neqs, gt, lt, gte, lte, add, sub, mult, div, exp, mod, inc, dec, neg, lshift, rshift, urshift,
	not, and, or, xor, lnot, land, lor, nullCoal,
	tap, identity, constant, defaultTo, noop,
	pluck, pluckDeep, propertyOf, callMethod, callMethodSafe, callMethodOf, callMethodOfSafe,
	attempt, times, until, when, unless, ifElese, tryCatch,
	toFunc, fromString, fromNumber, fromArray, fromObject, fromFunction, fromBigInt, fromRegExp, fromDate, fromBoolean
};

export default {
	TypeOf, Instanceof, In, New, eq, eqs, neq, neqs, gt, lt, gte, lte, add, sub, mult, div, exp, mod, inc, dec, neg, lshift, rshift, urshift,
	not, and, or, xor, lnot, land, lor, nullCoal,
	tap, identity, constant, defaultTo, noop,
	pluck, pluckDeep, propertyOf, callMethod, callMethodSafe, callMethodOf, callMethodOfSafe,
	attempt, times, until, when, unless, ifElese, tryCatch,
	toFunc, fromString, fromNumber, fromArray, fromObject, fromFunction, fromBigInt, fromRegExp, fromDate, fromBoolean
}