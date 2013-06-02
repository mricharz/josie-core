jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.core.Socket.Status');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.Socket', {
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
		
		if(this.getUrl()) {
			this.open();
		}
	},
	
	open: function() {
		if(this.getUrl()) {
			if(this.getStatus() == com.nysoft.nyas.core.Socket.Status.None || this.getStatus() == com.nysoft.nyas.core.Socket.Status.Closed) {
				this.setProperty('status', com.nysoft.nyas.core.Socket.Status.Connecting);
				this.setSocket(new WebSocket(this.getUrl()));
				this.getSocket().onopen = jQuery.proxy(this.onOpen, this);
				this.getSocket().onerror = jQuery.proxy(this.onError, this);
				this.getSocket().onmessage = jQuery.proxy(this.onMessage, this);
				this.getSocket().onclose = jQuery.proxy(this.onClose, this);
			} else {
				throw new Exception('Socket already opened or in connecting-progress!');
			}
		} else {
			throw new Exception('URL for SocketConnection is not defined!');
		}
	},
	
	close: function() {
		this.setProperty('status', com.nysoft.nyas.core.Socket.Status.Disconnecting);
		this.getSocket().close();
	},
	
	send: function(data) {
		this.getSocket().send(data);
	},
	
	onMessage: function(e) {
		console.log(e.data);
		if(jQuery.isFunction(this.getOnMessage()))
			this.getOnMessage().call(this, e);
	},
	
	onError: function(e) {
		console.log(e);
		if(jQuery.isFunction(this.getOnError()))
			this.getOnError().call(this, e);
	},
	
	onOpen: function(e) {
		this.setProperty('status', com.nysoft.nyas.core.Socket.Status.Opened);
		if(jQuery.isFunction(this.getOnOpen()))
			this.getOnOpen().call(this, e);
	},
	
	onClose: function(e) {
		this.setProperty('status', com.nysoft.nyas.core.Socket.Status.Closed);
		this.send('bye:'+this.getUser().getName());
		if(jQuery.isFunction(this.getOnClose()))
			this.getOnClose().call(this, e);
	}
});