export var checkstr = (str, name = 'str') => {
	if (typeof str !== 'string') throw new TypeError(`str: ${name} of type (${str?.constructor?.name}), expected (String)`);
	return true;
};

export var checkpInt = (nb, name, allowZero = true) => {
	if (typeof nb !== 'number') throw new TypeError(`str: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= (allowZero ? -1 : 0)) throw new TypeError(`str: ${name} is (${nb}), expected positive integer`);
};

export var checkint = (nb, name) => {
	if (typeof nb !== 'number') throw new TypeError(`str: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb)) throw new TypeError(`str: ${name} is (${nb}), expected integer`);
};

export var checkfn = (fn, name = 'fn') => {
	if (typeof fn !== 'function') throw new TypeError(`str: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkstrReg = (val, name) => {
	if (typeof val !== 'string' && !(val instanceof RegExp)) 
		throw new TypeError(`str: ${name} of type (${val?.constructor?.name}), expected (String) or (RegExp)`);
};
