jQuery.require('com.nysoft.nyas.ui.Canvas.Square');

com.nysoft.nyas.ui.Canvas.Square.extend('com.nysoft.nyas.ui.Canvas.Rectangle', {
	meta: {
		height: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getHeight()) && this.setHeight('10px');
		this._super('init', options);
	},
	
	render: function(canvas) {
		canvas.getContext().save();
		canvas.getContext().beginPath();
		this.applyRotation(canvas, this.getWidth(), this.getHeight());
		canvas.getContext().rect(this.getVector().getX(), this.getVector().getY(), parseInt(this.getWidth(), 10), parseInt(this.getHeight(),10));
		
		this.applyStrokeSettings(canvas);
		if(this.isStroked()) {
			canvas.getContext().stroke();
		}
		
		this.applyFillSettings(canvas);
		if(this.isFilled()) {
			canvas.getContext().fill();
		}
		
		canvas.getContext().closePath();
		canvas.getContext().restore();
	}
});