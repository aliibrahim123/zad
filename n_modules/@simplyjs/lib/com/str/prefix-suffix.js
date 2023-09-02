//prefix and suffix methods

import { checkstr } from './check.js';

export var removePrefix = (str, prefix) => {
	checkstr(str);
	checkstr(prefix, 'prefix');
	
	return str.startsWith(prefix) ? str.slice(prefix.length) : str
}

export var removeSuffix = (str, suffix) => {
	checkstr(str);
	checkstr(suffix, 'suffix');
	
	return str.endsWith(suffix) ? str.slice(0, -suffix.length) : str
}

export var addPrefix = (str, prefix) => {
	checkstr(str);
	checkstr(prefix, 'prefix');
	
	return str.startsWith(prefix) ? str : prefix + str
}

export var addSuffix = (str, suffix) => {
	checkstr(str);
	checkstr(suffix, 'suffix');
	
	return str.endsWith(suffix) ? str : str + suffix
}