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
		}, 1500)
	});
	setFun('goToMWork', () => {
		var [day, month] = dateConverter.toHijri(new Date().getDate(), new Date().getMonth() +1, new Date().getFullYear());
		$comp.router.go(`amal/month?path=${globalObjects.months[month -1]}/اليوم (${day})`);
	});
	setFun('goToWWork', () => {
		$comp.router.go(`amal/ayam?path=${Object.keys(globalObjects['اعمال الأسبوع'])[new Date().getDay()]}`);
	});
	
	return `<span>`
}, () => {
	//clean element with flowIn class
	setTimeout(() => $el.chain('.flowIn').removeClass('flowIn'), 5000);
	
	//handle today sub menu
	var [day, month, year] = dateConverter.toHijri(new Date().getDate(), new Date().getMonth() +1, new Date().getFullYear());
	month = globalObjects.months[month -1];
	$el('#time')[0].innerText = `اليوم: ${day} ${month} ${year}`;
	var monasabat = globalObjects.monasabatData[globalObjects['مناسبات'][month][`اليوم (${day})`]];
	if (monasabat) $el('#monasabat')[0].innerText = monasabat + '\n\n';
	if (monasabat) $el('#monhead')[0].className = '';
	if (globalObjects['اعمال الأشهر'][month][`اليوم (${day})`]) $el('#mwork')[0].className = '';
	
	lastFahrasPath = []
});

$comp.add('main', comp);