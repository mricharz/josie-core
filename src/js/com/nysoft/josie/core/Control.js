Josie.require('com.nysoft.josie.core.ManagedObject');

//onBeforeInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.Control', 'onBeforeInit', function(e) {
	var oControlObject = e[0];
	// set default id
	(!oControlObject.getId())
		&& oControlObject.setId(Josie.utils.uniqueId());
});

//onAfterInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.Control', 'onAfterInit', function(e) {
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

com.nysoft.josie.core.ManagedObject.extend('com.nysoft.josie.core.Control', {
	
	meta: {
		id: 'string',
		visible: 'boolean',
        cssClasses: { type: 'object', defaultValue: {} }
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
			var setter = 'set'+Josie.utils.capitalize(key.slice(1));
			if(this[setter]) {
				Josie.log.trace('Call '+setter, value);
				this[setter].call(this, value);
			}
		}, this));
	},
	
	rerender: function(bWithoutUpdateProperties) {
		this.trigger('onBeforeRenderer');
		this.replaceDom('<div />').remove();
		this._renderControl();
		if(!bWithoutUpdateProperties)
			this._forceUpdateProperties();
		this.trigger('onAfterRenderer');
	},
	
	invalidate: function() {
		Josie.log.debug('Invalidating '+this.className);
		if(this.__valid !== false) {
	  		this.__valid = false;
			setTimeout(jQuery.proxy(function() {
	   			this.__valid = true;
				this.rerender();
			}, this), 0);
		}
	},

    replaceDom: function(sContent) {
        var jqOldDom = this.getDom(),
            jqNewDom = jQuery(sContent);
        this.setDom(jqNewDom);
        return jqOldDom.replaceWith(this.getDom());
    },

    addCssClass: function(sClass) {
        this.getCssClasses()[sClass] = true;
    },

    removeCssClass: function(sClass) {
        delete this.getCssClasses()[sClass];
    },

    writeCssClasses: function() {
        var aCssClasses = jQuery.map(this.getCssClasses(), function(value, index) { return index; });
        this.setCssClasses({});  // empty it for next write or writing-step
        return ' class="'+aCssClasses.join(' ')+'" ';
    }
	
});