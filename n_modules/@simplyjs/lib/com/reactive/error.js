//reactive error

export class ReactiveError extends Error {
	constructor(msg = 'reactive: empty') {
		var ind = msg.indexOf(':');
		super(msg.slice(ind + 1).trim());
		this.name = msg.slice(0, ind);
  }
}