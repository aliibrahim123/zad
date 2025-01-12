export function randomInt (min: number, max?: number) {
	if (max === undefined) {
		return Math.floor(Math.random() * min);
	}
	return Math.floor(Math.random() * (max - min)) + min;
}

export function isMobile () {
	return screen.orientation.type.startsWith('portrait')
}