//match handler

export var check = (v, p) => {
	if (p === undefined) return (x) => check(x, v);
	if (typeof p === 'function') return p(v);
	if (Array.isArray(p)) return Array.isArray(v) && p.every((i, ind) => check(i, v[ind]));
	if (typeof p === 'object' && p !== null) {
		if (p instanceof RegExp) return typeof v === 'string' && p.test(v);
		if (typeof v !== 'object' || v === null) return false;
		if (p instanceof Date) return v instanceof Date && Number(v) === Number(p);
		for (let prop in p) {
			if (!check(p[prop], v[prop])) return false
		}
		return true
	}
	return Object.is(p, v)
}

export var handle = (value, predicates, Default) => {
	if (!Array.isArray(predicates)) throw new TypeError(`match: predicates of type (${predicates?.constructor?.name}), expected (Array)`);
	for (let i = 0; i < predicates.length; i++) {
		let predicate = predicates[i];
		if (!Array.isArray(predicate)) throw new TypeError(`match: predicate at index (${i}) of type (${predicate?.constructor?.name}), expected (Array)`);
		if (check(value, predicate[0])) return typeof predicate[1] === 'function' ? predicate[1](value) : predicate[1]
	}
	return typeof Default === 'function' ? Default(value) : Default
}

export var match = (value) => (...args) => handle(value, args.slice(0, -1), args[args.length -1]);

export var when = (pattern, value) => [pattern, value];

export var otherwise = (value) => value;