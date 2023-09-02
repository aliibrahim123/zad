//stream collection

import { ReactiveError } from './error.js';
import { Stream } from './stream.js';
import { checkStream, checkStreams } from './check.js';

export class StreamCollection {
	constructor (streams) {
		if (!Array.isArray(streams)) throw new ReactiveError('stream collection: streams of type (' + streams?.constructor?.name + '), expected (Array)');
		checkStreams(streams, 'stream collection')
		this.streams = streams
	}
	add (stream) {
		checkStream(stream, 'stream collection');
		this.streams.push(stream);
		return this
	}
	remove (stream) {
		checkStream(stream, 'stream collection');
		this.streams = this.streams.filter(s => s !== stream);
		return this
	}
	next (value) {
		return Promise.all(this.streams.map(s => s.next(value)))
	}
	complete (value) {
		return Promise.all(this.streams.map(s => s.complete(value)))
	}
	nextMultiple(...values) {
		return Promise.all(this.streams.map(s => s.nextMultiple(...values)))
	}
}