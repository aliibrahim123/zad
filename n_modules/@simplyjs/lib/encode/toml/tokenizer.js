//toml tokenizer

import { TOMLError, throwAtIndex } from './error.js';

export var NLToken    = Symbol('\n');
export var EqToken    = Symbol('eq');
export var DotToken   = Symbol('.');
export var CommaToken = Symbol(',');

export var LeftCurlyToken    = Symbol('{');
export var RightCurlyToken   = Symbol('}');
export var LeftBracketToken  = Symbol('[');
export var RightBracketToken = Symbol(']');

export var StrToken = Symbol('string');

export var BareKeyToken = Symbol('bare key');

export var NbLikeToken = Symbol('int/float/date');

//match bare keys
//visualize: https://jex.im/regulex/#!flags=&re=%5Ba-zA-Z0-9_-%5D%2B
export var BareKeyReg = /[a-zA-Z0-9_-]+/g;

import { SQuoteX3Reg, DQuoteX1Reg, DQuoteX3Reg, NbLikeReg, NbLikeFirstReg } from './regex.js';

export var tokenizer = (data) => {
	var tokens = [];
	
	var len = data.length, i = 0;
	while (i !== len) {
		var curChar = data[i];
		
		//case of white space, descard all until non-white space 
		if (curChar === ' ' || curChar === '\t') {
			i++;
			while (data[i] === ' ' || data[i] === '\t') i++;
			continue
		}
		
		//case of new line
		else if (curChar === '\n') tokens.push({ type: NLToken, ind: i }) && (i += 1);
		else if (curChar === '\r') tokens.push({ type: NLToken, ind: i }) && (i += 2);
		
		//case of single character tokens (=, ., ',', {, }, [, ])
		else if (curChar === '=') tokens.push({ type: EqToken,           ind: i }) && (i += 1);
		else if (curChar === '.') tokens.push({ type: DotToken,          ind: i }) && (i += 1);
		else if (curChar === ',') tokens.push({ type: CommaToken,        ind: i }) && (i += 1);
		else if (curChar === '{') tokens.push({ type: LeftCurlyToken,    ind: i }) && (i += 1);
		else if (curChar === '}') tokens.push({ type: RightCurlyToken,   ind: i }) && (i += 1);
		else if (curChar === '[') tokens.push({ type: LeftBracketToken,  ind: i }) && (i += 1);
		else if (curChar === ']') tokens.push({ type: RightBracketToken, ind: i }) && (i += 1);
		
		//case of comments, descard all until new line or end of file
		else if (curChar === '#') {
			i = data.indexOf('\n', i) + 1;
			if (i === 0) break;
			tokens.push({ type: NLToken, ind: i -1 })
			continue
		}
		
		//case of int/float/date
		else if (curChar.match(NbLikeFirstReg)) {
			let start = i;
			NbLikeReg.lastIndex = i;
			let str = NbLikeReg.exec(data)[0];
			i = NbLikeReg.lastIndex;
			tokens.push({ type: NbLikeToken, val: str, ind: start})
		}
		
		//case of bare key
		else if (curChar.match(BareKeyReg)) {
			let start = i;
			BareKeyReg.lastIndex = i;
			let str = BareKeyReg.exec(data)[0];
			i = BareKeyReg.lastIndex;
			tokens.push({ type: BareKeyToken, val: str, ind: start})
		}
		
		//case of basic string
		else if (curChar === '"') {
			let str = '', start = i;
			//triple double quote
			if (data[i +1] === '"' && data[i +2] === '"') {
				DQuoteX3Reg.lastIndex = i;
				str = DQuoteX3Reg.exec(data)?.[0];
				if (str === undefined) throwAtIndex('unclosed quote', data, i);
				i = DQuoteX3Reg.lastIndex;
				tokens.push({type: StrToken, basic: true, triple: true, str: str.slice(3, -3), ind: start })
			
			//single double quote
			} else {
				DQuoteX1Reg.lastIndex = i;
				str = DQuoteX1Reg.exec(data)?.[0];
				if (str === undefined) throwAtIndex('unclosed quote', data, i);
				i = DQuoteX1Reg.lastIndex;
				tokens.push({type: StrToken, basic: true, triple: false, str: str.slice(1, -1), ind: start })
			}
			continue
		}
		
		//literal strings
		else if (curChar === "'") {
			let str = '', ind = 0, start = i;
			
			//triple single quote
			if (data[i +1] === "'" && data[i +2] === "'") {
				SQuoteX3Reg.lastIndex = i;
				str = SQuoteX3Reg.exec(data)?.[0];
				if (str === undefined) throwAtIndex('unclosed quote', data, i);
				i = SQuoteX3Reg.lastIndex;
				tokens.push({type: StrToken, basic: false, triple: true, str: str.slice(3, -3), ind: start })
				
			//single single quote
			} else {
				ind = data.indexOf("'", i +1);
				str = data.slice(i, ind +1);
				if (ind === -1) throwAtIndex('unclosed quote', data, i);
				i = ind +1;
				tokens.push({type: StrToken, basic: false, triple: false, str: str.slice(1, -1), ind: start })
			}
			continue
		}
		
		//unknown tokens
		else throwAtIndex(`unexpected token (${curChar})`, data, i)
	}
	
	return tokens
}