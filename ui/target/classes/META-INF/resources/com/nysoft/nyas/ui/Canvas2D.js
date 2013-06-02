jQuery.require('com.nysoft.nyas.ui.Canvas');

com.nysoft.nyas.ui.Canvas.extend('com.nysoft.nyas.ui.Canvas2D', {
	meta: {
		context: 'object',
		objects: 'object',
		measureCallback: 'function'
	},
	
	init: function(canvas) {
		this._super('init', canvas);
		if(this.getCanvas()) {
			//get 2d context out of canvas
			this.setContext(this.getCanvas().getContext('2d'));
		}
		
		//performance measurement
		this.fps = 0;
		this.now = null;
		this.lastUpdate = (new Date)*1 - 1;
		this.fpsFilter = 50; //highcap

	},
	
	addObject: function(object) {
		if(!this.getObjects()) {
			this.setObjects([]);
		}
		return this.getObjects().push(object)-1;
	},
	
	clearCanvas: function() {
		// Store the current transformation matrix
		this.getContext().save();

		// Use the identity matrix while clearing the canvas
		this.getContext().setTransform(1, 0, 0, 1, 0, 0);
		this.getContext().clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);

		// Restore the transform
		this.getContext().restore();
	},
	
	renderObjects: function() {
		jQuery.each(this.getObjects(), jQuery.proxy(function(index, object) {
			object.render(this, index);
		}, this));
	},
	
	render: function() {
		this.renderObjects();
		this._measureFrame();
	},
	
	rerender: function() {
		this.clearCanvas();
		this.render();
	},
	
	_openImage: function(file, callback) {
		image = new Image();
		image.onload = callback;
		image.src = file;
		return image;
	},
	
	drawImage: function(file, vector) {
		tmpImage = this._openImage(file, jQuery.proxy(function(){
			this.getContext().drawImage(tmpImage, vector.getX(), vector.getY(), tmpImage.width, tmpImage.height);
		}, this));
	},
	
	_measureFrame: function() {
	  var thisFrameFPS = 1000 / ((this.now=new Date) - this.lastUpdate);
	  this.fps += (thisFrameFPS - this.fps) / this.fpsFilter;
	  this.lastUpdate = this.now * 1 - 1;
	  
	  if(this.getMeasureCallback()) {
		  this.getMeasureCallback().call(this, this.fps);
	  }
	},
	
	animate: function(callback) {
		this.rerender();
		//next frame
        return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        })(callback);
    }
});