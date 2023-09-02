//reduce object

import checkfn from './checkfn.js';

export var reduce = (obj, reducer, init) => {
	checkfn(reducer, 'reducer')
	for (let prop in obj) {
		init = reducer(init, obj[prop], prop, obj)
	}
	return init
};

export var reduceTyped = (obj, reducer, init) => { //with prototype
	checkfn(reducer, 'reducer')
	Object.keys(obj).forEach(prop=>{
		init = reducer(init, obj[prop], prop, obj)
	});
	return init
}