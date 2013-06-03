jQuery.extend(jQuery.expr[":"],{display:function(c,d,b){if((b[3]!=null)&&(b[3]!==undefined)&&(b[3]!="")){if(jQuery(c).css("display")===b[3]){return true}}else{if(jQuery(c).css("display")!="none"){return true}}return false},jsclass:function(c,d,b){if(c){if((b[3]!=null)&&(b[3]!==undefined)&&(b[3]!="")){if(jQuery(c).data("jsclass")===b[3]){return true}}else{if(jQuery(c).data("jsclass")){return true}}}return false},jsoptions:function(c,d,b){if((b[3]!=null)&&(b[3]!==undefined)&&(b[3]!="")){if(jQuery(c).data("jsoptions")===b[3]){return true}}else{if(jQuery(c).data("jsoptions")){return true}}return false},rel:function(c,d,b){if((b[3]!=null)&&(b[3]!==undefined)&&(b[3]!="")){if(jQuery(c).attr("rel")===b[3]){return true}}else{if(jQuery(c).attr("rel")){return true}}return false}});jQuery.log={_getTimestamp:function(){return new Date().toISOString()},_write:function(a){if(console!==undefined&&console.log!==undefined){console.log("["+this._getTimestamp()+"] "+a)}},_writeError:function(a){if(console!==undefined&&console.error!==undefined){console.error("["+this._getTimestamp()+"] "+a)}},trace:function(a){if(jQuery.log.logLevel>=5){this._write(a)}},debug:function(a){if(jQuery.log.logLevel>=4){this._write(a)}},info:function(a){if(jQuery.log.logLevel>=3){this._write(a)}},warning:function(a){if(jQuery.log.logLevel>=2){this._write(a)}},error:function(a){if(jQuery.log.logLevel>=1){this._writeError(a)}},setLevel:function(a){jQuery.log.logLevel=a},level:{None:0,Error:1,Warning:2,Info:3,Debug:4,Trace:5,All:6}};jQuery.utils={deg2rad:function(a){return a*0.017453292519943295},S4:function(){return((1+Math.random())*65536|0).toString(16).substring(1)},uniqueId:function(){return jQuery.utils.S4()+jQuery.utils.S4()+jQuery.utils.S4()+jQuery.utils.S4()},isjQuery:function(a){return a&&a.hasOwnProperty&&a instanceof jQuery}};jQuery.declare=function(a,c){if(c===undefined||c===null){c=window}if(a){var b=a.split(".");firstScope=b.shift();if(c[firstScope]===undefined){c[firstScope]={}}if(b.length){return jQuery.declare(b.join("."),c[firstScope])}return c[firstScope]}return c};jQuery.require=function(b,a){if(!window[b]){var c=b.replace(/\./g,"/")+".js";a=jQuery.extend({async:false,url:c,dataType:"script",cache:true},a);jQuery.ajax(a).done(function(d,e){jQuery.log.trace("Loaded: "+c+" - "+e)}).fail(function(f,e,d){jQuery.log.error("Could not load: "+c+" - "+f.status+" "+d)})}};jQuery.fn.generateObject=function(a){var b=[];a=(jQuery(this).length)?jQuery(this):jQuery(a);if(a){a.each(function(){var e=jQuery(this);if(!jQuery.data(e.get(0),"object")){var f=e.data("jsclass")||null,d=e.data("jsoptions")||"";d=(d)?"{"+d+"}":"{}";if(f){jQuery.require(f);var c=f.split(".");f=c.pop();var g=jQuery.declare(c.join("."));if(jQuery.isFunction(g[f])){var h=new g[f](e,JSON.parse(d));if(h){b.push(h)}}else{c.push(f);jQuery.log.error("Class not found: "+c.join("."))}}}})}return b};jQuery.agent=navigator.userAgent||navigator.vendor||window.opera;jQuery.device={mode:{landscape:!(window.innerHeight>window.innerWidth),portrait:(window.innerHeight>window.innerWidth)},mobile:/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(jQuery.agent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(jQuery.agent.substr(0,4)),iPhone:/iphone/i.test(navigator.userAgent.toLowerCase()),iPad:/ipad/i.test(navigator.userAgent.toLowerCase()),iPod:/ipod/i.test(navigator.userAgent.toLowerCase()),iDevice:/ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase()),Android:/android/i.test(navigator.userAgent.toLowerCase()),Blackberry:/blackberry/i.test(navigator.userAgent.toLowerCase()),WebOs:/webos/i.test(navigator.userAgent.toLowerCase()),WindowsPhone:/windows phone/i.test(navigator.userAgent.toLowerCase())};window.addEventListener("orientationchange",function(){jQuery.device.mode={landscape:!(window.innerHeight>window.innerWidth),portrait:(window.innerHeight>window.innerWidth)}});jQuery(document).ready(function(){jQuery("body :jsclass").generateObject()});