//view functions

var viewFns = {
	show (els, val) {
		els.forEach(el => el.style.display = val ? '' : 'none')
	}
};

export { viewFns }