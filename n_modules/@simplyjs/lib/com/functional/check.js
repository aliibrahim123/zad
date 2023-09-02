export var checkfn = (fn, name = 'fn') => {
	if (typeof fn !== 'function') throw new TypeError(`functional: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkpInt = (nb, type) => {
	if (typeof nb !== 'number') throw new TypeError(`functional: ${type} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= 0) throw new TypeError(`functional: ${type} is (${nb}), expected positive integer`);
};
