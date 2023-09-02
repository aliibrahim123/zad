//on:... attributes handlers

var useOnHandler = {
	handle (comp, el, attrs) {
		attrs.forEach(attr=>{
			if (!attr.startsWith('on(')) return;
			
			//split according to syntax: on(...events).modifiers:method:arg
			var arg, parenEnd = attr.indexOf(')'), methodStart = attr.indexOf(':'); //parenthesis end
			var events = attr.slice(attr.indexOf('(')+1, parenEnd).split(',');
			var modifiers = attr.slice(parenEnd+1, methodStart).split('.');
			var method = attr.slice(methodStart +1);
			if (method.includes(':')) [method, arg] = method.split(':');
			
			if (!this.methods[method]) throw new CompError('on:attrs: undefined method (' + method + ')');
			this.methods[method](comp, el, el.getAttribute(attr), events, attr, modifiers, arg ? arg.replace(/--./, (i)=>i[2].toUpperCase()) : undefined);
		})
		return true
	},
	methods: {
		'call' (comp, el, attr, events, name, modifs) {
			var args = JSON.parse(attr);
			comp.doAct({type: 'on:call', el, events, modifs, fun: args[0], args: args.slice(1)});
			el.removeAttribute(name)
		},
		'set' (comp, el, attr, events, name, modifs) {
			var args = JSON.parse(attr);
			comp.doAct({type: 'on:set', el, events, modifs, prop: args[0], value: args[1]});
			el.removeAttribute(name)
		},
		'set-fun' (comp, el, attr, events, name, modifs, arg) {
			var args = JSON.parse(attr);
			comp.doAct({type: 'on:set-fun', el, events, modifs, prop: args[0], fun: arg, args: args.slice(1)});
			el.removeAttribute(name)
		},
		'set-attr' (comp, el, attr, events, name, modifs, arg) {
			comp.doAct({type: 'on:set-attr', el, events, modifs, prop: attr, attr: arg});
			el.removeAttribute(name)
		},
		'set-attr-fun' (comp, el, attr, events, name, modifs, arg) {
			var args = JSON.parse(attr);
			comp.doAct({type: 'on:set-attr-fun', el, events, modifs, prop: args[0], attr: args[1], fun: arg, args: args.slice(2)});
			el.removeAttribute(name)
		},
	}
};

export { useOnHandler }