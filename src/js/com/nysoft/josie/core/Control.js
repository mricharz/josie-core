Josie.require('com.nysoft.josie.core.ManagedObject');

Josie.declare('com.nysoft.josie.core.Control');
com.nysoft.josie.core.Control._controls = {};

//onBeforeInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.Control', 'onBeforeInit', function(e) {
    var oControlObject = e[0];
    // set default id
    (!oControlObject.getId())
    && oControlObject.setId(Josie.utils.uniqueId());
});

//onAfterInit
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.Control', 'onAfterInit', function(e) {
    var oControlObject = e[0], arguments = e[1], domObject, options;
    domObject = arguments[0] || null;
    options = arguments[1] || null;

    //render control
    oControlObject.trigger('onBeforeRenderer');
    oControlObject._renderControl();

    //update all properties to force rendering
    oControlObject._forceUpdateProperties();
    oControlObject._setReference();
    oControlObject.trigger('onAfterRenderer');
});

com.nysoft.josie.core.ManagedObject.extend('com.nysoft.josie.core.Control', {

    meta: {
        id: 'string',
        visible: { type: 'boolean', defaultValue: true },
        cssClasses: { type: 'string[]', defaultValue: [] },
        cssStyles: { type: 'object', defaultValue: {} },
        content: 'com.nysoft.josie.core.Control[]'
    },

    init: function() {},

    _renderControl: function() {
        if(this.getDom()) {
            //set id to dom-Element
            this.getDom().attr('id', this.getId());
            //is visible?
            if(this.getVisible() === false) {
                this.getDom().hide();
            }
            //render content-items
            this._renderContent();
        }
    },

    _renderContent: function() {
        var aObjects = this.getContent();
        if(typeof aObjects == 'object' && aObjects) {
            if(aObjects.length > 0) {
                var t = this;
                Josie.utils.each(aObjects, function(oObject) {
                    t._renderContentItem(oObject);
                });
            } else {
                this._renderContentItem(aObjects);
            }
        }
    },

    _renderContentItem: function(oItem) {
        if(oItem instanceof com.nysoft.josie.core.Control) {
            this.getDom().append(oItem.getDom());
            oItem.invalidate();
        }
    },

    _forceUpdateProperties: function() {
        var aProperties = this.getProperties();
        jQuery.each(aProperties, jQuery.proxy(function(key, value) {
            var setter = 'set'+Josie.utils.capitalize(key);
            if(this[setter]) {
                Josie.log.trace('Call '+setter, value);
                this[setter].call(this, value);
            }
        }, this));
    },

    rerender: function(bWithoutUpdateProperties) {
        this.trigger('onBeforeRenderer');
        this.replaceDom('<div />').remove();
        this._renderControl();
        if(!bWithoutUpdateProperties)
            this._forceUpdateProperties();
        this.trigger('onAfterRenderer');
    },

    invalidate: function() {
        Josie.log.debug('Invalidating '+this.className);
        if(this.__valid !== false) {
            this.__valid = false;
            setTimeout(jQuery.proxy(function() {
                this.__valid = true;
                this.rerender();
            }, this), 0);
        }
    },

    replaceDom: function(sContent) {
        var jqOldDom = this.getDom(),
            jqNewDom = jQuery(sContent);
        this.setDom(jqNewDom);
        return jqOldDom.replaceWith(this.getDom());
    },

    addCssClass: function(sClass) {
        this.getCssClasses().push(sClass);
    },

    removeCssClass: function(sClass) {
        var aCssClasses = this.getCssClasses(),
            iIndex = aCssClasses.indexOf(sClass);
        if(iIndex > -1) {
            aCssClasses.splice(iIndex, 1);
        }
    },

    writeCssClasses: function() {
        var aCssClasses = this.getCssClasses();
        this.setCssClasses([]);  // empty it for next write or writing-step
        if(aCssClasses.length) {
            return ' class="' + aCssClasses.join(' ') + '" ';
        }
        return ' ';
    },

    addCssStyle: function(sStyle, sValue) {
        this.getCssStyles()[sStyle] = sValue;
    },

    removeCssStyle: function(sStyle) {
        delete this.getCssStyles()[sStyle];
    },

    writeCssStyles: function() {
        var aCssStyles = jQuery.map(this.getCssStyles(), function(value, index) {
            return index + ':' + value;
        });
        this.setCssStyles({});  // empty it for next write or writing-step
        if(aCssStyles.length) {
            return ' style="' + aCssStyles.join(';') + '" ';
        }
        return ' ';
    },

    _setReference: function(domObject) {
        com.nysoft.josie.core.Control._controls[this.getId()] = this;
    }

});