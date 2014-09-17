Josie.declare('com.nysoft.josie.core.Exception');

com.nysoft.josie.core.Exception = function(message) {
	this.message = message;
    this.toString = function() {
        var message = this.message || 'unknown exception';
        return "Exception: "+message;
    };
};