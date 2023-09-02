//assertion error

export class AssertionError extends Error {
	constructor (msg) {
		super();
		this.name = 'assertion';
		this.message = msg
	}
}