export var checkarr = (arr, name='array') => {
	if (!Array.isArray(arr)) throw new TypeError(`arr: ${name} of type (${arr?.constructor?.name}), expected (Array)`);
	return true;
};

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`arr: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkpInt = (nb, type, allowZero = false) => {
	if (typeof nb !== 'number') throw new TypeError(`arr: ${type} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= (allowZero ? -1 : 0)) throw new TypeError(`arr: ${type} is (${nb}), expected positive integer`);
};
