//server error

export class ServerError extends Error {
	constructor(msg = 'serve: empty') {
		var ind = msg.indexOf(':');
		super(msg.slice(ind + 1).trim());
		this.name = msg.slice(0, ind);
  }
}