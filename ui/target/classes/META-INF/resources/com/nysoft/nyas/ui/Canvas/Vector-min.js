jQuery.require("com.nysoft.nyas.core.BaseObject");com.nysoft.nyas.core.BaseObject.extend("com.nysoft.nyas.ui.Canvas.Vector",{meta:{x:"number",y:"number"},add:function(a){return new com.nysoft.nyas.ui.Canvas.Vector(this.getX()+a.getX(),this.getY()+a.getY())},substract:function(a){return new com.nysoft.nyas.ui.Canvas.Vector(this.getX()-a.getX(),this.getY()-a.getY())},multiply:function(a){return new com.nysoft.nyas.ui.Canvas.Vector(this.getX()*a.getX(),this.getY()*a.getY())},length:function(){return Math.sqrt((this.getX()*this.getX())+(this.getY()*this.getY()))},dotProduct:function(a){return(this.getX()*a.getX()+this.getY()*a.getY())},angle:function(){return -Math.atan2(-this.getY(),this.getX())},rotate:function(d,e){divV=this.substract(d);var b=divV.length();var c=divV.angle();c+=jQuery.deg2rad(e);newVect=new com.nysoft.nyas.ui.Canvas.Vector(b*Math.cos(c),b*Math.sin(c));return newVect.add(d)},normalize:function(){var a=this.length();this.setX(this.getX()/a);this.setY(this.getY()/a)},setX:function(a){if(typeof a==="string"){a=parseInt(a,10)}if(typeof a==="number"){this.setProperty("x",a)}},setY:function(a){if(typeof a==="string"){a=parseInt(a,10)}if(typeof a==="number"){this.setProperty("y",a)}},init:function(a,b){if(a!==undefined&&b!==undefined){this.setX(a);this.setY(b)}},toArray:function(){return[this.getX(),this.getY()]},toPlainObject:function(){return{x:this.getX(),y:this.getY()}},__toString:function(){return"["+this.getX()+","+this.getY()+"]"}});