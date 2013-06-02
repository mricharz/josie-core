jQuery.require('com.nysoft.nyas.ui.Canvas.CanvasObject');
jQuery.require('com.nysoft.nyas.ui.Canvas.Type');

com.nysoft.nyas.ui.Canvas.CanvasObject.extend('com.nysoft.nyas.ui.Canvas.StrokeAndFillObject', {
	meta: {
		borderColor: 'string',
		borderWidth: 'string',
		fillColor: 'string',
		type: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		//settings defaults
		(!this.getBorderColor()) && this.setBorderColor('#000000');
		(!this.getFillColor()) && this.setFillColor('#ffffff');
		(!this.getBorderWidth()) && this.setBorderWidth('1px');
		(!this.getType()) && this.setType(com.nysoft.nyas.ui.Canvas.Type.Fill);
		this._super('init', options);
	},
	
	applyStrokeSettings: function(canvas) {
		if(this.isStroked()) {
			canvas.getContext().lineWidth = parseInt(this.getBorderWidth(), 10);
			canvas.getContext().strokeStyle = this.getBorderColor();
		}
	},
	
	applyFillSettings: function(canvas) {
		if(this.isFilled()) {
			canvas.getContext().fillStyle = this.getFillColor();	
		}
	},
	
	isStroked: function() {
		return (this.getType().indexOf('stroke')>=0);
	},
	
	isFilled: function() {
		return (this.getType().indexOf('fill')>=0);
	},
});