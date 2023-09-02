//memoize

import { checkfn } from './check.js';

export var memoize = (fn, resolver = args => args[0]) => {
	checkfn(fn);
	checkfn(resolver, 'resolver');
	
	var cache = new Map();
	var handler = function (...args) {
		var key = resolver(args);
		if (cache.has(key)) return cache.get(key);
		var result = fn.apply(this, args);
		cache.set(key, result);
		return result
	}
	handler.cache = cache;
	return handler
}