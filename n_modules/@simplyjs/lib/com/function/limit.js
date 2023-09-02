//limit calling

import { checkfn, checkpInt } from './check.js';

export var after = (fn, nb) => {
	checkfn(fn);
	checkpInt(nb, 'count');
	var i = nb;
	return function (...args) {
		if (i === 0) return fn.apply(this, args);
		i--;
	}
}

export var limit = (fn, nb) => {
	checkfn(fn);
	checkpInt(nb, 'count');
	var i = nb, last;
	return function (...args) {
		if (i === 0) return last;
		i--;
		return last = fn.apply(this, args)
	}
}

export var once = (fn) => limit(fn, 1)