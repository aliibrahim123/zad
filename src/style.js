//random background
var imageCount = 39;

export var randomBackground = () => {
	document.body.style.background = `url(${curPath}assets/backgrounds/${Math.floor(Math.random() * imageCount) +1}.jpg) 0% 0%/ 100% 100%` 
}

export var changeBack = () => {
	var el = document.body.children[0];
	if (el.getAttribute('comp-name') === 'lazy:main') return; //dont affect root page
	if (setting.color === 'black') el.style.background = 'rgba(0,0,0,0.95)';
	if (setting.color === 'tblack') el.style.background = '';
}