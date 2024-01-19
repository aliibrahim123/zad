//prompt handler

globalThis.createPrompt = (msg) => {
	var el = $el(`<div class=prompt>
		<div>${msg}</div>
		<input>
		<span id=confirm class=button>حسنا</span>
	`)[0];
	document.body.append(el);
	el.animate([{opacity: 0}, {opacity:1}], {duration: 500});
	var resolve, promise = new Promise(r => resolve = r);
	$el('#confirm', el)[0].onclick = () => {
		el.animate([{opacity: 1}, {opacity:0}], {duration: 500})
		  .finished.then(() => el.remove());
		resolve($el(' input', el)[0].value)
	}
	return promise
}