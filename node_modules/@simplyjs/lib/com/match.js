//pattern matching

import { 
	isOfType, isInstanceOf, isStringP, isString, isNumberP, isNumber, isBooleanP, isBoolean, isBigIntP, isBigInt, isSymbol, 
	isPrimitive, isNull, isUndefined, isNill, isDefined, isTruthy, isFalsy, isTrue, isFalse, isObject, isPlainObject, isArray,
	isArrayLike, isSafeArrayLike, isArrayBuffer, isDataView, isBlob, isDate, isRegExp, isInteger, isNaN, isFinite,
	isSafeInteger, isFunction, isPromise, isConstructor, isError, isMap, isSet, isWeakMap, isWeakSet, isEmpty, isInt8, isInt16,
	isInt32, isUint8, isUint16, isUint32, isNative 
} from './is.js';

import { match, handle, check, otherwise } from './match/base.js';
import { is, isStrictly, isLosely, isNotStrictly, isNotLosely, has, hasOwn, callAndCheck } from './match/coreHelpers.js';
import { gt, lt, gte, lte, inRange } from './match/number.js';
import { ofLength, includes, firstOf, lastOf, every, some } from './match/array.js';
import { startsWith, endsWith, matchString } from './match/string.js';
import { not, allOff, anyOff } from './match/combinators.js';

export default {
	match, handle, check, otherwise,
	is, isStrictly, isLosely, isNotStrictly, isNotLosely, has, hasOwn, callAndCheck,
	not, allOff, anyOff,
	gt, lt, gte, lte, inRange,
	ofLength, includes, firstOf, lastOf, every, some,
	startsWith, endsWith, matchString,
	isOfType, isInstanceOf, isStringP, isString, isNumberP, isNumber, isBooleanP, isBoolean, isBigIntP, isBigInt, isSymbol, 
	isPrimitive, isNull, isUndefined, isNill, isDefined, isTruthy, isFalsy, isTrue, isFalse, isObject, isPlainObject, isArray,
	isArrayLike, isSafeArrayLike, isArrayBuffer, isDataView, isBlob, isDate, isRegExp, isInteger, isNaN, isFinite,
	isSafeInteger, isFunction, isPromise, isConstructor, isError, isMap, isSet, isWeakMap, isWeakSet, isEmpty, isInt8, isInt16,
	isInt32, isUint8, isUint16, isUint32, isNative 
};

export {
	match, handle, check, otherwise,
	is, isStrictly, isLosely, isNotStrictly, isNotLosely, has, hasOwn, callAndCheck,
	not, allOff, anyOff,
	gt, lt, gte, lte, inRange,
	startsWith, endsWith, matchString,
	ofLength, includes, firstOf, lastOf, every, some,
	isOfType, isInstanceOf, isStringP, isString, isNumberP, isNumber, isBooleanP, isBoolean, isBigIntP, isBigInt, isSymbol, 
	isPrimitive, isNull, isUndefined, isNill, isDefined, isTruthy, isFalsy, isTrue, isFalse, isObject, isPlainObject, isArray,
	isArrayLike, isSafeArrayLike, isArrayBuffer, isDataView, isBlob, isDate, isRegExp, isInteger, isNaN, isFinite,
	isSafeInteger, isFunction, isPromise, isConstructor, isError, isMap, isSet, isWeakMap, isWeakSet, isEmpty, isInt8, isInt16,
	isInt32, isUint8, isUint16, isUint32, isNative 
}