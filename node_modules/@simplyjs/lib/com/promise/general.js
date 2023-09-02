//promise general utility

import { checkfn, checkpromise, checkpInt } from './check.js';

export var catchOfType = (promise, errorType, fn) => {
	checkpromise(promise);
	checkfn(fn, 'catcher');
	return promise.catch((error) => error instanceof errorType && fn(error))
};

export var tap = (promise, fn) => {
	checkpromise(promise);
	checkfn(fn);
	return promise.then((value) => {fn(value); return value})
};

export var delay = (handler, delay) => {
	checkfn(handler);
	checkpInt(delay, 'delay');
	return new Promise((resolve, reject) => setTimeout(() => handler(resolve, reject), delay))
};