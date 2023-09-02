//object mergeing

import checkfn from './checkfn.js';

export var mergeDeep = (base, layer, copyfn = false) => {
	if (copyfn && typeof copyfn !== 'function') throw new TypeError('obj: copyFn of type (' + copyfn?.constuctor?.name + '), expected (Function)');
	if (layer === undefined) return copyfn ? copyfn(base) : base;
	if (typeof base !== 'object' || base === null) return layer; //base isnt object
	if (typeof layer !== 'object' || layer === null) return layer; //layer isnt object
	//both are object
	var result = {
		...base
	};
	for (let prop in layer) {
		result[prop] = mergeDeep(base[prop], layer[prop])
	}
	if (copyfn) for (let prop in base) {//copy by function the properties not found in layer
		if (layer[prop] === undefined) result[prop] = copyfn(base[prop]);
	}
	return result
};

export var mergeByMap = (base, layer, map, copyfn = false) => {
	//if map is false, dont copy
	//if map is undefined, return layer and stop merging
	//if map is object, continue merging
	if (copyfn && typeof copyfn !== 'function') throw new TypeError('obj: copyFn of type (' + copyfn?.constuctor?.name + '), expected (Function)');
	if (layer === undefined) return copyfn ? copyfn(base) : base;
	if (typeof base !== 'object' || base === null) return layer; //base isnt object
	if (typeof layer !== 'object' || layer === null) return layer; //layer isnt object
	if (map === undefined) return layer;
	//both are object
	var result = {
		...base
	};
	for (let prop in layer) {
		if (map[prop] !== false) result[prop] = mergeByMap(base[prop], layer[prop], map[prop], copyfn)
	}
	if (copyfn) for (let prop in base) {//copy by function the properties not found in layer
		if (layer[prop] === undefined) result[prop] = copyfn(base[prop]);
	}
	return result
};