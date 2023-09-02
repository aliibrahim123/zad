//component error

class CompError extends Error {
	constructor(msg = 'comp: empty') {
		var ind = msg.indexOf(':');
		super(msg.slice(ind + 1).trim());
		this.name = msg.slice(0, ind);
  }
}

export { CompError }

//errors:
//  data: warn
//  others(elements, components...) throw error