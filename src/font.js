//font manager

export var fontMan = {
	curSize: 25,
	curFont: 0,
	apply () {
		document.body.style.setProperty('--font-size', this.curSize + 'px');
		if (this.curFont === 0) document.body.style.setProperty('font-family', '');
		else document.body.style.setProperty('font-family', 'f-' + this.curFont);
		localStorage.setItem('z-font', JSON.stringify({ type: this.curFont, size: this.curSize }))
	},
	incSize () {
		this.curSize += 1;
		this.apply()
	},
	decSize () {
		this.curSize -= 1;
		if (this.curSize === 2) this.curSize = 3;
		this.apply()
	},
	changeFont () {
		this.curFont++;
		if (this.curFont === 21) this.curFont = 0;
		this.apply()
	}
}