//setting page component

var { createComp, setFun, useRef } = $comp.func;

var data = {
	sala: {
		method: {
			'معهد ليفا، قم': 0,
			'جامعة العلوم الإسلامية، كراتشي': 1,
			'جمعية المسلمين في أمريكا الشمالية (ISNA)': 2,
			'رابطة العالم الإسلامي': 3,
			'جامعة أم القرى، مكة المكرمة': 4,
			'الهيئة العامة المصرية للمساحة': 5,
			'معهد الجيوفيزياء، جامعة طهران': 7,
			'المنطقة الخليجية': 8,
			'الكويت': 9,
			'قطر': 10,
			'المجلس الديني الإسلامي في سنغافورة': 11,
			'المنظمة الإسلامية الاتحادية في فرنسا': 12,
			'رئاسة الشؤون الدينية، تركيا': 13,
			'الإدارة الروحية للمسلمين في روسيا': 14,
			'لجنة رؤية الهلال عالمياً (Moonsighting.com)': 15,
			'دبي': 16,
			'جهاز الكِماجوان الإسلامي، ماليزيا': 17,
			'تونس': 18,
			'الجزائر': 19,
			'وزارة الشؤون الدينية، إندونيسيا': 20,
			'المغرب': 21,
			'الجالية الإسلامية في لشبونة': 22
		},
		midnightMode:{
			'قياسي (من منتصف الغروب إلى الشروق)': 0,
			'جعفري (من منتصف الغروب إلى الفجر)': 1
		},
		latitudeAdjustmentMethod: {
			'منتصف الليل': 1,
			'سيع الليل': 2,
			'بناءً على الزاوية': 3
		},
		shafaq: {
			'عام': 'general',
			'أحمر': 'ahmar',
			'أبيض': 'abyad'
		}
	}
};

var reverse = (obj) => {
	var cloned = {};
	for (let prop in obj) {
		if (typeof obj[prop] !== 'object') cloned[obj[prop]] = prop;
		else cloned[prop] = reverse(obj[prop])
	}
	return cloned
};
data.reverse = reverse(data); 

var byPath = (obj, path) => path.reduce((o,p) => o[p], obj);

var handleDataList = (id, obj) => useRef(id)[0].append(
	...Object.keys(obj).map(v => $el('option', { innerText: v })[0])
)

var comp = createComp(() => {
	setFun('post-init', () => {
		//generate datalists
		handleDataList('smethods', data.sala.method);
		handleDataList('midnmode', data.sala.midnightMode);
		handleDataList('lat-adj-mode', data.sala.latitudeAdjustmentMethod);
		handleDataList('shafaq', data.sala.shafaq);
		
		//set inputs
		useRef('inp').forEach(el => {
			var path = el.getAttribute('prop').split('.');
			var value = byPath(setting, path);
			el.value = el.hasAttribute('map') ? byPath(data.reverse, path)[value] : value;
		});
	});
	
	setFun('incSize', () => fontMan.incSize());
	setFun('decSize', () => fontMan.decSize());
	setFun('incType', () => fontMan.changeFont());
	setFun('decType', () => fontMan.changeFont());
	
	setFun('setBack', (el, color) => {
		setting.color = color;
		localStorage.setItem('z-setting', JSON.stringify(setting))
	});
	
	setFun('fromInp', (el) => {
		var path = el.getAttribute('prop').split('.');
		var obj = byPath(setting, path.slice(0, -1));
		obj[path[path.length-1]] = el.hasAttribute('map') ? byPath(data, path)[el.value] : el.value;
		localStorage.setItem('z-setting', JSON.stringify(setting))
	});
	
	return `<span>`
});

$comp.add('setting', comp);