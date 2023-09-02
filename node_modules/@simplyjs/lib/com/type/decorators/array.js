//array decorators

export var ofLength = (len) => (value, name, doThrow) => {
	var length = value.length === undefined ? value.size : value.length;
	var result = length === len;
	if (!result && doThrow) throw new TypeError(`${name} of length (${length}), expected be (${len})`);
	return result
}

export var ofLengthBelow = (len) => (value, name, doThrow) => {
	var length = value.length === undefined ? value.size : value.length;
	var result = length < len;
	if (!result && doThrow) throw new TypeError(`${name} of length (${length}), expected to be below (${len})`);
	return result
}

export var ofLengthAbove = (len) => (value, name, doThrow) => {
	var length = value.length === undefined ? value.size : value.length;
	var result = length > len;
	if (!result && doThrow) throw new TypeError(`${name} of length (${length}), expected to be above (${len})`);
	return result
}

export var empty = (value, name, doThrow) => {
	var length = value.length === undefined ? value.size : value.length;
	var result = length === 0;
	if (!result && doThrow) throw new TypeError(`${name} of length (${length}), expected to be empty`);
	return result
}

export var nonempty = (value, name, doThrow) => {
	var length = value.length === undefined ? value.size : value.length;
	var result = length !== 0;
	if (!result && doThrow) throw new TypeError(`${name} of length (${length}), expected to be nonempty`);
	return result
}

export var includes = (...items) => (value, name, doThrow) => {
	var result = items.every(item => value.includes(item));
	if (!result && doThrow) throw new TypeError(`expected ${name} to includes (${items.join(', ')})`);
	return result
}