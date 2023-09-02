//promise array functions

import { checkfn } from './check.js';

var checkarr = (arr) => {
	if (!Array.isArray(arr)) throw new TypeError('promise: array of type (' + arr?.constructor?.name + '), expected (Array)');
};

export var each = (array, handler) => {
	checkfn(handler);
	checkarr(array);
	return array.reduce((promise, value, ind) =>
		promise.then(() => new Promise((resolve, reject) =>
			handler(value, resolve, reject, ind, array)
		)), Promise.resolve()
	)
}

export var map = (array, handler) => {
	checkfn(handler);
	checkarr(array);
	return Promise.all(array.map((i, ind) => new Promise((resolve, reject) => handler(i, resolve, reject, ind, array))))
};

export var mapSeries = (array, handler) => {
	checkfn(handler);
	checkarr(array);
	return array.reduce((promise, value, ind) => 
		promise.then((result) => new Promise((resolve, reject) => 
			handler(value, resolve, reject, ind, array)).then(v => {
				result.push(v);
				return result
			})
		), Promise.resolve([])
	)
};

export var filter = (array, handler) => {
	checkfn(handler);
	checkarr(array);
	return Promise.all(array.map((i, ind) => new Promise((resolve, reject) => handler(i, resolve, reject, ind, array))))
	  .then(arr => array.filter((v,i) => arr[i]))
};

export var reduce = (array, handler, init) => {
	checkfn(handler);
	checkarr(array);
	return array.reduce((promise, value, ind) =>
		promise.then((result) => new Promise((resolve, reject) =>
			handler(result, value, resolve, reject, ind, array)
		)), Promise.resolve(init)
	)
};