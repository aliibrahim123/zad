//operate at path

export var pluck = (prop) => obj => obj?.[prop];

var getPath = (path) => {
	if (Array.isArray(path)) return path;
	else if (typeof path === 'string') return path.split('.');
	else throw new TypeError('functional: path of type (' + path?.constructor?.name + '), expected (String) or (Array)');
}

var handleGet = (path, obj) => {
	var curProp = obj, curPath;
	for (let i = 0; i < path.length; i++) {
		curPath = path?.[i];
		if (curProp === undefined || curProp === null) return curProp;
		curProp = curProp[curPath]
	}
	return curProp
}

export var pluckDeep = (path) => {
	path = getPath(path);
	return (obj) => handleGet(path, obj)
}

export var propertyOf = (obj) => path => handleGet(getPath(path), obj);

export var callMethod = (path, ...args) => {
	path = getPath(path);
	return (obj) => {
		var prop = handleGet(path, obj);
		if (typeof prop !== 'function') throw new TypeError('functional: method at path (' + path.join('.') + ') of type (' + prop?.constructor?.name + '), expected (Function)');
		return prop(...args)
	}
}

export var callMethodSafe = (path, ...args) => {
	path = getPath(path);
	return (obj) => {
		var prop = handleGet(path, obj);
		if (typeof prop !== 'function') return;
		return prop(...args)
	}
}

export var callMethodOf = (obj, ...args) => path => {
	path = getPath(path);
	var prop = handleGet(path, obj);
	if (typeof prop !== 'function') throw new TypeError('functional: method at path (' + path.join('.') + ') of type (' + prop?.constructor?.name + '), expected (Function)');
	return prop(...args)
}

export var callMethodOfSafe = (obj, ...args) => path => {
	path = getPath(path);
	var prop = handleGet(path, obj);
	if (typeof prop !== 'function') return;
	return prop(...args)
}