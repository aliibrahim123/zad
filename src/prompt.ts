import { create } from "./libs.ts";
import { delay } from "./utils.ts";

export async function prompt (msg: string, fn?: (el: HTMLElement, input: HTMLInputElement) => void) {
	let resolve: (response: string) => void;

	//create container
	const input = create('input');
	const container = create('div', '.prompt', 
	  create('div', 
		create('span', { innerText: msg }), input, create('br'),
		create('button', 'حسناً', { events: { 
			click (evt) { resolve(input.value) }
		} })
	  )
	);
	document.body.append(container);
	if (fn) fn(container, input);

	//start animation
	const animationSpeed = settings.style.core.animationSpeed;
	if (animationSpeed) 
		container.animate({ opacity: [0, 1] }, { duration: 300 * animationSpeed });

	//await for response
	input.focus();
	const response = await new Promise<string>(res => resolve = res);

	//end animation
	if (animationSpeed) 
		container.animate({ opacity: [1, 0] }, { duration: 300 * animationSpeed })
		  .finished.then(() => container.remove());
	else container.remove();

	return response;
}

export async function alert (msg: string, Delay = 3000) {
	const container = create('div', '.alert', { innerText: msg });
	document.body.append(container);

	//start animation
	const animationSpeed = settings.style.core.animationSpeed;
	if (animationSpeed) 
		container.animate({ opacity: [0, 1] }, { duration: 300 * animationSpeed });

	await delay(Delay);

	//end animation
	if (animationSpeed) 
		container.animate({ opacity: [1, 0] }, { duration: 300 * animationSpeed })
		  .finished.then(() => container.remove());
	else container.remove();
}