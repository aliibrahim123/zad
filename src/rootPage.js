//root page component

var { createComp, setFun, use$ } = $comp.func;

var comp = createComp(() => {
	setFun('showSubMenu', (el, menu) => {
		$el.chain('#title').addClass('shrink');
		$el.chain('.item').addClass('shrink');
		$el.chain('.sub-menu[sub-menu="' + menu + '"]').removeClass('hide').addClass('grow1')
	});
	
	setFun('showMainMenu', (el) => {
		$el.chain('#title').addClass('grow2');
		$el.chain('.item').addClass('grow2');
		$el.chain('.sub-menu.grow1').removeClass('grow1').addClass('shrink2');
		
		//clean after animation
		setTimeout(() => {
			$el.chain('.grow2').removeClass('grow2').removeClass('shrink');
			$el.chain('.shrink2').addClass('hide').removeClass('shrink2')
		}, 2000)
	});
	
	return `<span>`
}, () => {
	//clean element with flowIn class
	setTimeout(() => $el.chain('.flowIn').removeClass('flowIn'), 5000)
});

$comp.add('main', comp);