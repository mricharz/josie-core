jQuery.require('com.nysoft.nyas.ui.Tile');

com.nysoft.nyas.ui.Tile.extend('com.nysoft.nyas.ui.AppTile', {
	meta: {
		namespace: 'string',
		options: 'object'
	},
	
	init: function() {
		this._super('init');
	},
	
	open: function() {
		this.getTilescontainer().hide();
		
		var app = this.getApp();
		app.attachTo(this.getTilescontainer().parent());
		this.setOpened(true);
		
		if(jQuery.isFunction(this.getOnOpen()))
			this.getOnOpen().call(this, this);
	},
	
	getApp: function() {
		if(!this.app) {
			jQuery.require(this.getNamespace());
			this.app = new (jQuery.declare(this.getNamespace()))(this.getOptions());
		}
		return this.app;
	},
	
	close: function() {
		var app = this.getApp();
		app.detach();
		this.setOpened(false);
		
		this.getTilescontainer().show();
		
		if(jQuery.isFunction(this.getOnClose()))
			this.getOnClose().call(this, this);
	}

});