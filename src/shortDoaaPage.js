//short doaa page component

import doaa from '../data/doaaShort.js';
var { createComp, setFun, useStore, useCall } = $comp.func;

var comp = createComp(() => {
	setFun('init', () => {
		useCall('randomize');
	})
	setFun('randomize', () => {
		useStore().content = Array.from({length: 10}, 
			() => doaa[Math.floor(Math.random() * doaa.length)]
		).join('\n-----------\n\n')
	})
	
	return `<span>`
});

$comp.add('short-doaa', comp);