//timing operations

import { checkfn, checkpInt } from './check.js';

export var delay = (fn, delay) => {
	checkfn(fn);
	checkpInt(delay, 'delay');
	return (...args) => setTimeout(fn, delay, ...args)
};

export var debounce = (fn, delay) => {
	checkfn(fn);
	checkpInt(delay, 'delay');
	var timerId = 0;
	return (...args) => {
		clearTimeout(timerId);
		timerId = setTimeout(fn, delay, ...args)
	}
}

export var throttle= (fn, delay) => {
	checkfn(fn);
	checkpInt(delay, 'delay');
	var timerId = 0, lastTime = 0;
	return (...args) => {
		var curTime = Date.now();
		if (curTime - lastTime >= delay) {
			lastTime = curTime;
			fn(...args)
			return;
		}
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			lastTime = curTime;
			fn(...args)
		}, delay - (curTime - lastTime));
	}
}

export var defer = (fn) => {
	checkfn(fn);
	setTimeout(fn, 0)
}