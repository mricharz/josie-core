jQuery.require('com.nysoft.nyas.core.ManagedObject');

//onBeforeInit
com.nysoft.nyas.core.EventStack.bind('com.nysoft.nyas.core.Control', 'onBeforeInit', function(e, data) {
	var oControlObject = e[0];
	// set default id
	(!oControlObject.getId())
		&& oControlObject.setId(jQuery.utils.uniqueId());
});

//onAfterInit
com.nysoft.nyas.core.EventStack.bind('com.nysoft.nyas.core.Control', 'onAfterInit', function(e, data) {
	var oControlObject = e[0], arguments = e[1], domObject, options;
	domObject = arguments[0] || null;
	options = arguments[1] || null;
	
	//render control
	oControlObject.trigger('onBeforeRenderer');
	oControlObject._renderControl();

	//make dom-reference
	oControlObject._setReference();
	
	//update all properties to force rendering
	var aProperties = oControlObject.getProperties();
	jQuery.each(aProperties, function(key, value) {
		var setter = 'set'+jQuery.utils.capitalize(key.slice(1));
		if(oControlObject[setter]) {
			jQuery.log.trace('Call '+setter, value);
			oControlObject[setter].call(oControlObject, value);
		}
	});
	oControlObject.trigger('onAfterRenderer');
	
});

com.nysoft.nyas.core.ManagedObject.extend('com.nysoft.nyas.core.Control', {
	
	meta: {
		id: 'string'
	},
	
	init: function() {},
	
	_renderControl: function() {
		if(this.getDom()) {
			//set id to dom-Element
			this.getDom().attr('id', this.getId());
		}
	},
	
	rerender: function() {
		this.getDom().empty();
		this._renderControl();
	}
	
});