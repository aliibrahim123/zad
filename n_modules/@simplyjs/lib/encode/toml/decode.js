//decode toml

import { 
	tokenizer, NLToken, EqToken, DotToken, CommaToken, LeftCurlyToken, RightCurlyToken, LeftBracketToken,
	RightBracketToken, StrToken, BareKeyToken, NbLikeToken
} from './tokenizer.js';
import { TOMLError, throwAtIndex } from './error.js';
import { checkstr } from './check.js';
import { BareKeyReg, IntReg, FloatReg } from './regex.js';

var throwAtKey = (msg, keysFromRoot, keys, i) => {
	throw new TOMLError(`${msg} at key (${keysFromRoot.concat(keys.slice(0, i+1)).join('.')})`)
}

export var decode = (data) => {
	checkstr(data, 'data');
	
	//split into tokens
	var tokens = tokenizer(data);
	
	var root = {}, i = 0, curTable = root,
	tableIsInlined = new Map(),
	arrayIsTableArray = new Map(),
	expectNewLine = false, keysFromRoot = [];
	
	while (i !== tokens.length) {
		var curToken = tokens[i];
		
		//case of new line
		if (curToken.type === NLToken) {
			expectNewLine = false
			i++
		}
		else if (expectNewLine) throwAtIndex(`unexpected token (${data[curToken.ind]}), expected new line`, data, curToken.ind);
		
		//case of header
		else if (curToken.type === LeftBracketToken) {
			//check if is array of tables
			let isArrayTable = false;
			if (tokens[i +1].type === LeftBracketToken) isArrayTable = true;
			
			//get path until ']' token
			let path = [], innerInd = i + (isArrayTable ? 2 : 1);
			while (tokens[innerInd]?.type !== RightBracketToken) {
				if (tokens[innerInd] === undefined) throwAtIndex("end of file, expected ']'", data, data.length);
				path.push(tokens[innerInd]);
				innerInd++;
			}
			
			//get keys 
			let keys = handleKeys(path, data, tokens[i+1].ind);
			
			//define table
			if (!isArrayTable) {
				curTable = handleTable(root, keys, tableIsInlined, arrayIsTableArray, []);
				i = innerInd +1
			}
			
			//define table array
			else {
				curTable = handleTableArray(root, keys, tableIsInlined, arrayIsTableArray, data, tokens[i].ind);
				i = innerInd +2
			}
			
			keysFromRoot = keys;
			expectNewLine = true;
		}
		
		//case of key/value
		else {
			i = handleKeyValue(curTable, tokens, i, data, tableIsInlined, arrayIsTableArray, keysFromRoot);
			expectNewLine = true;
		}
	}
	
	return root
}

var handleKeys = (path, data, startInd) => {
	if (path.length === 0) throwAtIndex('empty keys', data, startInd);
	if (!(path.length & 1)) throwAtIndex(`keys of length (${path.length})`, data, startInd); //case if keys length is even
	
	return path.map((curKey, i) => {
		//case of dot
		if (i & 1) {
			if (curKey.type !== DotToken) throwAtIndex(`unexpected token (${data[curKey.ind]}), expected dot`, data, curKey.ind);
			return false
		}
		
		//if bare key
		if (curKey.type === BareKeyToken) return curKey.val;
		
		//if the first character is a digit, it will be a nb like token, and it may contain more than one key
		if (curKey.type === NbLikeToken) return curKey.val.split('.').map(nb => {
			if (nb.match(BareKeyReg)) return nb;
			throwAtIndex(`token (${nb}) unable to be bare key`, data, curKey.ind)
		});
		
		//or it will be a string token
		if (curKey.type === StrToken) return handleString(curKey, data);
		
		throwAtIndex(`unexpected token (${data[curKey.ind]})`, data, curKey.ind);
	}).filter(key => key !== false).flat()
}

var handleTable = (parent, keys, tableIsInlined, arrayIsTableArray, keysFromRoot, inlined = false) => {
	var curTable = parent, lastTable = parent;
	for (let i = 0; i < keys.length; i++) {
		let key = keys[i];
		lastTable = curTable;
		curTable = curTable[key]
		
		//case of tables array, return the last table
		if (Array.isArray(curTable)) {
			if (arrayIsTableArray.get(curTable)) {
				if (keysFromRoot.length !== 0) throwAtKey('can not access table array outside headers', keysFromRoot, keys, i);
				curTable = curTable[curTable.length -1];
			}
			else throwAtKey('can not access array', keysFromRoot, keys, i);
		}
		
		//case of table
		else if (typeof curTable === 'object') {
			if (tableIsInlined.get(curTable) && !inlined) throwAtKey('can not access inlined table', keysFromRoot, keys, i);
		}
		
		//case of undefined, create table
		else if (curTable === undefined) {
			curTable = {};
			lastTable[key] = curTable;
			tableIsInlined.set(curTable, false)
		}
		
		else throwAtKey('can not set defined value', keysFromRoot, keys, i);
	}
	
	return curTable
}

var handleTableArray = (root, keys, tableIsInlined, arrayIsTableArray, data, startInd) => {
	//get keys
	keys = keys.concat();
	var lastKey = keys.pop();
	
	//get parent table
	var table = handleTable(root, keys, tableIsInlined, arrayIsTableArray, []);

	var tableArray = table[lastKey];
	
	//if inlined array, throw
	if (Array.isArray(tableArray)) {
		if (!arrayIsTableArray.get(tableArray)) throwAtKey('array is not table array', [], keys.concat(lastKey), keys.length);
	} 
	
	//define array if not exist
	else if (tableArray === undefined) {
		tableArray = [];
		table[lastKey] = tableArray;
		arrayIsTableArray.set(tableArray, true)
	}
	
	//else throw
	else throwAtKey('can not set defined value', [], keys.concat(lastKey), keys.length);
	
	//define table at last index
	var curTable = {};
	tableIsInlined.set(curTable, false)
	tableArray.push(curTable);
	return curTable
}

var handleValue = (vToken, tokens, i, data, keys, tableIsInlined, arrayIsTableArray, keysFromRoot) => {
	var vTokenType = vToken.type, value;
	
	//case string
	if (vTokenType === StrToken) value = handleString(vToken, data);
	
	else if (vTokenType === BareKeyToken) {
		let val = vToken.val;
		
		//case boolean
		if      (val === 'true') value = true;
		else if (val === 'false') value = false;
		
		//case unsigned nan and inf
		else if (val === 'nan') value = NaN;
		else if (val === 'inf') value = Infinity;
		
		else throwAtIndex(`unexpected token (${val})`, data, vToken.ind);
	}
	
	//case nb-like
	else if (vTokenType === NbLikeToken) {
		let val = vToken.val;
		
		//case -/+ inf/nan
		if (val === '+' || val === '-') {
			let nextToken = tokens[i +1];
			if (nextToken.type === BareKeyToken) {
				i++;
				if      (nextToken.val === 'nan') value = NaN;
				else if (nextToken.val === 'inf') value = val === '+' ? Infinity : -Infinity;
				else throwAtIndex(`unexpected token (${val})`, data, vToken.ind);
			} 
			else throwAtIndex(`unexpected token (${val})`, data, vToken.ind);
		}
		
		//case int
		else if (val.match(IntReg)) {
			value = Number(val.replaceAll('_', ''));
			if (Object.is(value, NaN)) throwAtIndex(`mulformed integer (${val})`, data, vToken.ind);
			if (!Number.isSafeInteger(value)) {
				if (value > 9223372036854775807 || value < -9223372036854775808)
					throwAtIndex(`(${val}) is not 64bit int`, data, vToken.ind);
				value = BigInt(val)
			}
		}
		
		//case float
		else if (val.match(FloatReg)) {
			value = Number(val.replaceAll('_', ''));
			if (Object.is(value, NaN)) throwAtIndex(`mulformed float (${val})`, data, vToken.ind);
		}
		
		//case date
		else {
			value = new Date(val);
			if (Object.is(value.getSeconds(), NaN)) throwAtIndex(`unexpected token (${val})`, data, vToken.ind);
		}
	}
	
	//case array
	else if (vTokenType === LeftBracketToken) 
		[value, i] = handleArray(tokens, i, data, keys, tableIsInlined, arrayIsTableArray, keysFromRoot);
	
	//case inline table
	else if (vTokenType === LeftCurlyToken)
		[value, i] = handleInlinedTable(tokens, i, data, keys, tableIsInlined, arrayIsTableArray, keysFromRoot)
	
	else throwAtIndex(`unexpected token (${data[vToken.ind]})`, data, vToken.ind);
	
	return [value, i]
}

var handleKeyValue = (parentTable, tokens, i, data, tableIsInlined, arrayIsTableArray, keysFromRoot, inlined) => {
	//get path until '='
	var path = [], value;
	while (tokens[i]?.type !== EqToken) {
		if (tokens[i] === undefined) throwAtIndex("end of file, expected '='", data, data.length);
		path.push(tokens[i]);
		i++
	}
	
	//get keys
	var keys = handleKeys(path, data, tokens[i].ind);
	var lastKey = keys.pop();
	
	//define tables until last key
	var table = keys.length ? handleTable(parentTable, keys, tableIsInlined, arrayIsTableArray, keysFromRoot, inlined) : parentTable;
	
	//inc ind to be after '='
	i++;
	
	//handle value
	[value, i] = handleValue(tokens[i], tokens, i, data, keys.concat(lastKey), tableIsInlined, arrayIsTableArray, keysFromRoot);
	
	//define value
	if (table[lastKey] === undefined) table[lastKey] = value;
	else throwAtKey('can not set defined value', keysFromRoot, keys.concat(lastKey), 100000);
	
	return i +1
}

var handleInlinedTable = (tokens, i, data, keys, tableIsInlined, arrayIsTableArray, keysFromRoot) => {
	//define table
	var table = {};
	tableIsInlined.set(table, true);
	
	keys = keysFromRoot.concat(keys);
	
	i++;
	
	var curToken = tokens[i], expectComma = false, empty = true;
	
	//loop until '}'
	while (curToken?.type !== RightCurlyToken) {
		empty = false;
		
		//case end of line
		if (curToken === undefined) throwAtIndex("end of file, expected '}'", data, data.length);
		
		//case new line
		else if (curToken.type === NLToken) throwAtIndex('unexpected new line', data, curToken.ind);
		
		//case comma
		else if (curToken.type === CommaToken) {
			if (expectComma) expectComma = false;
			else throwAtIndex('unexpected token (,)', data, curToken.ind);
			i++;
		}
		
		//case value
		else {
			expectComma = true;
			i = handleKeyValue(table, tokens, i, data, tableIsInlined, arrayIsTableArray, keys, true);
		}
		
		curToken = tokens[i];
	}
	
	//case of trailing comma
	if (!empty && !expectComma) throwAtIndex(`unexpected trailing comma`, data, tokens[i -1].ind);
	
	return [table, i]
}

var handleArray = (tokens, i, data, keys, tableIsInlined, arrayIsTableArray, keysFromRoot) => {
	//define array
	var array = [];
	arrayIsTableArray.set(array, false);
	
	keys = keysFromRoot.concat(keys);
	
	i++;
	
	var curToken = tokens[i], expectComma = false, value;
	
	//loop tokins until ']'
	while (curToken?.type !== RightBracketToken) {
		//case end of line
		if (curToken === undefined) throwAtIndex("end of file, expected ']'", data, data.length);
		
		//case new line, no thing
		else if (curToken.type === NLToken) {}
		
		//case comma
		else if (curToken.type === CommaToken) {
			if (expectComma) expectComma = false;
			else throwAtIndex('unexpected token (,)', data, curToken.ind);
		}
		
		//case value
		else {
			if (expectComma) throwAtIndex(`unexpected token (${data[curToken.ind]}), expected ','`, data, curToken.ind);
			[value, i] = handleValue(curToken, tokens, i, data, array.length, tableIsInlined, arrayIsTableArray, keys)
			array.push(value);
			expectComma = true
		}
		
		i++;
		curToken = tokens[i];
	}
	
	return [array, i]
}

var handleString = (token, data) => {
	var { basic, triple, str } = token;
	
	//slice new line directly after the triple quote
	if (triple) {
		if (str[0] === '\n') str = str.slice(1);
		if (str.startsWith('\r\n')) str = str.slice(2);
	}
	
	//single quoted strings can not contains new line
	if (!triple && str.includes('\n')) throwAtIndex('single quote contains new line', data, token.ind);
	
	//excape basic strings
	if (basic) str = str
		.replaceAll('\\b', '\b')
		.replaceAll('\\t', '\t')
		.replaceAll('\\n', '\n')
		.replaceAll('\\f', '\f')
		.replaceAll('\\r', '\r')
		.replaceAll('\\"', '"')
		.replaceAll('\\\\', '#\\#')
		.replaceAll(/\\U......../g, v => String.fromCodePoint(Number.parseInt(v.slice(2), 16)))
		.replaceAll(/\\u..../g, v => String.fromCodePoint(Number.parseInt(v.slice(2), 16)))
		.replaceAll(/\\\s*?\n\s*/g, '') //visualize: https://jex.im/regulex/#!flags=&re=%5C%5C%5Cs*%3F%5Cn%5Cs*
		.replaceAll('#\\#', '\\') //sometimes the above regex eat / where ever is it, so hide it
	
	return str
}