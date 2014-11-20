//get global-object
if(GLOBAL === undefined)
	var GLOBAL = window;

GLOBAL.Josie = {};
//detect environment
Josie.environment = (window === undefined) ? 'server' : 'browser';

//detect last script source
var scripts = document.getElementsByTagName('script');
Josie.basePath = GLOBAL.Josie.basePath || scripts[scripts.length-1].src.replace(/\/[^/]*?core\.[^js]*?js.*$/, '/') || __dirName;
Josie.localRun = Josie.basePath.match(/^file:\/\//) ? true : false;

Josie.version = {
	'josie-core': '0.0.3'
};

//Some utils
Josie.utils = {
	
	//convert degrees into radian
	deg2rad: function(angle) {
	    return angle * .017453292519943295; //(angle / 180) * Math.PI;
	},
	
	rad2deg: function(radiant) {
		return radiant / .017453292519943295;
	},
	
	//faster alternative for Math.round(value)
	round: function(value) {
	    return (0.5 + value) & 0xffff;	
	},
	
	//faster alternative for Math.ceil(value)
	ceil: function(value) {
	    return ~~value + 1;	
	},
	
	//faster alternative for Math.floor(value)
	floor: function(value) {
	    return ~~value;
	},
	
	/* GUID Generator */
	S4: function() {
	    return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
	},
	
	uniqueId: function() {
	    return Josie.utils.S4() + Josie.utils.S4() + Josie.utils.S4() + Josie.utils.S4();
	},
	
	isjQuery: function(oObj){
	  return oObj && oObj.hasOwnProperty && oObj instanceof jQuery;
	},
	
	isUrl: function(sUrl) {
		var pattern = new RegExp('^([a-z]{0,10}:?\\/\\/)?'+ // protocol
				  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
				  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
				  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
				  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
				  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		if(!pattern.test(sUrl)) {
			return false;
		}
		return true;
	},
	
	isSelector: function(sSelector) {
		sSelector = sSelector.replace(/^.*?;/, ''); //remove modelKey
		var ns = document.styleSheets[0];
	    if(!ns) {
	        document.getElementsByTagName('head')[0].appendChild(document.createElement('style'));
	        ns = document.styleSheets[0];
	    }
	    try {
            document.querySelector(sSelector);
	        return true;
	    } catch(e) {
	        return false;
	    }
	},
	
	isNamespace: function(sNamespace) {
		var pattern = new RegExp('^([a-zA-Z0-9_-]*\\.?)*$', 'i');
		if(pattern.test(sNamespace) && typeof sNamespace === 'string' && sNamespace != '') {
			return true;
		}
		return false;
	},
	
	getParameter: function(name) {
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	},
	
	capitalize: function(value) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	},
	
	//convert HTML-attributes like "data-foo-bar" into a camelCase-variant like "DataFooBar"
	toCamelCase: function(sText) {
		return sText.replace(/-(.)/gi, function(m, p1) { 
			return p1.toUpperCase(); 
        });
	},
	
	//call callback for each iteration; break with return false
	//only for unnamed arrays
	each: function(oIterateable, fCallback) {
		var iIndex = -1, iLength = oIterateable.length;

	    while(++iIndex < iLength) {
	    	if(fCallback(oIterateable[iIndex], iIndex) === false)
	    		break;
    	}
    	return oIterateable;
	},
	
	//call and save callback for each iteration
	//only for unnamed arrays
	map: function(oIterateable, fCallback) {
		var iIndex = -1, iLength = oIterateable.length, oResult = Array(iLength);

		while(++iIndex < iLength) {
			oResult[iIndex] = fCallback(oIterateable[iIndex], iIndex);
		}
		return oResult;
	}
	
};

//logging
Josie.log = {
		_getTimestamp: function() {
			return new Date().toISOString();	
		},
		
		_write: function() {
			if(console !== undefined && console.log !== undefined) {
				var data = [];
				data.push('[' + this._getTimestamp() + '] ');
				data.push(arguments);
				console.log.apply(console, data);
			}
		},
		
		_writeInfo: function() {
			if(console !== undefined && console.info !== undefined) {
				var data = [];
				data.push('[' + this._getTimestamp() + '] ');
				data.push(arguments);
				console.info.apply(console, data);
			} else {
				this._write.apply(this, arguments);
			}
		},
		
		_writeWarn: function() {
			if(console !== undefined && console.warn !== undefined) {
				var data = [];
				data.push('[' + this._getTimestamp() + '] ');
				data.push(arguments);
				console.warn.apply(console, data);
			} else {
				this._writeInfo.apply(this, arguments);
			}
		},
		
		_writeError: function() {
			if(console !== undefined && console.error !== undefined) {
				var data = [];
				data.push('[' + this._getTimestamp() + '] ');
				data.push(arguments);
				console.error.apply(console, data);
			} else {
				this._writeWarn.apply(this, arguments);
			}
		},
		
		trace: function() {
			if(this.logLevel >= 5) {
				this._write.apply(this, arguments);
			}
		},
		
		debug: function() {
			if(this.logLevel >= 4) {
				this._write.apply(this, arguments);
			}
		},
		
		info: function() {
			if(this.logLevel >= 3) {
				this._writeInfo.apply(this, arguments);
			}
		},
		
		warning: function() {
			if(this.logLevel >= 2) {
				this._writeWarn.apply(this, arguments);
			}
		},

		error: function() {
			if(this.logLevel >= 1) {
				this._writeError.apply(this, arguments);
			}
		},
		
		setLevel: function(logLevel) {
			this.logLevel = logLevel;
		},
		
		level: {
			None: 0,
			Error: 1,
			Warning: 2,
			Info: 3,
			Debug: 4,
			Trace: 5,
			All: 6
		}
};

//add aliases
Josie.log.err = Josie.log.error;
Josie.log.warn = Josie.log.warning;

//namespace generation
Josie.declare = function(namespace, base) {
    if(base === undefined || base === null) {
        base = GLOBAL;
    }
    if(namespace && Josie.utils.isNamespace(namespace)) {
	    var scopes = namespace.split('.');
	    firstScope = scopes.shift();
	    if(base[firstScope] === undefined) {
	        base[firstScope] = {};
	    }
	    if(scopes.length) {
	        return Josie.declare(scopes.join('.'), base[firstScope]); 
	    }
	    return base[firstScope];
    }
    return base;
};

//check if a class exists
Josie.classExists = function(className) {
    var oClass = Josie.getClass(className);
    return (oClass !== undefined && typeof oClass === 'function');
};

//get class by name
Josie.getClass = function(className, base) {
	if(base === undefined || base === null) {
        base = GLOBAL;
    }
	if(Josie.utils.isNamespace(className) || (Array.isArray(className) && className.length)) {
		var aScopes = Array.isArray(className) ? className : className.split('.'),
			sFirstScope = aScopes.shift();
		
		if(base[sFirstScope] !== undefined) {
			if(aScopes.length) {
				return Josie.getClass(aScopes, base[sFirstScope]);
			}
			return base[sFirstScope];
		}
		return undefined;
	}
	return base[className];
};

Josie._aliasMapping = [];
Josie.alias = function(sAlias, sNamespace) {
    if(sAlias) {
        if (!GLOBAL[sAlias]) {
            if(sNamespace) {
                Josie._aliasMapping.push({
                    alias: sAlias,
                    namespace: sNamespace
                });
                GLOBAL[sAlias] = Josie.declare(sNamespace);
            }
        }
        return GLOBAL[sAlias];
    } else {
        return Josie._aliasMapping;
    }
};

//Get and set namespace-mappings
Josie._resourceMapping = [];
Josie.namespace = function(sNamespace, sPath) {
    if(sNamespace && sPath) {
        Josie._resourceMapping.push({namespace: sNamespace, path: sPath});
    } else if (sNamespace) {
        var oNamespaceMapping = {
            basePath: Josie.basePath,
            namespace: '',
            package: sNamespace
        };
        Josie.utils.each(Josie._resourceMapping, function(oMapping){
            if(oMapping.namespace.length > oNamespaceMapping.namespace && sNamespace.indexOf(oMapping.namespace) > -1) {
                oNamespaceMapping.basePath = oMapping.path + '/';
                oNamespaceMapping.namespace = oMapping.namespace;
                oNamespaceMapping.package = sNamespace.replace(oMapping.namespace + '.', '');
            }
        });
        return oNamespaceMapping;
    }
};

//Lazyloading
//TODO: Refactor this!
//TODO: only for browsers! make this useable for server-side
Josie._resources = [];
Josie.require = function(className, options) {
	if(!className) return;
	if(Josie.utils.isNamespace(className)) {
        //check if is an alias and get the fullname
        Josie.utils.each(Josie._aliasMapping, function(oAlias) {
            if(className.indexOf(oAlias.alias) == 0) {
                className = className.replace(oAlias.alias, oAlias.namespace);
            }
        });
		//check if class already exists
		if(Josie.classExists(className)) return;
        //check if there is a namespace-mapping to another path
        var oNamespace = Josie.namespace(className);
		//convert className into path
		className = oNamespace.basePath + oNamespace.package.replace(/\./g, '/')+'.js';
	}
	options = jQuery.extend({
		async: false,
		dataType: "script",
		cache: true,
		url: className
	}, options);
	
	//check if resource is already loaded
	for(var p = 0; p < Josie._resources.length; p++) {
		if (className === Josie._resources[p])
			return;
	}
	//load it
	if(options.dataType == 'stylesheet') {
		Josie.loadCSS(options.url);
		Josie._resources.push(className);
	} else {
		jQuery.ajax(options).done(function(script, textStatus) {
			Josie._resources.push(className);
			Josie.log.trace('Loaded: '+options.url+' - '+textStatus);
		}).fail(function(jqxhr, settings, exception) {
			Josie.log.error('Could not load: '+options.url+' - '+jqxhr.status+' '+exception);
		});
	}
};


/**
 * ONLY IN BROWSERS - we should move this stuff into an own module for browser-usage
 */

//load css file and apply styles
Josie.loadCSS = function(url) {
	if (document.createStyleSheet){
		document.createStyleSheet(url);
	} else {
		jQuery("head").append(jQuery("<link rel='stylesheet' href='"+url+"' type='text/css' media='screen' />"));
	}
};

//Class Pattern
//Object can given as Return-Value or as Parameter
jQuery.fn.generateObject = function (domObject) {
    var objects = [];
    domObject = (jQuery(this).length) ? jQuery(this) : jQuery(domObject);
    if(domObject)
        domObject.each(function () {
            var t = jQuery(this);
            //Check if Object already exsist
            if (!t.data("control")) {
            	var className = t.data('class'),
            		options = t.data();
                //Check if ClassName is defined
                if (className) {
                	//require class
                	Josie.require(className);
                    //Generating Object
                	var nsScopes = className.split('.');
                	className = nsScopes.pop();
                	var base = Josie.declare(nsScopes.join('.'));
                	if(jQuery.isFunction(base[className])) {
	                    var obj = new base[className](t, options);
	                    if (obj) {
	                        objects.push(obj);
	                    }
                	} else {
                		nsScopes.push(className);
                		Josie.log.error('Class not found: '+nsScopes.join('.'));
                	}
                }
            }
        });
    return objects;
};

//get managed control by controlId
Josie.byId = function(sId) {
	return jQuery('#'+sId).data('control');
};

//requestAnimationFrame-wrapper for different browsers
Josie.requestAnimationFrame = (function() {
	return window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(fCallback){
		window.setTimeout(fCallback, 1000 / 60);
	};
})();

//Device detection
Josie.userAgent = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
Josie.device = {
	"mode": {
		"landscape": !(window.innerHeight > window.innerWidth),
		"portrait": (window.innerHeight > window.innerWidth)
	},
	"mobile": /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(Josie.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(Josie.userAgent.substr(0, 4)),
	"iPhone": /iphone/i.test(Josie.userAgent),
	"iPad": /ipad/i.test(Josie.userAgent),
	"iPod": /ipod/i.test(Josie.userAgent),
	"iDevice": /ipad|iphone|ipod/i.test(Josie.userAgent),
	"Android": /android/i.test(Josie.userAgent),
	"Blackberry": /blackberry/i.test(Josie.userAgent),
	"WebOs": /webos/i.test(Josie.userAgent),
	"WindowsPhone": /windows phone/i.test(Josie.userAgent)
};
//update device orientation mode on change
window.addEventListener("orientationchange", function() {
	Josie.device.mode = {
		"landscape": !(window.innerHeight > window.innerWidth),
		"portrait": (window.innerHeight > window.innerWidth)
	};
});

jQuery(document).ready(function() {
	Josie.log.debug('Josie-Core BasePath:', Josie.basePath);
	if(Josie.localRun) {
		Josie.log.warn('Josie-Core is running locally. You may have problems loading local files over "file://".');
		Josie.log.info('OPTION 1: You can view this page through "http://localhost" instead of open it as "file://"');
		Josie.log.info('OPTION 2: Or you can start your browser with deactivated security-rules.');
	}
	// Autodetect Class Pattern (only first-level of data-class-Objects)
	jQuery("[data-class]").not('[data-class] [data-class]').generateObject();
});
