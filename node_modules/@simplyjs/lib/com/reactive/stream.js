//stream
//asynchronous piped data flow

//execution flow:
//	piping phase: pipe the value through different stream operators,
//		-if value is drop, drop the flow silently
//		-if value is error, drop the flow and call the error handlers
//		-if value is promise, pause the flow and wait to resolve
//		-else continue piping
//	handling phase: run handlers in parallel
//	post-fullfill phase: resolve the promise returned by the next method

import { checkfn } from './check.js';
import { ReactiveError } from './error.js';

export class Stream {
	constructor (fns = [], opts = {}) {
		this.fns = [];
		this.pipe(fns);
		this.packetHandlers = [];
		this.completeHandlers = [];
		this.errorHandlers = [];
		if (opts) this.subscribe(opts);
		this.latest = undefined;
		this.processingPackets = 0;
		this.completed = false;
	}
	pipe (...fns) {
		if (Array.isArray(fns[0])) fns = fns[0];
		fns.forEach((fn, i) => {
			if (typeof fn !== 'function') 
				throw new ReactiveError(`stream: fn at index (${i}) of type (${fn?.constructor?.name}), expected (Function)`)
		});
		this.fns = this.fns.concat(fns);
		return this
	}
	pipeFirst (...fns) {
		if (Array.isArray(fns[0])) fns = fns[0];
		fns.forEach((fn, i) => {
			if (typeof fn !== 'function') 
				throw new ReactiveError(`stream: fn at index (${i}) of type (${fn?.constructor?.name}), expected (Function)`)
		});
		this.fns.unshift(...fns);
		return this
	}
	next (value) {
		if (value instanceof Promise) return value.then(this.next.bind(this));
		this.processingPackets++;
		return new Promise((resolve, reject) => {
			if (this.completed) return this.processingPackets = 0;
			handle(this, value, 0, resolve, reject)
		})
	}
	nextMultiple (...values) {
		if (Array.isArray(values[0])) values = values[0];
		return Promise.all(values.map(v => this.next(v)))
	}
	complete (value) {
		return new Promise(resolve => {
			if (this.processingPackets === 0) return handleComplte(this, value, resolve);
			this.packetHandlers.push(
				() => this.processingPackets === 0 && handleComplte(this, value, resolve)
			)
		})
	}
	subscribe (subscription) {
		var { packet, complete, error } = subscription;
		
		if (packet) {
			checkfn(packet, 'stream', 'packetHandler');
			this.packetHandlers.push(packet);
		}
		
		if (complete) {
			checkfn(complete, 'stream', 'completeHandler');
			this.completeHandlers.push(complete)
		}
		
		if (error) {
			checkfn(error, 'stream', 'errorHandler');
			this.errorHandlers.push(error)
		}
		
		return this
	}
	unsubscribe (fn) {
		var { packet, complete, error } = subscription;
		
		if (packet) {
			checkfn(packet, 'stream', 'packetHandler');
			this.packetHandlers.filter(fn => fn !== packet);
		}
		
		if (complete) {
			checkfn(complete, 'stream', 'completeHandler');
			this.completeHandlers.filter(fn => fn !== complete)
		}
		
		if (error) {
			checkfn(error, 'stream', 'errorHandler');
			this.errorHandlers.filter(fn => fn !== error)
		}
		
		return this
	}
}

var handle = (stream, value, index, resolve, reject)  => { //handle flow at index
	var curValue = value;
	
	//loop through piped handlers
	for (let i = index; i < stream.fns.length; i++) {
		curValue = handleOne(stream, curValue, i, resolve, reject);
		if (curValue === Break) return; //break the handler
		if (curValue instanceof Promise) 
			return curValue
			  .then(v => handle(stream, v, i+1, resolve, reject))
			  .catch(v => handle(stream, v, i+1, resolve, reject));
	}
	
	stream.processingPackets--;
	
	//in some edge cases at the last function, its drop and error values are not handeled if it is promise
	if (curValue === StreamDrop) return resolve(curValue);
	if (curValue instanceof Error) return handleError(stream, curValue, reject);
	
	//handle complete
	Promise.all(stream.packetHandlers.map(fn => fn(curValue, stream))).then(() => {
		resolve(curValue);
		stream.latest = curValue;
	}); 
}

var handleError = (stream, value, reject) => Promise.all(
	stream.errorHandlers.map(fn => fn(value, stream))
).then(() => reject(value))

var handleComplte = (stream, value, resolve) => {
	stream.completed = true;
	Promise.all(stream.completeHandlers.map(fn => fn(value, stream)))
	  .then(() => resolve(value))
}

var handleOne = (stream, value, index, resolve, reject) => {
	value = stream.fns[index](value, stream);
	if (value instanceof Error && !stream.fns[index +1]?.$isCatcher) handleError(stream, value, reject); //handle error
	else if (value === StreamDrop) resolve(StreamDrop) //handle drop
	else return value;
	stream.processingPackets--;
	return Break //in non normal case, break the handler
}

var Break = Symbol('break'); //break the current handler
export var StreamDrop = Symbol('stream-drop'); //drop the current flow silently