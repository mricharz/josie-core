jQuery.require('com.nysoft.nyas.ui.Canvas.StrokeAndFillObject');

com.nysoft.nyas.ui.Canvas.StrokeAndFillObject.extend('com.nysoft.nyas.ui.Canvas.Polygon', {
	meta: {
		numberOfSides: 'number',
		size: 'number'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getNumberOfSides()) && this.setNumberOfSides(3);
		(this.getSize() === null) && this.setSize(10);
		this._super('init', options);
	},
	
	render: function(canvas) {
		canvas.getContext().save();
		canvas.getContext().beginPath();
		this.applyRotation(canvas, this.getSize(), this.getSize());
		
		var sinZero = Math.sin(0);
		var cosZero = Math.sin(0);
		
		//go to first edge
		canvas.getContext().moveTo(this.getVector().getX() + this.getSize() * cosZero, this.getVector().getY() + this.getSize() * sinZero);          

		//draw rest of the edges
		for (var i = 1; i <= this.getNumberOfSides(); i++) {
			var preCalculation = i * 2 * Math.PI / this.getNumberOfSides();
			canvas.getContext().lineTo(this.getVector().getX() + this.getSize() * Math.cos(preCalculation), this.getVector().getY() + this.getSize() * Math.sin(preCalculation));
		}
		
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