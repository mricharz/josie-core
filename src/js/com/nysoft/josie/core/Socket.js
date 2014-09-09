jQuery.require('com.nysoft.josie.core.BaseObject');
jQuery.require('com.nysoft.josie.core.Socket.Status');

com.nysoft.josie.core.BaseObject.extend('com.nysoft.josie.core.Socket', {
	meta: {
		url: 'string',
		status: 'string',
		socket: 'object',
		onError: 'function',
		onMessage: 'function',
		onClose: 'function',
		onOpen: 'function',
	},
	
	init: function(options) {
		this.setProperties(options);
		
		this.open();
	},
	
	open: function() {
		if(this.getUrl()) {
			if(this.getStatus() == com.nysoft.josie.core.Socket.Status.None || this.getStatus() == com.nysoft.josie.core.Socket.Status.Closed) {
				this.setProperty('status', com.nysoft.josie.core.Socket.Status.Connecting);
				this.setSocket(new WebSocket(this.getUrl()));
				this.getSocket().onopen = jQuery.proxy(this.onOpen, this);
				this.getSocket().onerror = jQuery.proxy(this.onError, this);
				this.getSocket().onmessage = jQuery.proxy(this.onMessage, this);
				this.getSocket().onclose = jQuery.proxy(this.onClose, this);
			} else {
				throw new com.nysoft.josie.core.Exception('Socket already opened or in connecting-progress!');
			}
		} else {
			throw new com.nysoft.josie.core.Exception('URL for SocketConnection is not defined!');
		}
	},
	
	close: function() {
		this.setProperty('status', com.nysoft.josie.core.Socket.Status.Disconnecting);
		this.getSocket().close();
	},
	
	send: function(data) {
		if(this.getStatus() == com.nysoft.josie.core.Socket.Status.Opened) {
			this.getSocket().send(data);
		} else {
			throw new com.nysoft.josie.core.Exception('Socket is not ready, yet!');
		}
	},
	
	onMessage: function(e) {
		jQuery.log.trace(e.data);
		if(jQuery.isFunction(this.getOnMessage()))
			this.getOnMessage().call(this, e);
	},
	
	onError: function(e) {
		jQuery.log.trace(e);
		if(jQuery.isFunction(this.getOnError()))
			this.getOnError().call(this, e);
	},
	
	onOpen: function(e) {
		this.setProperty('status', com.nysoft.josie.core.Socket.Status.Opened);
		if(jQuery.isFunction(this.getOnOpen()))
			this.getOnOpen().call(this, e);
	},
	
	onClose: function(e) {
		this.setProperty('status', com.nysoft.josie.core.Socket.Status.Closed);
		if(jQuery.isFunction(this.getOnClose()))
			this.getOnClose().call(this, e);
	}
});