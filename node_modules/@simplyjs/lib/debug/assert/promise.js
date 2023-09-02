//promise assertion operation

import { checkfn } from './check.js';
import { ofType } from './ofType.js';
import { AssertionError } from '../assertionError.js';

export var resolve = (promise, resolver = ()=>{}, msg) => {
	checkfn(resolver, 'resolver');
	ofType(Promise, promise);
	promise.then(resolver);
	promise.catch(error => { throw new AssertionError(msg || `expected value to resolve, rejected with (${error?.name}: ${error?.message})`) })
}

export var reject = (promise, rejecter = ()=>{}, msg) => {
	checkfn(rejecter, 'rejecter');
	ofType(Promise, promise);
	promise.then(result => { throw new AssertionError(msg || `expected value to reject, resolved with (${result})`) });
	promise.catch(rejecter)
}
