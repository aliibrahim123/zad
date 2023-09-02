//object testing

import checkfn from './checkfn.js';

export var some = (obj, predicate) => {
	checkfn(predicate, 'predicate');
	for (let prop in obj) {
		if (predicate(obj[prop], prop, obj)) return true
	}
	return false
};

export var someTyped = (obj, predicate) => {//without prototype
	checkfn(predicate, 'predicate');
	var result = false;
	Object.keys(obj).forEach(prop => {
		result = result ? true : predicate(obj[prop], prop, obj)
	})
	return result
};

export var every = (obj, predicate) => {
	checkfn(predicate, 'predicate');
	for (let prop in obj) {
		if (!predicate(obj[prop], prop, obj)) return false
	}
	return true
};

export var everyTyped = (obj, predicate) => {//without prototype
	checkfn(predicate, 'predicate');
	var result = true;
	Object.keys(obj).forEach(prop => {
		result = result ? predicate(obj[prop], prop, obj) : false
	})
	return result
};