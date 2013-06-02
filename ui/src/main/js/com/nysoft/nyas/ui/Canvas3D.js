jQuery.require('com.nysoft.nyas.ui.Canvas');

com.nysoft.nyas.ui.Canvas.extend('com.nysoft.nyas.ui.Canvas3D', {
	meta: {
		context: 'object',
	},
	
	init: function(canvas) {
		this._super('init', canvas);
		if(this.getCanvas()) {
			//get 3d context out of canvas
			this.setContext(this.getCanvas().getContext('3d'));
		}
	}
});