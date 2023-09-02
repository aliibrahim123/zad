//handle property at path

import checkfn from './checkfn.js';

var getPath = (path) => {
	if (Array.isArray(path)) return path;//nothing
	else if (typeof path === 'string') return path.split('.');
	else throw new TypeError('obj: path of type (' + path?.constructor?.name + '), expected (Array) or (String)');
}

export var get = (obj, path) => {
	path = getPath(path)
	var curProp = obj, curPath;
	for (let i = 0; i < path.length; i++) {
		curPath = path[i];
		if (curProp === undefined || curProp === null) return curProp;
		curProp = curProp[curPath]
	}
	return curProp
};

export var set = (obj, path, value) => {
	path = getPath(path)
	if (path.length === 0) return;
	var curProp = obj, curPath;
	for (let i = 0; i < path.length; i++) {
		curPath = path[i];
		if (i === path.length-1) {
			curProp[curPath] = value;
			return value
		}
		if (curProp[curPath] === undefined || curProp[curPath] === null) curProp[curPath] = {};
		curProp = curProp[curPath]
	}
};

export var remove = (obj, path) => {
	path = getPath(path)
	if (path.length === 0) return false;
	var curProp = obj, curPath;
	for (let i = 0; i < path.length; i++) {
		curPath = path[i];
		if (i === path.length-1) {
			delete curProp[curPath];
			return true
		}
		if (curProp[curPath] === undefined || curProp[curPath] === null) return false;
		curProp = curProp[curPath]
	}
};

export var update = (obj, path, updater, ...args) => {
	checkfn(updater, 'updater');
	path = getPath(path)
	if (path.length === 0) return;
	var curProp = obj, curPath;
	for (let i = 0; i < path.length; i++) {
		curPath = path[i];
		if (i === path.length-1) {
			curProp[curPath] = updater(curProp[curPath], path, obj, ...args);
			return curProp[curPath]
		}
		if (curProp[curPath] === undefined || curProp[curPath] === null) curProp[curPath] = {};
		curProp = curProp[curPath]
	}
};