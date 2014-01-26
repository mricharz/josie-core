Simple-JavaScript-Framework
===========================

This is a simple and small OOP framework based on jQuery.
Makes JavaScript more _Java_ than _Script_.


Namespaces:
-----------

To create a new namespace _foo.bar_:
```javascript
jQuery.declare('foo.bar');
```

to call a namespace:
```javascript
foo.bar.Test = 'hello';
```

Classes:
--------

To create Classes, extend the BaseObject:
```javascript
com.nysoft.nyas.core.BaseObject.extend('foo.bar.Foobar', {});
```
this will create a new Class named _Foobar_ in namespace _foo.bar_

to make an instance of this class just call:
```javascript
new foo.bar.Foobar();
```

### Constructor:

you can implement a constructor by adding a method named _init_:
```javascript
com.nysoft.nyas.core.BaseObject.extend('foo.bar.Foobar', {
  init: function() {
    alert(arguments[0]); //arguments are the constructor parameters
  }
});

new foo.bar.Foobar('hello');
```
This will show a messagebox with text _hello_.

### Super:

You can call super-class methods by using \_super()_:
```javascript
this._super('init', argument1, argument2, ...);
```
But this will throw an exception if the method not exists in super-class.

### Getter, Setter and Validation

You can use _meta_-Property to autogenerate getter and setter methods with type validation:
```javascript
com.nysoft.nyas.core.BaseObject.extend('foo.bar.Foobar', {
  meta: {
    foo: 'number',
    bar: 'string'
    /*
    possible types:
      number
      string
      boolean
      function
      object
      null (without ') > no validation
    and more. see native javascript types as reference
    */
  }
});

var a = new foo.bar.Foobar();
a.setFoo(3); //works
a.setFoo('3'); //throws exception
a.setBar(3); //throws exception
a.setBar('3') //works
```

Required Classes:
-----------------

If you require a class that is not yet loaded, you can call:
```javascript
jQuery.require('foo.bar.Foobar');
```
this will load synchronously: /foo/bar/Foobar.js

You also can load external Scripts using _jQuery.require_:
```javascript
jQuery.require('http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js');
```

*A script will only be loaded once! If this is already loaded, _jQuery.require_ will skip without an error.*

Events:
-------

For DOM-Events you should use jQuery-Functions.

But for Object-Events there is an EventStack-Class.

### Global Events:

You can set a global eventHandler to a Class. If this event gets executed, each object of this class is affected.
```javascript
//Create Class
com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.Control', {
  init: function() {
    alert('world');
  }
});

//Bind global Class-event
com.nysoft.nyas.core.EventStack.bind('com.nysoft.nyas.core.Control', 'onAfterInit', function(e, data) {
  alert('hello');
});

var oControl = new com.nysoft.nyas.core.Control();
```
_This will alert "hello" after init-Method of each Control-Object is called._

### Object Events:

You can also set an object eventHandler. If this event gets executed only this one object is affected.

```javascript
com.nysoft.nyas.core.BaseObject.extend('com.nysoft.nyas.core.Control', {
  init: function() {
    alert('world');
  },
  
  foo: function() {
    this.trigger('onFoo');
  }
});
var oControl = new com.nysoft.nyas.core.Control();

oControl.bindEvent('onFoo', function() {
  alert('bar');
});

oControl.foo();
```
_This will alert "foo" while calling method foo()._

### Unbind Events:

To unbind event just use:
```javascript
this.unbind('onFoo');
// or
com.nysoft.nyas.core.EventStack.unbind('com.nysoft.nyas.core.Control', 'onAfterInit');
```

### Break Event execution:

You can bind 0 ... n eventHanlder to an event. But what you can do to avoid executing next eventHandler in stack?

Easy! Just _return false;_.

```javascript
oControl.bindEvent('onFoo', function() {
  alert('bar');
  return false;
});

oControl.bindEvent('onFoo', function() {
  alert('foo');
});
```
_This will alert "bar" but NOT "foo"._

Databinding:
------------

### Creating a Model

You can create a Datamodel with:
```javascript
var oModel = new com.nysoft.nyas.core.Model.JSONModel({
  src: '/url/to/json',
  key: 'modelKey' // optional. useful if you have more than one datamodel.
});
```

or with:

```html
<div data-class="com.nysoft.nyas.core.Model.JSONModel" data-src="/admin/cache/listCaches"></div>
```

### Binding Data

You can bind data to many objects and to all managed objects.

just pass the data-selector as property-content like this:
```javascript
/*
Your json-data is something like this:

{
  data: [
    {
      text: 'Submit'
    },
    {
      text: 'foobar'
    }
  ]
}

*/

new com.nysoft.nyas.ui.Button({
  text: '{".data .text:first-child"}'
});
```

The binding gets automatically loaded and the control gets automatically updated if the data inside the model changes.
You can use normal CSS3 Selectors to select data from your datamodel.
For more information see: http://jsonselect.org/


HTML-Decleration
----------------

You can create an Object-Tree in Html. Just create objects with a normal div-Tag and add data-Attributes as Object-Properties.

```
<div data-class="foo.bar.Foobar" data-foo="bar"></div>
```

You can also use databinding (see section above)

### Aggregations

You can aggregate child objects to specific properties or to the default property _content_

```
<div data-class="foo.bar.Foobar" data-foo="bar">

  <!-- This objects gets aggregated into the parent object's property: content -->
  <div data-class="foo.bar.SubFooBar" data-foo="I am content"></div>
  <div data-class="foo.bar.SubFooBar" data-foo="I am content 2"></div>
  
  <div data-property="subs">
    <!-- This objects gets aggregated into the parent object's property: subs -->
    <div data-class="foo.bar.SubFooBar" data-foo="I am sub"></div>
    <div data-class="foo.bar.SubFooBar" data-foo="I am sub 2"></div>
  </div>
  
</div>
```

Logging:
--------

It is recommended to use the built-in logging mechanism instead of console.log to prevent errors in some browsers.

```javascript
jQuery.log.trace('trace foobar');
jQuery.log.debug('debug foobar');
jQuery.log.info('info foobar');
jQuery.log.warning('warning foobar');
jQuery.log.error('ERROR foobar');
```

The default LogLevel is _None_. To set the LogLevel use:
```javascript
jQuery.log.setLevel( jQuery.log.level.All );
jQuery.log.setLevel( jQuery.log.level.Info );
/* None, Error, Warning, Info, Debug, Trace, All */
```

Utils:
------

There are coming some little methods with the core.js. Have a look at [jQuery.utils](https://github.com/mricharz/Simple-JavaScript-Framework/blob/master/core/src/main/js/core.js#L95 "jQuery.utils in core.js").

DOM Class Pattern:
------------------

You can split Javascript and HTML by using Class Pattern.
```javascript
<div data-class="com.nysoft.nyas.ui.Button" data-text="FooBar"></div>
```
_This will generate a Button onto this DOM-Element._

The Class-Pattern gets executed on _jQuery(document).ready()_
You can execute the Class-Pattern manually by using _jQuery().generateObject()_
```javascript
var aGeneratedObjects = jQuery('div.foo > [data-class]').generateObject();
```
_It will generate the Objects and return this as a list._

Dependencies:
-------------

This Framework depends on [jQuery](http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js "jQuery 1.9.1")
This should work with all jQuery-Versions from 1.4 up to 2.x.
If there is any error/bug with some jquery version, please tell me or feel free to push a fix.

Usage:
------

To get this framework into your project you can download the jar-Files of [core](https://github.com/mricharz/Simple-JavaScript-Framework/blob/master/core/target/core-0.0.1-SNAPSHOT.jar "Core-Library") and [ui](https://github.com/mricharz/Simple-JavaScript-Framework/blob/master/ui/target/ui-0.0.1-SNAPSHOT.jar "UI-Library") and load it inside of your project.
Or you can checkout the repo and import both projects _core_ and _ui_ to your IDE and add dependencies in your maven-project.

To init the library, you only have to add this to your HTML-Head:
```html
//Before this line you need to load jQuery-Library!
<script type="text/javascript" src="/core.js"></script>
```

License:
--------

Distributed under the [MIT license](http://opensource.org/licenses/MIT "MIT license")
