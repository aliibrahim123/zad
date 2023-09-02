//grouping array

import { checkarr, checkfn } from './check.js';

export var keyBy = (arr, grouper) => {
	checkarr(arr);
	checkfn(grouper, 'grouper');
	var result = {};
	arr.forEach((item, i, arr) => result[grouper(item, i, arr)] = item);
	return result
}

export var countBy = (arr, grouper) => {
	checkarr(arr);
	checkfn(grouper, 'grouper');
	var result = {};
	arr.forEach((item, i, arr) => {
		var key = grouper(item, i, arr);
		result[key] ? result[key]++ : result[key] = 1
	});
	return result
}

export var groupBy = (arr, grouper) => {
	checkarr(arr);
	checkfn(grouper, 'grouper');
	var result = {};
	arr.forEach((item, i, arr) => {
		var key = grouper(item, i, arr);
		result[key] ? result[key].push(item) : result[key] = [item]
	});
	return result
}