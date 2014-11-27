Josie.require('com.nysoft.josie.core.BaseObject');

//onBeforeInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.ManagedObject', 'onBeforeInit', function(e, data) {
    var oControlObject = e[0], arguments = e[1], domObject, options;
    domObject = arguments[0] || null;
    options = arguments[1] || null;

    if (domObject) {
        oControlObject.setDom(domObject);
        // capture object properties
        var properties = domObject.data();
        jQuery.each(properties, function(sPropertyName, sValue) {
            if(sPropertyName === "class") { // skip class-property
                return true;
            }
            var propertyName = Josie.utils.toCamelCase(sPropertyName);
            Josie.log.trace('Get PropertyValue of: '
            + propertyName, sValue);
            var value;
            //check for shot-hand selector
            if(sValue && sValue.match) {
                var aMatches = sValue.match(/^\{(\".*\")\}$/);
                if(aMatches && aMatches.length == 2) {
                    //enrich short-hand selector
                    sValue = '{"selector":'+aMatches[1]+'}';
                }
            }
            try { //try to parse as JSON-Data and set as property-value
                value = sValue;
                if(typeof value !== 'object') {
                    value = jQuery.parseJSON(sValue);
                }
                if(typeof value === 'object') {
                    Josie.log.trace('Parsed as JSON');
                    //check for selector
                    if (value.selector && Josie.utils.isSelector(value.selector)) {
                        Josie.log.trace('has selector binding');
                        oControlObject.addBinding(propertyName, value.selector);
                        delete options[propertyName];
                        return true;
                    }
                }
            } catch (err) { //otherwise look for binding selector
                Josie.log.trace('Parsed as string-value');
                //check if it is a namespace
                value = (sValue && sValue.indexOf('.') > -1) ? Josie.getClass(sValue) || sValue : sValue;
            }
            options[propertyName] = value;
        });
        //aggregate content
        var jqAggregations = domObject.children('*[data-property]');
        var oAggregations = {};
        jqAggregations.each(function(){
            var jqThis = jQuery(this);
            var sAggregation = jqThis.data('property');
            //create aggregation array
            if(!oAggregations[sAggregation]) {
                oAggregations[sAggregation] = [];
            }
            //is this a object, then generate it
            if(jqThis.data('data-class')) {
                var oObject = jqThis.generateObject();
                oAggregations[sAggregation].push(oObject);
            } else { //id this only a container, then generate its content
                oAggregations[sAggregation] = oAggregations[sAggregation].concat(jqThis.children().generateObject());
            }
        });
        options = jQuery.extend(options, oAggregations);
        //aggregate to default "content" for content without aggregation
        var aContentObjects = domObject.children(':not([data-property])[data-class]').generateObject();
        if(aContentObjects.length) {
            Josie.log.debug('Found default content-aggregation.', aContentObjects);
            options.content = (options.content) ? options.content.concat(aContentObjects) : aContentObjects;
        }
        //clear content
        domObject.empty();
    } else {
        oControlObject.setDom(jQuery('<div />'));
    }
    oControlObject.setProperties(options);
});

//onAfterInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.Control', 'onAfterInit', function(e) {
    var oControlObject = e[0], arguments = e[1], domObject, options;
    domObject = arguments[0] || null;
    options = arguments[1] || null;

    //make dom-reference
    oControlObject._setReference();
});

com.nysoft.josie.core.BaseObject.extend('com.nysoft.josie.core.ManagedObject', {
    meta: {
        dom: 'object',
        bindings: { type: 'object', defaultValue: [] }
    },

    init: function(domObject) {
        Josie.log.trace('Init ManagedObject', arguments);
        if(domObject && domObject.detach) {
            domObject.detach();
        }
    },

    destroy: function() {
        this.getDom().remove();
    },

    attachTo: function(domObject, prepend) {
        if(!Josie.utils.isjQuery(domObject)) {
            domObject = jQuery(domObject);
        }
        if(!prepend) {
            domObject.append(this.getDom());
        } else {
            domObject.prepend(this.getDom());
        }
    },

    detach: function() {
        this.getDom().detach();
    },

    addBinding: function(sPropertyName, sSelector) {
        var oBinding = com.nysoft.josie.core.Model.addBinding(this, sPropertyName, sSelector);
        this.getBindings()[sPropertyName] = oBinding;
    },

    removeBinding: function(sPropertyName) {
        delete this.getBindings()[sPropertyName];
        //TODO: Remove also from model
    },

    getBinding: function(sPropertyName) {
        return this.getBindings()[sPropertyName];
    },

    _setReference: function(domObject) {
        domObject = domObject || this.getDom();
        domObject.data('control', this);
    },

});