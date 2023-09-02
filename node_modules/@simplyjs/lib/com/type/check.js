export var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`type: ${name} of type (${str?.constructor?.name}), expected (String)`)
};

export var checkfn = (fn, name = 'fn') => {
	if (typeof fn !== 'function') throw new TypeError(`type: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkarr = (arr, name = 'array') => {
	if (!Array.isArray(arr)) throw new TypeError(`type: ${name} of type (${arr?.constructor?.name}), expected (Array)`)
};

export var checkChecker = (obj, name = 'type checker') => {
	if (obj?.$isTypeChecker !== true) throw new TypeError(`type: ${name} of type (${obj?.constructor?.name}), expected (TypeChecker)`)
}