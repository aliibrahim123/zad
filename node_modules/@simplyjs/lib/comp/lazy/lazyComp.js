//lazy comp class

export class LazyComp {
	isComp = true;
	static isCompClass = true;
	constructor(name, ...args) {
		this.name = name;
		this.args = args;
		if (args[0]?.hasAttribute?.('is-root')) this.isRoot = true;
		this.fn = this.handle.bind(this);
		$comp.events.on('comp-added', this.fn)
	}
	trigger (name, ...args) {
		if (name === 'appended-to-parent') this.parent = args[0];
		else if (name === 'deleted-child') $comp.events.off('comp-added', this.fn);
		else throw new CompError('lazy comp: undefined event (' + name + ')')
	}
	handle (name, comp) {
		//this function is lister for 'comp-added'
		if (name !== this.name) return;
		$comp.events.off('comp-added', this.fn);
		
		//case of root, set new root
		if (this.isRoot) return $comp.setRoot(this.args[0], name, this.args.slice(1));
		
		if (!this.parent) throw new CompError('lazy comp: undefined parent');
		
		//create component and replace it with self
		var newComp = new comp(...this.args);
		this.parent.children[this.parent.children.indexOf(this)] = newComp;
		
		newComp.trigger('appended-to-parent', this.parent)
	}
}