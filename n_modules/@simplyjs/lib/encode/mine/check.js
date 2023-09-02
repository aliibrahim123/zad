export var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`mine: ${name} of type (${str?.constructor?.name}), expected (String)`);
}