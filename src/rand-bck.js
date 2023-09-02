//random background

var imageCount = 39;

export var randomBackground = () => {
	document.body.style.background = `url(${curPath}assests/backgrounds/${Math.floor(Math.random() * imageCount) +1}.jpg) 0% 0%/ 100% 100%` 
}