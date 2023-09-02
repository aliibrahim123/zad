//bind all methods to the object itself

export var bindAll = (obj) => {
	for (let prop in obj) {
		if (typeof obj[prop] === 'function') obj[prop] = obj[prop].bind(obj)
	}
	return obj
}

export var bindAllTyped = (obj) => {
	Object.getOwnPropertyNames(prop => {
		if (typeof obj[prop] === 'function') obj[prop] = obj[prop].bind(obj)
	});
	return obj
}