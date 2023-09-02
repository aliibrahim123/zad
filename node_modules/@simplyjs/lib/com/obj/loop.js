//object looping

import checkfn from './checkfn.js';

export var loop = (obj, fn) => {//normal prop
	checkfn(fn)
	Object.keys(obj).forEach((prop)=>fn(obj[prop], prop, obj))
};

export var loopProto = (obj, fn) => {//normal prop with prototype
	checkfn(fn)
	for (let prop in obj) {
		fn(obj[prop], prop, obj)
	}
};

export var loopStrict = (obj, fn, symbol = false, proto = false) => {//every thing
	checkfn(fn)
	var curProto;
	Object.getOwnPropertyNames(obj).forEach(prop=> fn(obj[prop], prop, obj));
	if (symbol) Object.getOwnPropertySymbols(obj).forEach(prop=> fn(obj[prop], prop, obj));
	if (proto) curProto = Object.getPrototypeOf(obj);
	while (curProto) {
		Object.getOwnPropertyNames(curProto).forEach(prop=> (obj[prop] === curProto[prop]) && fn(curProto[prop], prop, obj));
		if (symbol) Object.getOwnPropertySymbols(curProto).forEach(prop=> (obj[prop] === curProto[prop]) && fn(curProto[prop], prop, obj));
		curProto = Object.getPrototypeOf(curProto)
	}
}