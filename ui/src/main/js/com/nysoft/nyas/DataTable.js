jQuery.require('com.nysoft.nyas.core.Control');

/*
 * <div data-class="com.nysoft.nyas.ui.DataTable" data-id="GamesDataTable" data-selectable="true" data-multiselect="true" data-datasource="/bla/bla/bla" data-columns='["Id", "Title"]'></div>
 * 
 */
com.nysoft.nyas.core.Control.extend('com.nysoft.nyas.ui.DataTable', {	
	meta: {
		columns: 'object',
		data: 'object',
		title: 'string',
		sortBy: 'string',
		selectable: 'boolean',
		multiselect: 'boolean',
		showSelectionBox: 'boolean',
		actionTarget: null,
		actions: 'object'
	},
	
	init: function(domObject, options) {
		//enable debug
		jQuery.log.trace('Creating DataTable');
		
		//save dom and options
		this.setDom(domObject);
		this.setProperties(options);
		
		//set default sortType
		this.sortType = 0;
		
		//init selectedIndexes Array
		this.selectedIndexes = [];
		
		jQuery.log.trace('DataTable created');
	},
	
	toggleSortType: function() {
		this.sortType = !this.sortType;
	},
	
	_renderControl: function() {
		this.trigger('onBeforeRendering', this, arguments);
		this._super('_renderControl', arguments);
		if(this.getDom()) {
			//remove for rerender()
			this.getDom().removeClass('table-responsive').addClass('table-responsive');
			this.getDom().removeClass('dataTable').addClass('dataTable');
			//render nav
			this.jqMenubar = jQuery('<nav class="navbar navbar-default" role="navigation"></nav>');
			this.getDom().append(this.jqMenubar);
			//render table
			this.jqTable = jQuery('<table class="table table-striped table-hover"><thead><tr></tr></thead><tbody></tbody></table>');
			this.getDom().append(this.jqTable);
			this.jqTableHead = this.jqTable.find('thead > tr');
			this.jqTableBody = this.jqTable.children('tbody');
			
			//render columns
			this._renderColumns();
			
			//render menubar
			this._renderMenubar();

			//render tupels
			this._renderTupels();
			
		}
		this.trigger('onAfterRendering', this, arguments);
	},
	
	_renderMenubar: function() {
		//render smartphone dropdown and title
		this.jqMenubar.append('<div class="navbar-header">' +
				    		'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#collapse-navbar-'+this.getId()+'">' +
				      		'<span class="sr-only">Toggle navigation</span>' +
				      		'<span class="icon-bar"></span>' + 
				      		'<span class="icon-bar"></span>' +
				      		'<span class="icon-bar"></span>' +
				    		'</button>' +
				    		'<a class="navbar-brand" href="#">'+this.getTitle()+'</a>' +
				  		'</div>');
		//render action-menu
		this.jqMenubar.append('<div class="collapse navbar-collapse" id="collapse-navbar-'+this.getId()+'">'+
							'<ul class="nav navbar-nav navbar-right">'+
								'<li class="dropdown action-dropdown">' +
									'<a href="#" class="dropdown-toggle" data-toggle="dropdown">Actions <b class="caret"></b></a>' +
									'<ul class="dropdown-menu">' +
									'</ul>' +
								'</li>' +
							'</ul>'+
						'</div>');
		//render action-menu-items
		this._renderActionMenuItems();
	},
	
	_renderActionMenuItems: function() {
		var jqActionMenu = this.jqMenubar.find('.action-dropdown .dropdown-menu');
		var oActions = this.getActions();
		var isObject = jQuery.isPlainObject(oActions);
		jQuery.each(this.getActions(), jQuery.proxy(function(sKey, sValue) {
			var sUrl = (isObject) ? sKey : sValue;
			var sTitle = sValue;
			var jqAction = jQuery('<li><a href="'+this.getActionTarget()+sUrl+'">'+sTitle+'</a></li>');
			jqAction.bind('click', jQuery.proxy(this._onActionMenuClick, this));
			jqActionMenu.append(jqAction);
		}, this));
	},
	
	_renderColumns: function() {
		this.trigger('onBeforeRenderColumns', this, arguments);
		jQuery.log.trace('Render Columns in DataTable');
		//render selection box
		if(this.getShowSelectionBox()) {
			var jqColumn = jQuery('<th></th>');
			if(this.getMultiselect()) {
				var jqSelectAll = jQuery('<input type="checkbox" class="toggleSelection" />');
				jqSelectAll.bind('change', jQuery.proxy(this._onToggleSelection, this));
			}
			jqColumn.append(jqSelectAll);
			this.jqTableHead.append(jqColumn);
		}
		//render data columns
		jQuery.each(this.getColumns(), jQuery.proxy(function(sKey, sValue){
			jQuery.log.trace('Render Column: '+sValue);
			var jqColumn = jQuery('<th>'+sValue+'</th>');
			jqColumn.bind('click', jQuery.proxy(this._onColumnClick, this));
			this.jqTableHead.append(jqColumn);
		}, this));
		this.trigger('onAfterRenderColumns', this, arguments);
	},
	
	_renderTupels: function() {
		jQuery.log.trace('Render Tupels in DataTable');
		if(this.getData()) {
			var oData = this._sort(this.getData());
			jQuery.each(oData, jQuery.proxy(this._renderTupel, this));
		}
	},
	
	_renderTupel: function(sTupelKey, oTupelData) {
		this.trigger('onBeforeRenderTupel', this, arguments);
		jQuery.log.trace('Render Tupel "'+sTupelKey+'" in DataTable');
		var jqTupel = jQuery('<tr></tr>');
		//render selectionbox
		if(this.getShowSelectionBox()) {
			var jqTupelColumn = jQuery('<td></td>');
			var jqSelect = (this.getMultiselect()) ? jQuery('<input type="checkbox" class="select" />') : jQuery('<input type="radio" name="select-'+this.getId()+'" class="select" />');
			jqSelect.bind('change', jQuery.proxy(this._onSelectField, this));
			//TODO: onSelect
			jqTupelColumn.append(jqSelect);
			jqTupel.append(jqTupelColumn);
		}
		//render data
		jQuery.each(this.getColumns(), jQuery.proxy(function(sKey, sColumn) {
			var jqTupelColumn = jQuery('<td></td>');
			if(oTupelData[sColumn] !== undefined) {
				var oColumnData = oTupelData[sColumn];
				if(oColumnData._renderControl && jQuery.isFunction(oColumnData._renderControl)) {
					jqTupelColumn.append(oColumnData.getDom());
					oColumnData._renderControl();
				} else {
					jqTupelColumn.append(oColumnData);
				}
				jqTupelColumn.bind('click', jQuery.proxy(this._onTupelClick, this));
				jqTupelColumn.bind('dblclick', jQuery.proxy(this._onTupelDblClick, this));
			}
			jqTupel.append(jqTupelColumn);
		}, this));
		this.jqTableBody.append(jqTupel);
		this.trigger('onAfterRenderTupel', this, arguments);
	},
	
	_onActionMenuClick: function(e) {
		jQuery.log.debug('_onActionMenuClick');
		e.preventDefault();
	},
	
	_onToggleSelection: function() {
		jQuery.log.debug('_onToggleSelection');
		this.toggleSelection();
	},
	
	_onSelectField: function(e) {
		jQuery.log.debug('_onSelectField');
		var jqSelectedItem = jQuery(e.target).parent().parent();
		var iIndex = this._getIndexOfListItem(jqSelectedItem);
		this.selectIndex(iIndex);
		arguments['selectedIndex'] = iIndex;
		arguments['selectedItem'] = jqSelectedItem;
		this.trigger('onSelect', this, arguments);
	},
	
	_onTupelClick: function(e) {
		this.trigger('onTupelClick', this, arguments);
		if(this.getSelectable()) {
			this._onToggle(e);
		}
	},
	
	_onTupelDblClick: function(e) {
		this.trigger('onTupelDblClick', this, arguments);
		if(this.getSelectable()) {
			this._onToggle(e);
		}
	},
	
	_onToggle: function(e) {
		var jqSelectedItem = jQuery(e.target);
		var iIndex = this._getIndexOfListItem(jqSelectedItem);
		this.toggleIndexSelection(iIndex);
		arguments['toggledIndex'] = iIndex;
		arguments['toggledItem'] = jqSelectedItem;
	},
	
	_onColumnClick: function(e) {
		this.trigger('onColumnClick', this, arguments);
		var sColumn = jQuery(e.target).text();
		jQuery.log.trace('Sort DataTable by: '+sColumn);
		if(this.getSortBy() == sColumn) {
			this.toggleSortType();
		} else {
			this.sortType = 0;
			this.setSortBy(sColumn);
		}
		this.rerender();
	},
	
	toggleSelection: function() {
		jQuery.log.trace('DataTable: toggleSelection');
		var jqRows = this.getRows();
		jqRows.toggleClass('selected');
		jqRows.find('td:first-child .select').each(function() {
			this.attr('checked', !this.attr('checked'));
		})
		var iCount = jqRows.length;
		var aNewSelected = [];
		for(var i = 0; i < iCount; i++) {
			if(jQuery.inArray(i, this.selectedIndexes) < 0) {
				aNewSelected.push(i);
			}
		}
		this.selectedIndexes = aNewSelected;
		this.trigger('onToggleSelection', this, arguments);
	},
	
	toggleIndexSelection: function(iIndex) {
		jQuery.log.trace('DataTable: toggleIndexSelection', iIndex);
		var iPosition = jQuery.inArray(iIndex, this.selectedIndexes);
		if(iPosition < 0) {
			this.selectIndex(iIndex);
		} else {
			this.deselectIndex(iIndex);
		}
		this.trigger('onToggleIndexSelection', this, arguments);
	},
	
	selectIndex: function(iIndex) {
		jQuery.log.trace('DataTable: selectIndex', iIndex);
		if(!this.getMultiselect()) {
			this.clearSelection();
		}
		var iPosition = jQuery.inArray(iIndex, this.selectedIndexes);
		if(iPosition < 0) {
			this.selectedIndexes.push(iIndex);
			var jqRow = this.jqTableBody.children('tr:eq('+iIndex+')');
			jqRow.removeClass('selected').addClass('selected');
			var jqSelect = jqRow.find('td:first-child .select');
			jqSelect.attr('checked', true);
			this.trigger('onSelectIndex', this, arguments);
		}
	},
	
	deselectIndex: function(iIndex) {
		jQuery.log.trace('DataTable: deselectIndex', iIndex);
		var iPosition = jQuery.inArray(iIndex, this.selectedIndexes);
		if(iPosition >= 0) {
			this.selectedIndexes.splice(iPosition, 1);
			var jqRow = this.jqTableBody.children('tr:eq('+iIndex+')');
			jqRow.removeClass('selected');
			var jqSelect = jqRow.find('td:first-child .select');
			jqSelect.attr('checked', false);
			this.trigger('onDeselectIndex', this, arguments);
		}
	},
	
	clearSelection: function() {
		jQuery.log.trace('DataTable: clearSelection');
		this.selectedIndexes = [];
		var jqSelectedRows = this.getSelectedRows();
		jqSelectedRows.removeClass('selected');
		jqSelectedRows.find('td:first-child .select').attr('checked', false);
		this.trigger('onClearSelection', this, arguments);
	},
	
	getRows: function() {
		return this.jqTableBody.children('tr');
	},
	
	getSelectedRows: function() {
		return this.jqTableBody.children('tr.selected');
	},
	
	getSelectedIndexes: function() {
		return this.selectedIndexes;
	},
	
	_getIndexOfListItem: function(jqListItem) {
		return jqListItem.parent().children('tr').index(jqListItem);
	},
	
	_sort: function(oData) {
		this.trigger('onSort', this, arguments);
		var sSortBy = this.getSortBy();
		var bSortType = this.sortType;
		if(oData && sSortBy) {
			oData = oData.sort(function(a, b) {
				if(!bSortType) {
					if(a[sSortBy] < b[sSortBy]) return -1;
					if(a[sSortBy] > b[sSortBy]) return 1;
				} else {
					if(a[sSortBy] > b[sSortBy]) return -1;
					if(a[sSortBy] < b[sSortBy]) return 1;
				}
			    return 0;
			});
		}
		return oData;
	},
	
});