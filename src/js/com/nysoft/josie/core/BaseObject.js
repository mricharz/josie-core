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
    base[className] = jQuery.extend(function () {
        this.aProperties = jQuery.extend({}, this.aDefaultProperties);
        
        this.setProperty = function (key, value) {
            this.aProperties[key] = value;
        };
        
        this.setProperties = function(properties) {
            if(jQuery.isArray(properties) || jQuery.isPlainObject(properties)) {
                jQuery.each(properties, jQuery.proxy(function(key, value) {
                    this.setProperty(key, value);
                }, this));
            }
        };
    
        this.getProperty = function (key) {
            return this.aProperties[key];
        };
        
        this.getProperties = function() {
            return this.aProperties;
        };
        
        this._super = function() {
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
        
        this.bindEvent = function(sEventName, fEventHandlerFunction, oData) {
        	com.nysoft.josie.core.EventStack.bind(this ,sEventName, fEventHandlerFunction, this, oData);
        };
        
        this.unbindEvent = function(sEventName) {
        	com.nysoft.josie.core.EventStack.unbind(this, sEventName);
        };
        
        this.trigger = function() {
        	var args = [];
    		Array.prototype.push.apply(args, arguments);
    		args.unshift(this);
    		com.nysoft.josie.core.EventStack.trigger.apply(com.nysoft.josie.core.EventStack, args);
        };
        
    	this.getEventStack = function() {
    		return com.nysoft.josie.core.EventStack;
    	};
        
    	this.trigger('onBeforeInit', this, arguments);
        if(!init && this.init) {
            this.init.apply(this, arguments);
        }
        this.trigger('onAfterInit', this, arguments);
    }, base[className]);
    //abstract this
    init = true;
    base[className].prototype = new this();
    base[className].prototype.$parent = new this();
    base[className].prototype.className = nameSpace+'.'+className;
    if(!base[className].prototype.aDefaultProperties) {
    	base[className].prototype.aDefaultProperties = {};
    }
    init = false;
    base[className].extend = this.extend;
    base[className].parseMetadata = this.parseMetadata;

    this.parseMetadata = function (metadata) {
        jQuery.each(metadata, function (key, type) {
        	var defaultValue = null;
        	if(jQuery.isPlainObject(type)) {
        		defaultValue = type.defaultValue;
        		type = type.type;
        	}
            type = (type) ? type.toLowerCase() : type;
            var name = Josie.utils.capitalize(key);
            
            //set defaultValue
            base[className].prototype.aDefaultProperties[key] = defaultValue;

            //prototyping setter (with validation)
            base[className].prototype['set' + name] = function (value) {
                if (type === null || typeof (value) === type || value === null) {
                    this.setProperty(key, value);
                } else {
                    throw new com.nysoft.josie.core.Exception('Parameter must be a type of: ' + type);
                }
            };

            //prototyping getter
            base[className].prototype['get' + name] = function () {
                return this.getProperty(key);
            };
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