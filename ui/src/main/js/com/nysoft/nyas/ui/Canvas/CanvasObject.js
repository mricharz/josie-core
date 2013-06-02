jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.ui.Canvas.Vector');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Canvas.CanvasObject', {
	meta: {
		id: 'string',
		vector: 'object',
		rotation: 'number',
		rotationPoint: 'object'
	},
	
	init: function(options) {
		this.setProperties(options);
		//settings defaults
		(!this.getId()) && this.setId(this.className+'-'+jQuery.uniqueId());
		(!this.getVector()) && this.setVector(new com.nysoft.nyas.ui.Canvas.Vector(0, 0));
		(!this.getRotation()) && this.setRotation(0);
	},
	
	addRotation: function(value) {
		if(typeof value == 'number') {
			this.setProperty('rotation', this.getProperty('rotation') + value);
		}
	},
	
	moveToVector: function(canvas) {
		canvas.getContext().moveTo(this.getVector().getX(), this.getVector().getY());
	},
	
	applyRotation: function(canvas, width, height) {
		var tx = 0, ty = 0;
		if(this.getRotationPoint()) {
			tx = this.getRotationPoint().getX();
			ty = this.getRotationPoint().getY();
		} else {
			tx = this.getVector().getX()+parseInt(width, 10)/2;
			ty = this.getVector().getY()+parseInt(height, 10)/2;
		}
		canvas.getContext().translate(tx, ty);
		canvas.getContext().rotate(jQuery.deg2rad(this.getRotation()));
		canvas.getContext().translate(-tx, -ty);
	},
	
	render: function() {},
	
	animate: function(canvas, callback) {
		if(jQuery.isFunction(callback)) {
			callback.call(this);
		}
		canvas.animate(jQuery.proxy(this.animate, this));

		return {
			stop: function() {},
			start: function() {}
		}
	}
});