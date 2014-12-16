Josie.require('com.nysoft.josie.core.BaseObject');

//onBeforeInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.ManagedObject', 'onBeforeInit', function(e, data) {
    var oControlObject = e[0], arguments = e[1], domObject, options;
    domObject = arguments[0] || null;
    options = arguments[1] || arguments[0] || null;

    if (domObject && Josie.utils.isjQuery(domObject)) {
        oControlObject.setDom(domObject);
        // capture object properties
        var properties = domObject.data();
        jQuery.each(properties, function(sPropertyName, sValue) {
            if(sPropertyName === "class") { // skip class-property
                return true;
            }
            var propertyName = Josie.utils.toCamelCase(sPropertyName),
                bEvent = (sPropertyName.match(/^on[A-Z0-9]/) !== null);
            Josie.log.trace('Get PropertyValue of: '
            + propertyName, sValue, bEvent);
            var value;
            //check for shot-hand selector
            if(sValue && sValue.match) {
                var aMatches = sValue.match(/^\{(\".*\")\}$/);
                if(aMatches && aMatches.length == 2) {
                    //enrich short-hand selector
                    sValue = '{"selector":'+aMatches[1]+'}';
                }
            }
            if(bEvent) {
                var fnEvent = Function(sValue);
                oControlObject.bindEvent(propertyName, jQuery.proxy(fnEvent, oControlObject));
                return;
            }
            try { //try to parse as JSON-Data
                value = jQuery.parseJSON(sValue);
            } catch(err) {
                value = sValue;
            }

            if(typeof value === 'object') { //look for binding selector
                Josie.log.trace('Parsed as JSON');
                //check for selector
                if (value.selector && Josie.utils.isSelector(value.selector)) {
                    Josie.log.trace('has selector binding');
                    oControlObject.addBinding(propertyName, value.selector);
                    return true;
                }
            } else if(typeof value === 'string') {
                Josie.log.trace('Parsed as string-value', value, Josie.getClass(value));
                //check if it is a namespace and get the object
                if(Josie.utils.isNamespace(value) && value.indexOf('.') > 0) {
                    try {
                        value = Josie.getClass(value);
                        if(!value) {
                            Josie.require(value.replace(/\.[^\.]*?$/, ''));
                            value = Josie.getClass(value);
                        }
                    } catch(err) {}
                }
            }
            var fnSetter = oControlObject['set'+Josie.utils.capitalize(propertyName)];
            if(fnSetter) {
                fnSetter.call(oControlObject, value);
                delete options[propertyName];
            } else {
                options[propertyName] = value;
            }
        });
        //aggregate content
        var jqAggregations = domObject.children('*[data-property]');
        var oAggregations = {};
        jqAggregations.each(function(){
            var jqThis = jQuery(this);
            var sAggregation = jqThis.data('property');
            delete options[sAggregation];
            var fnAdder = oControlObject['add'+Josie.utils.capitalize(sAggregation)];
            if(!fnAdder) {
                //if there is no add*-Method, this is not an Array-Property only the last item will be left in this Property
                fnAdder = oControlObject['set'+Josie.utils.capitalize(sAggregation)];
            }
            //is this a object, then generate it
            if(jqThis.data('data-class')) {
                var aObjects = jqThis.generateObject();
                if(fnAdder && aObjects && aObjects.length) {
                    fnAdder.call(oControlObject, aObjects[0]);
                }
            } else { //id this only a container, then generate its content
                jqThis.children().each(function(){
                    if(fnAdder) {
                        var aObjects = jQuery(this).generateObject();
                        if(aObjects && aObjects.length) {
                            fnAdder.call(oControlObject, aObjects[0]);
                        }
                    }
                });
            }
        });
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
        var jqDom = this.getDom();
        if(jqDom && jqDom.length) {
            this.getDom().remove();
        }
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
    }

});