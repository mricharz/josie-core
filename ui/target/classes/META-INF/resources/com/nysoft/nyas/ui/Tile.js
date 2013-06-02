jQuery.require('com.nysoft.nyas.core.BaseObject');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Tile', {
	meta: {
		tile: 'object',
		tilescontainer: 'object',
		title: 'string',
		opened: 'boolean',
		playground: 'object',
		onOpen: 'function',
		onClose: 'function'
	},
	
	init: function(object, options) {
		jQuery.log.trace('Tile constructor');
		if(object) {
			this.setTilescontainer(object.parents('.tilescontainer'));
			this.setTile(object);
			
			this.getTile().click(jQuery.proxy(function() {
				if(!this.getOpened()) {
					this.open();
				} else {
					this.close();
				}
			}, this));
		}
		this.setProperties(options);
	},
	
	open: function() {
		this.getTilescontainer().hide();
		jQuery('body').append(this.getPlayground());
		this.getPlayground().generateObject();
		this.setOpened(true);
		if(jQuery.isFunction(this.getOnOpen()))
			this.getOnOpen().call(this, this);
	},
	
	close: function() {
		this.getPlayground().detach();
		this.getTilescontainer().show();
		this.setOpened(false);
		if(jQuery.isFunction(this.getOnClose()))
			this.getOnClose().call(this, this);
	},
	
	draw: function(parent) {
		this.setTile(jQuery(
				'<div class="tile">' +
				'<h2>' + this.getTitle() + '</h2>' +
				'</div>'
		));
		parent.append(this.getTile());
		
		this.getTile().click(jQuery.proxy(function() {
			if(!this.getOpened()) {
				this.open();
			} else {
				this.close();
			}
		}, this));
	}
});