//flat

import { checkarr, checkpInt } from './check.js';

export var flatDeep = (arr) => {
	checkarr(arr);
	var flatted = [];
	handle(arr, flatted, -1);
	return flatted
};

export var flatDepth = (arr, depth) => {
	checkpInt(depth, 'depth');
	checkarr(arr);
	var flatted = [];
	handle(arr, flatted, depth);
	return flatted
};

var handle = (arr, flatted, depth) => { //-1 for infinite depth
	if (depth === 0) return flatted.push(arr)
	arr.forEach(i => Array.isArray(i) ? handle(i, flatted, depth - 1) : flatted.push(i)) 
} 