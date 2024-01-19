//comp:... actions handlers

var compActs = {
	'comp:this' (par, act) {
		var { el, name } = act;
		el.forEach(el => {
			let comp = new ($comp.get(name))(el);
			par.addChild(comp)
		})
	},
	'comp:log' (comp, act) {
		console.log([act.data || 'hallo', act?.el?.[0], comp])
	},
	'comp:sub' (comp, act) {
		comp.view.setSub(act.el, ...act.data)
	},
	'comp:ref' (comp, act) {
		comp.view.addRef(act.name, act.el)
	},
	'comp:call' (comp, act) {
		comp.call(act.fun, act.el[0], ...act.args)
	}
};

export { compActs }