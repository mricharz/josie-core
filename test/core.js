QUnit.module('josie-core core.js')
QUnit.test("josie-core version", function(assert) {
	assert.ok(jQuery.version['josie-core'], JSON.stringify(jQuery.version['josie-core']));
});

QUnit.test("josie-core utils", function(assert) {
	// deg2rad and rad2deg
	assert.equal(jQuery.utils.deg2rad(50), 0.8726646259971648, 'deg2rad( 50 ) == 0.8726646259971648');
	assert.equal(jQuery.utils.rad2deg(0.8726646259971648), 50, 'rad2deg( 0.8726646259971648 ) == 50');
	// round
	assert.equal(jQuery.utils.round(13.37), 13, 'round( 13.37 ) == 13');
	assert.equal(jQuery.utils.round(41.58), 42, 'round( 41.58 ) == 42');
	// ceil
	assert.equal(jQuery.utils.ceil(13.37), 14, 'ceil( 13.37 ) == 14');
	assert.equal(jQuery.utils.ceil(41.58), 42, 'ceil( 41.58 ) == 42');
	// floor
	assert.equal(jQuery.utils.floor(41.58), 41, 'floor( 41.58 ) == 41');
	assert.equal(jQuery.utils.floor(13.37), 13, 'floor( 13.37 ) == 13');
	// guid generation
	assert.ok(jQuery.utils.S4(), 'S4()');
	assert.ok(jQuery.utils.uniqueId(), 'uniqueId()');
	assert.notEqual(jQuery.utils.uniqueId(), jQuery.utils.uniqueId(), 'uniqueId() =! uniqueId()');
	// isjQuery
	assert.ok(jQuery.utils.isjQuery(jQuery()), 'isjQuery( jQuery() )');
	assert.ok( ! jQuery.utils.isjQuery({}), '! isjQuery( {} )');
	assert.ok( ! jQuery.utils.isjQuery([]), '! isjQuery( [] )');
	// isUrl
	assert.ok(jQuery.utils.isUrl('http://google.de'), 'isUrl( "http://google.de" )');
	assert.ok(jQuery.utils.isUrl('https://google.de'), 'isUrl( "https://google.de" )');
	assert.ok(jQuery.utils.isUrl('http://www.google.de'), 'isUrl( "http://www.google.de" )');
	assert.ok(jQuery.utils.isUrl('https://www.google.de'), 'isUrl( "https://google.de" )');
	assert.ok(jQuery.utils.isUrl('//google.de'), 'isUrl( "//google.de" )');
	assert.ok(jQuery.utils.isUrl('//www.google.de'), 'isUrl( "//www.google.de" )');
	assert.ok(jQuery.utils.isUrl('http://google.de:80'), 'isUrl( "http://google.de:80" )');
	assert.ok(jQuery.utils.isUrl('https://google.de:443'), 'isUrl( "https://google.de:443" )');
	assert.ok(jQuery.utils.isUrl('http://www.google.de:80'), 'isUrl( "http://www.google.de:80" )');
	assert.ok(jQuery.utils.isUrl('https://www.google.de:443'), 'isUrl( "https://www.google.de:443" )');
	assert.ok(jQuery.utils.isUrl('//google.de:80'), 'isUrl( "//google.de:80" )');
	assert.ok(jQuery.utils.isUrl('//www.google.de:80'), 'isUrl( "//www.google.de:80" )');
	assert.ok(jQuery.utils.isUrl('http://google.de?foo=bar&leet=1337#whoot'), 'isUrl( "http://google.de?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('https://google.de?foo=bar&leet=1337#whoot'), 'isUrl( "https://google.de?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('http://www.google.de?foo=bar&leet=1337#whoot'), 'isUrl( "http://www.google.de?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('https://www.google.de?foo=bar&leet=1337#whoot'), 'isUrl( "https://www.google.de?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('//google.de?foo=bar&leet=1337#whoot'), 'isUrl( "//google.de?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('//www.google.de?foo=bar&leet=1337#whoot'), 'isUrl( "//www.google.de?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('http://google.de/data/test?foo=bar&leet=1337#whoot'), 'isUrl( "http://google.de/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('https://google.de/data/test?foo=bar&leet=1337#whoot'), 'isUrl( "https://google.de/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('http://www.google.de/data/test?foo=bar&leet=1337#whoot'), 'isUrl( "http://www.google.de/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('https://www.google.de/data/test?foo=bar&leet=1337#whoot'), 'isUrl( "https://www.google.de/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('//google.de/data/test?foo=bar&leet=1337#whoot'), 'isUrl( "//google.de/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok(jQuery.utils.isUrl('//www.google.de/data/test?foo=bar&leet=1337#whoot'), 'isUrl( "//www.google.de/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok( ! jQuery.utils.isUrl('/data/test?foo=bar&leet=1337#whoot'), '! isUrl( "/data/test?foo=bar&leet=1337#whoot" )');
	assert.ok( ! jQuery.utils.isUrl('http:\\google.de\data\test?foo=bar&leet=1337#whoot'), '! isUrl( "http:\\\\google.de\\data\\test?foo=bar&leet=1337#whoot" )');
	assert.ok( ! jQuery.utils.isUrl('asd@asd.de'), '! isUrl( "asd@asd.de" )');
	assert.ok( ! jQuery.utils.isUrl('10/12/2014'), '! isUrl( "10/12/2014" )');
	// isSelector (for JSONSelect)
	assert.ok(jQuery.utils.isSelector('.content :nth-child(0)'), 'isSelector( ".content :nth-child(0)" )');
	assert.ok(jQuery.utils.isSelector('.data .childs'), 'isSelector( ".data .childs" )');
	assert.ok( ! jQuery.utils.isSelector('/data /childs'), '! isSelector( "/data /childs" )');
	assert.ok( ! jQuery.utils.isSelector('$'), '! isSelector( "$" )');
	assert.ok( ! jQuery.utils.isSelector('jQuery()'), '! isSelector( "jQuery()" )');
	// isNamespace
	assert.ok(jQuery.utils.isNamespace('foo'), 'isNamespace( "foo" )');
	assert.ok(jQuery.utils.isNamespace('foo.bar.Test'), 'isNamespace( "foo.bar.Test" )');
	assert.ok(jQuery.utils.isNamespace('123.456.789'), 'isNamespace( "123.456.789" )');
	assert.ok( ! jQuery.utils.isNamespace('123\456\789'), '! isNamespace( "123\\456\\789" )');
	assert.ok( ! jQuery.utils.isNamespace('10/12/2014'), '! isNamespace( "10/12/2014" )');
	assert.ok( ! jQuery.utils.isNamespace('http://google.de'), '! isNamespace( "http://google.de" )');
	//todo: we need fail-tests for all is***-methods
	// getParameter
	//assert.ok(jQuery.utils.getParameter('test'), 'getParameter');
	// capitalize
	assert.equal(jQuery.utils.capitalize('foo'), 'Foo', 'capitalize( "foo" ) == "Foo"');
	assert.equal(jQuery.utils.capitalize('Bar'), 'Bar', 'capitalize( "Bar" ) == "Bar"');
	// htmlAttr2CamelCase
	assert.equal(jQuery.utils.htmlAttr2CamelCase('data-test-foo'), 'dataTestFoo', 'htmlAttr2CamelCase( "data-test-foo" ) == "dataTestFoo"');
	assert.equal(jQuery.utils.htmlAttr2CamelCase('src'), 'src', 'htmlAttr2CamelCase( "src" ) == "src"');
});

QUnit.test("josie-core namespaces & classes", function(assert) {
	// declare
	assert.ok(jQuery.declare('com.nysoft.josie.test.Test'), 'jQuery.declare("com.nysoft.josie.test.Test")');
	assert.equal(jQuery.declare('com.nysoft.josie.test.Test'), com.nysoft.josie.test.Test, 'jQuery.declare("com.nysoft.josie.test.Test") == com.nysoft.josie.test.Test');
	assert.notEqual(com.nysoft.josie.test.Test, null, 'com.nysoft.josie.test.Test != null');
	// getClass, classExists and require
	assert.equal(jQuery.getClass('com.nysoft.josie.core.Control'), undefined, 'jQuery.getClass("com.nysoft.josie.core.Control")');
	assert.ok( ! jQuery.classExists('com.nysoft.josie.core.Control'), '! jQuery.classExists("com.nysoft.josie.core.Control")');
	assert.equal(jQuery.require('com.nysoft.josie.core.Control'), null, 'jQuery.require("com.nysoft.josie.core.Control")');
	assert.notEqual(jQuery.getClass('com.nysoft.josie.core.Control'), undefined, 'jQuery.getClass("com.nysoft.josie.core.Control")');
	assert.ok(jQuery.classExists('com.nysoft.josie.core.Control'), 'jQuery.classExists("com.nysoft.josie.core.Control")');
	assert.equal(jQuery.require('com.nysoft.josie.test.Test'), null, 'jQuery.require("com.nysoft.josie.test.Test")');
});

QUnit.test('josie-core other stuff', function(assert) {
	assert.equal(typeof jQuery.requestAnimationFrame, 'function', 'typeof jQuery.requestAnimationFrame == "function"');
	assert.equal(typeof jQuery.agent, 'string', 'typeof jQuery.agent == "string"');
	assert.notEqual(jQuery.device, null, 'jQuery.device != null');
	assert.notEqual(jQuery.device.mode, null, 'jQuery.device.mode != null');
	assert.equal(typeof jQuery.josieBasePath, 'string', 'typeof jQuery.josieBasePath == "string"');
	assert.equal(typeof jQuery.josieLocalRun, 'boolean', 'typeof jQuery.josieLocalRun == "string"')
});