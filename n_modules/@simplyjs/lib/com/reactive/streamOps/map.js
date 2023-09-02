//stream mapping operations

import { checkfn } from '../check.js';

export var map = (fn) => {
	checkfn(fn, 'stream op (map)');
	return fn
};

export var acc = (fn, init) => {
	checkfn(fn, 'stream op (acc)');
	var cur = init;
	return (value, stream) => cur = fn(cur, value, stream)
};

export var statefulMap = (fn, init) => {
	checkfn(fn, 'stream op (statefulMap)');
	var cur = init, toreturn;
	return (value, stream) => {
		[toreturn, cur] = fn(cur, value, stream);
		return toreturn
	}
};

export var fill = (value) => () => value;

export var mapIf = (cond, fn) => {
	checkfn(cond, 'stream op (mapIf)', 'cond');
	checkfn(fn, 'stream op (mapIf)');
	return (value, stream) => cond(value, stream) ? fn(value, stream) : value
};

export var accIf = (cond, fn, init) => {
	checkfn(cond, 'stream op (accIf)', 'cond');
	checkfn(fn, 'stream op (accIf)');
	var cur = init;
	return (value, stream) => cond(value, cur, stream) ? cur = fn(cur, value, stream) : cur;
};

export var statefulMapIf = (cond, fn, init) => {
	checkfn(cond, 'stream op (statefulMapIf)', 'cond');
	checkfn(fn, 'stream op (statefulMapIf)');
	var cur = init, toreturn;
	return (value, stream) => {
		if (!cond(value, cur, stream)) return value;
		[toreturn, cur] = fn(cur, value, stream);
		return toreturn
	}
};

export var fillIf = (cond, filler) => {
	checkfn(cond, 'stream op (fillIf)', 'cond');
	return (value, stream) => cond(value, stream) ? filler : value
}
