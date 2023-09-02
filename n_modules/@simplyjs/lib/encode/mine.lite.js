//media type operations
//lite mode: no vnd or x- media types

import { extensionsDB, charsetDB } from './mine/db.lite.js';
import { checkstr } from './mine/check.js';

//generate byExtensionsDB
var byExtensionsDB = {};
for (let type in extensionsDB) 
	extensionsDB[type].forEach(ext => byExtensionsDB[ext] = type);

export var parse = (data) => {
	checkstr(data, 'data');
	
	//split by syntax type; ...params
	var [type, ...parms] = data.split(';');
	
	//if there are parms, loop through them
	if (parms.length) parms = parms.reduce((obj, parm) => {
		parm = parm.trim();
		
		//split by syntax name=value
		var [name, value] = parm.split('=');
		
		if (name === '') throw new SyntaxError(`mine: parm (${parm}) have no name`);
		if (value === undefined || value === '') throw new SyntaxError(`mine: parm (${parm}) have no value`);
		
		obj[name.trim()] = value.trim();
		return obj
	}, {});
	else parms = {};
	
	return [type, parms]
}

export var byExtension = (name) => {
	checkstr(name, 'name');
	
	//slice after last . if possible
	var dotInd = name.lastIndexOf('.')
	if (dotInd !== -1) name = name.slice(dotInd +1);
	
	//lookup the database
	return byExtensionsDB[name]
}

export var extensions = (name) => {
	checkstr(name, 'name');
	return extensionsDB[name]
}

export var charset = (name) => {
	var [type, {charset}] = parse(name);
	
	//if specified charset parm, return it
	if (charset) return charset
	
	//if in charsetDB return default
	var maybeCharset = charsetDB[type];
	if(maybeCharset) return maybeCharset;
	
	//if it is of main type text, return the default (UTF-8)
	if (type.startsWith('text/')) return 'UTF-8';
}

export var format = (type, parms) => {
	checkstr(type, 'type');
	var parmsSection = '';
	for (let parm in parms) {
		let value = parms[parm]
		if (value === undefined) continue; 
		checkstr(value, `parm (${parm})`);
		parmsSection += `; ${parm}=${value}`
	}
	return parmsSection ? type + parmsSection : type
}

export var contentType = (data) => {
	checkstr(data, 'data');
	
	//attempt to parse as media type
	var [type, parms] = parse(data);
	
	//else attempt as extension
	if (!(type in extensionsDB)) {
		type = byExtension(data);
		if (!type) return;
	}
	
	//set charset parm if not defined
	if (!('charset' in parms)) parms.charset = charset(type);
	
	//return it formated
	return format(type, parms)
}

export {
	extensionsDB, charsetDB, byExtensionsDB
}

export default {
	extensionsDB, charsetDB, byExtensionsDB,
	byExtension, extensions, parse, format, charset, contentType
}