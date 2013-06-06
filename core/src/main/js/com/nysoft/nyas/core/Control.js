jQuery.require('com.nysoft.nyas.core.BaseObject');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.Control', {
	meta: {
		id: 'string',
		dom: 'object'
	},
	
	init: function(domObject, options) {
		if(domObject) {
			this.setDom(domObject);
			//capture content & and clear it
			var properties = domObject.children('[data-property]');
			if(properties.length > 0) {
				properties.each(function() {
					jqThis = jQuery(this);
					var propertyName = jqThis.data('property');
					jQuery.log.trace('Get PropertyValue of: '+propertyName, jqThis.html());
					options[propertyName] = jqThis.html();
				});
			} else {
				options.content = domObject.html();
			}
			domObject.empty();
		} else {
			this.setDom(jQuery('<div />'));
		}
		this.setProperties(options);
		
		(!this.getId()) && this.setId(jQuery.utils.uniqueId());
		
		this._renderControl();
		this._setReference();
	},
	
	_setReference: function(domObject) {
		domObject = domObject || this.getDom();
		domObject.data('control', this);
	},
	
	_renderControl: function() {
		if(this.getDom()) {
			//set id to dom-Element
			this.getDom().attr('id', this.getId());
		}
	},
	
	destroy: function() {
		this.getDom().remove();
	},
	
	attachTo: function(domObject, prepend) {
		if(!jQuery.utils.isjQuery(domObject)) {
			domObject = jQuery(domObject);
		}
		if(!prepend) {
			domObject.append(this.getDom());
		} else {
			domObject.prepend(this.getDom());
		}
	}
});