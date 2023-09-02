//chained assertion

import { AssertionError } from './assertionError.js';
import { ChainedAssertion } from './expect/chainedAssertion.js';

var expect = (value) => new ChainedAssertion(value);

Object.defineProperty(Object.prototype, '$must', {
	get: function () {
		return new ChainedAssertion(this)
	}
});

Object.defineProperty(Object.prototype, '$should', {
	get: function () {
		return new ChainedAssertion(this)
	}
});

globalThis.$expect = expect;
$expect.ChainedAssertion = ChainedAssertion;
$expect.AssertionError = AssertionError;

export default expect;

export {
	expect, ChainedAssertion, AssertionError
}