jQuery.require('com.nysoft.nyas.ui.Canvas.StrokeAndFillObject');

com.nysoft.nyas.ui.Canvas.StrokeAndFillObject.extend('com.nysoft.nyas.ui.Canvas.Square', {
	meta: {
		width: 'number'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getWidth()) && this.setWidth('10px');
		this._super('init', options);
	},

	render: function(canvas) {
		canvas.getContext().save();
		canvas.getContext().beginPath();
		this.applyRotation(canvas, this.getWidth(), this.getWidth());
		canvas.getContext().rect(this.getVector().getX(), this.getVector().getY(), parseInt(this.getWidth(), 10), parseInt(this.getWidth(),10));
		
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