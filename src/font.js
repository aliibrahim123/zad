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

var askForSize = () => {
	if (!confirm('اهذا هاتف')) fontMan.curSize = 1.6;
	else {
		fontMan.curSize = 1.46
	}
}

var delay = (d) => new Promise((r) => setTimeout(r, d));

if (!localStorage.getItem('notFirstTime')) setTimeout(async () => {
	if (!confirm('اهذا هاتف')) return;
	fontMan.curSize = 2.3;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 3.0;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 3.8;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 4.4;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 4.9;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 5.3;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 6.0;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 7;
	fontMan.apply();
	await delay(1000)
	if (confirm('أهذا احسن')) return;
	fontMan.curSize = 8;
	fontMan.apply();
}, 3000)

//generate vd (viewport diagonal)
//represent 1% of the viewport diagonals
//usefull for exact dimensions across every screen size
//formula sqrt(height ** 2 + width ** 2)
var vd = Math.sqrt(screen.height **2 + screen.width ** 2) / 100;
document.body.style.setProperty('--vd', vd + 'px')