jQuery.declare('com.nysoft.nyas.core.EventStack');

com.nysoft.nyas.core.EventStack.events = {};

com.nysoft.nyas.core.EventStack.getEventNamespace = function(sEventName) {
	if(com.nysoft.nyas.core.EventStack.events) {
		return jQuery.declare(sEventName, com.nysoft.nyas.core.EventStack.events);
	}
};
	
com.nysoft.nyas.core.EventStack.bind = function(sEventName, fEventHandler, oContext, oData) {
	if(com.nysoft.nyas.core.EventStack.events) {
		if(jQuery.isFunction(fEventHandler)) {
			oEventNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(sEventName);
			jQuery.log.trace('Bind event to: '+sEventName, oEventNamespace, arguments);
			if(!oEventNamespace.handler)
				oEventNamespace.handler = [];
			oEventNamespace.handler.push({
				handlerFunction: fEventHandler,
				data: oData,
				context: oContext
			});
		} else {
			jQuery.log.error('EventHandler is not a function!', sNamespace, sEventName, fEventHandler);
		}
	}
};
	
com.nysoft.nyas.core.EventStack.trigger = function() {
	if(arguments.length > 1) {
		var args = [];
		Array.prototype.push.apply(args, arguments);
		var sEventName = args.shift();
		var oEventNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(sEventName);
		jQuery.log.debug('Trigger events from: '+sEventName, oEventNamespace);
		if(oEventNamespace.handler) {
			jQuery.each(oEventNamespace.handler, function() {
				return this.handlerFunction.call(this.context, args, this.data);
			});
		}
	}
};
	
com.nysoft.nyas.core.EventStack.unbind = function(sEventName) {
	var oEventNamespace = com.nysoft.nyas.core.EventStack.getEventNamespace(sEventName);
	jQuery.log.trace('Unbind events from: '+sEventName, oEventNamespace);
	if(oEventNamespace.handler) {
		oEventNamespace.handler = [];
	}
};

jQuery.log.trace(com.nysoft.nyas.core.EventStack);