//promise creation

import { checkfn } from './check.js';

export var extracted = () => {
	var resolve, reject, promise = new Promise((rs, rj) => {
		resolve = rs;
		reject = rj
	});
	return { promise, resolve, reject }
};

export var cancelable = (handler) => {
	checkhandler(handler);
	var cancelled = false, promise = new Promise((resolve, reject) => {
		handler(
			(value) => cancelled || resolve(value), 
			(value) => cancelled || reject(value), 
		)
	});
	return {
		promise,
		cancel: () => cancelled = true
	}
};

export var promisify = (fn) => {
	checkfn(fn, 'fn');
	return (...args) => new Promise((resolve, reject) => {
		fn(...args, (error, result) => {
			error ? reject(error) : resolve(result)
		})
	})
};