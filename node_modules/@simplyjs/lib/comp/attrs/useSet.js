//set:... attributes handlers
var useSetHandler = {
	handle (comp, el, attrs) {
		attrs.forEach(attr=>{
			if (!attr.startsWith('set(')) return;
			
			//split according to syntax: set(...props):method:arg
			var arg, parenEnd = attr.indexOf(')'); //parenthesis end;
			var prop = attr.slice(attr.indexOf('(')+1, parenEnd).split(',');
			var method = attr.slice(parenEnd + 2);
			if (method.includes(':')) [method, arg] = method.split(':');
			
			if (!this.methods[method]) throw new CompError('set:attrs: undefined method (' + method + ')');
			this.methods[method](comp, el, el.getAttribute(attr), prop, attr, arg ? arg.replaceAll(/--./g, (i)=>i[2].toUpperCase()) : undefined);
		})
		return true
	},
	methods: {
		'attr' (comp, el, attr, prop, name) { //simple
			JSON.parse(attr).forEach(i=>comp.doAct({type: 'set:attr', el, prop, attr: i}));
			el.removeAttribute(name);
		},
		'attr-temp' (comp, el, attr, prop, name, arg) {
			comp.doAct({ type: 'set:attr-temp', attr: arg, prop, el, temp: attr});
			el.removeAttribute(name);
		},
		'attr-call' (comp, el, attr, prop, name, arg) {
			var args = JSON.parse(attr);
			comp.doAct({type: 'set:attr-call', el, prop, attr: arg, fun: args[0], args: args.slice(1)});
			el.removeAttribute(name);
		},
		'text' (comp, el, attr, prop, name) {
			comp.doAct({type: 'set:text', el, prop});
			el.removeAttribute(name);
		},
		'html' (comp, el, attr, prop, name) {
			comp.doAct({type: 'set:html', el, prop});
			el.removeAttribute(name);
		},
		'if' (comp, el, attr, prop, name) {
			var args = JSON.parse(attr)
			comp.doAct({
				type: 'set:if', 
				el, 
				prop, 
				condF: Function('comp', 'el', prop.map(p => p.replace(/\..*/, '')), args[0].includes(';') ? args[0] : 'return ' + args[0]), 
				fun: args[1], 
				args: args.slice(2)
			});
			el.removeAttribute(name);
		},
		'if-else' (comp, el, attr, prop, name) {
			var args = JSON.parse(attr)
			var proparg = prop.map(p => p.replace(/\..*/, ''));
			comp.doAct({
				type: 'set:if-else', 
				el, 
				prop, 
				conds: args.map(i=> { return {
					condF: Function('comp', 'el', ...proparg, i[0].includes(';') ? i[0] : 'return ' + i[0]),
					fun: i[1],
					args: i.slice(2)
				}})
			});
			el.removeAttribute(name);
		},
		'for' (comp, el, attr, prop, name, arg) {
			var args = JSON.parse(attr);
			comp.doAct({type: 'set:for', el, prop, mtype: arg, stype: args[0], args: args.slice(1), onemptyEls: [...el.childNodes]});
			el.removeAttribute(name)
		}
	}
};

export { useSetHandler }