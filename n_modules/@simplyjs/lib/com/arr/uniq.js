//create duplicate-free array

import { checkarr } from './check.js';

export var uniq = (arr) => {
	checkarr(arr);
	return Array.from(new Set(arr))
}