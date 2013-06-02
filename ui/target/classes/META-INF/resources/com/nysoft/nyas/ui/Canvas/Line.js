jQuery.require('com.nysoft.nyas.ui.Canvas.CanvasObject');

com.nysoft.nyas.ui.Canvas.CanvasObject.extend('com.nysoft.nyas.ui.Canvas.Line', {
	meta: {
		length: 'string',
		lineWidth: 'number',
		color: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getLineWidth()) && this.setLineWidth(1);
		(!this.getColor()) && this.setColor('#000000');
		this._super('init', options);
	},
	
	calculateTargetVector: function() {
		var targetVector = new com.nysoft.nyas.ui.Canvas.Vector(this.getVector().getX()+parseInt(this.getLength(), 10), this.getVector().getY());
		return targetVector.rotate(this.getVector(), this.getRotation());
	},
	
	render: function(canvas) {
		//there is no need to render if invisible!!!
		if(this.getColor() == 'none' || parseInt(this.getLength(), 10) == 0) {
			return;
		}
		
		canvas.getContext().save();
		canvas.getContext().beginPath();
		this.moveToVector(canvas);
		
		var targetVector = this.calculateTargetVector();
	    canvas.getContext().lineTo(targetVector.getX(), targetVector.getY());
	    
	    canvas.getContext().lineWidth = this.getLineWidth();
	    canvas.getContext().strokeStyle = this.getColor();
	    canvas.getContext().stroke();
	    
	    canvas.getContext().closePath();
	    canvas.getContext().restore();
	}
});