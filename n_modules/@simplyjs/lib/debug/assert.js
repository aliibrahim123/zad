//assertion operations

import { assert } from './assert/helpers.js';
import { ofType, notOfType } from './assert/ofType.js';
import { eq, notEq, deepEq, notDeepEq } from './assert/equal.js';
import { 
	isString, isNotString, isNumber, isNotNumber, isBoolean, notBoolean, isBigint, isNotBigint, isSymbol, isNotSymbol,
	isFunction, isNotFunction, isObject, isNotObject, isArray, isNotArray, isTrue, isFalse, isUndefined, isDefined, isNull,
	isNotNull, isPrimitive, isNotPrimitive, isTruthy, isFalsy, isNill, isNotNill, isDate, isNotDate, isRegExp, isNotRegExp,
	isMap, isNotMap, isSet, isNotSet, isWeakMap, isNotWeakMap, isWeakSet, isNotWeakSet, isPromise, isNotPromise, isError,
	isNotError, isArrayBuffer, isNotArrayBuffer, isTypedArray, isNotTypedArray, isNaN, isNotNaN, isInt, isFloat, isFinite,
	isInfinite, isFrozen, isNotFrozen, isSealed, isNotSealed 
} from './assert/is.js';
import { oneOf, notOneOf, deeplyOneOf, notDeeplyOneOf } from './assert/oneOf.js';
import { have, haveOwn, notHave, notHaveOwn, haveKeys, haveOwnKeys, notHaveKeys, notHaveOwnKeys } from './assert/have.js';
import { ownPropertyDescriptor } from './assert/ownPropertyDescriptor.js';
import { gt, lt, gte, lte, between, notBetween } from './assert/compare.js';
import { startsWith, endsWith, match, notStartsWith, notEndsWith, notMatch } from './assert/string.js';
import { ofLength, notOfLength, includes, notIncludes, isEmpty, isNotEmpty } from './assert/array.js';
import { throws, notThrows } from './assert/throws.js';
import { reject, resolve } from './assert/promise.js';

export {
	assert,
	ofType, notOfType,
	eq, notEq, deepEq, notDeepEq,
	isString, isNotString, isNumber, isNotNumber, isBoolean, notBoolean, isBigint, isNotBigint, isSymbol, isNotSymbol,
	isFunction, isNotFunction, isObject, isNotObject, isArray, isNotArray, isTrue, isFalse, isUndefined, isDefined, isNull,
	isNotNull, isPrimitive, isNotPrimitive, isTruthy, isFalsy, isNill, isNotNill, isDate, isNotDate, isRegExp, isNotRegExp,
	isMap, isNotMap, isSet, isNotSet, isWeakMap, isNotWeakMap, isWeakSet, isNotWeakSet, isPromise, isNotPromise, isError,
	isNotError, isArrayBuffer, isNotArrayBuffer, isTypedArray, isNotTypedArray, isNaN, isNotNaN, isInt, isFloat, isFinite,
	isInfinite, isFrozen, isNotFrozen, isSealed, isNotSealed,
	oneOf, notOneOf, deeplyOneOf, notDeeplyOneOf,
	have, haveOwn, notHave, notHaveOwn,
	haveKeys, haveOwnKeys, notHaveKeys, notHaveOwnKeys,
	ownPropertyDescriptor,
	gt, lt, gte, lte, between, notBetween,
	startsWith, endsWith, match, notStartsWith, notEndsWith, notMatch,
	ofLength, notOfLength, includes, notIncludes, isEmpty, isNotEmpty,
	throws, notThrows,
	reject, resolve
}

export default {
	assert,
	ofType, notOfType,
	eq, notEq, deepEq, notDeepEq,
	isString, isNotString, isNumber, isNotNumber, isBoolean, notBoolean, isBigint, isNotBigint, isSymbol, isNotSymbol,
	isFunction, isNotFunction, isObject, isNotObject, isArray, isNotArray, isTrue, isFalse, isUndefined, isDefined, isNull,
	isNotNull, isPrimitive, isNotPrimitive, isTruthy, isFalsy, isNill, isNotNill, isDate, isNotDate, isRegExp, isNotRegExp,
	isMap, isNotMap, isSet, isNotSet, isWeakMap, isNotWeakMap, isWeakSet, isNotWeakSet, isPromise, isNotPromise, isError,
	isNotError, isArrayBuffer, isNotArrayBuffer, isTypedArray, isNotTypedArray, isNaN, isNotNaN, isInt, isFloat, isFinite,
	isInfinite, isFrozen, isNotFrozen, isSealed, isNotSealed,
	oneOf, notOneOf, deeplyOneOf, notDeeplyOneOf,
	have, haveOwn, notHave, notHaveOwn,
	haveKeys, haveOwnKeys, notHaveKeys, notHaveOwnKeys,
	ownPropertyDescriptor,
	gt, lt, gte, lte, between, notBetween,
	startsWith, endsWith, match, notStartsWith, notEndsWith, notMatch,
	ofLength, notOfLength, includes, notIncludes, isEmpty, isNotEmpty,
	throws, notThrows,
	reject, resolve
}