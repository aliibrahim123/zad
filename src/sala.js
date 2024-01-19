//sala timing getter
//using https://aladhan.com/prayer-times-api

export var getSalaTiming = async (date = new Date()) => {
	//case offline, return empty
	if (!navigator.onLine) return {		
		'الفجر': '00:00',
		'الشروق': '00:00',
		'الظهر': '00:00',
		'العصر': '00:00',
		'الغروب': '00:00',
		'المغرب': '00:00',
		'العشاء': '00:00',
		'الإمساك': '00:00',
		'ثلث الليل الأول': '00:00',
		'منتصف الليل': '00:00',
		'ثلث الليل الأخير': '00:00'
	}
	
	var dateStr = 
		date.getDate().toString().padStart(2, 0) + '-'
		+ (date.getMonth()+1).toString().padStart(2, 0) + '-'
		+ date.getFullYear().toString().padStart(4, 0);
	
	var location = await new Promise(r => navigator.geolocation.getCurrentPosition(r));
	
	var options = {
		latitude: location.coords.latitude,
		longitude: location.coords.longitude,
		method: setting.sala.method,
		tune: setting.sala.tune.join(','),
		midnightMode: setting.sala.midnightMode,
		latitudeAdjustmentMethod: setting.sala.latitudeAdjustmentMethod,
		adjustment: setting.dateAdjustment,
		shafaq: setting.sala.shafaq
	};
	
	var response = (await (await fetch(
		`http://api.aladhan.com/v1/timings/${dateStr}?${Object.entries(options).map(v => v.join('=')).join('&')}`
	)).json());
	
	var timings = response.data.timings;
	
	return {
		'الفجر': timings.Fajr || '00:00',
		'الشروق': timings.Sunrise || '00:00',
		'الظهر': timings.Dhuhr || '00:00',
		'العصر': timings.Asr || '00:00',
		'الغروب': timings.Sunset || '00:00',
		'المغرب': timings.Maghrib || '00:00',
		'العشاء': timings.Isha || '00:00',
		'الإمساك': timings.Imsak || '00:00',
		'ثلث الليل الأول': timings.Firstthird || '00:00',
		'منتصف الليل': timings.Midnight || '00:00',
		'ثلث الليل الأخير': timings.Lastthird || '00:00'
	}
}