//object mapping

import checkfn from './checkfn.js';

export var map = (obj, mapper) => {
	checkfn(mapper, 'mapper')
	var mapped = {};
	for (let prop in obj) {
		mapped[prop] = mapper(obj[prop], prop, obj)
	}
	return mapped
};

export var mapTyped = (obj, mapper) => {//with prototype
	checkfn(mapper, 'mapper')
	var mapped = Object.create(Object.getPrototypeOf(obj));
	Object.keys(obj).forEach(prop=>{
		mapped[prop] = mapper(obj[prop], prop, obj)
	});
	return mapped
}; 

export var mapKeys = (obj, mapper) => {
	checkfn(mapper, 'mapper')
	var mapped = {};
	for (let prop in obj) {
		mapped[mapper(prop, obj[prop], obj)] = obj[prop]
	}
	return mapped
};

export var mapKeysTyped = (obj, mapper) => {//with prototype
	checkfn(mapper, 'mapper')
	var mapped = Object.create(Object.getPrototypeOf(obj));
	Object.keys(obj).forEach(prop=>{
		mapped[mapper(prop, obj[prop], obj)] = obj[prop]
	});
	return mapped
};

export var reshape = (obj, mapper) => {//map with keys and value
	checkfn(mapper, 'mapper')
	var reshaped = {};
	for (let prop in obj) {
		var result = mapper(obj[prop], prop, obj);
		reshaped[result[0]] = result[1]
	}
	return reshaped
};

export var reshapeTyped = (obj, mapper) => {//with prototype
	checkfn(mapper, 'mapper')
	var reshaped = Object.create(Object.getPrototypeOf(obj));
	Object.keys(obj).forEach(prop=>{
		var result = mapper(obj[prop], prop, obj);
		reshaped[result[0]] = result[1]
	});
	return reshaped
};