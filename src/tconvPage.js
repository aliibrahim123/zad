//date converter page component

var { createComp, setFun, useStore } = $comp.func;

var months = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'نشرين الثاني', 'كانون الأول'];

var comp = createComp(() => {
	setFun('init', () => {
		var store = useStore();
		store.out = 'في الإنتظار';
	})
	setFun('toHijri', () => {
		var store = useStore();
		var day = store.day-0;
		var month = store.month-0;
		var year = store.year-0;
		[day, month, year] = dateConverter.toHijri(day, month, year);
		store.out = `${day} ${globalObjects.months[month -1]} ${year}`
	});
	setFun('fromHijri', () => {
		var store = useStore();
		var day = store.day-0;
		var month = store.month-0;
		var year = store.year-0;
		[day, month, year] = dateConverter.fromHijri(day, month, year);
		store.out = `${day} ${months[month -1]} ${year}`
	});
	
	return `<span>`
});

$comp.add('tconv', comp);