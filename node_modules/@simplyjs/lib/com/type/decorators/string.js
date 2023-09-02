//string decorators

export var startsWith = (str) => (value, name, doThrow) => {
	var result = value.startsWith(str);
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected to start with (${str})`);
	return result
}

export var endsWith = (str) => (value, name, doThrow) => {
	var result = value.endsWith(str);
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected to end with (${str})`);
	return result
}

export var contains = (str) => (value, name, doThrow) => {
	var result = value.includes(str);
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected to contains (${str})`);
	return result
}

export var match = (str) => (value, name, doThrow) => {
	var result = !!value.match(str);
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected to match (${str})`);
	return result
}