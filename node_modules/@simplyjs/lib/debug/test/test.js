//test class

import { checkfn, checkstr, checkarr } from './check.js';

export class Test {
	constructor (suite, name, opts, fn) {
		//get options
		if (typeof opts === 'function') {
			fn = opts;
			opts = {}
		}
		
		var { tags, setup, cleanup, skipIf, mayReturnError } = {
			tags: [],
			setup: () => {},
			cleanup: () => {},
			skipIf: () => {},
			mayReturnError: true,
			...opts
		}
		
		//handle name and fn
		checkstr(name, 'name');
		this.name = name;
		this.path = suite.path + '/' + name;
		checkfn(fn, 'fn');
		this.fn = fn;
		
		this.suite = suite;
		
		//handle handlers
		checkfn(setup, 'setup');
		this.setupHandler = setup;
		checkfn(cleanup, 'cleanup');
		this.cleanupHandler = cleanup;
		checkfn(skipIf, 'skipIf');
		this.skipIfHandler = skipIf
		
		//handle options
		checkarr(tags, 'tags');
		this.tags = tags;
		this.mayReturnError = mayReturnError
	}
	
	setup (fn) {
		checkfn(fn, 'setup');
		this.setupHandler = fn;
	}
	cleanup (fn) {
		checkfn(fn, 'cleanup');
		this.cleanupHandler = fn;
	}
	skipIf (fn) {
		checkfn(fn, 'skepIf');
		this.skipIfHandler = fn;
	}
}