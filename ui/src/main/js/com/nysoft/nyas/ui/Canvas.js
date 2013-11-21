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
			//we need to add this to DOM or we cannot use it
			this.getDom().hide();
			jQuery('body').append(this.getDom());
		}
		this.setProperties(options);
		(!this.getId()) && this.setId(jQuery.utils.uniqueId());
		
		//update size of canvas
		this.bindEvent('onAfterRenderer', function() {
			this._updateSize();
			window.addEventListener("orientationchange", jQuery.proxy(this._updateSize, this));
			window.addEventListener("resize", jQuery.proxy(this._updateSize, this));
		});
	},
	
	_updateSize: function() {
		var parent = this.getDom().parent() || jQuery(window);
		var innerHeight = parent.innerHeight();
		var innerWidth = parent.innerWidth();
		
		jQuery.log.trace('Canvas::_updateSize', parent, innerHeight, innerWidth);
		
		var width = (this.getWidth() >= innerWidth || !this.getWidth()) ? innerWidth : this.getWidth();
		var height = (this.getHeight() >= innerHeight || !this.getHeight()) ? innerHeight : this.getHeight();
		
		this.getDom().css('height', height);
		this.getDom().css('width', width);
		this.getCanvas().get(0).height = height;
		this.getCanvas().get(0).width = width;
	},
	
	destroy: function() {
		delete this.getContext();
		delete this.getCanvas();
		this.getDom().remove();
	},
	
	_renderControl: function() {
		jQuery.log.trace('Canvas::renderControl');
		//setting id to domObject
		this.getDom().attr('id', this.getId());
		//add canvas-CSSClass
		if(!this.getDom().hasClass('canvas'))
			this.getDom().addClass('canvas');
		//create background domObject
		this._renderBackground();
		//create canvas domObject
		this.setCanvas(jQuery('<canvas id="'+this.getId()+'-canvas" />'));
		this.getDom().append(this.getCanvas());
	},
	
	_renderBackground: function() {
		if(!this.getBackground()) {
			this.setBackground(jQuery('<div id="'+this.getId()+'-bg" class="canvas-background" />'));
		} else {
			if(!this.getBackground().hasClass('canvas-background')) {
				this.getBackground().addClass('canvas-background');
			}
		}
		this.getDom().append(this.getBackground());
	}
});