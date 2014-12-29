Josie.declare('com.nysoft.josie.core.EventStack');

com.nysoft.josie.core.EventStack.events = {};

com.nysoft.josie.core.EventStack.getEventNamespace = function(sNamespace) {
    if(typeof sNamespace == 'object') {
        return sNamespace;
    }
    if(com.nysoft.josie.core.EventStack.events) {
        return Josie.declare(sNamespace, com.nysoft.josie.core.EventStack.events);
    }
};

com.nysoft.josie.core.EventStack._getEvent = function(oNamespace, sEventName, forceInit) {
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

com.nysoft.josie.core.EventStack.bind = function(sNamespace, sEventName, fEventHandler, oContext, oData) {
    if(com.nysoft.josie.core.EventStack.events) {
        if(jQuery.isFunction(fEventHandler)) {
            var oNamespace = com.nysoft.josie.core.EventStack.getEventNamespace(sNamespace);
            var oEvent = com.nysoft.josie.core.EventStack._getEvent(oNamespace, sEventName, true);
            Josie.log.trace('Bind event to: '+sEventName, oEvent, oNamespace, arguments);
            if(!oEvent._eventHandler)
                oEvent._eventhandler = [];
            oEvent._eventhandler.push({
                handlerFunction: fEventHandler,
                data: oData,
                context: oContext
            });
        } else {
            Josie.log.error('EventHandler is not a function!', sEventName, fEventHandler);
        }
    }
};

com.nysoft.josie.core.EventStack.trigger = function() {
    if(arguments.length > 1) {
        var args = [];
        Array.prototype.push.apply(args, arguments);
        var oNamespace = args.shift();
        var sEventName = args.shift();

        if(oNamespace.className) {
            var oGlobalNamespace = com.nysoft.josie.core.EventStack.getEventNamespace(oNamespace.className);

            //trigger global parent-Class Events
            var oParent = oNamespace;
            while(oParent && oParent.$parent && (oParent = oParent.$parent)) {
                if(oParent.className) {
                    var oParentNamespace = com.nysoft.josie.core.EventStack.getEventNamespace(oParent.className);
                    com.nysoft.josie.core.EventStack._triggerObjectEvent(oParentNamespace, sEventName, args, oNamespace);
                }
            }

            //trigger global class-Event
            com.nysoft.josie.core.EventStack._triggerObjectEvent(oGlobalNamespace, sEventName, args, oNamespace);
        }

        //trigger object-event
        var oObjectNamespace = oNamespace;
        com.nysoft.josie.core.EventStack._triggerObjectEvent(oObjectNamespace, sEventName, args, oNamespace);
    }
};

com.nysoft.josie.core.EventStack._triggerObjectEvent = function(oObject, sEventName, args, oContext) {
    if(oObject && oObject._events) {
        var oEvent = com.nysoft.josie.core.EventStack._getEvent(oObject, sEventName);
        if(oEvent && oEvent._eventhandler) {
            Josie.log.debug('Trigger events from: '+sEventName, oEvent, args);
            Josie.utils.each(oEvent._eventhandler, function(oEvent) {
                oContext = oEvent.context || oContext;
                return oEvent.handlerFunction.call(oContext, args, oEvent.data);
            });
        }
    }
};

com.nysoft.josie.core.EventStack.unbind = function(sNamespace, sEventName) {
    var oNamespace = com.nysoft.josie.core.EventStack.getEventNamespace(sNamespace);
    var oEvent = com.nysoft.josie.core.EventStack._getEvent(oNamespace, sEventName);
    Josie.log.trace('Unbind events from: '+sEventName, oEvent, oNamespace);
    if(oEvent && oEvent._eventhandler) {
        oEvent._eventhandler = [];
    }
};