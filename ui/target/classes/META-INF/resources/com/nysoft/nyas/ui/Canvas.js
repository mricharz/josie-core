jQuery.require('com.nysoft.nyas.core.BaseObject');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Canvas', {
	meta: {
		canvas: 'object'
	},
	
	init: function(canvas) {
		if(canvas) {
			this.setCanvas(canvas.get(0));
			//set canvas to fullScreen and keep it up2date if orientation changed
			this.getCanvas().height = jQuery('body').innerHeight();
			this.getCanvas().width = jQuery('body').innerWidth();
			window.addEventListener("orientationchange", jQuery.proxy(function() {
				this.getCanvas().height = window.innerHeight;
				this.getCanvas().width = window.innerWidth;
			}, this));
		}
	}
});