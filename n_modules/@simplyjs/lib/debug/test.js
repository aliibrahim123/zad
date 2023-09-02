//test framework

import { Suite } from './test/suite.js';
import { Test } from './test/test.js';
import { getSuite } from './test/getSuite.js';
import { rootSuite } from './test/rootSuite.js';
import { run } from './test/run.js';

var $test = {
	Suite, Test,
	rootSuite,
	getSuite, run,
	suite (name, callback, opts) {
		return this.rootSuite.suite(name, callback, opts)
	},
	test (name, opts, fn) {
		return this.rootSuite.test(name, opts, fn)
	},
}

//bind $test as this for all methods, for destruction capabilities
for (let p in $test) {
	if (typeof $test[p] === 'function') $test[p] = $test[p].bind($test)
} 

export var suite = $test.suite;
export var test = $test.test;

export {
	Suite, Test,
	getSuite, run
}

export default $test