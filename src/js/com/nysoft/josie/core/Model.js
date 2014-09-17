Josie.require('com.nysoft.josie.core.ManagedObject');
Josie.require('org.jsonselect.JSONSelect');

com.nysoft.josie.core.ManagedObject.extend('com.nysoft.josie.core.Model', {
	
	meta: {
		data: 'object',
		bindings: { type: 'object', defaultValue: [] },
		key: { type: 'string', defaultValue: 'default' }
	},
	
	init: function(domObject) {
		this._super('init', domObject);
		//reference model instance
		Josie.log.trace('Referencing Model: '+this.getKey());
		com.nysoft.josie.core.Model._models[this.getKey()] = this;
	},
	
	update: function(bForceRerender) {
		this._loadData();
		this._updateBindings(bForceRerender);
	},
	
	_loadData: function() {
		this.trigger('onBeforeLoadingData', this, arguments);
		if(!this._loadedOnce) {
			this._loadedOnce = true;
		}
		Josie.log.trace('Loading Model-Data');
	},
	
	_updateBindings: function(bForceRerender) {
		this.trigger('onBeforeUpdatingBindings', this, arguments);
		Josie.log.trace('Updating bindings. With rerender: '+bForceRerender);
		var aBindings = this.getBindings();
		jQuery.each(aBindings, jQuery.proxy(function(iIndex, oBinding) {
			this._updateBinding(oBinding, bForceRerender);
		}, this));
		this.trigger('onAfterUpdatingBindings', this, arguments);
	},
	
	getData: function() {
		if(!this._loadedOnce) {
			this._loadData();
		}
		return this.getProperty('data');
	},
	
	setData: function(oValue, bPreventBindingUpdate) {
		this.setProperty('data', oValue);
		if(!bPreventBindingUpdate) {
			this._updateBindings(true);
		}
	},
	
	_updateBinding: function(oBinding, bForceRerender) {
		Josie.log.trace('Updating binding', oBinding, bForceRerender);
		//get value of selector
		var oValue = this._evaluateSelector(oBinding.selector);
		//set object attribute value
		oBinding.object.setProperty(oBinding.property, oValue);
		//rerender if forced and possible
		if(bForceRerender) {
			if(jQuery.isFunction(oBinding.object.invalidate)) {
				oBinding.object.invalidate(); //just invalidate if possible (recommended)
			}
			else if(jQuery.isFunction(oBinding.object.rerender)) {
				oBinding.object.rerender();
			}
		}
	},
	
	getSelectorValue: function(sSelector) {
		var oSelector = JSONSelect.compile(sSelector);
		return this._evaluateSelector(oSelector);
	},
	
	_evaluateSelector: function(oSelector) {
		// try-catch because this is an external lib and i am a careful man \o/
		try {
			return oSelector.match(this.getData());
		} catch(err) {
			Josie.log.error(err);
		}
	},
	
	addBinding: function(oObject, sPropertyName, sSelector) {
		var oBinding = {
			object: oObject,
			property: sPropertyName,
			selector: JSONSelect.compile(sSelector),
			model: this
		};
		//save binding in model
		this.getBindings().push(oBinding);
		Josie.log.trace('Added new binding', oBinding);
		//update this binding (without rerender)
		this._updateBinding(oBinding, false);
		return oBinding;
	},
	
	getBinding: function(oObject, sPropertyName) {
		var oBinding = null;
		jQuery.each(this.getBindings(), function() {
			if(this.object == oObject) {
				if(this.property == sPropertyName) {
					oBinding = this;
					return false;
				}
			}
		});
		return oBinding;
	}

});

com.nysoft.josie.core.Model._models = {};

com.nysoft.josie.core.Model.getModel = function(sModelKey) {
	return com.nysoft.josie.core.Model.getModels()[sModelKey];
};

com.nysoft.josie.core.Model.getModels = function() {
	return com.nysoft.josie.core.Model._models;
};

com.nysoft.josie.core.Model.addBinding = function(oObject, sPropertyName, sSelector) {
	var aMatches = sSelector.match(/^(.*?);/);
	var sModelKey = 'default';
	if(aMatches && aMatches.length == 2) {
		sModelKey = aMatches[1];
		sSelector = sSelector.replace(aMatches[0], '');
	} 
	var oModel = com.nysoft.josie.core.Model.getModel(sModelKey);
	if(oModel) {
		return oModel.addBinding(oObject, sPropertyName, sSelector);
	} else {
		throw new com.nysoft.josie.core.Exception('Cannot bind property "'+sPropertyName+'"! Model "'+sModelKey+'" not found!');
	}
};

com.nysoft.josie.core.Model.getBinding = function(oObject, sPropertyName) {
	var oBinding = null;
	jQuery.each(com.nysoft.josie.core.Model.getModels(), function() {
		var oModelBinding = this.getBinding(oObject, sPropertyName);
		if(oModelBinding) {
			oBinding = oModelBinding;
			return false;
		}
	});
	return oBinding;
};