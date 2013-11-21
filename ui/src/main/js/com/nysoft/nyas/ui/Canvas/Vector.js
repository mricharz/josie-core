jQuery.require('com.nysoft.nyas.core.BaseObject');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Canvas.Vector', {
	meta: {
		x: 'number',
		y: 'number'
	},
	
	add: function(vector) {
		return new com.nysoft.nyas.ui.Canvas.Vector(
				this.getX()+vector.getX(),
				this.getY()+vector.getY()
				);
	},
	
	substract: function(vector) {
		return new com.nysoft.nyas.ui.Canvas.Vector(
				this.getX()-vector.getX(),
				this.getY()-vector.getY()
				);
	},
	
	multiply: function(vector) {
		return new com.nysoft.nyas.ui.Canvas.Vector(
				this.getX()*vector.getX(),
				this.getY()*vector.getY()
				);
	},
	
	length: function() {
		return Math.sqrt((this.getX() * this.getX()) + (this.getY() * this.getY()));
	},
	
	dotProduct: function(vector) {
		return (this.getX() * vector.getX() + this.getY() * vector.getY());
	},
	
	angle: function() {
		 return -Math.atan2(-this.getY(), this.getX());
	},
	
	rotate: function(centerVector, deg) {
		//substract center
		divV = this.substract(centerVector);
		//get length
		var m = divV.length();
		//get angle
		var a = divV.angle();
		//change angle
		a += jQuery.utils.deg2rad(deg);
		//polar to cartesian
		newVect = new com.nysoft.nyas.ui.Canvas.Vector(
			m * Math.cos(a),
			m * Math.sin(a)
		);
		//add center and return
		return newVect.add(centerVector);
	},
	
	normalize: function() {
		var length = this.length();
        this.setX(this.getX() / length);
        this.setY(this.getY() / length);
	},
	
	setX: function(value) {
		if(typeof value === 'string') {
			value = parseInt(value, 10);
		}
		if(typeof value === 'number') {
			this.setProperty('x', value);
		}
	},
	
	setY: function(value) {
		if(typeof value === 'string') {
			value = parseInt(value, 10);
		}
		if(typeof value === 'number') {
			this.setProperty('y', value);
		}
	},
	
	init: function(x, y) {
		if(x !== undefined && x.length) {
			if(jQuery.isPlainObject(x)) {
				this.setX(x.x);
				this.setX(x.y);
			} else {
				this.setX(x[0]);
				this.setX(x[1]);
			}
		}
		if(x !== undefined && y !== undefined) {
			this.setX(x);
			this.setY(y);
		}
	},
	
	toArray: function() {
		return [this.getX(), this.getY()];
	},
	
	toPlainObject: function() {
		return {
			x: this.getX(),
			y: this.getY()
		};
	},
	
	__toString: function() {
		return "[" + 
			this.getX() + "," + 
			this.getY() + 
		"]";
	}
});