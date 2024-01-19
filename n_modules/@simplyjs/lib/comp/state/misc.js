//various state utility

import { checkDataProv, checkstr } from '../check.js';

//bind state between components
export var createBound = (source, sourceProp, dist, distProp, unidir = false) => {
	checkDataProv(source, 'comp', 'source');
	checkDataProv(dist, 'comp', 'dist');
	checkstr(sourceProp, 'sourceProp', 'comp');
	checkstr(distProp, 'distProp', 'comp');
	
	var isReacting = false;
	
	source.effects.add(sourceProp, (c,value) => {
		if (isReacting) return;
		isReacting = true;
		dist.model.set(distProp, value);
		isReacting = false
	});
	
	if (unidir) dist.effects.add(distProp, (c,value) => {
		if (isReacting) return;
		isReacting = true;
		source.model.set(sourceProp, value);
		isReacting = false
	})
}