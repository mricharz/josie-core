jQuery.require('com.nysoft.nyas.ui.Canvas.CanvasObject');

com.nysoft.nyas.ui.Canvas.CanvasObject.extend('com.nysoft.nyas.ui.Canvas.Image', {
	
	meta: {
		width: 'number',
		height: 'number',
		source: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		this._super('init', options);
	},

	render: function(canvas) {
		canvas.getContext().save();
		this.applyRotation(canvas, this.getWidth(), this.getHeight());
		console.log(this.getSource());
		canvas.getContext().drawImage(this.getSource(), this.getVector().getX(), this.getVector().getY(), this.getWidth(), this.getHeight());
		canvas.getContext().restore();
		
		console.log(this.getSource().width);
		//if image is not ready, yet
		if(!this.getSource().width) {
			jQuery.log.trace('Trigger rerender of canvas because image is not ready, yet. ('+this.getSource().src+')');
			//trigger canvas to rerender if image is ready
			this.getSource().onload = jQuery.proxy(function() {
				(!this.getWidth()) && this.setWidth(this.getSource().width);
				(!this.getHeight()) && this.setHeight(this.getSource().height);
				jQuery.log.trace('Rerender canvas because image is now ready.');
				canvas.rerender();
			}, this);
		}
	}
});