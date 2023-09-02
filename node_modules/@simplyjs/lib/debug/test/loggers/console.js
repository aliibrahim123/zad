//console logger

import { green, red } from '../../../cli/ansi/style.js';

var onPatch = (operation) => {
	console.clear();
	console.log(`running test:
    total: ${operation.total}, started: ${operation.started}, executed: ${operation.executed},
    ${green('passed: ' + operation.passed)}, ${red('failed: ' + operation.failed)}`)
}

var onComplete = (operation) => {
	console.clear();
	console.log(`results:
    total: ${operation.total}, ${green('passed: ' + operation.passed)}, ${red('failed: ' + operation.failed)}

errors:
${operation.errors.map(({error, test}) => '    at ' + test.path + ': ' + red(error.name + ': ' + error.message)).join('\n')}`)
}

var consoleLogger = (operation) => {
	operation.onPatch = onPatch;
	operation.onComplete = onComplete;
	return operation
}

export default consoleLogger;

if (globalThis.$test) $test.consoleLogger = consoleLogger;