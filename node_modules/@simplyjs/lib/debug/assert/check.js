export var checkstr = (str, name = 'str') => {
	if (typeof str !== 'string') throw new TypeError(`assert: ${name} of type (${str?.constructor?.name}), expected (String)`);
}

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`assert: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
}

export var checkpInt = (nb, name, allowZero = true) => {
	if (typeof nb !== 'number') throw new TypeError(`assert: ${name} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= (allowZero ? -1 : 0)) throw new TypeError(`assert: ${name} is (${nb}), expected positive integer`);
}

export var throwNotStrOrFun = (val, name) => {
	throw new TypeError(`assert: ${name} of type (${val?.constructor?.name}), expected (String) or (Function)`)
}

export var checkstrOrReg = (val, name) => {
	if (typeof val !== 'string' && !(val instanceof RegExp)) 
		throw new TypeError(`assert: ${name} of type (${val?.constructor?.name}), expected (String) or (RegExp)`)
}