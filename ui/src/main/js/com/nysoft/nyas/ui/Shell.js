jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.core.Socket');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Shell', {
	meta: {
		object: 'object',
		user: 'object',
		socketConnection: 'object',
		tiles: 'object',
		currentTileIndex: 'number'
	},
	
	addTile: function(tile) {
		if(!this.getTiles()) {
			this.setTiles([]);
		}
		return this.getTiles().push(tile)-1;
	},
	
	getURLParameter: function(name) {
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	},
	
	init: function(obj, options) {
		this.setUser(new com.nysoft.nyas.core.User({
			name: this.getURLParameter('name')
		}));
		
		this.setObject(obj);
		this.setProperties(options);
		
		this.openSocket();
		this.drawShell();
		
		if(options.createTiles) {
			jQuery.each(options.createTiles, jQuery.proxy(function(key, value) {
				if(window[value]) {
					var tile = new window[value](null, {
						tilescontainer: this.tilescontainer,
						onOpen: jQuery.proxy(function(tile) {
							var index = null;
							jQuery.each(this.getTiles(), jQuery.proxy(function(key, value) {
								if(tile == value) {
									index = key;
									return false;
								}
							}, this));
							this.setCurrentTileIndex(index);
						}, this),
						onClose: jQuery.proxy(function(tile) {
							this.setCurrentTileIndex(null);
						}, this)
					});
					tile.draw(this.tilescontainer);
					this.addTile(tile);
				}
			}, this));
		}
	},
	
	addChatBoxBtn: function(users) {
		if(!users)
			return;
		users = users.split(',');
		jQuery.each(users, jQuery.proxy(function(key, value) {
			if(value && value != this.getUser().getName()) {
				var chatBoxBtn = jQuery('<li class="chatbox-btn">'+value+'</li>');
				this.chats.append(chatBoxBtn);
			}
		}, this));
	},
	
	remChatBoxBtn: function(users) {
		if(!users)
			return;
		users = users.split(',');
		jQuery.each(users, jQuery.proxy(function(key, value) {
			this.chats.find('.chatbox-btn').each(function() {
				if(jQuery(this).text() == value)
					this.remove();
			})
		}, this));
	},
	
	drawShell: function() {
		if(this.getObject()) {
			var obj = this.getObject().html(
					'<div class="shell-bar">' +
						'<a class="button home"><span>Home</span></a>' +
						'<ul class="chats"></ul>' +
					'</div>' +
					'<div class="tilescontainer">' + 
						'<h2>Willkommen im NySoft Testcenter</h2>' +
					'</div>'
			);
			this.bar = obj.children('.shell-bar');
			this.homeButton = this.bar.children('.button.home');
			this.chats = this.bar.children('.chats');
			this.tilescontainer = obj.children('.tilescontainer');
			
			//event
			this.homeButton.click(jQuery.proxy(function() {
				var tile = this.getCurrentTile();
				if(tile)
					tile.close();
			}, this));
		}
	},
	
	getCurrentTile: function() {
		if(this.getCurrentTileIndex() !== null) {
			return this.getTiles()[this.getCurrentTileIndex()];
		}
		return null;
	},
	
	socketReady: function() {
		if(this.getSocketConnection().getStatus() != com.nysoft.nyas.core.Socket.Status.Opened) {
			this.openSocket();
		}
		if(this.getSocketConnection().getStatus() == com.nysoft.nyas.core.Socket.Status.Opened) {
			return true;
		}
		return false;
	},
	
	openSocket: function() {
		if(!this.getSocketConnection()) {
			this.setSocketConnection(new com.nysoft.nyas.core.Socket({
				url: 'ws://dev.nysoft.de:88',
				onOpen: jQuery.proxy(this.onSocketOpen, this),
				onError: jQuery.proxy(this.onSocketError, this),
				onMessage: jQuery.proxy(this.onSocketMessage, this)
			}));
		}
		if(this.getSocketConnection().getStatus() != com.nysoft.nyas.core.Socket.Status.Connecting && 
			this.getSocketConnection().getStatus() != com.nysoft.nyas.core.Socket.Status.Opened &&
			this.getSocketConnection().getStatus() != com.nysoft.nyas.core.Socket.Status.Disconnecting) {
			this.getSocketConnection().open();
		}
	},
	
	onSocketOpen: function(e) {
		this.getSocketConnection().send('hello:'+this.getUser().getName());
	},
	
	onSocketError: function(e) {
		alert(JSON.stringify(e));
	},
	
	onSocketMessage: function(e) {
		console.log(e);
		var dataSplit = e.data.match(/^([^:]*):(.*)/);
		if(dataSplit.length > 0) {
			var msg = dataSplit[2] || null;
			this[dataSplit[1]].call(this, e, msg);
		}
	},
	
	userleft: function(e, data) {
		this.remChatBoxBtn(data);
	},
	
	newuser: function(e, data) {
		this.addChatBoxBtn(data);
	},
	
	userlist: function(e, data) {
		this.addChatBoxBtn(data);
	}
});

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.User', {
	meta: {
		name: 'string'
	},

	init: function(options) {
		this.setProperties(options);
	}
});

jQuery.require('com.nysoft.nyas.ui.Tile');

com.nysoft.nyas.ui.Tile.extend('Canvas3DTextTestTile', {
	init: function(object, options) {
		this.setTitle('Canvas 3D Text Test');
		this.setPlayground(jQuery('<canvas class="playarea" id="magicball-canvas" data-jsclass="com.nysoft.Canvas3DTextTest">'));
		this._super('init', object, options);
	}
});

com.nysoft.nyas.ui.Tile.extend('CanvasTextTestTile', {
	init: function(object, options) {
		this.setTitle('Canvas Text Test');
		this.setPlayground(jQuery('<canvas class="playarea" id="memory-canvas" data-jsclass="com.nysoft.CanvasTextTest">'));
		this._super('init', object, options);
	}
});

com.nysoft.nyas.ui.Tile.extend('CanvasBasicObjectsTestTile', {
	init: function(object, options) {
		this.setTitle('Canvas Basic Objects Test');
		this.setPlayground(jQuery('<canvas class="playarea" id="memory-canvas" data-jsclass="com.nysoft.CanvasBasicObjectsTest">'));
		this._super('init', object, options);
	}
});

com.nysoft.nyas.ui.Tile.extend('AccelerationRotationTestTile', {
	init: function(object, options) {
		this.setTitle('Acceleration & Rotation Test');
		this.setPlayground(jQuery('<canvas class="playarea" id="memory-canvas" data-jsclass="com.nysoft.AccelerationRotationTest">'));
		this._super('init', object, options);
	}
});

com.nysoft.nyas.ui.Tile.extend('PuzzleTile', {
	init: function(object, options) {
		jQuery.log.debug('PuzzleTile constructor');
		this.setPlayground(jQuery('<div class="playarea" id="puzzle-div" data-jsclass="Puzzle">'));
		this._super('init', object, options);
	}
});

com.nysoft.nyas.ui.Tile.extend('LabyrinthTile', {
	init: function(object, options) {
		jQuery.log.debug('LabyrinthTile constructor');
		this.setPlayground(jQuery('<canvas class="playarea" id="labyrinth-canvas" data-jsclass="Labyrinth">'));
		this._super('init', object, options);
	}
});

com.nysoft.nyas.ui.Tile.extend('StatisticTile', {
	init: function(object, options) {
		jQuery.log.debug('StatisticTile constructor');
		this.setPlayground(jQuery('<div class="playarea" id="statistic-canvas" data-jsclass="Statistic">'));
		this._super('init', object, options);
	}
});