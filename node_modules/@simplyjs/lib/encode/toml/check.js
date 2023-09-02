export var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`toml: ${name} of type (${str?.constructor?.name}), expected (String)`);
}

export var checkobj = (obj, name) => {
	if (typeof obj !== 'object' || obj === null || obj instanceof Date || Array.isArray(obj)) 
		throw new TypeError(`toml: ${name} of type (${obj?.constructor?.name}), expected (object)`);
}