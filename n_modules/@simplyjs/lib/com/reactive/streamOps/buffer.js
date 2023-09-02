//stream buffer operations

import { checkInt } from '../check.js';
import { drop } from './filter.js';

export var buffer = (size, startEvery = 1) => {
	checkInt(size, 'stream op (buffer)', 'size');
	checkInt(startEvery, 'stream op (buffer)', 'startEvery');
	var curArray = Array.from({length:size}), curInd = startEvery; //dec toward 0
	return (value) => {
		curArray.push(value);
		curArray.shift();
		if (--curInd !== 0) return drop;
		curInd = startEvery;
		return Array.from(curArray)
	}
}

export var bufferTime = (delay, maxSize = 0) => {
	checkInt(delay, 'stream op (bufferTime)', 'delay');
	if (maxSize !== 0) checkInt(maxSize, 'stream op (bufferTime)', 'maxSize');
	var curArray = [], promise, resolve, didRetured = true;
	return (value) => {
		curArray.push(value);
		if (maxSize > 0 && curArray.length > maxSize) curArray.shift();
		if (didRetured) {
			promise = new Promise(r => resolve = r);
			setTimeout(() => {
				didRetured = true;
				var toreturn = curArray;
				curArray = [];
				resolve(toreturn)
			}, delay);
			didRetured = false;
			return promise
		}
		return drop
	}
}