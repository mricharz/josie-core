jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.ui.Canvas.Container');

com.nysoft.nyas.ui.Canvas.Container.extend('com.nysoft.nyas.ui.Canvas.Model', {
	meta: {
		preRender: 'boolean',
		width: 'number',
		height: 'number'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		this._super('init', options);
	},
	
	hasToPreRender: function() {
		return this.getPreRender();
	},
	
	_preRender: function() {
		if(!this._bPreRendered) {
			jQuery.log.trace('PreRendering Model: '+this.getId());
			var preRenderCanvas = this.getPreRenderCanvas();
			jQuery.each(this.getObjects(), function() {
				this.render(preRenderCanvas);
			});
			this._bPreRendered = true;
		}
	},
	
	getAsImage: function() {
		if(!this.image) {
			this._preRender();
			this.image = new Image();
			this.image.id = this.getId()+'-image';
			this.image.src = this.getPreRenderCanvas().getCanvas().get(0).toDataURL();
		}
		return this.image;
	},
	
	getPreRenderCanvas: function(canvas) {
		if(!this._preRenderCanvas) {
			this._preRenderCanvas = new com.nysoft.nyas.ui.Canvas2D(null, {
				width: this.getWidth(),
				height: this.getHeight()
			});
		}
		return this._preRenderCanvas;
	},
	
	render: function(canvas) {
		if(this.hasToPreRender()) {
			this._preRender();
			canvas.getContext().save();
			this.applyRotation(canvas, this.getWidth(), this.getHeight());
			//draw prerendered image
			canvas.getContext().drawImage(this.getPreRenderCanvas().getCanvas().get(0), this.getVector().getX(), this.getVector().getY());
			canvas.getContext().restore();
		} else {
			this._super('render', canvas);
		}
	}
});