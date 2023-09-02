//check fn and throw

export default function (fn, name) {
	if (typeof fn !== 'function') throw new TypeError(`obj: ${name} of type (${fn?.constructor?.name}), expected (Function)'`)
}