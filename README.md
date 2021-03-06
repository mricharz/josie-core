Josie-Framework
===========================

This is a simple OOP framework based on jQuery.
Makes JavaScript more _Java_ than _Script_.

[![Build Status](https://travis-ci.org/mricharz/josie-core.svg?branch=master)](https://travis-ci.org/mricharz/josie-core)

Download [latest release](https://github.com/mricharz/josie-core/releases/latest "Download latest release version").


Namespaces:
-----------

To create a new namespace _foo.bar_:
```javascript
Josie.declare('foo.bar');
```

to call a namespace:
```javascript
foo.bar.Test = 'hello';
```

Classes:
--------

To create Classes, extend the BaseObject:
```javascript
com.nysoft.josie.core.BaseObject.extend('foo.bar.Foobar', {});
```
this will create a new Class named _Foobar_ in namespace _foo.bar_

to make an instance of this class just call:
```javascript
new foo.bar.Foobar();
```

### Constructor:

you can implement a constructor by adding a method named _init_:
```javascript
com.nysoft.josie.core.BaseObject.extend('foo.bar.Foobar', {
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

### Getter, Setter, DefaultValue and Validation

You can use _meta_-Property to autogenerate getter and setter methods with defaultValue and type-validation:
```javascript
com.nysoft.josie.core.BaseObject.extend('foo.bar.Foobar', {
  meta: {
  
    foo: 'number',
    
    bar: 'string',
    
    foo2: {
      type: 'boolean',
      defaultValue: true
    },
    
    bar2: {
      type: 'object',
      defaultValue: {
        some: 'thing'
      }
    }
    
    /*
    possible types:
      number
      string
      boolean
      function
      object
      null (without ') > no validation
      complete classnames like: com.nysoft.josie.core.Control
      and collections with []-suffix like: number[] or com.nysoft.josie.core.Control[]
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
Josie.require('foo.bar.Foobar');
```
this will load synchronously: /foo/bar/Foobar.js

You also can load external Scripts using _Josie.require_:
```javascript
Josie.require('http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js');
```

*A script will only be loaded once! If this is already loaded, _Josie.require_ will skip without an error.*

Alias:
------

You can create namespace aliases to shorten namespace-names.
You can use this aliases also in HTML-Decleration.
```javascript
Josie.alias('ui', 'com.nysoft.josie.ui');

var text = new ui.Text();
```

Events:
-------

For DOM-Events you should use jQuery-Functions.

But for Object-Events there is an EventStack-Class.

### Global Events:

You can set a global eventHandler to a Class. If this event gets executed, each object of this class is affected.
```javascript
//Create Class
com.nysoft.josie.core.BaseObject.extend('com.nysoft.josie.core.Control', {
  init: function() {
    alert('world');
  }
});

//Bind global Class-event
com.nysoft.josie.core.EventStack.bind('com.nysoft.josie.core.Control', 'onAfterInit', function(e, data) {
  alert('hello');
});

var oControl = new com.nysoft.josie.core.Control();
```
_This will alert "hello" after init-Method of each Control-Object is called._

### Object Events:

You can also set an object eventHandler. If this event gets executed only this one object is affected.

```javascript
com.nysoft.josie.core.BaseObject.extend('com.nysoft.josie.core.Control', {
  init: function() {
    alert('world');
  },
  
  foo: function() {
    this.trigger('onFoo');
  }
});
var oControl = new com.nysoft.josie.core.Control();

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
com.nysoft.josie.core.EventStack.unbind('com.nysoft.josie.core.Control', 'onAfterInit');
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
var oModel = new com.nysoft.josie.core.Model.JSONModel({
  src: '/url/to/json',
  key: 'modelKey' // optional. useful if you have more than one datamodel.
});
```

or with:

```html
<div data-class="com.nysoft.josie.core.Model.JSONModel" data-src="/admin/cache/listCaches"></div>
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

new com.nysoft.josie.ui.Button({
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
Josie.log.trace('trace foobar');
Josie.log.debug('debug foobar');
Josie.log.info('info foobar');
Josie.log.warning('warning foobar');
Josie.log.error('ERROR foobar');
```

The default LogLevel is _None_. To set the LogLevel use:
```javascript
Josie.log.setLevel( Josie.log.level.All );
Josie.log.setLevel( Josie.log.level.Info );
/* None, Error, Warning, Info, Debug, Trace, All */
```

Utils:
------

There are coming some little methods with the core.js. Have a look at [Josie.utils](https://github.com/mricharz/Simple-JavaScript-Framework/blob/master/src/js/core.js#L19 "Josie.utils in core.js").

DOM Class Pattern:
------------------

You can split Javascript and HTML by using Class Pattern.
```javascript
<div data-class="com.nysoft.josie.ui.Button" data-text="FooBar"></div>
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
If there is any error/bug with some jQuery version, please tell me or feel free to push a fix.

Usage:
------

To get this framework into your project you can download the [latest release](https://github.com/mricharz/josie-core/releases/latest "Download latest release version") and add it to your project.

To init the library, you only have to add this to your HTML-Head:
```html
//Before this line you need to load jQuery-Library!
<script type="text/javascript" src="/js/core.js"></script>
```

License:
--------

Distributed under the [MIT license](http://opensource.org/licenses/MIT "MIT license")
