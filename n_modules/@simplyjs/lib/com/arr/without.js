//return array filtered from values

import { checkarr } from './check.js';

var check = (v, isSet) => {
		if (!(Array.isArray(v) || isSet)) throw new TypeError('arr: values of type (' + v?.constructor?.name + '), epected (Array) or (Set)');
}

export var without = (arr, values) => {
	checkarr(arr);
	var isSet = values instanceof Set;
	check(values, isSet);
	if (isSet) return arr.filter(v => !values.has(v));
	else return arr.filter(v => !values.includes(v));
}