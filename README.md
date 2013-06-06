Simple-JavaScript-Framework
===========================

This is a simple and small OOP framework based on jQuery


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

You can call super-class methods by using _\_super()_:
```javascript
this._super('init', arguments);
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

But this will only be loaded once! If this is already loaded, _jQuery.require_ will skip without an error.

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

Dependencies:
-------------

This Framework depends on [jQuery](http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js "jQuery 1.9.1")
This should work with all jQuery-Versions from 1.4 up to 2.x.
If there is any error/bug with some jquery version, please tell me or feel free to push a fix.

Usage:
------

To get this framework to your project you can download the jar-Files of [core](https://github.com/mricharz/Simple-JavaScript-Framework/blob/master/core/target/core-0.0.1-SNAPSHOT.jar "Core-Library") and [ui](https://github.com/mricharz/Simple-JavaScript-Framework/blob/master/ui/target/ui-0.0.1-SNAPSHOT.jar "UI-Library") and load it inside of your project.
Or you can checkout the repo and import both projects _core_ and _ui_ to your IDE and add dependencies in your maven-project.

Then init the library you only have to add this to your HTML-Head:
```html
//Before this line you need to load jQuery-Library!
<script type="text/javascript" src="/core.js"></script>
```

License:
--------

Distributed under the [MIT license](http://opensource.org/licenses/MIT "MIT license")
