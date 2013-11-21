jQuery.require('com.nysoft.nyas.ui.Canvas.CanvasObject');

//TODO
//see: http://www.html5canvastutorials.com/tutorials/html5-canvas-paths/

com.nysoft.nyas.ui.Canvas.StrokeAndFillObject.extend('com.nysoft.nyas.ui.Canvas.Path', {
	
	meta: {
		nodes: 'object'
		autoClose: 'boolean'
	},
	
	init: function(options) {
		this._super('init', options);
		(!this.getNodes().length || !this.getNodes().length) && this.setNodes([]);
		(this.getAutoClose() === null) && this.setAutoClose(true);
	},
	
	addNode: function(oVector) {
		return this.getNodes().push(oVector)-1;
	},
	
	removeNode: function(index) {
		return this.getNodes().splice(index, 1);
	},
	
	getNode: function(index) {
		return this.getNodes()[index];
	},
	
	getWidth: function() {
		var farestDiff = 0;
		jQuery.each(this.getNodes(), jQuery.proxy(function(index, oVector){
			var iDiff = oVector.getX() - this.getVector().getX();
			if(iDiff >= farestDiff) {
				farestDiff = iDiff;
			}
		}, this));
		return iDiff;
	},
	
	getHeight: function() {
		var farestDiff = 0;
		jQuery.each(this.getNodes(), jQuery.proxy(function(index, oVector){
			var iDiff = oVector.getY() - this.getVector().getY();
			if(iDiff >= farestDiff) {
				farestDiff = iDiff;
			}
		}, this));
		return iDiff;
	},
	
	render: function(canvas) {
		canvas.getContext().save();
		canvas.getContext().beginPath();
		this.applyRotation(canvas, this.getSize(), this.getSize());
		
		var sinZero = Math.sin(0);
		var cosZero = Math.sin(0);
		
		//go to first vector
		var startVector = this.getNode(0);
		canvas.getContext().moveTo(startVector.getX(), startVector.getY());      

		//draw rest of the edges
		for (var i = 1; i <= this.getNodes(); i++) {
			var oVector = this.getNode(i);
			canvas.getContext().lineTo(oVector.getX(), oVector.getY());
		}
		
		//close path if autoClose = true
		if(this.getAutoClose()) {
			canvas.getContext().lineTo(startVector.getX(), startVector.getY());
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