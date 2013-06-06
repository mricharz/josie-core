jQuery.require('com.nysoft.nyas.core.Control');

com.nysoft.nyas.core.Control.extend('com.nysoft.nyas.ui.TileContainer', {
	meta: {
		tiles: 'object',
		title: 'string'
	},

	init: function(domObject, options) {
		this._super('init', domObject, options);
		
		//update properties to force draw in dom
		this.setTitle(this.getTitle());
		this.setTiles(this.getTiles());
	},
	
	_renderControl: function() {
		if(this.getDom()) {
			this.getDom().addClass('tile-container');
			this.getDom().html(
					'<h2></h2>' +
					'<div class="container">' +
						'<div class="arrow left" />' +
						'<div class="inner" />' + 
						'<div class="arrow right" />' +
					'</div>'
			);
			this.container = this.getDom().find('.inner');
			this.btnLeft = this.getDom().find('.arrow.left');
			this.btnRight = this.getDom().find('.arrow.right');
			this.title = this.getDom().children('h2');
		}
	},
	
	addTile: function(tile) {
		if(!this.getTiles()) {
			this.setTiles([]);
		}
		if(typeof tile == 'object') {
			this.getTiles().push(tile);
			if(this.container) {
				tile.attachTo(this.container);
			}
		}
	}
	
});