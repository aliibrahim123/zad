//toml error

export class TOMLError extends Error {
	constructor (msg) {
		super();
		this.name = 'toml';
		this.message = msg
	}
}

export var throwAtIndex = (msg, data, ind) => {
	var line = 0, char = 0, charCount = 0;
	var lines = data.split('\n').map(line => line.length);
	for (let i = 0; i < lines.length; i++) {
		if (charCount + lines[i] >= ind) {
			line = i +1;
			char = ind - charCount +1;
			throw new TOMLError(`${msg} at ${line}:${char}`)
		}
		charCount += lines[i] +1
	}
}