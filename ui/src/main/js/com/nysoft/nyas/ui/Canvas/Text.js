jQuery.require('com.nysoft.nyas.ui.Canvas.StrokeAndFillObject');
jQuery.require('com.nysoft.nyas.ui.Canvas.Text.Style');
jQuery.require('com.nysoft.nyas.ui.Canvas.Text.Baseline');

com.nysoft.nyas.ui.Canvas.StrokeAndFillObject.extend('com.nysoft.nyas.ui.Canvas.Text', {
	meta: {
		text: 'string',
		fontFamily: 'string',
		fontSize: 'string',
		fontStyle: 'string',
		baseline: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getFontFamily()) && this.setFontFamily('Open Sans');
		(!this.getFontSize()) && this.setFontSize('12px');
		(!this.getFontStyle()) && this.setFontStyle('normal');
		(!this.getBaseline()) && this.setBaseline(com.nysoft.nyas.ui.Canvas.Text.Baseline.Alphabetic);
		this._super('init', options);
	},
	
	_prepareFontString: function() {
		return this.getFontStyle() + ' ' + this.getFontSize() + ' ' + this.getFontFamily();
	},
	
	render: function(canvas) {
		canvas.getContext().save();
		var metric = canvas.getContext().measureText(this.getText());
		this.applyRotation(canvas, metric, this.getFontSize());
		canvas.getContext().font = this._prepareFontString();
		canvas.getContext().baseline = this.getBaseline();
		
		this.applyStrokeSettings(canvas);
		if(this.isStroked()) {
			canvas.getContext().strokeText(this.getText(), this.getVector().getX(), this.getVector().getY());
		}
		
		this.applyFillSettings(canvas);
		if(this.isFilled()) {
			canvas.getContext().fillText(this.getText(), this.getVector().getX(), this.getVector().getY());			
		}
		
		canvas.getContext().restore();
	}
});