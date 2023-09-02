//test suite class

import { checkfn, checkstr, checkarr } from './check.js';
import { Test } from './test.js';

export class Suite {
	constructor (parent, name, callback = () => {}, opts = {}) {
		//get options
		var { tests, suites, beforeAll, afterAll, beforeEach, afterEach } = {
			tests: [],
			suites: [],
			beforeAll: [],
			beforeEach: [],
			afterAll: [],
			afterEach: [],
			...opts
		}
		
		//handle name and path
		checkstr(name, 'name');
		this.name = name;
		this.path = parent ? (parent.path ? parent.path + '/' : '') + name : '';
		
		this.parent = parent;
		
		//handle tests and suites
		this.tests = [];
		this.suites = {};
		checkarr(tests, 'tests');
		tests.forEach(test => this.test(test?.name, test, test?.fn));
		checkarr(suites, 'suites');
		suites.forEach(suite => this.suite(suite?.name, suite?.fn, suite));
		
		//handle hooks
		this.beforeAllHooks = [];
		this.beforeEachHooks = [];
		this.afterAllHooks = [];
		this.afterEachHooks = [];
		checkarr(beforeAll, 'opts.beforeAll');
		beforeAll.forEach(fn => this.beforeAll(fn));
		checkarr(beforeEach, 'opts.beforeEach');
		beforeEach.forEach(fn => this.beforeEach(fn));
		checkarr(afterAll, 'opts.afterAll');
		afterAll.forEach(fn => this.afterAll(fn));
		checkarr(afterEach, 'opts.afterEach');
		afterEach.forEach(fn => this.afterEach(fn));
		
		//run callback
		checkfn(callback, 'callback');
		callback(this)
	}
	
	test (name, opts, fn) {
		var test = new Test(this, name, opts, fn);
		this.tests.push(test);
		return test
	}
	suite (name, callback, opts) {
		var suite = new Suite(this, name, callback, opts);
		this.suites[name] = suite;
		return suite
	}
	
	beforeAll (fn) {
		checkfn(fn, 'hook');
		this.beforeAllHooks.push(fn);
		return this
	}
	beforeEach (fn) {
		checkfn(fn, 'hook');
		this.beforeEachHooks.push(fn);
		return this
	}
	afterAll (fn) {
		checkfn(fn, 'hook');
		this.afterAllHooks.push(fn);
		return this
	}
	afterEach (fn) {
		checkfn(fn, 'hook');
		this.afterEachHooks.push(fn);
		return this
	}
	injectIntoContext () {
		return {
			suite: this.suite.bind(this),
			test: this.test.bind(this),
			beforeAll: this.beforeAll.bind(this),
			beforeEach: this.beforeEach.bind(this),
			afterAll: this.afterAll.bind(this),
			afterEach: this.afterEach.bind(this),
		}
	}
}