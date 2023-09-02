//operation envolving randomness

import { checkarr, checkpInt } from './check.js';

export var sample = (arr, size) => {
	checkarr(arr);
	checkpInt(size, 'size');
	var samples = [];
	for (let i = 0; i < size; i++) {
		samples.push(arr[Math.floor(Math.random() * arr.length)])
	}
	return samples
}

export var shuffle = (arr) => {
	checkarr(arr);
	var shuffled = [...arr];
	for (let i = 0; i < arr.length; i++) {
		let n = Math.floor(Math.random() * arr.length);
		let temp = shuffled[i];
		shuffled[i] = shuffled[n];
		shuffled[n] = temp;
	}
	return shuffled
}