//stream timing operations

import { checkfn, checkInt } from '../check.js';
import { drop } from './filter.js';

export var debounce = (delay) => {
	checkInt(delay, 'stream op (debounce)', 'delay');
	var timerId, resolve, curPromise;
	return (value) => {
		clearTimeout(timerId);
		if (resolve) resolve(drop);
		curPromise = new Promise(r => resolve = r);
		timerId = setTimeout(() => resolve(value), delay);
		return curPromise
	}
}

export var throttle = (delay) => {
	checkInt(delay, 'stream op (throttle)', 'delay');
	var timerId, lastTime = 0, resolve, curPromise;
	return (value) => {
		var curTime = Date.now();
		if (curTime - lastTime >= delay) {
			lastTime = curTime;
			return value;
		}
		clearTimeout(timerId);
		if (resolve) resolve(drop);
		curPromise = new Promise(r => resolve = r);
		timerId = setTimeout(() => {
			lastTime = curTime;
			resolve(value)
		}, delay - (curTime - lastTime));
		return curPromise
	}
}

export var delay = (delay) => {
	checkInt(delay, 'stream op (delay)', 'delay');
	return (value) => {
		var resolve, promise = new Promise(r => resolve = r);
		setTimeout(() => resolve(value), delay);
		return promise
	}
};

export var delayWhen = (cond, delay) => {
	checkfn(cond, 'stream op (delayWhen)', 'cond')
	checkInt(delay, 'stream op (delayWhen)', 'delay');
	return (value, stream) => {
		if (!cond(value, stream)) return value;
		var resolve, promise = new Promise(r => resolve = r);
		setTimeout(() => resolve(value), delay);
		return promise
	}
};