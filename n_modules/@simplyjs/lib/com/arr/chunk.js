//chunk

import { checkarr, checkpInt } from './check.js';

export var chunk = (arr, size = 1) => {
	checkpInt(size, 'size');
	checkarr(arr);
	var chunked = [];
	for (let i = 0; i < arr.length; i += size) {
		chunked.push(arr.slice(i, i + size))
	}
	return chunked
}

export var pairs = (arr) => chunk(arr, 2)