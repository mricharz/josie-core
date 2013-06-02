jQuery.declare('com.nysoft.nyas.core.Exception');

com.nysoft.nyas.core.Exception = function(message) {
	this.message = message;
    this.toString = function() {
        var message = this.message || 'unknown exception';
        return "Exception: "+message;
    };
};