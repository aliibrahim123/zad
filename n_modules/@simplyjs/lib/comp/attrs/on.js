//on:... attributes handlers

var onHandler = {
	handle (comp, el, attrs) {
		attrs.forEach(attr=>{
			if (!attr.startsWith('on(')) return;
			
			//split according to syntax: on(...events).modifiers:method:arg1
			var arg1, parenEnd = attr.indexOf(')'), methodStart = attr.indexOf(':'); //parenthesis end
			var events = attr.slice(attr.indexOf('(')+1, parenEnd).split(',');
			var modifiers = attr.slice(parenEnd+1, methodStart).split('.');
			var method = attr.slice(methodStart +1);
			if (method.includes(':')) [method, arg1] = method.split(':');
			
			if (!this.methods[method]) throw new CompError('on:attrs: undefined method (' + method + ')');
			this.methods[method](comp, el, el.getAttribute(attr), events, attr, modifiers, arg1 ? arg1.replace(/--./, (i)=>i[2].toUpperCase()) : undefined);
		})
		return true
	},
	methods: {
		'call' (comp, el, value, events, attr, modifs) {
			var args = JSON.parse(value);
			comp.doAct({type: 'on:call', el, events, modifs, fun: args[0], args: args.slice(1)});
			el.removeAttribute(attr)
		},
		'set' (comp, el, value, events, attr, modifs, arg1) {
			comp.doAct({type: 'on:set', el, events, modifs, prop: arg1.replaceAll(/-./g, s => s[1].toUpperCase()), value: JSON.parse(value)});
			el.removeAttribute(attr)
		},
		'set-fun' (comp, el, value, events, attr, modifs, arg1) {
			var args = JSON.parse(value);
			comp.doAct({type: 'on:set-fun', el, events, modifs, prop: args[0], fun: arg1, args: args.slice(1)});
			el.removeAttribute(attr)
		},
		'set-attr' (comp, el, value, events, attr, modifs, arg1) {
			comp.doAct({type: 'on:set-attr', el, events, modifs, prop: value, attr: arg1});
			el.removeAttribute(attr)
		},
		'set-attr-fun' (comp, el, value, events, attr, modifs, arg1) {
			var args = JSON.parse(value);
			comp.doAct({type: 'on:set-attr-fun', el, events, modifs, prop: args[0], attr: args[1], fun: arg1, args: args.slice(2)});
			el.removeAttribute(attr)
		},
	}
};

export { onHandler }