//array zipping

import { checkarr } from './check.js';

var check = (arrs) => {
	if (!Array.isArray(arrs)) throw new TypeError('arr: arrays of type (' + arrs?.constructor?.name + '), expected (Array)');
	arrs.forEach((arr, i) => {if (!Array.isArray(arr)) throw new TypeError('arr: array at index (' + i + ') of type (' + arr?.constructor?.name + '), expected (Array)')})
}

export var unzip = (arrs) => {
	check(arrs);
	var maxLen = Math.max(...arrs.map(arr => arr.length));
	var result = [];

	for (let i = 0; i < maxLen; i++) {
		result.push(arrs.map(arr => arr[i]));
	}

	return result;
}

export var zip = (...arrs) => {
	return unzip(arrs)
}