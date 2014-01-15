jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('http://jsonselect.org/js/jsonselect.min.js');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.Model', {
	
	meta: {
		data: 'object',
		bindings: 'object'
	},
	
	init: function(options) {
		//setup model
		this.setProperties(options);
		//init bindings array to hold bindings
		this.setBindings([]);
	},
	
	update: function(bForceRerender) {
		this._loadData();
		this._updateBindings(bForceRerender);
	},
	
	_loadData: function() {
		jQuery.log.trace('Loading Model-Data');
	},
	
	_updateBindings: function(bForceRerender) {
		jQuery.log.trace('Updating bindings. With rerender: '+bForceRerender);
		jQuery.each(this.getBindings(), jQuery.proxy(function(oBinding) {
			this._updateBinding(oBinding, bForceRerender);
		}, this));
	},
	
	_updateBinding: function(oBinding, bForceRerender) {
		jQuery.log.trace('Updating binding', oBinding);
		//get value of selector
		var oValue = this._evaluateSelector(oBinding.selector);
		//set object attribute value
		oBinding.object.setProperty(oBinding.property, oValue);
		//rerender if forced and possible
		if(bForceRerender && jQuery.isFunction(oBinding.object.rerender)) {
			oBinding.object.rerender();
		}
	},
	
	getSelectorValue: function(sSelector) {
		var oSelector = JSONSelect.compile(sSelector);
		return this._evaluateSelector(oSelector);
	},
	
	_evaluateSelector: function(oSelector) {
		return oSelector.match(this.getData());
	},
	
	addBinding: function(oObject, sPropertyName, sSelector) {
		var oBinding = {
			object: oObject,
			property: sPropertyName,
			selector: JSONSelect.compile(sSelector)
		};
		this.getBindings().push(oBinding);
		jQuery.log.trace('Added new binding', oBinding);
	}

});