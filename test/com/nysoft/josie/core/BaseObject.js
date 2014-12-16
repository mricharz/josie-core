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
            testBaseObjectVal: 'com.nysoft.josie.core.BaseObject',
            testStringArrayVal: 'string[]',
            testNumberArrayVal: 'number[]',
            testBaseObjectArrayVal: 'com.nysoft.josie.core.BaseObject[]',
			testStrValWithDefault: { type: 'string', defaultValue: 'foo' },
			testIntValWithDefault: { type: 'number', defaultValue: 42 },
			testArrValWithDefault: { type: 'object', defaultValue: [] },
			testObjValWithDefault: { type: 'object', defaultValue: {} },
			testBoolValWithDefault: { type: 'boolean', defaultValue: true },
			testFuncValWithDefault: { type: 'function', defaultValue: String.toLowerCase },
            testBaseObjectValWithDefault: { type: 'com.nysoft.josie.core.BaseObject', defaultValue: null },
            testStringArrayValWithDefault: { type: 'string[]', defaultValue: ['foo', 'bar'] },
            testNumberArrayValWithDefault: { type: 'number[]', defaultValue: [1, 2] },
            testBaseObjectArrayValWithDefault: { type: 'com.nysoft.josie.core.BaseObject[]', defaultValue: [new com.nysoft.josie.core.BaseObject()] }
		},

		init: function(options) {
			this.setProperties(options);
		}
	});
	// BaseObjectExtendMetadataTest exists
	assert.notEqual(com.nysoft.josie.core.BaseObjectExtendMetadataTest, undefined, 'com.nysoft.josie.core.BaseObjectExtendMetadataTest !== undefined');
	// BaseObjectExtendMetadataTest can be created
	assert.equal(typeof new com.nysoft.josie.core.BaseObjectExtendMetadataTest(), 'object', 'typeof new com.nysoft.josie.core.BaseObjectExtendMetadataTest() === "object"');
    var oBaseObjectExtendMetadataTest = new com.nysoft.josie.core.BaseObjectExtendMetadataTest();
    assert.ok(oBaseObjectExtendMetadataTest instanceof com.nysoft.josie.core.BaseObjectExtendMetadataTest, 'new com.nysoft.josie.core.BaseObjectExtendMetadataTest() instanceof com.nysoft.josie.core.BaseObjectExtendMetadataTest');
	
	var oBaseObjectExtendMetadataTest_Filled = new com.nysoft.josie.core.BaseObjectExtendMetadataTest({
		testVal: 'something',
		testStrVal: 'bar',
		testIntVal: 1337,
		testArrVal: [1,2,3],
		testObjVal: { foo: 'bar', donkey: 'kong' },
		testBoolVal: false,
		testFuncVal: String.toUpperCase,
        testBaseObjectVal: new com.nysoft.josie.core.BaseObject(),
        testStringArrayVal: ['some', 'strings', 'in', 'array'],
        testNumberArrayVal: [2, 3, 4],
        testBaseObjectArrayVal: [
            new com.nysoft.josie.core.BaseObject(),
            new com.nysoft.josie.core.BaseObject(),
            new com.nysoft.josie.core.BaseObject()
        ],
		testStrValWithDefault: 'bar',
		testIntValWithDefault: 1337,
		testArrValWithDefault: [1,2,3],
		testObjValWithDefault: { foo: 'bar', donkey: 'kong' },
		testBoolValWithDefault: false,
		testFuncValWithDefault: String.toUpperCase,
        testBaseObjectValWithDefault: new com.nysoft.josie.core.BaseObject(),
        testStringArrayValWithDefault: ['some', 'strings', 'in', 'array'],
        testNumberArrayValWithDefault: [2, 3, 4],
        testBaseObjectArrayValWithDefault: [
            new com.nysoft.josie.core.BaseObject(),
            new com.nysoft.josie.core.BaseObject(),
            new com.nysoft.josie.core.BaseObject()
        ]
	});

	// getter tests with filled object
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestVal(), 'something', 'oBaseObjectExtendMetadataTest_Filled.getTestVal() === "something"');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestStrVal(), 'bar', 'oBaseObjectExtendMetadataTest_Filled.getTestStrVal() === "bar"');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestIntVal(), 1337, 'oBaseObjectExtendMetadataTest_Filled.getTestIntVal() === 1337');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestArrVal(), [1,2,3], 'oBaseObjectExtendMetadataTest_Filled.getTestArrVal() === [1,2,3]');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestObjVal(), { foo: 'bar', donkey: 'kong' }, 'oBaseObjectExtendMetadataTest_Filled.getTestObjVal() === { foo: "bar", donkey: "kong" }');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestBoolVal(), false, 'oBaseObjectExtendMetadataTest_Filled.getTestBoolVal() === false');
	assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestFuncVal(), String.toUpperCase, 'oBaseObjectExtendMetadataTest_Filled.getTestFuncVal() === String.toUpperCase');
    var oBaseObject = oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectVal();
    assert.ok(oBaseObject instanceof com.nysoft.josie.core.BaseObject, 'oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectVal() instanceof com.nysoft.josie.core.BaseObject');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestStringArrayVal(), ['some', 'strings', 'in', 'array'], 'oBaseObjectExtendMetadataTest_Filled.getTestStringArrayVal() === ["some", "strings", "in", "array"]');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestNumberArrayVal(), [2, 3, 4], 'oBaseObjectExtendMetadataTest_Filled.getTestNumberArrayVal() === [2, 3, 4]');
    var aBaseObjects = oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectArrayVal();
    assert.equal(aBaseObjects.length, 3, 'oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectArrayVal().length === 3');
    assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestStrValWithDefault(), 'bar', 'oBaseObjectExtendMetadataTest_Filled.getTestStrValWithDefault() === "bar"');
    assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestIntValWithDefault(), 1337, 'oBaseObjectExtendMetadataTest_Filled.getTestIntValWithDefault() === 1337');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestArrValWithDefault(), [1,2,3], 'oBaseObjectExtendMetadataTest_Filled.getTestArrValWithDefault() === [1,2,3]');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestObjValWithDefault(), { foo: 'bar', donkey: 'kong' }, 'oBaseObjectExtendMetadataTest_Filled.getTestObjValWithDefault() === { foo: "bar", donkey: "kong" }');
    assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestBoolValWithDefault(), false, 'oBaseObjectExtendMetadataTest_Filled.getTestBoolValWithDefault() === false');
    assert.equal(oBaseObjectExtendMetadataTest_Filled.getTestFuncValWithDefault(), String.toUpperCase, 'oBaseObjectExtendMetadataTest_Filled.getTestFuncValWithDefault() === String.toUpperCase');
    var oBaseObject = oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectValWithDefault();
    assert.ok(oBaseObject instanceof com.nysoft.josie.core.BaseObject, 'oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectValWithDefault() instanceof com.nysoft.josie.core.BaseObject');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestStringArrayValWithDefault(), ['some', 'strings', 'in', 'array'], 'oBaseObjectExtendMetadataTest_Filled.getTestStringArrayValWithDefault() === ["some", "strings", "in", "array"]');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Filled.getTestNumberArrayValWithDefault(), [2, 3, 4], 'oBaseObjectExtendMetadataTest_Filled.getTestNumberArrayValWithDefault() === [2, 3, 4]');
    var aBaseObjects = oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectArrayValWithDefault();
    assert.equal(aBaseObjects.length, 3, 'oBaseObjectExtendMetadataTest_Filled.getTestBaseObjectArrayValWithDefault().length === 3');

	var oBaseObjectExtendMetadataTest_Empty = new com.nysoft.josie.core.BaseObjectExtendMetadataTest();

	// getter tests with empty object
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestStrVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestStrVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestIntVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestIntVal() === null');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestArrVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestArrVal() === null');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestObjVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestObjVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBoolVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestBoolVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestFuncVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestFuncVal() === null');
    assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectVal() === null');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestStringArrayVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestStringArrayVal() === null');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestNumberArrayVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestNumberArrayVal() === null');
    assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectArrayVal(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectArrayVal() === null');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestStrValWithDefault(), 'foo', 'oBaseObjectExtendMetadataTest_Empty.getTestStrValWithDefault() === "bar"');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestIntValWithDefault(), 42, 'oBaseObjectExtendMetadataTest_Empty.getTestIntValWithDefault() === 1337');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestArrValWithDefault(), [], 'oBaseObjectExtendMetadataTest_Empty.getTestArrValWithDefault() === [1,2,3]');
	assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestObjValWithDefault(), {}, 'oBaseObjectExtendMetadataTest_Empty.getTestObjValWithDefault() === { foo: "bar", donkey: "kong" }');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBoolValWithDefault(), true, 'oBaseObjectExtendMetadataTest_Empty.getTestBoolValWithDefault() === false');
	assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestFuncValWithDefault(), String.toLowerCase, 'oBaseObjectExtendMetadataTest_Empty.getTestFuncValWithDefault() === String.toUpperCase');
    assert.equal(oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectValWithDefault(), null, 'oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectValWithDefault() === null');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestStringArrayValWithDefault(), ['foo', 'bar'], 'oBaseObjectExtendMetadataTest_Empty.getTestStringArrayValWithDefault() === ["foo", "bar"]');
    assert.deepEqual(oBaseObjectExtendMetadataTest_Empty.getTestNumberArrayValWithDefault(), [1, 2], 'oBaseObjectExtendMetadataTest_Empty.getTestNumberArrayValWithDefault() === [1, 2]');
    var aBaseObjects = oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectArrayValWithDefault();
    assert.equal(aBaseObjects.length, 1, 'oBaseObjectExtendMetadataTest_Empty.getTestBaseObjectArrayValWithDefault().length === 1');
});