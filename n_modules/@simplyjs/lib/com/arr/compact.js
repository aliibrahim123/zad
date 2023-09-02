//filter false values

import { checkarr } from './check.js';

export var compact = (arr) => {
	checkarr(arr);
	return arr.filter(i=>i)
}