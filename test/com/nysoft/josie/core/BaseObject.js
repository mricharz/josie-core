QUnit.module('josie-core - com.nysoft.josie.core.BaseObject');

QUnit.test('require, create, use', function(assert) {
	Josie.require('com.nysoft.josie.core.BaseObject');
	// BaseObject exists
	assert.notEqual(com.nysoft.josie.core.BaseObject, undefined, 'com.nysoft.josie.core.BaseObject !== undefined');
	// BaseObject can be created
	assert.equal(typeof new com.nysoft.josie.core.BaseObject(), 'object', 'typeof new com.nysoft.josie.core.BaseObject() === "object"');
	
	com.nysoft.josie.core.BaseObject.extend('com.nysoft.josie.core.BaseObjectExtendMetadataTest', {
		meta: {
			testVal: null,
			testStrVal: 'string',
			testIntVal: 'number',
			testArrVal: 'object',
			testObjVal: 'object',
			testBoolVal: 'boolean',
			testFuncVal: 'function',
			testStrValWithDefault: { type: 'string', defaultValue: 'foo' },
			testIntValWithDefault: { type: 'number', defaultValue: 42 },
			testArrValWithDefault: { type: 'object', defaultValue: [] },
			testObjValWithDefault: { type: 'object', defaultValue: {} },
			testBoolValWithDefault: { type: 'boolean', defaultValue: true },
			testFuncValWithDefault: { type: 'function', defaultValue: String.toLowerCase }
		},
		
		init: function(options) {
			this.setProperties(options);
		}
	});
	// BaseObjectExtendMetadataTest exists
	assert.notEqual(com.nysoft.josie.core.BaseObjectExtendMetadataTest, undefined, 'com.nysoft.josie.core.BaseObjectExtendMetadataTest !== undefined');
	// BaseObjectExtendMetadataTest can be created
	assert.equal(typeof new com.nysoft.josie.core.BaseObjectExtendMetadataTest(), 'object', 'typeof new com.nysoft.josie.core.BaseObjectExtendMetadataTest() === "object"');
	
	var oBaseObjectExtendMetadataTest_Filled = new com.nysoft.josie.core.BaseObjectExtendMetadataTest({
		testVal: 'something',
		testStrVal: 'bar',
		testIntVal: 1337,
		testArrVal: [1,2,3],
		testObjVal: { foo: 'bar', donkey: 'kong' },
		testBoolVal: false,
		testFuncVal: String.toUpperCase,
		testStrValWithDefault: 'bar',
		testIntValWithDefault: 1337,
		testArrValWithDefault: [1,2,3],
		testObjValWithDefault: { foo: 'bar', donkey: 'kong' },
		testBoolValWithDefault: false,
		testFuncValWithDefault: String.toUpperCase
	});

	// getter tests with filled object
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestVal(), 'something', 'oBaseObjectExtendMetadataTest_Filled.getTestVal() === "something"');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestStrVal(), 'bar', 'oBaseObjectExtendMetadataTest_Filled.getTestStrVal() === "bar"');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestIntVal(), 1337, 'oBaseObjectExtendMetadataTest_Filled.getTestIntVal() === 1337');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestArrVal(), [1,2,3], 'oBaseObjectExtendMetadataTest_Filled.getTestArrVal() === [1,2,3]');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestObjVal(), { foo: 'bar', donkey: 'kong' }, 'oBaseObjectExtendMetadataTest_Filled.getTestObjVal() === { foo: "bar", donkey: "kong" }');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestBoolVal(), false, 'oBaseObjectExtendMetadataTest_Filled.getTestBoolVal() === false');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestFuncVal(), String.toUpperCase, 'oBaseObjectExtendMetadataTest_Filled.getTestFuncVal() === String.toUpperCase');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestStrValWithDefault(), 'bar', 'oBaseObjectExtendMetadataTest_Filled.getTestStrValWithDefault() === "bar"');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestIntValWithDefault(), 1337, 'oBaseObjectExtendMetadataTest_Filled.getTestIntValWithDefault() === 1337');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestArrValWithDefault(), [1,2,3], 'oBaseObjectExtendMetadataTest_Filled.getTestArrValWithDefault() === [1,2,3]');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestObjValWithDefault(), { foo: 'bar', donkey: 'kong' }, 'oBaseObjectExtendMetadataTest_Filled.getTestObjValWithDefault() === { foo: "bar", donkey: "kong" }');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestBoolValWithDefault(), false, 'oBaseObjectExtendMetadataTest_Filled.getTestBoolValWithDefault() === false');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestFuncValWithDefault(), String.toUpperCase, 'oBaseObjectExtendMetadataTest_Filled.getTestFuncValWithDefault() === String.toUpperCase');
	
	var oBaseObjectExtendMetadataTest_Empty = new com.nysoft.josie.core.BaseObjectExtendMetadataTest();

	// getter tests with filled object
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestStrVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestStrVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestIntVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestIntVal() === null');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestArrVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestArrVal() === null');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestObjVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestObjVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBoolVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestBoolVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestFuncVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestFuncVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestStrValWithDefault(), 'foo', 'oBaseObjectExtendMetadataTest_Empty.getTestStrValWithDefault() === "bar"');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestIntValWithDefault(), 42, 'oBaseObjectExtendMetadataTest_Empty.getTestIntValWithDefault() === 1337');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestArrValWithDefault(), [], 'oBaseObjectExtendMetadataTest_Empty.getTestArrValWithDefault() === [1,2,3]');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestObjValWithDefault(), {}, 'oBaseObjectExtendMetadataTest_Empty.getTestObjValWithDefault() === { foo: "bar", donkey: "kong" }');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBoolValWithDefault(), true, 'oBaseObjectExtendMetadataTest_Empty.getTestBoolValWithDefault() === false');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestFuncValWithDefault(), String.toLowerCase, 'oBaseObjectExtendMetadataTest_Empty.getTestFuncValWithDefault() === String.toUpperCase');
});