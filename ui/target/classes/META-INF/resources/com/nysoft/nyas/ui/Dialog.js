jQuery.require('com.nysoft.nyas.ui.ShadowLayer');

com.nysoft.nyas.ui.ShadowLayer.extend('com.nysoft.nyas.ui.Dialog', {
	meta: {
		object: 'object',
		showCloseButton: 'boolean',
		title: 'string',
		content: 'object',
		width: 'string',
		height: 'string'
	},
	
	init: function(options) {
		this.setProperties(options);
		
		this.drawDialog();
		
		this._super('init', arguments);
	},
	
	drawDialog: function() {
		this.setObject(jQuery(
				'<div class="dialog">' +
					'<div class="title">'+this.getTitle()+'</div>' +
					'<div class="closeBtn"></div>' +
					'<div class="content">' +
					'</div>' +
				'</div>'
		));
		this.getObject().css('width', this.getWidth());
		this.getObject().css('height', this.getHeight());
		this.title = this.getObject().children('.title');
		this.closeBtn = this.getObject().children('.closeBtn');
		if(this.getShowCloseButton()) {
			this.closeBtn.click(jQuery.proxy(function() {
				this.close();
			}, this));
		} else {
			this.closeBtn.hide();
		}
		this.contentCnt = this.getObject().children('.content');
		this.contentCnt.append(this.getContent());
	},
	
	open: function() {
		jQuery('body').append(this.getObject());
		this._super('open');
	},
	
	close: function() {
		this.getObject().detach();
		this._super('close');
	}
});