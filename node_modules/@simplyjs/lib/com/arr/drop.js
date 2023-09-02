//create array by dropping elements

import { checkarr, checkfn, checkpInt } from './check.js';

export var drop = (arr, n = 1) => {
	checkpInt(n, 'count');
	checkarr(arr);
	return arr.slice(n) 
};

export var dropRight = (arr, n = 1) => {
	checkpInt(n, 'count');
	checkarr(arr);
	return arr.slice(0, Math.max(0, arr.length - n)) 
};

export var dropUntil = (arr, predicate, keepHit = true) => {
	checkarr(arr);
	checkfn(predicate, 'predicate');
	var ind = arr.findIndex(predicate);
	return arr.slice(ind + (keepHit ? 0 : 1))
};

export var dropRightUntil = (arr, predicate, keepHit = true) => {
	checkarr(arr);
	checkfn(predicate, 'predicate');
	var ind = arr.findLastIndex(predicate);
	return arr.slice(0, ind + (keepHit ? 1 : 0))
};