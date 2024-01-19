//set:... actions handlers

import { parse } from '../template/parseAttr.js';

var setActs = {
	'set:attr' (comp, act) { //simple
		comp.binder.addSet(act.prop, {type: 'attrBasic', el: act.el[0], attr: act.attr})
	},
	'set:attr-temp' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'attr', el: act.el[0], attr: act.attr, temp: parse(act.temp, comp, act.el[0])})
	},
	'set:attr-call' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'attrCall', el: act.el[0], attr: act.attr, fun: act.fun, args: act.args})
	},
	'set:class-one' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'classOne', el: act.el[0], name: act.name})
	},
	'set:class-all' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'classAll', el: act.el[0]})
	},
	'set:style' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'style', el: act.el[0], prop: act.name, temp: act.temp && parse(act.temp, comp, act.el[0])})
	},
	'set:text' (comp, act) {
		var el = act.el[0];
		comp.binder.addSet(act.prop, {type: 'text', el, temp: parse(el.innerText, comp, el)})
	},
	'set:html' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'html', el: act.el[0]})
	},
	'set:if' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'if', el: act.el[0], prop: act.prop, cond: act.cond})
	},
	'set:for' (comp, act) {
		comp.binder.addSet(act.prop, {type: 'for', el:act.el[0], mtype: act.mtype, stype: act.stype, args: act.args, onemptyEls: act.onemptyEls})
	}
};

export { setActs }