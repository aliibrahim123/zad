//handle loop element handling

//array looping:
//	value is not an array: clear element
//	value is empty: clear element
//	value was empty: add all
//	else: apply patch
//patch handling:
//	main type = sub
//		add: append sub
//		remove: remove sub
//		change: replace sub
//	main type = comp
//		add: append component
//		delete: delete component
//		change: update component property
//	main type = collection
//		add: append component
//		delete: delete component
//		change: update component property
//		always reupdate the components property

import { CompError } from '../base/error.js';

var handleCreate = (comp, obj, val, ind, prop) => {
	var { el, mtype, stype, args } = obj;
	
	if (mtype === 'sub') comp.view.appendSub(el, stype, ind, val, ...args);
	
	else if (mtype === 'comp') {
		//construct component
		var child = new ($comp.get(stype))(undefined, ...args.slice(1));
		
		//append it
		if (ind === el.children.length) el.append(child.el);
		else el.children[ind].before(child.el)
		
		//set property
		child.set(typeof val === 'object' ? val : (args[0] || 'value'), val);
		
		//add to parent
		comp.addChild(child)
	
	} else if (mtype === 'collection') {
		//construct component
		var child = new ($comp.get(stype))(undefined, ...args.slice(1));
		
		//append it
		if (ind === el.children.length) el.append(child.el);
		else el.children[ind].before(child.el)
		
		//set property
		child.set(typeof val === 'object' ? val : (args[0] || 'value'), val);
		
		//add to parent and collection
		comp.addChild(child);
		obj.collection.add(child, ind)
	
	} else throw new CompError('binder handler (for): undefined main type (' + mtype + ')')
}

var handleDelete = (comp, obj, ind, prop) => {
	var { mtype, el } = obj;
	if (mtype === 'sub') el.children[ind].remove();
	else if (mtype === 'comp') el.children[ind].$comp.remove();
	else if (mtype === 'collection') {
		el.children[ind].$comp.remove();
		obj.collection.remove(ind)
	} else throw new CompError('binder handler (for): undefined main type (' + mtype + ')')
}

var handleChange = (comp, obj, val, ind, prop) => {
	var { mtype } = obj;
	if (mtype === 'sub') {
		obj.el.children[ind].remove();
		comp.view.appendSub(obj.el, obj.stype, ind, val, ...obj.args);
	}
	else if (mtype === 'comp') obj.el.children[ind].$comp.set(typeof val === 'object' ? val : (obj.args[0] || 'value'), val);
	else if (mtype === 'collection') obj.collection.setOne(val, ind);
	else throw new CompError('binder handler (for): undefined main type (' + mtype + ')')
}

export { handleCreate, handleDelete, handleChange }