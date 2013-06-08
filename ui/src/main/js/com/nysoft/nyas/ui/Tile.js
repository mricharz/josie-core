jQuery.require('com.nysoft.nyas.core.Control');

com.nysoft.nyas.core.Control.extend('com.nysoft.nyas.ui.Tile', {
	meta: {
		tilescontainer: 'object',
		title: 'string',
		opened: 'boolean',
		onOpen: 'function',
		onClose: 'function'
	},
	
	init: function() {
		//get tileContainer
		if(this.getDom()) {
			this.setTilescontainer(this.getDom().parents('.tile-container'));
		}
		
		//update properties to force draw in dom
		this.setTitle(this.getTitle());
	},
	
	_renderControl: function() {
		if(this.getDom()) {
			this.getDom().addClass('tile');
			this.getDom().html(
				'<h3></h3>'
			);
			this.title = this.getDom().children('h3');
			
			this.getDom().click(jQuery.proxy(function() {
				if(!this.getOpened()) {
					this.open();
				} else {
					this.close();
				}
			}, this));
		}
	},
	
	setTitle: function(title) {
		if(typeof title == 'string') {
			this.setProperty('title', title);
			if(this.title) {
				this.title.text(title);	
			}
		}
	},
	
	open: function() {
		this.getTilescontainer().hide();
		this.setOpened(true);
		if(jQuery.isFunction(this.getOnOpen()))
			this.getOnOpen().call(this, this);
	},
	
	close: function() {
		this.getTilescontainer().show();
		this.setOpened(false);
		if(jQuery.isFunction(this.getOnClose()))
			this.getOnClose().call(this, this);
	},
	
});