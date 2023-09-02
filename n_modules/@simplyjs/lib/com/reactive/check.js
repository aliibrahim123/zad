import { ReactiveError } from './error.js';
import { Stream } from './stream.js';

export var checkfn = (fn, system, type = 'fn') => {
	if (typeof fn !== 'function') throw new ReactiveError(`${system}: ${type} of type (${fn?.constructor?.name}), expected (Function)`);
};

export var checkarr = (arr, system, type) => {
	if (!Array.isArray(arr)) throw new ReactiveError(`${system}: ${type} of type (${arr?.constructor?.name}), expected (Array)`);
};

export var checkStream = (stream, system) => {
	if (!(stream instanceof Stream)) throw new ReactiveError(`${system}: stream of type (${stream?.constructor?.name}), expected (Stream)`);
};

export var checkStreams = (streams, system) => streams.forEach((s, i) => {
	if (!(s instanceof Stream)) throw new ReactiveError(`${system}: stream at index (${i}) of type (${s?.constructor?.name}), expected (Stream)`);
});

export var checkInt = (nb, system, type) => {
	if (typeof nb !== 'number') throw new ReactiveError(`${system}: ${type} of type (${nb?.constructor?.name}), expected (Number)`);
	if (!Number.isInteger(nb) || nb <= 0) throw new ReactiveError(`${system}: ${type} is (${nb}), expected positive integer`);
};