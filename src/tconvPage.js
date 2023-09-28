//date converter page component

var { createComp, setFun, useCall, useComp } = $comp.func;

var months = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'نشرين الثاني', 'كانون الأول'];

var comp = createComp(() => {
	setFun('toHijri', () => {
		var day = $el('#day')[0].value-0;
		var month = $el('#month')[0].value-0;
		var year = $el('#year')[0].value-0;
		[day, month, year] = dateConverter.toHijri(day, month, year);
		$el('#out')[0].innerText = `${day} ${globalObjects.months[month -1]} ${year}`
	});
	setFun('fromHijri', () => {
		var day = $el('#day')[0].value-0;
		var month = $el('#month')[0].value-0;
		var year = $el('#year')[0].value-0;
		[day, month, year] = dateConverter.fromHijri(day, month, year);
		$el('#out')[0].innerText = `${day} ${months[month -1]} ${year}`
	});
	
	return `<span>`
}, () => {
	$el('#main')[0].style.backgroundColor = 'rgba(0, 0, 0, 0.87)';
});

$comp.add('tconv', comp);