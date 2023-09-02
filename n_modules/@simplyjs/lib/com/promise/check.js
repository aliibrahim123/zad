export var checkfn = (fn, type = 'handler') => {
	if (typeof fn !== 'function') throw new TypeError(`promise: ${type} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkpInt = (nb, type) => {
	if (typeof nb !== 'number') throw new TypeError(`promise: ${type} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= 0) throw new TypeError(`promise: ${type} is (${nb}), expected positive integer`);
};

export var checkpromise = (promise) => {
	if (!(promise instanceof Promise)) throw new TypeError(`promise: promise of type (${promise?.constructor?.name}), expected (Promise)`);
};
