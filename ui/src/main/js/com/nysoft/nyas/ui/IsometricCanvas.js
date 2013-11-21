jQuery.require('com.nysoft.nyas.ui.Canvas2D');
jQuery.require('com.nysoft.nyas.ui.Canvas.Direction');

com.nysoft.nyas.ui.Canvas2D.extend('com.nysoft.nyas.ui.IsometricCanvas', {
	
	meta: {
		tileWidth: 'number',
		tileHeight: 'number'
	},
	
	init: function(domObject, options) {
		this._super('init', domObject, options);
	},
	
	renderObjects: function() {
		jQuery.each(this.getObjects(), jQuery.proxy(function(iRowIndex, aColumns) {
			jQuery.log.trace('Drawing Row: '+iRowIndex);
			jQuery.each(aColumns, jQuery.proxy(function(iColumnIndex, oColumnObject) {
				jQuery.log.trace('Drawing Column: '+iColumnIndex);
				this._renderPosition(iRowIndex, iColumnIndex);
			}, this));
		}, this));
	},
	
	_renderPosition: function(iRowIndex, iColumnIndex) {
		var oPositionObject = this.getObjectOfPosition(iRowIndex, iColumnIndex);
		if(oPositionObject) {
			if(!jQuery.isArray(oPositionObject)) {
				oPositionObject = [oPositionObject];
			}
			jQuery.each(oPositionObject, jQuery.proxy(function(index, oObject){
				//update vector
				oObject.setVector(this._calculateCoordinate(iRowIndex, iColumnIndex));
				//render object
				oObject.render(this, iColumnIndex);
			}, this));
		}
	},
	
	getPositionOfVector: function(oVector) {
		console.log('Column: '+oVector.getX()/this.getTileWidth());	
		console.log('Row: '+oVector.getY()/this.getTileHeight());
		return {
			column: Math.ceil(oVector.getX()/this.getTileWidth()),
			row: Math.ceil(oVector.getY()/this.getTileHeight()),
		};
	},
	
	_calculateCoordinate: function(iRowIndex, iColumnIndex) {
		return new com.nysoft.nyas.ui.Canvas.Vector(
			iColumnIndex*this.getTileWidth(),
			iRowIndex*this.getTileHeight()
		);
	},
	
	getObjectOfPosition: function(iRowIndex, iColumnIndex) {
		var aRow = this._getRow(iRowIndex);
		if(aRow && aRow.length) {
			return aRow[iColumnIndex];
		}
	},
	
	_getRow: function(iRowIndex) {
		return this.getObjects()[iRowIndex];
	},
	
	_getDirectionChanges: function(sDirection) {
		switch(sDirection) {
		case com.nysoft.nyas.ui.Canvas.Direction.North:
			return { row: -1, column: 0 };
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.NorthEast:
			return { row: -1, column: 1 };
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.East:
			return { row: 0, column: 1 };			
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.SouthEast:
			return { row: 1, column: 1 };
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.South:
			return { row: 1, column: 0 };
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.SouthWest:
			return { row: 1, column: -1 };
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.West:
			return { row: 0, column: -1 };
			break;
		case com.nysoft.nyas.ui.Canvas.Direction.NorthWest:
			return { row: -1, column: -1 };
			break;
		}
	}

});