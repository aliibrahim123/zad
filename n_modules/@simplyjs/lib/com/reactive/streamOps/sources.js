//stream sources operations

import { ReactiveError } from '../error.js';
import { checkfn, checkInt, checkStream } from '../check.js';
import { StreamCollection } from '../streamCollection.js';

export var fromEvents = (target, type, streams = []) => {
	if (!(target instanceof EventTarget)) throw new ReactiveError('stream op (fromEvents): target of type (' + target?.constructor?.name + '), expected (EventTarget)');
	var collection = new StreamCollection(streams);
	target.addEventListener(type, (e) => collection.next(e));
	return collection
}

export var fromTimer = (delay, mapper = (t) => t, max = 281474976710656, streams = []) => {
	checkfn(mapper, 'stream op (fromTimer)', 'mapper');
	checkInt(delay, 'stream op (fromTimer)', 'delay');
	checkInt(delay, 'stream op (fromTimer)', 'max');
	var collection = new StreamCollection(streams);
	var i = 0;
	var intvId = setInterval(() => {
		collection.next(mapper(++i));
		if (i === max) {
			collection.complete();
			clearInterval(intvId)
		}
	}, delay);
	return [collection, () => clearInterval(intvId)]
}

export var createCollection = (...streams) => new StreamCollection(streams);

export var fromStream = (stream) => {
	checkStream(stream, 'stream op (fromStream)');
	var collection =  new StreamCollection([]);
	stream.subscribe({
		packet: v => collection.next(v),
		complete: v => collection.complete(v)
	});
	return collection
}