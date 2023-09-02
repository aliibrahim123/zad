//array utility

import { head, last, tail, initial } from './arr/get.js';
import { drop, dropRight, dropUntil, dropRightUntil } from './arr/drop.js';
import { take, takeRight, takeUntil, takeRightUntil } from './arr/take.js';
import { chunk, pairs } from './arr/chunk.js';
import { everyNth, odd, even } from './arr/nth.js';
import { compact } from './arr/compact.js';
import { uniq } from './arr/uniq.js';
import { insert, insertNew } from './arr/insert.js';
import { fromRange, fromIndexes, ofLength } from './arr/create.js';
import { flatDeep, flatDepth } from './arr/flat.js';
import { sample, shuffle } from './arr/random.js';
import { keyBy, countBy, groupBy } from './arr/grouping.js';
import { without } from './arr/without.js';
import { zip, unzip } from './arr/zip.js';

var dontInclude = ['fromRange', 'fromIndexes', 'ofLength'];
var extendNative = () => {
	var handle = (fn) => function (...args) { return fn(this, ...args) };
	for (let prop in $arr) {
		if (!dontInclude.includes(prop)) Object.defineProperty(Array.prototype, '$' + prop, {
			value: handle($arr[prop]),
			enumerable: false
		})
	}
}

var $arr = {
	head, last, tail, initial, 
	drop, dropRight, dropUntil, dropRightUntil, 
	take, takeRight, takeUntil, takeRightUntil, 
	chunk, pairs,
	compact, 
	insert, insertNew,
	fromRange, fromIndexes, ofLength,
	everyNth, odd, even,
	uniq,
	flatDeep, flatDepth,
	sample, shuffle,
	keyBy, countBy, groupBy,
	without,
	zip, unzip,
	extendNative
}

export {
	head, last, tail, initial, 
	drop, dropRight, dropUntil, dropRightUntil, 
	take, takeRight, takeUntil, takeRightUntil, 
	chunk, pairs,
	compact, 
	insert, insertNew,
	fromRange, fromIndexes, ofLength,
	everyNth, odd, even,
	uniq,
	flatDeep, flatDepth,
	sample, shuffle,
	keyBy, countBy, groupBy,
	without,
	zip, unzip,
	extendNative
};

export default $arr;