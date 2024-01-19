//binder handlers

import { handleCreate, handleDelete, handleChange } from './forElHndl.js';
import { parse } from '../template/parseAttr.js';

var handlers = {
	attrBasic (obj, val, comp) { //basic attribute bind by value
		comp.view.attr(obj.el, obj.attr, val)
	},
	attrCall (obj, val, comp) { //attribute bind with function call
		comp.view.attr(obj.el, obj.attr, comp.call(obj.fun, val, ...obj.args))
	},
	attr (obj, val, comp) { //attr bind by template
		comp.view.attr(obj.el, obj.attr, parse.handle(obj.temp, comp, obj.el))
	},
	html (obj, val, comp) {
		obj.el.innerHTML = val
	},
	classOne (obj, val, comp) {
		if (val) obj.el.classList.add(obj.name);
		else obj.el.classList.remove(obj.name)
	},
	classAll (obj, val, comp, _, __, ___, meta) {
		var classList = obj.el.classList;
		//if not array
		if (!meta.arr) obj.el.className = '';
		//if empty
		else if (meta['arr:empty']) obj.el.className = '';
		//if was empty
		else if (meta['arr:wasempty']) obj.el.className = val.join(' ');
		
		else {
			//remove old
			[].forEach.call(classList, (name) => !val.includes(name) && classList.remove(name));
			
			//add new
			val.forEach((name) => !classList.contains(name) && classList.add(name))
		}
	},
	style (obj, val, comp) {
		obj.el.style.setProperty(obj.prop, obj.temp ? parse.handle(obj.temp, comp, obj.el) : val)
	},
	text (obj, val, comp) {
		obj.el.innerText = parse.handle(obj.temp, comp, obj.el, undefined)
	},
	if (obj, val, comp) {
		comp.call('v:show', obj.el, obj.cond(comp, obj.el, ...obj.prop.map(i=>comp.get(i))))
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