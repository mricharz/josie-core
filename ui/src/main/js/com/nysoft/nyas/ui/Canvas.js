jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('css/com/nysoft/nyas/ui.css', {dataType: 'stylesheet'});

com.nysoft.nyas.core.Control.extend('com.nysoft.nyas.ui.Canvas', {
	meta: {
		canvas: 'object',
		background: 'object'
	},
	
	init: function() {
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