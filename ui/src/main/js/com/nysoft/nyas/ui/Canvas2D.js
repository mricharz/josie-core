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
		
		//init loops
		this.loops = {};
		//start animationLooping
		this._animationLoop();
		
		//init for performance measurement
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
	
	addObjects: function(aObjects) {
		var aIds = [];
		if(aObjects && aObjects.length) {
			jQuery.each(aObjects, jQuery.proxy(function(index, oObject){
				aIds.push(this.addObject(oObject));
			}, this));
		}
		return aIds;
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
	
	addLoop: function(key, fnAnimation) {
		this.loops[key] = fnAnimation;
	},
	
	removeLoop: function(key) {
		delete this.loops[key];
	},
	
	getLoop: function(key) {
		return this.loops[key];
	},
	
	getLoops: function() {
		return this.loops;
	},
	
	_animationLoop: function() {
		if(this.loops) {
			var bHaveToRerender = false;
			//execute loops
			jQuery.each(this.loops, jQuery.proxy(function(key, fnAnimation) {
				jQuery.log.trace('Running canvas-Loop: '+key);
				fnAnimation.call(this, key);
				bHaveToRerender = true;
			}, this));
			//rerender canvas (only if needed)
			(bHaveToRerender) && this.rerender();
		}
		//continue the main-loop
		return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		        function(callback) {
		          window.setTimeout(callback, 1000 / 60);
		        })(jQuery.proxy(this._animationLoop, this));
	}
	
});