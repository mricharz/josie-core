jQuery.declare('com.nysoft.nyas.core.EventStack');

com.nysoft.nyas.core.EventStack.events = {};

com.nysoft.nyas.core.EventStack.getEventNamespace = function(sNamespace) {
	if(typeof sNamespace == 'object') {
		return sNamespace;
	}
	if(com.nysoft.nyas.core.EventStack.events) {
		return jQuery.declare(sNamespace, com.nysoft.nyas.core.EventStack.events);
	}
};

com.nysoft.nyas.core.EventStack._getEvent = function(oNamespace, sEventName, forceInit) {
	if(!oNamespace._events && !forceInit)
		return null;
	if(!oNamespace._events)
		oNamespace._events = {};
	
	if(!oNamespace._events[sEventName] && !forceInit)
			return null;
	if(!oNamespace._events[sEventName] && forceInit)
		oNamespace._events[sEventName] = {};
	
	
	return oNamespace._events[sEventName];
};
	
com.nysoft.nyas.core.EventStack.bind = function(sNamespace, sEventName, fEventHandler, oContext, oData) {
	if(com.nysoft.nyas.core.EventStack.events) {
		if(jQuery.isFunction(fEventHandler)) {
			var oNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(sNamespace);
			var oEvent = com.nysoft.nyas.core.EventStack._getEvent(oNamespace, sEventName, true);
			jQuery.log.trace('Bind event to: '+sEventName, oEvent, oNamespace, arguments);
			if(!oEvent._eventHandler)
				oEvent._eventhandler = [];
			oEvent._eventhandler.push({
				handlerFunction: fEventHandler,
				data: oData,
				context: oContext
			});
		} else {
			jQuery.log.error('EventHandler is not a function!', sEventName, fEventHandler);
		}
	}
};
	
com.nysoft.nyas.core.EventStack.trigger = function() {
	if(arguments.length > 1) {
		var args = [];
		Array.prototype.push.apply(args, arguments);
		var oNamespace = args.shift();
		var sEventName = args.shift();
		
		if(oNamespace.className) {
			var oGlobalNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(oNamespace.className);
			
			//trigger global parent-Class Events
			var oParent = oNamespace;
	    	while(oParent && oParent.$parent && (oParent = oParent.$parent)) {
	    		if(oParent.className) {
		    		var oParentNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(oParent.className);
		    		com.nysoft.nyas.core.EventStack._triggerObjectEvent(oParentNamespace, sEventName, args);
	    		}
	    	}
			
			//trigger global class-Event
			com.nysoft.nyas.core.EventStack._triggerObjectEvent(oGlobalNamespace, sEventName, args);
		}

		//trigger object-event
		var oObjectNamespace = oNamespace;
		com.nysoft.nyas.core.EventStack._triggerObjectEvent(oObjectNamespace, sEventName, args);
	}
};

com.nysoft.nyas.core.EventStack._triggerObjectEvent = function(oObject, sEventName, args) {
	if(oObject && oObject._events) {
		var oEvent = com.nysoft.nyas.core.EventStack._getEvent(oObject, sEventName);
		jQuery.log.debug('Trigger events from: '+sEventName, oEvent, args);
		if(oEvent && oEvent._eventhandler) {
			jQuery.each(oEvent._eventhandler, function() {
				return this.handlerFunction.call(this.context, args, this.data);
			});
		}
	}
};
	
com.nysoft.nyas.core.EventStack.unbind = function(sNamespace, sEventName) {
	var oNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(sNamespace);
	var oEvent = com.nysoft.nyas.core.EventStack._getEvent(oNamespace, sEventName);
	jQuery.log.trace('Unbind events from: '+sEventName, oEvent, oNamespace);
	if(oEvent && oEvent._eventhandler) {
		oEvent._eventhandler = [];
	}
};