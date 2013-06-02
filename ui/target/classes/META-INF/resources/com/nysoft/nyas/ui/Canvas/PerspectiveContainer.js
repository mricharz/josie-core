jQuery.require('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.ui.Canvas.Vector');

com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.ui.Canvas.PerspectiveContainer', {
	meta: {
		layerCount: 'number',
		depth: 'number'
	},
	
	init: function(options) {
		this.setProperties(options);
		//setting defaults
		(!this.getLayerCount()) && this.setLayerCount(10);
		(!this.getDepth()) && this.setDepth(20);
		//register orientation event
		window.addEventListener('deviceorientation', jQuery.proxy(function(event) {
			this.onRotate(event, event.alpha, event.beta, event.gamma);
		}, this), false);
		this.g = 0;
		this.b = 0;
		this.objects = [];
	},
	
	addObject: function(object) {
		this.objects.push(object);
	},
	
	onRotate: function(event, a, b, g) {
		if(g)
			this.g = Math.round(g);
		if(b)
			this.b = Math.round(b);
	},
	
	render: function(canvas) {
		var layerCount = this.getLayerCount(), depth = this.getDepth(), g = this.g, b = this.b;
		for(var i = layerCount; i > 0; i--) {
			jQuery.each(this.objects, function() {
				var baseX = this.getVector().getX();
				var baseY = this.getVector().getY();
					if(jQuery.device.mode.landscape) {
						this.getVector().setY(baseY+(g*(i/depth)));
						this.getVector().setX(baseX-(b*(i/depth)));
					} else {
						this.getVector().setX(baseX-(g*(i/depth)));
						this.getVector().setY(baseY-(b*(i/depth)));
					}
					this.render(canvas);
				//reset vector
				this.getVector().setX(baseX);
				this.getVector().setY(baseY);
			});
		}
	}
	
});