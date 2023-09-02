//object filtering

import checkfn from './checkfn.js';

export var filter = (obj, predicate) => {
	checkfn(predicate, 'predicate')
	var filtered = {};
	for (let prop in obj) {
		if (predicate(obj[prop], prop, obj)) filtered[prop] = obj[prop]
	}
	return filtered
};

export var filterTyped = (obj, predicate) => {//with prototype
	checkfn(predicate, 'predicate')
	var filtered = Object.create(Object.getPrototypeOf(obj));
	Object.keys(obj).forEach(prop=>{
		if (predicate(obj[prop], prop, obj)) filtered[prop] = obj[prop]
	})
	return filtered
}; 

export var clean = (obj) => { //remove falsy properties
	var cleaned = {};
	for (let prop in obj) {
		if (obj[prop]) cleaned[prop] = obj[prop]
	}
	return cleaned
};

export var cleanTyped = (obj) => {//with prototype
	var cleaned = Object.create(Object.getPrototypeOf(obj));
	Object.keys(obj).forEach(prop=>{
		if (obj[prop]) cleaned[prop] = obj[prop]
	})
	return cleaned
}; 