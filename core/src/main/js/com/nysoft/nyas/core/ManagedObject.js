jQuery.require('com.nysoft.nyas.core.BaseObject');

//onBeforeInit
com.nysoft.nyas.core.EventStack.bind('com.nysoft.nyas.core.ManagedObject', 'onBeforeInit', function(e, data) {
	var oControlObject = e[0], arguments = e[1], domObject, options;
	domObject = arguments[0] || null;
	options = arguments[1] || null;
	

	if (domObject) {
		oControlObject.setDom(domObject);
		// capture object properties
		var properties = domObject.children('[data-property]');
		if (properties.length > 0) {
			properties.each(function() {
				jqThis = jQuery(this);
				var propertyName = jQuery.utils.htmlAttr2CamelCase(jqThis.data('property'));
				jQuery.log.trace('Get PropertyValue of: '
						+ propertyName, jqThis.html());
				var sContent = jqThis.html();
				var value;
				try { //try to parse as JSON-Data and set as property-value
					value = jQuery.parseJSON(sContent);
				} catch (err) { //otherwise look for binding selector
					var sSelector = sContent.replace(/^\{\"/, '').replace(/\"\}$/, '');
					if(jQuery.utils.isSelector(sSelector)) { //handle binding
						com.nysoft.nyas.core.Model.addBinding(oControlObject, propertyName, sContent);
					} else { //fallback: set content as property value
						value = sContent;
					}
				}
				options[propertyName] = value;
			});
		}
		//aggregate content
		var jqAggregations = domObject.children('*[data-parent-aggregation]');
		var oAggregations = {};
		jqAggregations.each(function(){
			var sAggregation = this.data('data-parent-aggregation');
			var oObject = this.generateObject();
			if(!oAggregations[sAggregation]) {
				oAggregations[sAggregation] = [];
			}
			oAggregations[sAggregation].push(oObject);
		});
		//TODO: maybe we need to add the objects into a AggregationObject and add this AggregationObject into the options
		options = jQuery.extend(options, oAggregations);
		//aggregate to default "content" for content without aggregation
		options.content = domObject.children(':not([data-parent-aggregation])[data-class]').generateObject();
		//clear content
		domObject.empty();
	} else {
		oControlObject.setDom(jQuery('<div />'));
	}
	oControlObject.setProperties(options);
});

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.ManagedObject', {
	meta: {
		dom: 'object'
	},
	
	init: function(domObject, options) {
		domObject.detach();
	},
	
	_setReference: function(domObject) {
		domObject = domObject || this.getDom();
		domObject.data('control', this);
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
	},
	
	detach: function() {
		this.getDom().detach();
	},
	
});