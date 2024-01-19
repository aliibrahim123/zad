//root page component

var { createComp, setFun, useStore, useRef } = $comp.func;

var comp = createComp(() => {
	setFun('init', () => {
		var store = useStore();
		store.curMenu = '';
		store.date = '';
		store.monasabat = '';
		store.stime = '';
	})
	setFun('post-init', async () => {
		//handle state
		var store = useStore();
		
		//handle title first animation
		var title = useRef('title')[0];
		title.classList.remove('centered');
		title.style.background = 'rgba(0,0,0,0.55)';
		title.style.border = 'solid black 3px';
		title.style.borderRadius = '24px';
		
		//handle items enter animation
		[].forEach.call(useRef('button-grid')[0].children, (item, i) => {
			item.classList.remove('hide');
			item.animate([{
				transform: 'translateY(50px)',
				opacity: 0
			}, {}], {
				duration: 1000,
				delay: 650 + i * 100,
				fill: 'backwards',
				easing: 'cubic-bezier(0.19, -0.01, 0.63, 1.38)',
			})
		});
	
		//handle today sub menu
		var mwork = useRef('mwork')[0];
		//set date
		var date = new Date();
		date.setDate(date.getDate() + Number(setting.dateAdjustment));
		var [day, month, year] = dateConverter.toHijri(date.getDate(), date.getMonth() +1, date.getFullYear());
		month = globalObjects.months[month -1];
		store.date = `${day} ${month} ${year}`;
		
		//set sala
		var timings = await getSalaTiming(date);
		store.stime = Object.entries(timings).map(([name, time]) => `${name}: ${time}`).join('\n');
		
		//set monasabat
		var monasabat = globalObjects.monasabatData[globalObjects['مناسبات'][month][`اليوم (${day})`]];
		store.monasabat = monasabat ? monasabat + '\n\n' : '';
		
		//show month work
		if (globalObjects['اعمال الأشهر'][month][`اليوم (${day})`]) mwork.classList.remove('hide');
	})
	setFun('showSubMenu', (el, menu) => {
		var store = useStore();
		store.curMenu = menu;
		
		//hide main menu
		useRef('main-menu')[0].animate([
			{ transform: 'scale(100%)', height: '100%' },
			{ height: '0px', transform: 'scale(0%)'}
		], { fill: 'both', duration: 1000, easing: 'ease-out' });
		
		//show sub menu
		useRef(menu)[0].classList.remove('hide');
		useRef(menu)[0].animate([
			{ transform: 'scale(0)', height: '0%' },
			{ transform: 'scale(100%)', height: '100%' }
		], { fill: 'both', duration: 1000 });
	});
	
	setFun('showMainMenu', (el) => {
		var store = useStore();
		//show main menu
		useRef('main-menu')[0].animate([
			{ height: '0%', transform: 'scale(0%)' },
			{ height: '100%', transform: 'scale(100%)'}
		], { fill: 'both', duration: 1000, easing: 'ease-out' });
		
		//hide sub menu
		useRef(store.curMenu)[0].animate([
			{ transform: 'scale(100%)', height: '100%' },
			{ transform: 'scale(0)', height: '0%' }
		], { fill: 'both', duration: 1000, easing: 'ease-out' });
		
		store.curMenu = '';
	});
	setFun('goToMWork', () => {
		var [day, month] = dateConverter.toHijri(new Date().getDate(), new Date().getMonth() +1, new Date().getFullYear());
		$comp.router.go(`fahras.html#اعمال الأشهر/${globalObjects.months[month -1]}/اليوم (${day})`);
	});
	setFun('goToWWork', () => {
		$comp.router.go(`fahras.html#اعمال الأسبوع/${Object.keys(globalObjects['اعمال الأسبوع'])[new Date().getDay()]}`);
	});
	
	return `<span>`
});

$comp.add('main', comp);