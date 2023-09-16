//short doaa page component

import doaa from '../data/doaaShort.js';
var { createComp, setFun, use$, useCall } = $comp.func;

var comp = createComp(() => {
	setFun('randomize', () => {
		$el('#sub-content')[0].innerText = Array.from({length: 10}, 
			() => doaa[Math.floor(Math.random() * doaa.length)]
		).join('\n-----------\n\n')
	})
	
	return `<span>`
}, () => {
	useCall('randomize')
});

$comp.add('short-doaa', comp);