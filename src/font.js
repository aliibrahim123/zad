//font manager

export var fontMan = {
	curSize: 1.6,
	curFont: 0,
	apply () {
		document.body.style.setProperty('--font-size', this.curSize * vd + 'px');
		if (this.curFont === 0) document.body.style.setProperty('font-family', '');
		else document.body.style.setProperty('font-family', 'f-' + this.curFont);
		localStorage.setItem('z-font', JSON.stringify({ type: this.curFont, size: this.curSize }))
	},
	incSize () {
		this.curSize += 0.07;
		this.apply()
	},
	decSize () {
		this.curSize -= 0.07;
		if (this.curSize === 2) this.curSize = 3;
		this.apply()
	},
	changeFont () {
		this.curFont++;
		if (this.curFont === 21) this.curFont = 0;
		this.apply()
	}
}

//generate vd (viewport diagonal)
//represent 1% of the viewport diagonals
//usefull for exact dimensions across every screen size
//formula sqrt(height ** 2 + width ** 2)
var vd = Math.sqrt(screen.height **2 + screen.width ** 2) / 100;
document.body.style.setProperty('--vd', vd + 'px')