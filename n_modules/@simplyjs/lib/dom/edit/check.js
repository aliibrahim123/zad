export var checkel = (el, name) => {
	if (!(el instanceof Element)) throw new TypeError(`edit: ${name} of type (${el?.constructor?.name}), expected (Element)`);
}

export var checknode = (node, name) => {
	if (!(node instanceof Node)) throw new TypeError(`edit: ${name} of type (${node?.constructor?.name}), expected (Node)`);
}

export var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`edit: ${name} of type (${str?.constructor?.name}), expected (String)`);
}

export var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`edit: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
}

export var checkarr = (arr, name) => {
	if (!Array.isArray(arr)) throw new TypeError(`edit: ${name} of type (${arr?.constructor?.name}), expected (Array)`)
}