//stream joining operatons

import { ReactiveError } from '../error.js';
import { checkfn, checkStreams } from '../check.js';
import { Stream } from '../stream.js';

export var merge = (...streams) => {
	var stream = new Stream();
	if (streams.length === 0) throw new ReactiveError('stream op (merge): no streams had been given')
	checkStreams(streams, 'stream op (merge)');
	
	var completed = [];
	streams.forEach(s => {
		var resolve;
		completed.push(new Promise(res => resolve = res));
		s.subscribe({
			packet: v => stream.next(v),
			complete: resolve
		})
	});
	Promise.all(completed).then(v => stream.complete(v))
	
	return stream
}

export var mergeWhen = (filter, mapper = v => v, ...streams) => {
	var thereMapper = true;
	checkfn(filter, 'stream op (mergeWhen)', 'filter');
	if (mapper instanceof Stream) {
		streams.push(mapper);
		thereMapper = false;
	} else checkfn(mapper, 'stream op (mergeWhen)', 'mapper');
	
	var stream = new Stream();
	if (streams.length === 0) throw new ReactiveError('stream op (mergeWhen): no streams had been given')
	checkStreams(streams, 'stream op (mergeWhen)');

	var completed = [];
	streams.forEach(s => {
		var resolve;
		completed.push(new Promise(res => resolve = res));
		s.subscribe({
			packet: v => filter(v, s) && stream.next(thereMapper ? mapper(v, s) : v),
			complete: resolve
		})
	});
	Promise.all(completed).then(v => stream.complete(v))
	
	return stream
}