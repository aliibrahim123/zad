//insert values at index

import { checkarr, checkpInt } from './check.js';

export var insert = (arr, ind, ...values) => {
	checkarr(arr);
	checkpInt(ind, 'index', true);
	arr.splice(ind, 0, ...values);
	return arr
}

export var insertNew = (arr, ind, ...values) => {
	checkarr(arr);
	checkpInt(ind, 'index', true);
	var narr = Array.from(arr);
	narr.splice(ind, 0, ...values);
	return narr
}