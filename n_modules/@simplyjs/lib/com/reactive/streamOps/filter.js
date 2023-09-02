//stream filtering operations

import { checkfn, checkInt } from '../check.js';
import { StreamDrop } from '../stream.js';
import { ReactiveError } from '../error.js';

export var drop = StreamDrop;

export var filter = (fn) => {
	checkfn(fn, 'stream op (filter)');
	return (value, stream) => fn(value, stream) ? value : drop
}

export var distinct = (set = []) => {
	if (!Array.isArray(set) && !(set instanceof Set)) throw new ReactiveError('stream op (distinct): set of type (' + set?.constructor?.name + '), expected (Array) or (Set)');
	if (Array.isArray(set)) set = new Set(set);
	return (value) => set.has(value) ? drop : (set.add(value) && value)
}

export var remove = (set) => {
	if (!Array.isArray(set) && !(set instanceof Set)) throw new ReactiveError('stream op (remove): set of type (' + set?.constructor?.name + '), expected (Array) or (Set)');
	if (Array.isArray(set)) set = new Set(set);
	return (value) => set.has(value) ? drop : value
}

export var skip = (nb) => {
	checkInt(nb, 'stream op (skip)', 'count')
	var i = nb;
	return (value) => nb-- > 0 ? drop : value
}

export var skipWhile = (fn) => {
	checkfn(fn, 'stream op (skipWhile)');
	var doSkip = true;
	return (value, stream) => doSkip ? (
		fn(value, stream) ? drop : ((doSkip = false) || value)
	  ) : value
}

export var take = (nb) => {
	checkInt(nb, 'stream op (take)', 'count')
	var i = nb;
	return (value) => nb-- > 0 ? value : drop
}

export var takeWhile = (fn) => {
	checkfn(fn, 'stream op (takeWhile)');
	var doTake = true;
	return (value, stream) => doTake ? (
		fn(value, stream) ? value : ((doTake = false) || drop)
	  ) : drop
}