export var checkfn = (fn, name = 'fn') => {
	if (typeof fn !== 'function') throw new TypeError(`fn: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkpInt = (nb, type, allowZero = false) => {
	if (typeof nb !== 'number') throw new TypeError(`fn: ${type} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= (allowZero ? -1 : 0)) throw new TypeError(`fn: ${type} is (${nb}), expected positive integer`);
};
