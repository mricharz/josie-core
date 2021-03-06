/*
 * Usage: BaseObject.extend('<ClassName>', {<Class Methods and Metadata>});
 * 
 * Metadata should look like:
 * meta: {
 * 		foo: 'string',
 * 		bar: 'object'
 * }
 * this will generate getter and setter for foo and for boo with validation for given type like:
 * setFoo(string) - getFoo()
 * setBar(object) - getBar()
 * 
 * Complete example:
 * 
 * BaseObject.extend('Foo', {
 * 		meta: {
 * 			bar: 'string',
 * 			bar2: 'number',
 * 			bar3: 'object',
 * 			bar4: 'object'
 * 		},
 * 
 * 		init: function()
 * 			this.setBar(arguments[0]);
 * 			this.setBar1(arguments[1]);
 * 			this.setBar2(arguments[2]);
 * 			this.setBar3(arguments[3]);
 * 			this.setBar4(arguments[4]);
 * 		},
 * 
 * 		hello: function() {
 * 			alert('hello '+this.getBar());
 * 		},
 * 
 * });
 * 
 * var foo = new Foo('World', 42, {}, []);
 * foo.hello();
 * 
 * Note: arrays are validated as objects!
 */
Josie.declare('com.nysoft.josie.core.BaseObject');
Josie.require('com.nysoft.josie.core.Exception');
Josie.require('com.nysoft.josie.core.EventStack');

com.nysoft.josie.core.BaseObject = function() {};

com.nysoft.josie.core.BaseObject.prototype.setProperty = function (key, value) {
    this.aProperties[key] = value;
};

com.nysoft.josie.core.BaseObject.prototype.setProperties = function(properties) {
    if(Array.isArray(properties) || jQuery.isPlainObject(properties)) {
        jQuery.each(properties, jQuery.proxy(function(key, value) {
            this.setProperty(key, value);
        }, this));
    }
};

com.nysoft.josie.core.BaseObject.prototype.getProperty = function (key) {
    return this.aProperties[key];
};

com.nysoft.josie.core.BaseObject.prototype.getProperties = function() {
    return this.aProperties;
};

com.nysoft.josie.core.BaseObject.prototype._super = function() {
    if(arguments.length) {
        var args = [];
        Array.prototype.push.apply(args, arguments);
        var methodName = args.shift();
        //generate parent-stack if not exists
        if(!this.__$translateParent) {
            this.__$translateParent = [];
        }
        //find method in parent
        function lookBackStack(method, arr, index) {
            if(index === undefined) {
                index = arr.length-1;
            }
            if(index < 0) {
                return;
            }
            if(arr[index][method]) {
                return arr[index][method];
            }
            return lookBackStack(method, arr, index-1);
        }
        //search in old parent-object for this method and use this instead
        var method = lookBackStack(methodName, this.__$translateParent) || this.$parent[methodName];
        if(typeof method == 'function') {
            //push current parent into parent-stack
            this.__$translateParent.push(this.$parent);
            //only translate parent if there is another parent
            if(this.$parent.$parent) {
                this.$parent = this.$parent.$parent;
            }
            //call super-method
            var result = method.apply(this, args);
            //revert parent to it's initial state
            this.$parent = this.__$translateParent.pop();
            return result;
        } else {
            throw new com.nysoft.josie.core.Exception(methodName+' is not a function!');
        }
    } else {
        throw new com.nysoft.josie.core.Exception('No methodName specified to call!');
    }
};

com.nysoft.josie.core.BaseObject.prototype.bindEvent = function(sEventName, fEventHandlerFunction, oData) {
    com.nysoft.josie.core.EventStack.bind(this ,sEventName, fEventHandlerFunction, this, oData);
};

com.nysoft.josie.core.BaseObject.prototype.unbindEvent = function(sEventName) {
    com.nysoft.josie.core.EventStack.unbind(this, sEventName);
};

com.nysoft.josie.core.BaseObject.prototype.trigger = function() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    args.unshift(this);
    com.nysoft.josie.core.EventStack.trigger.apply(com.nysoft.josie.core.EventStack, args);
};

com.nysoft.josie.core.BaseObject.prototype.getEventStack = function() {
    return com.nysoft.josie.core.EventStack;
};

com.nysoft.josie.core.BaseObject.extend = function (className, classDescObject) {
    //Validate Parameter
    if (!className) {
        throw new com.nysoft.josie.core.Exception('No Classname defined!');
    }
    if (classDescObject !== null && !jQuery.isPlainObject(classDescObject)) {
        throw new com.nysoft.josie.core.Exception(className + ' is not a valid Class!');
    }

    //generate namespace for class
    var nsScopes = className.split('.');
    className = nsScopes.pop();
    var nameSpace = nsScopes.join('.');
    var base = Josie.declare(nameSpace);

    //Declare class
    base[className] = jQuery.extend(function() {
        this.aProperties = jQuery.extend(true, {}, this.aDefaultProperties);

        if(!init && this.init) {
            this.trigger('onBeforeInit', this, arguments);
            this.init.apply(this, arguments);
            this.trigger('onAfterInit', this, arguments);
        }
    }, base[className]);
    //abstract this
    init = true;
    base[className].prototype = new this();
    base[className].prototype.$parent = new this();
    init = false;
    base[className].prototype.className = nameSpace+'.'+className;
    if(!base[className].prototype.aDefaultProperties) {
        base[className].prototype.aDefaultProperties = {};
    }
    base[className].prototype.aDefaultProperties = jQuery.extend(true, {}, base[className].prototype.aDefaultProperties);
    base[className].extend = this.extend;
    base[className].parseMetadata = this.parseMetadata;

    this.parseMetadata = function (metadata) {
        jQuery.each(metadata, function (key, type) {
            var defaultValue = null;
            if(jQuery.isPlainObject(type)) {
                defaultValue = type.defaultValue;
                type = type.type;
            }
            var sType = type,
                bArray = false;
            if(sType && typeof sType === 'string') {
                if (sType.indexOf('[]') === sType.length - 2) {
                    bArray = true;
                    sType = sType.replace(/\[\]$/, '');
                }
            }
            var name = Josie.utils.capitalize(key);

            //set defaultValue
            base[className].prototype.aDefaultProperties[key] = defaultValue;

            //prototyping setter (with validation)
            base[className].prototype['set' + name] = function (value) {
                if(Josie.utils.validateType(sType, value)) {
                    this.setProperty(key, value);
                    return;
                }

                //check if value is an array and if all items are an instance of this class
                if(bArray && value instanceof Array) {
                    var bValid = true;
                    Josie.utils.each(value, function(oValue) {
                        if(!Josie.utils.validateType(sType, oValue)) {
                            bValid = false;
                            return false;
                        }
                    });
                    if(bValid) {
                        this.setProperty(key, value);
                        return;
                    }
                }

                throw new com.nysoft.josie.core.Exception('Property "'+this.className+'::'+name+'" must be a type of: ' + type);
            };

            //prototyping getter
            base[className].prototype['get' + name] = function () {
                return this.getProperty(key);
            };

            //add methods to work with arrays
            if(bArray) {
                base[className].prototype['add' + name] = function (value) {
                    var aProp = this.getProperty(key);
                    if(!(aProp instanceof Array)) {
                        aProp = [];
                    }
                    if(!(value instanceof Array)) {
                        value = [value];
                    }
                    var lastIndex = 0;
                    Josie.utils.each(value, function(oObject) {
                        if(Josie.utils.validateType(sType, oObject)) {
                            lastIndex = aProp.push(oObject);
                        } else {
                            throw new com.nysoft.josie.core.Exception('Property "'+name+'" must be a type of: ' + type);
                        }
                    });
                    this.setProperty(key, aProp);
                    return lastIndex - 1;
                };

                base[className].prototype['remove' + name] = function (index) {
                    var aProp = this.getProperty(key);
                    if(aProp instanceof Array) {
                        return aProp.slice(index, 1);
                    }
                }
            }
        });
    };

    //handle metadata to generate getter and setter
    if (classDescObject.meta) {
        this.parseMetadata(classDescObject.meta);
        delete classDescObject.meta;
    }

    //prototyping the rest of classDescription
    jQuery.each(classDescObject, function (key, value) {
        if (value !== undefined) {
            base[className].prototype[key] = value;
        }
    });

    return base[className];
};