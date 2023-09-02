//promise retry

import { checkfn, checkpInt } from './check.js';

var handle = (handler, limit, delay, cond) => {
	checkfn(handler);
	checkpInt(limit, 'limit');
	var attempted = 0;
	var handle = (value, isrejected, resolve, reject) => {
		attempted++;
		if (!cond(value, isrejected)) resolve(value);
		else if (attempted === limit) reject('max attempts reached');
		else setTimeout(() => handler(
			(value) => handle(value, false, resolve, reject),
			(value) => handle(value, true, resolve, reject)
		), delay(attempted))
	};
	return new Promise((resolve, reject) => handler(
		(value) => handle(value, false, resolve, reject),
		(value) => handle(value, true, resolve, reject)
	))
};

export var retry = (handler, limit, delay = 0, cond = () => true) => {
	checkpInt(delay, 'delay');
	return handle(handler, limit, () => delay, cond)
};

export var retryLinearBackoff = (handler, limit, initDelay, delayMultiplier, cond = () => true) => {
	checkpInt(initDelay, 'initDelay');
	checkpInt(delayMultiplier, 'delayMultiplier');
	return handle(handler, limit, (i) => initDelay + i * delayMultiplier, cond)
};

export var retryExponentialBackoff = (handler, limit, delayMultiplier, cond = () => true) => {
	checkpInt(delayMultiplier, 'delayMultiplier');
	return handle(handler, limit, (i) => (1 << i) * delayMultiplier, cond)//delay = i**2 *multiplier
};

export var retryDelayFn = (handler, limit, delayFn, cond = () => true) => {
	checkfn(delayFn, 'delayFn');
	return handle(handler, limit, delayFn, cond)
}