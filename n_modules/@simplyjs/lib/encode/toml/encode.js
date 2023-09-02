//encode toml

import { checkstr, checkobj } from './check.js';
import { BareKeyReg } from './regex.js';

export var encode = (data, opts = {}) => {
	checkobj(data, 'data');
	
	opts = {
		forceInline: false,
		ident: '\t',
		newLine: '\n',
		whitespace: ' ',
		compactArray: false,
		allBasicString: false,
		multilineString: false,
		...opts
	}
	checkstr(opts.newLine, 'newLine');
	checkstr(opts.whitespace, 'whitespace');
	checkstr(opts.ident, 'ident');
	
	var result = [''];
	
	handleTable(data, [], false, result, opts);
	
	return result[0]
}

encode.compact = (data, opts) => encode(data, {
	forceInline: true,
	ident: '',
	newLine: '\n',
	whitespace: '',
	compactArray: true,
	...opts
})

var isObject = value => typeof value === 'object' && value !== null && !(value instanceof Date);

var handleTable = (obj, keys, inTableArray, rootResult, opts) => {
	//note: 
	//   -keys are reused throughout the operation, new tables push there keys and finished ones pop there own
	//   -table header is not appended if there is no values in it other than tables and table arrays
	
	var { forceInline, ident, newLine, whitespace } = opts;
	
	var result = '';
	var objs = [], isEmpty = true;
	var identCount = keys.length === 0 ? 0 : 1;
	ident = keys.length === 0 ? '' : ident;
	
	//always in table in array add header
	if (inTableArray) {
		result += `[[${keys.join('.')}]]` + newLine;
		isEmpty = false;
	}
	
	//handle inlined tables and array and scaler types
	for (let prop in obj) {
		let curProp = obj[prop];
		
		//if not forceInline and is a table or table array, push to objs to handle after
		if (!forceInline && isObject(curProp) && (Array.isArray(curProp) ? curProp.length > 0 && curProp.every(isObject) : true)) {
			objs.push(prop);
			continue
		}
		
		//convert value into string
		let value = handleValue(curProp, identCount +1, opts);
		if (value === undefined) continue; //ignore if unable to convert
		
		//append header if was empty and not root
		if (isEmpty) {
			isEmpty = false;
			if (keys.length !== 0) result += `[${keys.join('.')}]` + newLine;
		}
		
		//append to result
		result += ident + handleKey(prop, opts) + whitespace + '=' + whitespace + value + newLine
	}
	
	//append table to rootResult
	if (result) rootResult[0] += (rootResult[0] ? newLine : '') + result
	
	//handle sub tables and table arrays
	objs.forEach(prop => {
		var curProp = obj[prop];
		
		//case table array
		if (Array.isArray(curProp)) curProp.forEach(table => {
			keys.push(handleKey(prop, opts));
			handleTable(table, keys, true, rootResult, opts)
		});
		
		//case table
		else {
			keys.push(handleKey(prop, opts));
			handleTable(curProp, keys, false, rootResult, opts)
		}
	});
	
	keys.pop();
}

var handleValue = (value, identCount, opts) => {
	//case boolean
	if (value === true)  return 'true';
	if (value === false) return 'false';
	
	//case string
	if (typeof value === 'string') return handleString(value, opts); 
	
	//case number
	if (Object.is(value, NaN))       return 'nan';
	if (Object.is(value, Infinity))  return 'inf';
	if (Object.is(value, -Infinity)) return '-inf';
	if (typeof value === 'number') return String(value);
	
	//case signed 64bit bigint
	if (typeof value === 'bigint' && value < 9223372036854775807 && value > -9223372036854775808) return String(value);
	
	//case date, return ISO format
	if (value instanceof Date) return value.toISOString();
	
	//case array
	if (Array.isArray(value)) {
		let {compactArray, ident: Ident, whitespace, newLine} = opts;
		
		if (value.length === 0) return '[]';
		
		let ident = Ident.repeat(identCount);
		
		if (compactArray) return '[' 
			+ value.map(value => handleValue(value, identCount +1, opts)).filter(Boolean).join(',' + whitespace) + 
		']';
		
		return '[' + newLine + ident 
			+ value.map(value => handleValue(value, identCount +1, opts)).filter(Boolean).join(',' + newLine + ident) + 
		newLine + Ident.repeat(identCount -1) + ']';
	}
	
	//case object
	if (typeof value === 'object' && value !== null) {
		let {whitespace, newLine} = opts;
		
		return '{' + Object.keys(value).map(prop => {
			var val = handleValue(value[prop], identCount, opts);
			if (val) return handleKey(prop, opts) + whitespace + '=' + whitespace + val
		}).filter(Boolean).join(',' + whitespace) + '}'
	}
}

var escapeString = (str, escapeNewLine) => {
	str = str.replaceAll('\\', '#\\#');
	if (escapeNewLine) str = str.replaceAll('\n', '\\n');
	return str
		.replaceAll('\b', '\\b')
		.replaceAll('\t', '\\t')
		.replaceAll('\f', '\\f')
		.replaceAll('\r', '\\r')
		.replaceAll('\"', '"')
		.replaceAll('#\\#', '\\')
}

var handleString = (str, opts, noMultiLine = false) => {
	//case multi line
	if (str.includes('\n') && !noMultiLine && opts.multilineString) {
		// """
		if (opts.allBasicString || str.match(/\t|\f|\r|\"|\\/g)) 
			return '"""\n' + escapeString(str, opts, false) + '"""'
		// '''
		return "'''\n" + str + "'''" 
	}
	
	// "
	if (opts.allBasicString || str.match(/\n|\t|\f|\r|\"|\\/g)) return '"' + escapeString(str, opts) + '"'; 
	// '
	return "'" + str + "'" 
}

var handleKey = (key, opts) => {
	if (key.match(BareKeyReg)) return key;
	return handleString(key, opts, true)
}