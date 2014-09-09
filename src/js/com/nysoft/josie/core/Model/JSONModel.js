jQuery.require('com.nysoft.josie.core.Model');

com.nysoft.josie.core.Model.extend('com.nysoft.josie.core.Model.JSONModel', {
	
	meta: {
		src: 'string'
	},
	
	init: function(domObject, options) {
		jQuery.log.trace('Init JSONModel');
		this._super('init', options);
	},
	
	_loadData: function() {
		this._super('_loadData');
		if(this.getSrc()) {
			jQuery.getJSON(this.getSrc(), jQuery.proxy(this._onSuccess, this)).fail(jQuery.proxy(this._onError, this)).always(jQuery.proxy(this._onAlways, this));
		}
	},
	
	_onSuccess: function(oData) {
		this.trigger('onSuccess', oData);
		this.setData(oData);
	},
	
	_onError: function(oData) {
		jQuery.log.error('Error receiving data.', oData);
		this.trigger('onError', oData);
	},
	
	_onAlways: function(oData) {
		this.trigger('onAlways', oData);
	}
	
});