//gathering phase

import { getSuite } from './getSuite.js';

var createOperation = () => { return {
	total: 0,
	started: 0,
	executed: 0,
	passed: 0,
	failed: 0,
	suites: [],
	tests: [],
	errors: [],
	testsPerSuite: new Map,
	runnedTests: new Map, //per suite
	testPromisesMap: new Map(), //used to store the promises of the tests in each suite in an array
	testInd: 0,
	onPatch: () => {},
	onComplete: () => {},
}}

export var gather = (suites, tags) => {
	//gather root suites
	suites = suites.map(getSuite);
	
	//genarate operation object
	var operation = createOperation();
	
	//gather tests
	suites.forEach(suite => handleSuite(suite, operation, tags));
	
	//set total
	operation.total = operation.tests.length;
	
	return operation
}

var handleSuite = (suite, operation, tags) => {
	var testCount = 0;
	operation.suites.push(suite);
	operation.testPromisesMap.set(suite, []);
	operation.runnedTests.set(suite, 0);
	
	//gather own tests
	suite.tests.forEach(test => {
		if (tags.every(tag => test.tags.includes(tag)) && !test.skipIfHandler()) {
			operation.tests.push(test);
			testCount++
		}
	});
	
	operation.testsPerSuite.set(suite, testCount);
	
	//handle child suites
	for (let name in suite.suites) {
		handleSuite(suite.suites[name], operation, tags)
	}
}