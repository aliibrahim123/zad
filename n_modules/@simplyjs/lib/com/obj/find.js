//object find operations

export var find = (obj, tofind) => {
	var fn = typeof tofind === 'function' ? tofind : (value) => value === tofind;
	for (let prop in obj) {
		if (fn(obj[prop], prop, obj)) return obj[prop]
	}
};

export var findKey = (obj, tofind) => {
	var fn = typeof tofind === 'function' ? tofind : (value) => value === tofind;
	for (let prop in obj) {
		if (fn(obj[prop], prop, obj)) return prop
	}
};

export var findTyped = (obj, tofind, returnKey = false) => {//without prototype
	var result;
	var fn = typeof tofind === 'function' ? tofind : (value) => value === tofind;
	Object.keys(obj).forEach(prop => {
		if (fn(obj[prop], prop, obj)) result = returnKey ? prop : obj[prop]
	});
	return result
};

export var findMultiple = (obj, tofind, returnKey = false, typed = false) => {
	var matches = [];
	var fn = typeof tofind === 'function' ? tofind : (value) => value === tofind;
	if (typed) Object.keys(obj).forEach(prop => {
		if (fn(obj[prop], prop, obj)) matches.push(returnKey ? prop : obj[prop])
	});
	else for (let prop in obj) {
		if (fn(obj[prop], prop, obj)) matches.push(returnKey ? prop : obj[prop])
	}
	return matches
};