//stream transport operatons

import { checkfn, checkStreams } from '../check.js';
import { drop } from './filter.js';
import { StreamCollection } from '../streamCollection.js'

export var redirectTo = (...streams) => {
	if (streams[0] instanceof StreamCollection) streams = streams[0].streams; 
	checkStreams(streams, 'stream op (redirectTo)');
	return (value) => {
		streams.forEach(s => s.next(value));
		return drop
	}
}

export var redirectWhen = (fn, ...streams) => {
	if (streams[0] instanceof StreamCollection) streams = streams[0].streams;
	checkfn(fn, 'stream op (redirectWhen)')
	checkStreams(streams, 'stream op (redirectWhen)');
	return (value, stream) => {
		if (!fn(value, stream)) return value;
		streams.forEach(s => s.next(value));
		return drop
	}
}

export var multicast = (...streams) => {
	if (streams[0] instanceof StreamCollection) streams = streams[0].streams;
	checkStreams(streams, 'stream op (multicast)');
	return (value) => {
		streams.forEach(s => s.next(value));
		return value
	}
}

export var multicastWhen = (fn, ...streams) => {
	if (streams[0] instanceof StreamCollection) streams = streams[0].streams;
	checkfn(fn, 'stream op (multicastWhen)')
	checkStreams(streams, 'stream op (multicastWhen)');
	return (value, stream) => {
		if (!fn(value, stream)) return value;
		streams.forEach(s => s.next(value));
		return value
	}
}

export var mcastAndWait = (...streams) => {
	if (streams[0] instanceof StreamCollection) streams = streams[0].streams;
	checkStreams(streams, 'stream op (mcastAndWait)');
	return (value) => Promise.all(streams.map(s => s.next(value))).then(() => value);
}

export var mcastWhenAndWait = (fn, ...streams) => {
	if (streams[0] instanceof StreamCollection) streams = streams[0].streams;
	checkfn(fn, 'stream op (mcastWhenAndWait)')
	checkStreams(streams, 'stream op (mcastWhenAndWait)');
	return (value, stream) => {
		if (!fn(value, stream)) return value;
		return Promise.all(streams.map(s => s.next(value))).then(() => value)
	}
}