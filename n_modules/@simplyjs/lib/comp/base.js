//ui framework core

import { checkstr, checkel, checkcomp, checkCompClass, CompError } from './check.js';
import { EventEmmiter } from './base/event.js';
import { Comp, Model, View, Binder, EffectEmmiter, Signal } from './base/comp.js';
import { attrManeger } from './attrs/attrMan.js';
import { actManager } from './acts/actMan.js';
import { funNS } from './base/funns.js';
import { tempManager } from './template/tempMan.js';
import { CompCollection } from './base/collection.js';
import { func } from './functional.js';
import { lazyCManager, LazyComp } from './lazy/lazyCManager.js';

var $comp = {
	isDataProvider: true, //for global state
	opts: {
		warn: 'warn',
		maxCompRandId: 2 ** 30
	},
	warn (msg) {
		if (this.opts.warn) console[this.opts.warn](msg)
	},

	//component registry
	comps: {
		basic: Comp
	},
	compMans: {
		lazy: lazyCManager
	},
	add (name, comp) {
		checkCompClass(comp, 'adding class');
		checkstr(name, 'name')
		
		//handle case of component manager
		var parts = name.split(':');
		if (parts.length !== 1) {
			if (!this.compMans[parts[0]]) throw new CompError('comp: undefined component manager (' + parts[0] + ')');
			return this.compMans[parts[0]].add(parts[1]);
		}
		
		if (name in this.comps) this.warn('comp: adding defined component (' + name + ')');
		this.comps[name] = comp;
		this.events.trigger('comp-added', name, comp)
	},
	get (name) {
		if (name?.isCompClass) return name;
		if (name?.isComp) return name.class;
		checkstr(name, 'name')
		
		//handle case of component manager
		var parts = name.split(':');
		if (parts.length !== 1) {
			if (!this.compMans[parts[0]]) throw new CompError('comp: undefined component manager (' + parts[0] + ')');
			return this.compMans[parts[0]].get(parts[1]);
		}
		
		var comp = this.comps[name];
		if (comp) return comp;
		throw new CompError('comp: undefined comp (' + name + ')')
	},
	has (name) {
		checkstr(name, 'name')
		var parts = name.split(':');
		if (parts.length === 1) return name in this.comps; //normal case
		return this.compMans[parts[0]].has(parts[1]) //comp manager
	},
	root: null,
	setRoot (el, name = 'basic', ...args) {
		checkel(el);
		this.root = name.isComp ? name : new (this.get(name))(el, ...args);
		this.events.trigger('set-root', this.root)
		return this.root
	},
	idmap: {},
	addById (comp, id) { //add component to idmap
		checkcomp(comp);
		if (this.idmap[id]) this.warn('comp: defined id (' + id +')');
		else {
			this.idmap[id] = comp;
			this.events.trigger('id-added')
		}
		return this
	},
	getById (id, Throw = true) {
		var comp = this.idmap[id];
		if (!comp && Throw) throw new CompError('comp: undefined component of id (' + id + ')');
		return comp
	},
	
	//events
	events: new EventEmmiter(),
	on (name, fn) {
		this.events.on(name, fn);
		return this
	},
	off (name, fn) {
		this.events.off(name, fn);
		return this
	},
	trigger (name, ...args) {
		this.events.trigger(name, this, ...args);
		return this
	},
	
	//acts
	acts: actManager,
	doAct (comp, action) {
		this.acts.do(comp, action)
	},
	
	//attrs
	attrs: attrManeger,
	walk (comp, el) {//walk attributes
		this.attrs.walk(comp, el)
	},
	
	//others
	funNS,
	func,
	temps: tempManager,
	
	//model
	addProp (name, value, returnProp) {
		var prop = this.model.add(name, value, true);
		return returnProp ? prop : this 
	},
	setProp (name, value, returnProp = false) {
		var prop = this.model.set(name, value, true);
		return returnProp ? prop : this
	},
	getProp (name, returnProp = false) {
		return this.model.get(name, returnProp)
	},
	deleteProp (name) {
		this.model.delete(name);
		return this
	},
	hasProp (name) {
		return this.model.has(name)
	},
	
	//effect
	addEffect (prop, fn) {
		this.effect.add(prop, fn);
		return this
	},
	
	//signal
	addSignal(comp, obj) {
		this.signal.add(comp, obj);
		return this
	},
	classes: {
		comp: Comp,
		event: EventEmmiter,
		error: CompError,
		model: Model,
		view: View,
		binder: Binder,
		effect: EffectEmmiter,
		signal: Signal,
		collection: CompCollection,
		lazyComp: LazyComp
	},
	Comp,
	EventEmmiter,
	CompError,
	Model,
	View,
	CompCollection,
	Binder,
	EffectEmmiter,
	Signal,
	LazyComp
};

//bind $comp as this for all methods, for destruction capabilities
for (let i in $comp) {
	if ($comp[i]?.bind && !$comp[i].prototype) $comp[i] = $comp[i].bind($comp)
} 

//assign to globa;
globalThis.$comp = $comp;
globalThis.CompError = CompError;
globalThis.Comp = Comp;

//add events
['comp-added', 'set-root', 'delete-root', 'id-added', 'temp-added', 'model:add', 'model:delete', 'model:change',
	'init:model'].forEach(e => $comp.events.add(e));

//add data provider components
Object.assign($comp, {
	model: new Model($comp, {}, {}),
	signal: new Signal($comp, {}, []),
	effect: new EffectEmmiter($comp, {})
});

Comp.defaults.warn = $comp.opts.warn;

export { $comp, EventEmmiter, CompError, Comp, Model, View, EffectEmmiter, Signal };
export default $comp;

export var get = $comp.get;
export var add = $comp.add;
export var has = $comp.has;
export var setRoot = $comp.setRoot;
export var getById = $comp.getById;
export var addById = $comp.addById;

export var on = $comp.on;
export var off = $comp.off;
export var once = $comp.once;
export var trigger = $comp.trigger;

export var doAct = $comp.doAct;
export var walk = $comp.walk;

export var addProp = $comp.addProp;
export var setProp = $comp.setProp;
export var getProp = $comp.getProp;
export var hasProp = $comp.hasProp;
export var deleteProp = $comp.deleteProp;
export var addEffect = $comp.addEffect;
export var addSignal = $comp.addSignal;

export var createComp = func.createComp;
export var enableFor = func.enableFor;
export var useClass = func.useClass;
export var useDefaults = func.useDefaults;
export var setFun = func.setFun;
export var useComp = func.useComp;
export var useStore = func.useStore;
export var useState = func.useState;
export var useEffect = func.useEffect;
export var useEvent = func.useEvent;
export var useTrigger = func.useTrigger;
export var useSignal = func.useSignal;
export var useCall = func.useCall;
export var useCallSafe = func.useCallSafe;
export var useRef = func.useRef;
export var use$ = func.use$;
export var useEl = func.useEl;
export var useAttr = func.useAttr;