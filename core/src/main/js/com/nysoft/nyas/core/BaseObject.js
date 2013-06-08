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
jQuery.declare('com.nysoft.nyas.core.BaseObject');
jQuery.require('com.nysoft.nyas.core.Exception');
jQuery.require('com.nysoft.nyas.core.EventStack');

com.nysoft.nyas.core.BaseObject = function() {};

com.nysoft.nyas.core.BaseObject.extend = function (className, classDescObject) {
    //Validate Parameter
    if (!className) {
        throw new com.nysoft.nyas.core.Exception('No Classname defined!');
    }
    if (classDescObject !== null && !jQuery.isPlainObject(classDescObject)) {
        throw new com.nysoft.nyas.core.Exception(className + ' is not a valid Class!');
    }
    
    //generate namespace for class
    var nsScopes = className.split('.');
    className = nsScopes.pop();
    var nameSpace = nsScopes.join('.');
    var base = jQuery.declare(nameSpace);

    //Declare class
    base[className] = jQuery.extend(function () {
        this.aProperties = [];
        
        this.setProperty = function (key, value) {
            this.aProperties['_'+key] = value;
        };
        
        this.setProperties = function(properties) {
            if(jQuery.isArray(properties) || jQuery.isPlainObject(properties)) {
                jQuery.each(properties, jQuery.proxy(function(key, value) {
                    this.setProperty(key, value);
                }, this));
            }
        };
    
        this.getProperty = function (key) {
            return this.aProperties['_'+key];
        };
        
        this.getProperties = function() {
            return this.aProperties;
        };
        
        this._super = function() {
        	if(arguments.length) {
        		var args = [];
        	    Array.prototype.push.apply(args, arguments);
        		var methodName = args.shift();
        		if(typeof this.$parent[methodName] == 'function') {
        			var method = this.$parent[methodName];
		        	var tmpParent = this.$parent;
		        	this.$parent = this.$parent.$parent;
	        		var result = method.apply(this, args);
		        	this.$parent = tmpParent;
		        	return result;
        		} else {
        			throw new com.nysoft.nyas.core.Exception(methodName+' is not a function!');
        		}
        	} else {
        		throw new com.nysoft.nyas.core.Exception('No methodName specified to call!');
        	}
        };
        
        if(!init && this.init) {
        	var object = this;
        	while(object.$parent) {
        		object = object.$parent;
        		com.nysoft.nyas.core.EventStack.trigger(object.className+'.onBeforeInit', this, arguments);
        	}
        	com.nysoft.nyas.core.EventStack.trigger(this.className+'.onBeforeInit', this, arguments);
            this.init.apply(this, arguments);
            var object = this;
            while(object.$parent) {
        		object = object.$parent;
        		com.nysoft.nyas.core.EventStack.trigger(object.className+'.onAfterInit', this, arguments);
        	}
            com.nysoft.nyas.core.EventStack.trigger(this.className+'.onAfterInit', this, arguments);
        }
    }, base[className]);
    //abstract this
    init = true;
    base[className].prototype = new this();
    base[className].prototype.$parent = new this();
    base[className].prototype.className = nameSpace+'.'+className;
    init = false;
    base[className].extend = this.extend;
    base[className].parseMetadata = this.parseMetadata;

    this.parseMetadata = function (metadata) {
        jQuery.each(metadata, function (key, type) {
            type = (type) ? type.toLowerCase() : type;
            var name = key.charAt(0).toUpperCase() + key.slice(1);

            //prototyping setter (with validation)
            base[className].prototype['set' + name] = function (value) {
                if (type === null || typeof (value) === type || value === null) {
                    this.setProperty(key, value);
                } else {
                    throw new com.nysoft.nyas.core.Exception('Parameter must be a type of: ' + type);
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