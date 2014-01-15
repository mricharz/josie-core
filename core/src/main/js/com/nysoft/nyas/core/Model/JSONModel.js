jQuery.require('com.nysoft.nyas.core.Model');

com.nysoft.nyas.core.Model.extend('com.nysoft.nyas.core.Model.JSONModel', {
	
	meta: {
		src: 'string'
	},
	
	init: function(options) {
		this._super('init', options);
	},
	
	_loadData: function() {
		this._super('_loadData');
		if(this.getSrc()) {
			jQuery.getJSON(this.getSrc(), jQuery.proxy(this._onSuccess, this)).fail(jQuery.proxy(this._onError, this));
		}
	},
	
	_onSuccess: function(oData) {
		this.trigger('onSuccess', oData);
		this.setData(oData);
	},
	
	_onError: function(oData) {
		jQuery.log.error('Error receiving data.', oData);
		this.trigger('onError', oData);
	}
	
});