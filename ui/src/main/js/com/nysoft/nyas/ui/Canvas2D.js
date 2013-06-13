jQuery.require('com.nysoft.nyas.ui.Canvas');

com.nysoft.nyas.ui.Canvas.extend('com.nysoft.nyas.ui.Canvas2D', {
	meta: {
		context: 'object',
		objects: 'object',
		measureCallback: 'function',
		measurement: 'boolean'
	},
	
	init: function() {
		this._super('init');

		//init for performance measurement
		this.fps = 0;
		this.now = null;
		this.lastUpdate = (new Date)*1 - 1;
		this.fpsFilter = 50; //highcap
	},
	
	_renderControl: function() {
		this._super('_renderControl');
		if(this.getCanvas()) {
			//set canvas2d-CSSClass
			if(!this.getDom().hasClass('canvas2d'))
				this.getDom().addClass('canvas2d');
			//get 2d context out of canvas
			this.setContext(this.getCanvas().get(0).getContext('2d'));
		}
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
		this.getContext().clearRect(0, 0, this.getCanvas().get(0).width, this.getCanvas().get(0).height);

		// Restore the transform
		this.getContext().restore();
	},
	
	renderObjects: function() {
		if(this.getObjects()) {
			jQuery.each(this.getObjects(), jQuery.proxy(function(index, object) {
				object.render(this, index);
			}, this));
		}
	},
	
	render: function() {
		this.renderObjects();
		(this.getMeasurement()) && this._measureFrame();
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
	
	animate: function(fCallback) {
		this.rerender();
		//next frame
        jQuery.requestAnimationFrame(fCallback);
    }
});