//bind:... actions handlers

var useBindActs = {
	'bind:attr' (comp, act) { //simple
		comp.binder.addB(act.prop, {type: 'attrBasic', el: act.el[0], attr: act.attr})
	},
	'bind:attr-temp' (comp, act) {
		comp.binder.addB(act.prop, {type: 'attr', el: act.el[0], attr: act.attr, temp: $comp.temps.parseAttr(act.temp, comp, act.el[0])})
	},
	'bind:attr-call' (comp, act) {
		comp.binder.addB(act.prop, {type: 'attrCall', el: act.el[0], attr: act.attr, fun: act.fun, args: act.args})
	},
	'bind:text' (comp, act) {
		var el = act.el[0];
		el.childNodes.forEach(n=> {
			if (n.nodeType !== n.TEXT_NODE) return;
			var temp = $comp.temps.parseAttr(n.textContent, comp, el);
			comp.binder.addB(act.prop, {type: 'text', el, node: n, temp})
		});
	},
	'bind:html' (comp, act) {
		comp.binder.addB(act.prop, {type: 'html', el: act.el[0]})
	},
	'bind:if' (comp, act) {
		comp.binder.addB(act.prop, {type: 'if', el: act.el[0], prop: act.prop, condF: act.condF, fun: act.fun, args: act.args})
	},
	'bind:if-else' (comp, act) {
		comp.binder.addB(act.prop, {type: 'ifElse', el: act.el[0], prop: act.prop, conds: act.conds})
	},
	'bind:for' (comp, act) {
		comp.binder.addB(act.prop, {type: 'for', el:act.el[0], mtype: act.mtype, stype: act.stype, args: act.args, onemptyEls: act.onemptyEls})
	}
};

export { useBindActs }