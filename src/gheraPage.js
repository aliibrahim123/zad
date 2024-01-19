//ghera page component

import { ghera } from '../data/ghera.js';
var { createComp, setFun } = $comp.func;

var comp = createComp(() => {
	setFun('handle', async () => {
		var input = await createPrompt('إختار صفحة من من الجهة اليمنى من القرآن');
		input = Math.round(Number(input));
		if (Number.isNaN(input) || input > 604 || input < 1) return alert('رقم خاطئ');
		var content = ghera[Math.max(0, Math.floor((input -1) / 2))];
		$el('#content')[0].innerText = content[0] + '\n\nالخيرة:\n' + content[1] + '\n\nالمعاملة:\n' + content[2] + '\n\nالزواج:\n' + content[2];
	})
	
	return `<span>`
});

$comp.add('ghera', comp);