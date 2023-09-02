//pick/omit properties from Object

var checkProps = (props) => {
	if (!Array.isArray(props)) throw new TypeError('obj: props of type (' + props?.constructor?.name + '), expected (Array)');
}

export var pick = (obj, props) => {
	checkProps(props);
	var result = {};
	props.forEach(prop => {
		result[prop] = obj[prop]
	});
	return result
};

export var pickTyped = (obj, props) => {//with prototype
	checkProps(props);
	var result = Object.create(Object.getPrototypeOf(obj));
	props.forEach(prop => {
		result[prop] = obj[prop]
	});
	return result
};

export var omit = (obj, props) => {
	checkProps(props);
	var result = {};
	for (let prop in obj) {
		if (!props.includes(prop)) result[prop] = obj[prop]
	}
	return result
}

export var omitTyped = (obj, props) => {//with prototype
	checkProps(props);
	var result = Object.create(Object.getPrototypeOf(obj));
	Object.keys(obj).forEach(prop => {
		if (!props.includes(prop)) result[prop] = obj[prop]
	});
	return result
};