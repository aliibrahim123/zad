export var checkfn = (fn, type = 'fn') => {
	if (typeof fn !== 'function') throw new TypeError(`timing: ${type} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkpInt = (nb, type) => {
	if (typeof nb !== 'number') throw new TypeError(`timing: ${type} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= 0) throw new TypeError(`timing: ${type} is (${nb}), expected positive integer`);
};
