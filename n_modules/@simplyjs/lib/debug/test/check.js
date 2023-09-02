export var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`test: ${name} of type (${str?.constructor?.name}), expected (String)`);
}

export var checkarr = (arr, name) => {
	if (!Array.isArray(arr)) throw new TypeError(`test: ${name} of type (${arr?.constructor?.name}), expected (Array)`);
}

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`test: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
}

export var checkpInt = (nb, name) => {
	if (typeof nb !== 'number') throw new TypeError(`test: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= (0)) throw new TypeError(`test: ${name} is (${nb}), expected positive integer`);
};