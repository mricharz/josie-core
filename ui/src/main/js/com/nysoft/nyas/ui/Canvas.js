jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('css/com/nysoft/nyas/ui.css', {dataType: 'stylesheet'});

com.nysoft.nyas.core.Control.extend('com.nysoft.nyas.ui.Canvas', {
	meta: {
		canvas: 'object',
		background: 'object',
		width: 'number',
		height: 'number'
	},
	
	init: function(domObject, options) {
		if(domObject) {
			this.setDom(domObject);
		} else {
			this.setDom(jQuery('<div />'));
			//we need to add this to DOM or we cannot use it
			this.getDom().hide();
			jQuery('body').append(this.getDom());
		}
		this.setProperties(options);
		(!this.getId()) && this.setId(jQuery.utils.uniqueId());
		
		this._renderCanvasControl();
		
		//initial setup canvas size
		this._updateCanvasSize();

		//update size of canvas
		this.bindEvent('onAfterRenderer', function() {
			this._updateSize();
			window.addEventListener("orientationchange", jQuery.proxy(this._updateSize, this));
			window.addEventListener("resize", jQuery.proxy(this._updateSize, this));
		});
	},
	
	_updateSize: function() {
		jQuery.log.trace('Canvas::updateSize');
		var parent = this.getDom().parent();
		if(parent && parent.get(0) && parent.get(0).nodeName.toLowerCase() == 'body') {
			parent = jQuery(window);
		}
		jQuery.log.trace('Canvas::_updateSize', parent, parent.innerHeight(), parent.innerWidth());
		this.getDom().css('height', parent.innerHeight());
		this.getDom().css('width', parent.innerWidth());
		this.getCanvas().get(0).height = parent.innerHeight();
		this.getCanvas().get(0).width = parent.innerWidth();
	destroy: function() {
		delete this.getContext();
		delete this.getCanvas();
		this.getDom().remove();
	},
	
	_updateCanvasSize: function() {
		var parent = this.getDom().parent() || jQuery('body');
		
		var innerHeight = parent.innerHeight();
		var innerWidth = parent.innerWidth();
		var width = (this.getWidth() >= innerWidth || !this.getWidth()) ? innerWidth : this.getWidth();
		var height = (this.getHeight() >= innerHeight || !this.getHeight()) ? innerHeight : this.getHeight();
		
		this.getDom().css('height', height);
		this.getDom().css('width', width);
		this.getCanvas().get(0).height = height;
		this.getCanvas().get(0).width = width;
	},
	
	_renderControl: function() {
		jQuery.log.trace('Canvas::renderControl');
		//setting id to domObject
		this.getDom().attr('id', this.getId());
		//add canvas-CSSClass
		if(!this.getDom().hasClass('canvas'))
			this.getDom().addClass('canvas');
		//create background domObject
		this.setBackground(jQuery('<div id="'+this.getId()+'-bg" class="canvas-background" />'));
		this.getDom().append(this.getBackground());
		//create canvas domObject
		this.setCanvas(jQuery('<canvas id="'+this.getId()+'-canvas" />'));
		this.getDom().append(this.getCanvas());
	}
});