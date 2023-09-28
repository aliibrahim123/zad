//ghera page component

import { ghera } from '../data/ghera.js';
var { createComp, setFun, use$ } = $comp.func;

var comp = createComp(() => {
	setFun('handle', () => {
		var input = prompt('إختار صفحة من من الجهة اليمنى من القرآن');
		input = Math.round(Number(input));
		if (Number.isNaN(input) || input > 604 || input < 1) return alert('رقم خاطئ');
		var content = ghera[Math.max(0, Math.floor((input -1) / 2))];
		$el('#sub-content')[0].innerText = content[0] + '\n\nالخيرة:\n' + content[1] + '\n\nالمعاملة:\n' + content[2] + '\n\nالزواج:\n' + content[2];
	})
	
	return `<span>`
}, () => {
	$el('#main')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.87)';
});

$comp.add('ghera', comp);