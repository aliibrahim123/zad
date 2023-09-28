//setting page component

var { createComp, setFun, use$ } = $comp.func;

var comp = createComp(() => {
	setFun('incSize', () => fontMan.incSize());
	setFun('decSize', () => fontMan.decSize());
	setFun('incType', () => fontMan.changeFont());
	setFun('decType', () => fontMan.changeFont());
	
	return `<span>`
}, () => {
	$el('#main')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.87)';
});

$comp.add('setting', comp);