//model proxy
//proxy for model data

var handler = {
	set (model, name, value) {
		return model.set(name, value)
	},
	get (model, name) {
		return model.get(name)
	},
	has (model, name) {
		return model.has(name)
	},
	deleteProperty (model, name) {
		return model.delete(name)
	},
	ownKeys (model) {
		return model.getAllKeys()
	}
};

var createStore = (model) => new Proxy(model, handler);

export { createStore,  handler}