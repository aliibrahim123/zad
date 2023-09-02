//binder prehandlers

import { simple } from '../../com/diff/simple.js';

var prehandlers = {
	Array (comp, prop, oldv, newv, meta) {
		var nmeta,/* new meta */ oldarr = prop.meta['arr:old'];
		if (meta.set) //is set
			nmeta = {...meta, 'arr:wasempty': true}; 
		
		else if ((!oldarr || oldarr.length === 0) && newv.length !== 0) //was not array or empty
			nmeta = {...meta, 'arr:wasempty': true};
		
		else if (meta['arr:op']) //array operation
			nmeta = {...meta, 'arr:patch': [{...meta, type: meta['arr:op']}]};
		
		else if (newv.length === 0) //empty
			nmeta = {...meta, 'arr:empty': true};
		
		else //differencing
			nmeta = {...meta, 'arr:patch': simple(oldarr, newv).map(i=>{return {...i, values: newv.slice(i.nind, i.nind + i.count)}})};
		
		prop.meta['arr:old'] = [...newv];
		nmeta.arr = true;
		return nmeta
	} 
};

export { prehandlers }