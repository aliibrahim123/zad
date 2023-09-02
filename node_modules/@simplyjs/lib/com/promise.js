//promise utility

import { catchOfType, tap, delay } from './promise/general.js';
import { extracted, cancelable, promisify } from './promise/create.js';
import { map, mapSeries, filter, reduce, each } from './promise/array.js';
import { some, props, last } from './promise/collection.js';
import { retry, retryLinearBackoff, retryExponentialBackoff, retryDelayFn } from './promise/retry.js';

var extendNative = () => Object.assign(Promise.prototype, {
	$catchOfType (errorType, fn) { return catchOfType(this, errorType, fn) },
	$tap (fn) { return tap(this, fn) }
})

export default {
	catchOfType, tap, delay,
	extracted, cancelable, promisify,
	map, mapSeries, filter, reduce, each,
	some, props, last,
	retry, retryLinearBackoff, retryExponentialBackoff, retryDelayFn,
	extendNative
}

export {
	catchOfType, tap, delay,
	extracted, cancelable, promisify,
	map, mapSeries, filter, reduce, each,
	some, props, last,
	retry, retryLinearBackoff, retryExponentialBackoff, retryDelayFn,
	extendNative
}