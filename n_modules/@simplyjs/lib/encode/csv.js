//encode/decode csv files

//checkers
var checkstr = (str, name) => {
	if (typeof str !== 'string') throw new TypeError(`csv: ${name} of type (${str?.constructor?.name}), expected (String)`);
}

var checkarr = (arr, name) => { 
	if (!Array.isArray(arr)) throw new TypeError(`csv: ${name} of type (${arr?.constructor?.name}), expected (Array)`);
}

var checkfn = (fn, name) => {
	if (typeof fn !== 'function') throw new TypeError(`csv: ${name} of type (${fn?.constructor?.name}), expected (Function)`);
}

export var checkstrReg = (val, name) => {
	if (typeof val !== 'string' && !(val instanceof RegExp)) 
		throw new TypeError(`csv: ${name} of type (${val?.constructor?.name}), expected (String) or (RegExp)`);
};

export class CSVError extends Error {
	constructor (msg) {
		this.name = 'csv'
		this.message = msg
	}
}

var separators = [',', ';', '|', '\t', '^'];

//matches lines including quotes
//visualize (quote = "): https://jex.im/regulex/#!flags=&re=(%3F%3A%5B%5E%22%5Cn%5Cr%5D%2B%7C(%3F%3A%22(%3F%3A%22%22%7C%5B%5E%22%5D)*%22))%2B
var lineMatcher = (q) => new RegExp(`(?:[^${q}\n\r]+|(?:${q}(?:${q}${q}|[^${q}])*${q}))+`, 'g');

//matches cells including quotes
//visualize (separator = , and quote = "): https://jex.im/regulex/#!flags=&re=(%3F%3A%5B%5E%2C%22%5D%7C(%3F%3A%22(%3F%3A%22%22%7C%5B%5E%22%5D)*%22))%2B
var cellMatcher = (s, q) => new RegExp(`(?:[^${s}${q}]+|(?:${q}(?:${q}${q}|[^${q}])*${q}))+`, 'g')

var auto = Symbol('auto');

var detectSeparator = (lines) => {
	//get the minimiums count of separator in every line for all separators
	var mins = separators.map(separator => Math.min(
		...lines.map(line => line.split(separator).length)
	));
	
	//get the separator with the maximuim count
	var [ind, count] = mins.reduce(([sepi, count], cur, ind) => cur > count ? [ind, cur] : [sepi, count], [0,0]);
	
	//return it
	return separators[ind]
}

var encodeCell = (cell, quote, doQuoteRegex) => {
	cell = String(cell);
	return cell.match(doQuoteRegex) ? `${quote}${cell.replaceAll(quote, quote + quote)}${quote}` : cell
}

export var encode = (data, opts = {}) => {
	//get opts
	var { separator, lineEnd, quote } = {
		separator: ',',
		lineEnd: '\r\n',
		quote: '"',
		...opts
	};
	
	checkarr(data, 'data');
	checkstr(separator, 'separator');
	checkstr(lineEnd, 'lineEnd');
	checkstr(quote, 'quote');
	
	//make doQuoteRegex
	var doQuoteRegex = new RegExp('[' + lineEnd + separator + quote + ']')
	
	//get header
	var headers = Array.isArray(data[0]) ? false : Object.keys(data[0]);
	
	//encode header
	var header = headers ? 
	  headers.map(cell => encodeCell(cell, quote, doQuoteRegex)).join(separator) + lineEnd
	: '';
	
	//encode body
	var body = data.map(line => {
		if (headers) line = headers.map(name => line?.[name]);
		return line.map(cell => encodeCell(cell, quote, doQuoteRegex)).join(separator)
	}).join(lineEnd);
	
	return header + body
}

export var decode = (data, opts = {}) => {
	//get options
	var { separator, lineEnd, quote, headers, trim, cast, throwLengthNotEqual } = {
		separator: auto,
		lineEnd: '',
		quote: '"',
		headers: true,
		trim: false, //trim cells
		cast: true, //cast to string, number, undefined, null and boolean
		throwLengthNotEqual: true,
		...opts
	};
	
	checkstr(data, 'data');
	if (separator !== auto) checkstr(separator, 'separator');
	checkstrReg(lineEnd, 'lineEnd');
	checkstr(quote, 'quote');
	if (headers !== true && headers !== false) checkarr(headers, 'headers');
	if (cast !== true && cast !== false) checkarr(cast, 'cast');
	
	//split into lines
	var lineMatch = lineEnd || lineMatcher(quote);
	var lines = data.match(lineMatch);
	
	//auto detect separator
	if (separator === auto) separator = detectSeparator(lines);
	var cellMatch = cellMatcher(separator, quote);
	
	//split into cells, cell -> trim -> remove quote
	lines = lines.map(line => {
		return line.match(cellMatch).map(cell => {
			if (trim) cell = cell.trim();
			if (cell[0] === quote) cell = cell.slice(1, -1).replaceAll(quote + quote, quote);
			return cell
		});
	});
	
	//get headers
	if (headers === true) {
		headers = lines[0];
		lines = lines.slice(1)
	}
	
	return lines.map((line, lInd) => {
		//check line length
		if (headers && headers.length !== line.length && throwLengthNotEqual) 
			throw new CSVError(`line (${lInd}) of length (${line.length}), expected (${headers.length})`);
		
		//cast by Array
		if (Array.isArray(cast)) line = line.map((cell, i) => {
			var casting = cast[i];
			if (casting === 'string') return cell;
			if (casting === 'number') return Number(cell);
			if (cell === 'true') return true;
			if (cell === 'false') return false;
			if (cell === 'undefined') return;
			if (cell === 'null') return null;
			if (casting === 'date') return new Date(cell);
			if (casting === 'json') return JSON.parse(cell);
			throw new CSVError(`undefined casting type (${casting})`)
		});
		
		//cast by detect
		else if (cast) line = line.map(cell => {
			if (cell === 'true') return true;
			if (cell === 'false') return false;
			if (cell === 'undefined') return;
			if (cell === 'null') return null;
			var nb = Number(cell);
			if (!Number.isNaN(nb)) return nb;
			return cell
		});
		
		//map by headers
		if (headers) line = line.reduce((obj, cell, i) => {
			obj[headers[i]] = cell;
			return obj
		}, {});
		
		return line
	});
}

export default {
	encode, decode
}