//random background
var imageCount = 39;

export var changeBack = () => {
	document.body.style.background = `url(${curPath}assets/backgrounds/${
		setting.style.backImage === -1 ? Math.floor(Math.random() * imageCount) +1 : setting.style.backImage
	}.jpg) 0% 0%/ 100% 100%` 
}

//definitions
var themeDefs = {
	back: {
		'fblack': 'radial-gradient(rgb(0 0 0), rgb(0 0 0 / 95%))',
		'black': 'radial-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.83))',
		'tblack': 'radial-gradient(rgb(0 0 0 / 83%), rgb(0 0 0 / 74%), rgb(0 0 0 / 62%))',
		get page () { return `url(${curPath}assets/backgrounds/13.jpg) 0% 0% / 100% 100%`},
		get page2 () { return `url(${curPath}assets/backgrounds/38.jpg) 0% 0% / 100% 100%`},
	},
	tcolor: {
		'fblack': 'white',
		'black': 'white',
		'tblack': 'white',
		'page': 'black',
		'page2': 'black'
	},
	butColor: {
		//[normal, hover, active]
		'fblack': ['','',''],
		'black': ['','',''],
		'tblack': ['','',''],
		'page': ['rgb(149 148 114 / 31%)','',''],
		'page2': ['rgb(129 107 79 / 31%)','rgb(47 33 19 / 70%)','#120900']
	}
}

var shadowDefs = {
	'small': '0px 0px calc(var(--vu) * 3.5) calc(var(--vu) * 0.75) black',
	'big': '0px 0px calc(var(--vu) * 7) calc(var(--vu) * 1.5) black'
};

//theme manager
export var changeTheme = () => {
	var el = document.body.children[0];
	    
	var mainTheme = setting.style.mainTheme;
	el.style.setProperty('--main-theme-back', themeDefs.back[mainTheme]);
	el.style.setProperty('--main-theme-color', themeDefs.tcolor[mainTheme]);
	el.style.setProperty('--main-theme-but-col', themeDefs.butColor[mainTheme][0]);
	el.style.setProperty('--main-theme-but-hov-col', themeDefs.butColor[mainTheme][1]);
	el.style.setProperty('--main-theme-but-act-col', themeDefs.butColor[mainTheme][2]);
	
	var viewerTheme = setting.style.viewerTheme;
	el.style.setProperty('--viewer-theme-back', themeDefs.back[viewerTheme]);
	el.style.setProperty('--viewer-theme-color', themeDefs.tcolor[viewerTheme]);
	el.style.setProperty('--viewer-theme-but-col', themeDefs.butColor[viewerTheme][0]);
	el.style.setProperty('--viewer-theme-but-hov-col', themeDefs.butColor[viewerTheme][1]);
	el.style.setProperty('--viewer-theme-but-act-col', themeDefs.butColor[viewerTheme][2]);
};

//font manager
export var fontMan = {
	curSize: 1.5,
	curFont: 0,
	apply () {
		document.body.style.setProperty('--font-size', this.curSize + 'rem');
		if (this.curFont === 0) document.body.style.setProperty('font-family', '');
		else document.body.style.setProperty('font-family', 'f-' + this.curFont);
		localStorage.setItem('z-font-2', JSON.stringify({ type: this.curFont, size: this.curSize }))
	},
	incSize () {
		this.curSize += 0.1;
		this.apply()
	},
	decSize () {
		this.curSize -= 0.1;
		if (this.curSize === 2) this.curSize = 3;
		this.apply()
	},
	changeFont () {
		this.curFont++;
		if (this.curFont === 21) this.curFont = 0;
		this.apply()
	}
}


//other styles
export var changeVUMult = () => {
	document.body.style.setProperty('--vumult', setting.style.vumult)
}

export var changeMainMargin = () => {
	document.body.style.setProperty('--main-margin-mult', setting.style.mainMarginMult)
}

export var changeBolderMult = () => {
	document.body.style.setProperty('--border-mult', setting.style.borderMult)
}

export var changeShadow = () => {
	document.body.style.setProperty('--shadow', shadowDefs[setting.style.shadowSize])
}