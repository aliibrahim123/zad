//comp:... attributes handler

var compHandler = {
	propagAttrs: {
		'comp:log' (comp, el, attr) {
			comp.doAct({type: 'comp:log', el, data: attr})
		},
		'comp:logo' (comp, el, attr) {//once
			comp.doAct({type: 'comp:log', el, data: attr});
			el.removeAttribute('comp:logo')
		},
		'comp:ref' (comp, el, attr) {
			comp.doAct({type: 'comp:ref', el, name: attr});
			el.removeAttribute('comp:ref')
		},
		'comp:call' (comp, el, attr) {
			JSON.parse(attr).forEach(i=>comp.doAct({type: 'comp:call', el, fun: i[0], args: i.slice(1)}));
			el.removeAttribute('comp:call');
		}
	},
	unpropagAttrs: {
		'comp:this' (comp, el, attr) {
			comp.doAct({type: 'comp:this', el, name: attr});
			el.removeAttribute('comp:this')
		},
		'comp:sub' (comp, el, attr) {
			comp.doAct({type: 'comp:sub', el, data: JSON.parse(attr)});
			el.removeAttribute('comp:sub')
		}
	}
};

export { compHandler }