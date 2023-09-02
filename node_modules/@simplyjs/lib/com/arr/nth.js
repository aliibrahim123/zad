//array of every nth item of array

import { checkarr, checkpInt } from './check.js';

export var everyNth = (arr, nb, from = 0) => {
	checkpInt(nb, 'nth');
	checkpInt(from, 'from');
	checkarr(arr);
	
	var result = [];
	for (let i = from; i < arr.length; i += nb) {
		result.push(arr[i])
	}
	return result
};

export var odd = (arr) => everyNth(arr, 2, 1);
export var even = (arr) => everyNth(arr, 2, 0);