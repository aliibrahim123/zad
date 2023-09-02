//create array by taking elements

import { checkarr, checkfn, checkpInt } from './check.js';

export var take = (arr, n = 1) => {
	checkarr(arr);
	checkpInt(n, 'count');
	return arr.slice(0, n) 
};

export var takeRight = (arr, n = 1) => {
	checkarr(arr);
	checkpInt(n, 'count');
	return arr.slice(Math.max(0, arr.length - n), arr.length)
};

export var takeUntil = (arr, predicate, keepHit = true) => {
	checkarr(arr);
	checkfn(predicate, 'predicate');
	var ind = arr.findIndex(predicate);
	return arr.slice(0, ind + (keepHit ? 1 : 0))
};

export var takeRightUntil = (arr, predicate, keepHit = true) => {
	checkarr(arr);
	checkfn(predicate, 'predicate');
	var ind = arr.findLastIndex(predicate);
	return arr.slice(ind + (keepHit ? 0 : 1))
};