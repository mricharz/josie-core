jQuery.require('com.nysoft.nyas.core.BaseObject');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.ShadowLayer', {
	meta: {
		shadowOpacity: 'number',
		color: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		(!this.getColor()) && this.setColor('#000000');
		(!this.getShadowOpacity()) && this.setShadowOpacity(0.25);
		this.shadowLayer = jQuery('<div class="shadowLayer"></div>');
		this.shadowLayer.css('background-color', this.getColor());
		this.shadowLayer.css('opacity', this.getShadowOpacity());
	},
	
	open: function() {
		jQuery('body').append(this.shadowLayer);
	},
	
	close: function() {
		this.shadowLayer.detach();
	},
	
	setShadowOpacity: function(value) {
		if(typeof value == 'number') {
			this.setProperty('shadowOpacity', value);
			if(this.shadowLayer) {
				this.shadowLayer.css('opacity', value);
			}
		}
	},
	
	setColor: function(value) {
		if(typeof value == 'string') {
			this.setProperty('color', value);
			if(this.shadowLayer) {
				this.shadowLayer.css('background-color', value);
			}
		}
	}
});