jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('css/com/nysoft/nyas/ui.css', {dataType: 'stylesheet'});

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Canvas', {
	meta: {
		id: 'string',
		dom: 'object',
		canvas: 'object',
		background: 'object'
	},
	
	init: function(domObject, options) {
		if(domObject) {
			this.setDom(domObject);
		} else {
			this.setDom(jQuery('<div />'));
		}
		this.setProperties(options);
		(!this.getId()) && this.setId(jQuery.utils.uniqueId());
		
		this._renderCanvasControl();

		//update size of canvas
		window.addEventListener("orientationchange", jQuery.proxy(this._updateCanvasSize, this));
	},
	
	_updateCanvasSize: function() {
		var parent = this.getDom().parent() || jQuery('body');
		this.getDom().css('height', parent.innerHeight());
		this.getDom().css('width', parent.innerWidth());
		this.getCanvas().get(0).height = parent.innerHeight();
		this.getCanvas().get(0).width = parent.innerWidth();
	},
	
	_renderCanvasControl: function() {
		//setting id to domObject
		this.getDom().attr('id', this.getId());
		//add canvas-CSSClass
		if(!this.getDom().hasClass('canvas'))
			this.getDom().addClass('canvas');
		//create background domObject
		this.setBackground(jQuery('<div id="'+this.getId()+'-bg" class="canvas-background" />'));
		this.getDom().append(this.getCanvas());
		//create canvas domObject
		this.setCanvas(jQuery('<canvas id="'+this.getId()+'-canvas" />'));
		this.getDom().append(this.getCanvas());
	}
});