jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.ui.Canvas.Vector');

com.nysoft.nyas.ui.Canvas.CanvasObject.extend('com.nysoft.nyas.ui.Canvas.Container', {
	
	meta: {
		objects: 'object'
	},
	
	init: function(options) {
		this.setProperties(options);
		//init empty Objects-Array
		this.setObjects([]);
		this._super('init', options);
	},
	
	addObjects: function(object) {
		return this.getObjects().push(object) - 1;
	},
	
	removeObjectByIndex: function(index) {
		this.setObjects(this.getObjects().splice(index, 1));
	},
	
	size: function() {
		return this.getObjects().length;
	},
	
	render: function(canvas) {
		var containerVector = this.getVector().toPlainObject();
		var containerRotation = this.getProperty('rotation');
		jQuery.each(this.getObjects(), function() {
			var saveVector = this.getVector().toPlainObject();
			//apply vector
			this.getVector().setX(saveVector.x+containerVector.x);
			this.getVector().setY(saveVector.y+containerVector.y);
			//apply rotation
			var saveRotation = this.getProperty('rotation');
			this.addRotation(containerRotation);
			//render
			this.render(canvas);
			//reset rotation
			this.setProperty('rotation', saveRotation);
			//reset vector
			this.getVector().setX(saveVector.x);
			this.getVector().setY(saveVector.y);
		});
	}
	
});