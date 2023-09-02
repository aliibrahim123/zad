//number decorators

export var gt = (nb) => (value, name, doThrow) => {
	var result = value > nb;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected greater than (${nb})`);
	return result
}

export var lt = (nb) => (value, name, doThrow) => {
	var result = value < nb;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected less than (${nb})`);
	return result
}

export var gte = (nb) => (value, name, doThrow) => {
	var result = value >= nb;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected greater than or equal (${nb})`);
	return result
}

export var lte = (nb) => (value, name, doThrow) => {
	var result = value <= nb;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected less than or equal (${nb})`);
	return result
}

export var between = (a, b) => (value, name, doThrow) => {
	var result = value > a && value < b;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected betweeen (${a}) and (${b})`);
	return result
}

export var int = (value, name, doThrow) => {
	var result = Number.isInteger(value);
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected integer`);
	return result
}

export var positive = (value, name, doThrow) => {
	var result = value > 0;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected positive`);
	return result
}

export var negative = (value, name, doThrow) => {
	var result = value < 0;
	if (!result && doThrow) throw new TypeError(`${name} of value (${value}), expected negative`);
	return result
}