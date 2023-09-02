export var checkarr = (arr, name) => {
	if (!Array.isArray(arr)) throw new TypeError(`cli: ${name} of type (${arr?.constructor?.name}), expected (Array)`);
};

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`cli: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkstr = (str, name = 'str') => {
	if (typeof str !== 'string') throw new TypeError(`cli: ${name} of type (${str?.constructor?.name}), expected (String)`);
};

export var throwNotStrOrArr = (data, name) => {
	throw new TypeError(`cli: ${name} of type (${data?.constructor?.name}), expected (String) or (Array)`);
};

export var checkcommand = (command) => {
	//uses constructor.name since can not import dependent (command.js)
	if (command?.constructor?.name !== 'Command') throw new TypeError(`cli: command of type (${command?.constructor?.name}), expected (Command)`);
};

export var checkpInt = (nb, name, allowZero = false) => {
	if (typeof nb !== 'number') throw new TypeError(`cli: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb < (allowZero ? 0 : 1)) throw new TypeError(`cli: ${name} is (${nb}), expected positive integer`);
};

export var checkbyte = (byte, name, include256 = false) => {
	if (typeof byte !== 'number') throw new TypeError(`cli: ${name} of type (${byte?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(byte) || byte < 0 || byte > (include256 ? 256 : 255)) throw new TypeError(`cli: ${name} is (${byte}), expected unsigned byte`);
};

export var checknb = (nb, name) => {
	if (typeof nb !== 'number') throw new TypeError(`cli: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
};
