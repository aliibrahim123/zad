//reactive programming

import { ReactiveError } from './reactive/error.js';
import { RValue } from './reactive/rvalue.js';
import { CValue } from './reactive/computed.js';
import { Store } from './reactive/store.js';
import { Stream } from './reactive/stream.js';
import { StreamCollection } from './reactive/streamCollection.js';

import { state } from './reactive/state.js';

import { fromEvents, fromTimer, createCollection, fromStream } from './reactive/streamOps/sources.js';
import { merge, mergeWhen } from './reactive/streamOps/join.js';
import { map, mapIf, acc, accIf, fill, fillIf, statefulMap, statefulMapIf } from './reactive/streamOps/map.js';
import { drop, filter, distinct, remove, skip, skipWhile, take, takeWhile } from './reactive/streamOps/filter.js';
import { redirectTo, redirectWhen, multicast, multicastWhen, mcastAndWait, mcastWhenAndWait } from './reactive/streamOps/transport.js';
import { debounce, throttle, delay, delayWhen } from './reactive/streamOps/timing.js';
import { buffer, bufferTime } from './reactive/streamOps/buffer.js';
import { catchError, dropError } from './reactive/streamOps/catch.js';
import { tap, log } from './reactive/streamOps/utility.js';

export { 
	RValue, CValue, Store, Stream, StreamCollection, ReactiveError,
	state,
	fromEvents, fromTimer, createCollection, fromStream,
	merge, mergeWhen,
	map, mapIf, acc, accIf, fill, fillIf, statefulMap, statefulMapIf,
	drop, filter, distinct, remove, skip, skipWhile, take, takeWhile,
	redirectTo, redirectWhen, multicast, multicastWhen, mcastAndWait, mcastWhenAndWait,
	debounce, throttle, delay, delayWhen,
	buffer, bufferTime,
	catchError, dropError,
	tap, log
};

export var v = (value) => new RValue(value);
export var cv = (values, fn) => new CValue(values, fn);
export var on = (value, fn) => value.addEffect(fn);
export var off = (value, fn) => value.removeEffect(fn);
export var store = (data) => new Store(data);
export var stream = (fns, opts) => new Stream(fns, opts);

export default {
	RValue, CValue, Store, Stream, StreamCollection, ReactiveError,
	v, cv, on, off, store, state, stream, 
	fromEvents, fromTimer, createCollection, fromStream,
	merge, mergeWhen,
	map, mapIf, acc, accIf, fill, fillIf, statefulMap, statefulMapIf,
	drop, filter, distinct, remove, skip, skipWhile, take, takeWhile,
	redirectTo, redirectWhen, multicast, multicastWhen, mcastAndWait, mcastWhenAndWait,
	debounce, throttle, delay, delayWhen,
	buffer, bufferTime,
	catchError, dropError,
	tap, log
}