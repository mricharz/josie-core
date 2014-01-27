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

	//update all properties to force rendering
	oControlObject._forceUpdateProperties();
	oControlObject.trigger('onAfterRenderer');
	
});

com.nysoft.nyas.core.ManagedObject.extend('com.nysoft.nyas.core.Control', {
	
	meta: {
		id: 'string',
		visible: 'boolean'
	},
	
	init: function() {},
	
	_renderControl: function() {
		if(this.getDom()) {
			//set id to dom-Element
			this.getDom().attr('id', this.getId());
			//is visible?
			if(this.getVisible() === false) {
				this.getDom().hide();
			}
		}
	},
	
	_forceUpdateProperties: function() {
		var aProperties = this.getProperties();
		jQuery.each(aProperties, jQuery.proxy(function(key, value) {
			var setter = 'set'+jQuery.utils.capitalize(key.slice(1));
			if(this[setter]) {
				jQuery.log.trace('Call '+setter, value);
				this[setter].call(this, value);
			}
		}, this));
	},
	
	rerender: function(bWithoutUpdateProperties) {
		this.trigger('onBeforeRenderer');
		this.getDom().empty();
		this._renderControl();
		if(!bWithoutUpdateProperties)
			this._forceUpdateProperties();
		this.trigger('onAfterRenderer');
	}	
	
});