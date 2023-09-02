//create array

import { checkarr, checkfn, checkpInt } from './check.js';

export var fromRange = (start, end, step = 1) => {
	var result = [];
	if (start < end) for (let i = start; i < end; i += step) {
		result.push(i)
	}
	if (start > end) for (let i = start; i > end; i += step) {
		result.push(i)
	}
	return result
}

export var fromIndexes = (arr, inds) => {
	checkarr(arr);
	checkarr(inds, 'indices');
	return inds.map(i=> arr[i])
}

export var ofLength = (nb, mapper) => {
	checkpInt(nb, 'length');
	if (mapper) checkfn(mapper, 'mapper');
	var arr = [];
	if (mapper) for (let i = 0; i < nb; i++) {
		arr.push(mapper(i))
	}
	else for (let i = 0; i < nb; i++) {
		arr.push(undefined)
	}
	return arr
}