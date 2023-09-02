//the executing operation

//phases:
//	gathering: gather the tests to be run
//	executing: asynchronous running tests

import { checkarr, checkpInt, checkfn } from './check.js';
import { gather } from './gather.js';

export var run = (suites = [''], opts = {}, logger = () => {}) => {
	//handle arguments
	checkarr(suites, 'suites');
	var { tags, interval } = {
		tags: [],
		interval: 20, //as ms
		...opts
	}
	checkarr(tags, 'tags');
	checkpInt(interval, 'interval');
	checkfn(logger, 'logger');
	
	//generate operation object and gather tests
	var operation = gather(suites, tags);
	
	//apply logger
	logger(operation);
	
	//start executing
	handleExecute(operation, interval);
	
	return operation
}

var handleExecute = (operation, interval) => {
	var { total, started, executed, tests, runnedTests, testPromisesMap, testInd } = operation;

	//if finished, break
	if (total === executed) return operation.onComplete(operation);
	
	//if started every test put there still running, skip to the next tick
	if (started === total) return setTimeout(() => handleExecute(operation, interval), interval)
	
	//run tests until interval is met
	var lastTime = Date.now();
	while (Date.now() - lastTime <= interval) {
		let test = tests[testInd], suite = test.suite;
		
		//run beforeAll hooks if no test in suite had been runned
		if (runnedTests.get(suite).length === 0) suite.beforeAllHooks.forEach(hook => hook());
		
		//run beforeEach hooks
		suite.beforeEachHooks.forEach(hook => hook(test));
		
		//run setup handler
		let setupPromise = test.setupHandler();
		
		//handle test
		if (setupPromise instanceof Promise) setupPromise.then(() => handleTest(operation, test));
		else handleTest(operation, test);
		
		started++;
		testInd++;
		if (testInd === total) break;
	}
	
	//update operation
	operation.testInd = testInd;
	operation.started = started;
	
	//run onPatch
	operation.onPatch(operation);
	
	//schedule the next patch of tests to the next iteration of event loop
	setTimeout(() => handleExecute(operation, interval), 1);
}

var handleTest = (operation, test) => {
	var result, error, suite = test.suite;
	
	//run test
	try {
		result = test.fn();
	} catch (err) {
		error = err
	}
	
	//case of asynchronous test
	if (result instanceof Promise) result.then(
		(result) => handlePass(operation, test, result),
		(error) => handleFail(operation, test, error)
	);
	
	else if (error) return handleFail(operation, test, error);
	else handlePass(operation, test, result);
	
	//push result to testPromiseMap
	operation.testPromisesMap.get(suite).push(result);
	
	//if test is the last test in a suite, wait to all test to run and run afterAll hooks
	var testPromises = operation.testPromisesMap.get(suite);
	if (testPromises.length === operation.testsPerSuite.get(suite)) 
		Promise.all(testPromises.map(p => p?.catch?.(()=>{})))
		  .then(() => suite.afterAllHooks.forEach(hook => hook()))
}

var handlePass = (operation, test, result) => {
	if (result instanceof Error && test.mayReturnError) {
		operation.failed++;
		operation.errors.push({ test, error: result });
		return handleFinish(operation, test);
	}
	operation.passed++;
	handleFinish(operation, test);
}

var handleFail = (operation, test, error) => {
	operation.failed++;
	operation.errors.push({ test, error });
	handleFinish(operation, test);
}

var handleFinish = (operation, test) => {
	operation.executed++;
	test.cleanupHandler();
	
	//run afterEach hooks
	test.suite.afterEachHooks.forEach(hook => hook(test));
}