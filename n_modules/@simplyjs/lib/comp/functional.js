//functional api
//manage components in functional paradigm

import { checkcomp, checkfn, checkCompClass, CompError } from './check.js';

var func = {
	currentComp: null,
	
	compStack: [],
	push (comp) {
		checkcomp(comp, 'functional')
		this.compStack.push(comp)
		this.currentComp = comp
	},
	pop () {
		this.compStack.pop();
		this.currentComp = this.compStack.length === 0 ? null : this.compStack[this.compStack.length -1]
	},
	
	getCur (dothrow = true) {
		if (!this.currentComp) {
			if (dothrow) throw new CompError('functional: component stack length is 0');
			return
		} else return this.currentComp
	},
	enableFor (fn) {
		checkfn(fn, 'fn', 'functional');
		return (comp, ...args) => {
			this.push(comp);
			fn(...args);
			this.pop()
		}
	},
	
	currentClass: null,
	createComp (createFn, superClass = Comp) {
		checkfn(createFn, 'createFn', 'functional');
		checkCompClass(superClass, 'superClass', 'functional');
		
		var cclass = class FComp extends superClass {
			static defaults = {...superClass.defaults};
			static funs = {...superClass.funs}
		}
		this.currentClass = cclass;
		
		var temp = createFn();
		cclass.defaults.view.temp = temp;
		
		this.currentClass = null;
		return cclass
	},
	
	useClass () {
		if (!this.currentClass) throw new CompError('functional: currentClass is not defined');
		return this.currentClass
	},
	useDefaults () {
		return this.useClass().defaults
	},
	setFun (name, fn) {
		this.useClass().funs[name] = this.enableFor(fn)
	},
	setSub (name, sub) {
		this.useClass().defaults.view.subs[name] = sub
	},

	useComp () {
		return this.getCur()
	},
	useStore () {
		return this.getCur().model.toStore()
	},
	useSignal (name, value) {
		return this.getCur().createSignal(name, value)
	},
	useCSignal (name, depends, fn) {
		return this.getCur().createCSignal(name, depends, fn)
	},
	
	useEffect (prop, effect) {
		this.getCur().addEffect(prop, typeof effect === 'string' ? effect : this.enableFor(effect))
	},

	useEvent (event, fn) {
		this.getCur().on(event, this.enableFor(fn))
	},
	useTrigger (event, ...args) {
		this.getCur().trigger(event, ...args)
	},
	
	useCall (fun, ...args) {
		return this.getCur().call(fun, ...args)
	},
	useCallSafe (fun, ...args) {
		return this.getCur().callSafe(fun, ...args)
	},
	
	useRef (name) {
		return this.getCur().refs[name]
	},
	use$ (...args) {
		return this.getCur().view.$(...args)
	},
	useSub (name, ...args) {
		return this.useComp().view.createSub(name, ...args)
	},
	useEl () {
		return this.getCur().el
	},
	useAttr (el, attr, value) {
		return this.getCur().view.attr(el, attr, value)
	}
}
//bind func as this for all methods, for destruction capabilities
for (let p in func) {
	if (typeof func[p] === 'function') func[p] = func[p].bind(func)
} 

export { func }