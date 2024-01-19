//function namespaces
//example: ns:fun

//issafe: wethear is called in safe mode(donot throw errors) or not

import { CompError } from './error.js';

var funNS = {
	mg (name, comp, issafe, prop, ...args) {//get property value through a model fun
		if (issafe && !(name in comp.model.funs)) return;
		return comp.model.getFn(prop, name, ...args)
	},
	m (name, comp, issafe, ...args) {//call a model fun
		var fun = comp.model.funs[name];
		if (fun) return fun(comp.model, ...args);
		else if (issafe) return;
		throw new CompError(`model: undefined function (${name})`)
	},
	v (name, comp, issafe, el, ...args) {//call a view fun
		if (issafe && !(name in comp.view.funs)) return;
		return comp.view.call(el, name, ...args)
	},
	g (name, comp, issafe, ...args) { //call a global function
		var fun = $comp.globFuns[name];
		if (fun) return fun(comp, ...args);
		if (issafe) return;
		throw new CompError(`comp: undefined global function (${name})`)
	}
}

export { funNS }