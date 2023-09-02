//binder handlers

import { handleCreate, handleDelete, handleChange } from './forElHndl.js';

var handlers = {
	attr (obj, val, comp) { //attr bind by template
		comp.view.attr(obj.el, obj.attr, $comp.temps.parseAttr.handle(obj.temp, comp, obj.el, undefined))
	},
	html (obj, val, comp) {
		obj.el.innerHTML = val
	},
	text (obj, val, comp) {
		obj.node.textContent = $comp.temps.parseAttr.handle(obj.temp, comp, obj.el, undefined)
	},
	attrBasic (obj, val, comp) { //basic attribute bind by value
		comp.view.attr(obj.el, obj.attr, val)
	},
	attrCall (obj, val, comp) { //attribute bind with function call
		comp.view.attr(obj.el, obj.attr, comp.call(obj.fun, val, ...obj.args))
	},
	if (obj, val, comp) { //lonely conditions
		comp.call(obj.fun, obj.el, obj.condF(comp, obj.el, ...obj.prop.map(i=>comp.get(i))), ...obj.args)
	},
	ifElse (obj, val, comp) { //connected conditions
		var proparg = obj.prop.map(i=>comp.get(i));
		obj.conds.some(i => i.condF(comp, obj.el, ...proparg) && (comp.call(i.fun, obj.el, true, ...i.args) || true))
	},
	for (obj, val, comp,_, prop,__,meta) {
		var { el, collection } = obj;
		
		//create collection
		if (obj.mtype === 'collection' && !obj.collection) obj.collection = new $comp.CompCollection([], obj.args[0]);
		
		//case no array
		if (!meta.arr) { 
			el.replaceChildren(...obj.onemptyEls)
			if (prop) prop.meta['arr:old'] = undefined;
			
		} 
		
		//case empty array
		else if (meta['arr:empty']) {
			el.replaceChildren(...obj.onemptyEls);
			//remove all components in collection
			if (obj.mtype === 'collection') collection.remove(0, obj.collection.comps.length) 
			
		} 
		
		//case if was empty
		else if (meta['arr:wasempty']) {
			el.replaceChildren();
			val.forEach((i, ind)=> handleCreate(comp, obj, i, ind, prop))
			
		} 
		
		else {
			meta['arr:patch'].forEach(i=> {
				if (i.type === 'add') i.values.forEach((v, ind) => handleCreate(comp, obj, v, i.ind + ind, prop));
				if (i.type === 'delete') {
					for (let ind = i.count; ind > 0; ind--) {
						handleDelete(comp, obj, i.ind + ind -1, prop)
					}
				}
				if (i.type === 'change') i.values.forEach((v, ind) => handleChange(comp, obj, v, i.ind + ind, prop))
			})
			if (obj.type === 'collection') collection.set(val)
		}
	}
}

export { handlers }