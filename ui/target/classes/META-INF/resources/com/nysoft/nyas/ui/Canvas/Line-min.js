jQuery.require("com.nysoft.nyas.ui.Canvas.CanvasObject");com.nysoft.nyas.ui.Canvas.CanvasObject.extend("com.nysoft.nyas.ui.Canvas.Line",{meta:{length:"string",lineWidth:"number",color:"string"},init:function(a){this.setProperties(a);(!this.getLineWidth())&&this.setLineWidth(1);(!this.getColor())&&this.setColor("#000000");this._super("init",a)},calculateTargetVector:function(){var a=new com.nysoft.nyas.ui.Canvas.Vector(this.getVector().getX()+parseInt(this.getLength(),10),this.getVector().getY());return a.rotate(this.getVector(),this.getRotation())},render:function(b){if(this.getColor()=="none"||parseInt(this.getLength(),10)==0){return}b.getContext().save();b.getContext().beginPath();this.moveToVector(b);var a=this.calculateTargetVector();b.getContext().lineTo(a.getX(),a.getY());b.getContext().lineWidth=this.getLineWidth();b.getContext().strokeStyle=this.getColor();b.getContext().stroke();b.getContext().closePath();b.getContext().restore()}});