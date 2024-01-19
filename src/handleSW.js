//handle service worker

export var register = async () => {
	if (!navigator.onLine) return; //skip if offline
	
	var curVersion = await (await fetch(curPath + 'version.txt')).text();
	var lastVersion = localStorage.getItem('z-last-v');
	
	
	if (lastVersion === curVersion) return;
	if (lastVersion) (await navigator.serviceWorker.getRegistration())?.unregister?.();
	navigator.serviceWorker.register(curPath + 'sw.js', {type:'module'});
		
	localStorage.setItem('z-last-v', curVersion);
	
	if (lastVersion) $el('#main')[0].innerText = `
توفر تحديث جديد
يرجى اعادة تحمبل الصفحة واعادة تنزيل البيانات
	`;
	else $comp.router.go(curPath + 'opages/hallo.html')
}
