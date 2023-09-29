globalThis.downloadAll = () => {
	localStorage.setItem('downloadable', 'true')
	navigator.serviceWorker.controller.postMessage('cache');
}

if (!localStorage.getItem('notFirstTime')) document.body.append($el(`<div id=ftdownload class=popup>
	لتتمكن من التصفح بلا انترنت الرجاء التنريل (يمكنك التنزيل وقت ما تريد من خلال الخيار الموجود في قائمة 'أخرى')
	<div>
	<span class=button onclick='downloadAll(); $el("#ftdownload")[0].style.display = "none"'>تحميل</span>
	<span class=button onclick='$el("#ftdownload")[0].style.display = "none"'>كلا</span>
`)[0])

var finished = false;
navigator.serviceWorker.onmessage = ({data}) => {
	if (finished || (data[0] === 'c-process' && data[1] < data[2])) return;
	if (!$el('#download').length) document.body.append($el(`<div id=download class='popup hide'>`)[0]);
	var el = $el('#download')[0];
	el.classList.remove('hide');
	if (data[0] === 'c-fetched') el.innerText = 'تحميل البيانات';
	if (data[0] === 'c-extracted') el.innerText = 'تحميل الواجهة';
	if (data[0] === 'c-process') el.innerText = 'تحميل النصوص: ' + data[2] + '/' + data[1];
	if (data[0] === 'c-p2') el.innerText = 'تحميل الصور';
	if (data[0] === 'c-finished') el.classList.add('hide')
}