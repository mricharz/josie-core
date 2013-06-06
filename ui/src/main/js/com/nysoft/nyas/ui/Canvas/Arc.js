jQuery.require('com.nysoft.nyas.ui.Canvas.Circle');

com.nysoft.nyas.ui.Canvas.Circle.extend('com.nysoft.nyas.ui.Canvas.Arc', {
	meta: {
		beginDegrees: 'number',
		endDegrees: 'number'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getBeginDegrees()) && this.setBeginDegrees(0);
		(!this.getEndDegrees()) && this.setEndDegrees(0);
		this._super('init', options);
	},
	
	render: function(canvas) {
		canvas.getContext().save();
		canvas.getContext().beginPath();
		this.applyRotation(canvas, this.getWidth(), this.getWidth());
		canvas.getContext().arc(this.getVector().getX(), this.getVector().getY(), parseInt(this.getWidth(), 10), jQuery.utils.deg2rad(this.getBeginDegrees()), jQuery.utils.deg2rad(this.getEndDegrees()), false);
		
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