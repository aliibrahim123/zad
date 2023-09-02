//get suite at path

import { checkstr } from './check.js';
import { rootSuite } from './rootSuite.js';

export var getSuite = (path) => {
	checkstr(path, 'path');
	if (path === '') return rootSuite;
	path = path.split('/');
	return path.reduce((curSuite, curPath, i) => {
		curSuite = curSuite.suites[curPath];
		if (curSuite) return curSuite;
		throw new ReferenceError(`test: undefined suite at path (${path.slice(0, i + 1).join('/')})`)
	}, rootSuite)
}