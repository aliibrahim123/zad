//attribut parsing and handling

//syntax:
//{prop}: property value
//{@ns:value}: value namespace
//{{expression}}: normal expression, append 'return' on need, called with (comp, model, el, value)
//{{#expression}}: precomputed normal expression, append 'return' on need, called with (comp, model, el, value)
//{$fun(...args)}: function call (fun) with args

//value namespace: computed values

import { checkel, checkcomp, checkstr, CompError } from '../check.js';

var parse = (str, comp, el, value) => {
	checkstr(str, 'str', 'parse attr');
	
	var arr = str.split(parse.regex);
	var bytecode = [];
	
	arr.forEach(i=>{
		if (i==='') return; //empty, ignore
		else if (i.startsWith('{')) {
			if (i.startsWith('{{#')) return bytecode.push({//precomputed expression
				type: 'val',
				value: Function('comp', 'model', 'el', 'value', i.includes(';') ? i.slice(3,-2) : 'return ' + i.slice(3,-2))
					(comp, comp.model, el, value)
			});
			if (i.startsWith('{{')) return bytecode.push({//expression
				type:'exp', 
				fun: Function('comp', 'model', 'el', 'value', i.includes(';') ? i.slice(2,-2) : 'return ' + i.slice(2,-2))
			});
			if (i.startsWith('{$')) return bytecode.push(parseFun(i.slice(2,-1))); //function call
			if (i.startsWith('{@')) return bytecode.push({type: 'vNS', value: i.slice(2, -1).split(':')}); //value namespace
			bytecode.push({type: 'prop', name: i.slice(1,-1)}) //property
		}
		else bytecode.push({type: 'val', value: i}) //static value
	})
	return bytecode
}

//match ['{this}', '{{an example}}'] in '{this} is {{an example}}'
//visualize: https://jex.im/regulex/#!flags=&re=(%7B%7B%5B%5Cs%5CS%5D%2B%3F%7D%7D%7C%7B%5B%5E%7B%5D%2B%7D)
parse.regex = /({{[\s\S]+?}}|{[^{]+})/;

parse.parseArg = (str) => {
	if (str[0] === '@') return str.slice(1).split(':'); //value namespace
	if (str === 'true') return true;
	if (str === 'false') return false;
	if (str === 'null') return null;
	if (str === 'undefined') return undefined;
	var n = Number(str);
	if (!isNaN(n)) return n;
	return str
}

var parseArgs = (str) => {
	return str.split(',').map(i=>i.trim()).map(parse.parseArg)
}

var parseFun = (str) => {
	var parts = str.trim().split('(');
	return {
		type: 'call',
		fun: parts[0].trim(),
		args: parseArgs(parts[1].trimEnd().slice(0,-1))
	}
}

parse.valueNS = { 
	attr (comp, el, value, arg) {
		return comp.view.attr(el, arg[1])
	},
	prop (comp, el, value, arg) {
		return comp.get(arg[1])
	}
}

parse.handle = (str, comp, el, value) => { 
	checkcomp(comp, 'parse attr');
	checkel(el, 'parse attr');
	
	if (typeof str === 'string') var arr = parse(str, comp, el, value);
	else if (Array.isArray(str)) var arr = str;
	else throw new CompError('parse attr: str of type (' + str?.constructor?.name + '), expected (String) or (Array)');
	
	return arr.map(i=>{
		if (i.type === 'val') return i.value; //static value
		else if (i.type === 'prop') return comp.get(i.name); //property
		else if (i.type === 'exp') return i.fun(comp, comp.model, el, value); //expression
		else if (i.type === 'call') return comp.call(obj.fun, ...obj.args.map(i=> 
			Array.isArray(i) ? parse.valueNS[i[0]](comp, el, value, i) : i
		)); //function call
		else if (i.type === 'vNS') return parse.valueNS[i.value[0]](comp, el, value, i.value); //value namespace
		else throw new CompError('parse attr: undefined attribute expression type ('+i.type+')')
	}).join('')
}

export { parse }