//promise collection functions

import { checkfn, checkpInt } from './check.js';

var checkpromises = (promises) => {
	if (!Array.isArray(promises)) throw new TypeError('promise: promises of type (' + promises?.constructor?.name + '), expected (Array)');
	promises.forEach((promise, ind) => {
		if (!(promise instanceof Promise)) throw new TypeError('promise: promise at index (' + ind + ') of type (' + promise?.constructor?.name + '), expected (Array)')
	})
}

export var some = (promises, count) => {
	checkpromises(promises);
	checkpInt(count, 'count');
	if (promises.length < count) throw new TypeError('promise: promises length (' + promises.length + ') less than count (' + count + ')');
	return new Promise((resolve, reject) => {
		var result = [], errors = [];
		var check = () => {
			if (result.length === count) resolve(result);
			if (promises.length - errors.length < count) reject(errors)
		}
		promises.forEach(promise => promise
			.then(value => result.push(value) && check())
			.catch(error => errors.push(error) && check())
		);
	})
};

export var props = (obj) => {
	return new Promise((resolve, reject) => {
		var result = {...obj}, promises = [];
		for (let prop in obj) {
			if (obj[prop] instanceof Promise) promises.push(obj[prop].then(v => result[prop] = v));
		}
		Promise.all(promises).then(() => resolve(result)).catch(reject)
	})
}

export var last = (...promises) => {
	if (Array.isArray(promises[0])) promises = promises[0];
	checkpromises(promises);
	return new Promise((resolve, reject) => {
		var finished = 0;
		promises.forEach(promise => promise
			.then(value => {
				finished++;
				if (finished === promises.length) resolve(value)
			}, error => {
				finished++;
				if (finished === promises.length) reject(error)
			})
		);
	})
}