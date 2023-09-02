//error page

import { construct } from '../base.js';

export var errorPage = (error, url) => {
	if (error instanceof Error) return construct(`<div>
		<h1 style="color: red">${error.name}: ${error.message}:</h1>url: ${url}
	<div>`);
	else return construct(`<div>
		<h1 style="color: red">${error.statusText} (${error.status}):</h1>url: ${url}
	</div>`)
}