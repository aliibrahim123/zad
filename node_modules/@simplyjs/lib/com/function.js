//function utility

import { ary, rotateArg1, flipArgs, mapArgs, overArgs, unary, rearg } from './function/args.js';
import { after, limit, once } from './function/limit.js';
import { memoize } from './function/memoize.js';
import { partial, partialRight, curry, curryRight, curryFirstFirstly, curryFirstLastly } from './function/curry.js';
import { pipe, compose, over, overAll, overSome } from './function/pipe.js';
import { wrap, negate } from './function/wrap.js';

var dontInclude = ['pipe', 'compose', 'over', 'overAll', 'overSome'];
var extendNative = () => {
	var handle = (fn) => function (...args) { return fn(this, ...args) };
	for (let prop in $fn) {
		if (!dontInclude.includes(prop)) Object.defineProperty(Function.prototype, '$' + prop, {
			value: handle($fn[prop]),
			enumerable: false
		})
	}
}

var $fn = {
	ary, rotateArg1, flipArgs, mapArgs, overArgs, unary, rearg,
	after, limit, once,
	memoize,
	partial, partialRight, curry, curryRight, curryFirstFirstly, curryFirstLastly,
	pipe, compose, over, overAll, overSome,
	wrap, negate,
	extendNative
}

export {
	ary, rotateArg1, flipArgs, mapArgs, overArgs, unary, rearg,
	after, limit, once,
	memoize,
	partial, partialRight, curry, curryRight, curryFirstFirstly, curryFirstLastly,
	pipe, compose, over, overAll, overSome,
	wrap, negate,
	extendNative
}

export default $fn;