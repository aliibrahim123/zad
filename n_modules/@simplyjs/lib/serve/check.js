import { ServerError } from './base/error.js'

export var checkarr = (arr, name) => {
	if (!Array.isArray(arr)) throw new ServerError(`serve: ${name} of type (${arr?.constructor?.name}), expected (Array)`);
};

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new ServerError(`serve: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkstr = (str, name = 'str') => {
	if (typeof str !== 'string') throw new ServerError(`serve: ${name} of type (${str?.constructor?.name}), expected (String)`);
};

export var checkpInt = (nb, name, allowZero = false) => {
	if (typeof nb !== 'number') throw new ServerError(`serve: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb < (allowZero ? 0 : 1)) throw new ServerError(`serve: ${name} is (${nb}), expected positive integer`);
};