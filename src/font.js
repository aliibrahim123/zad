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

var delay = (d) => new Promise((r) => setTimeout(r, d));

if (false && !localStorage.getItem('notFirstTime')) setTimeout(async () => {
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