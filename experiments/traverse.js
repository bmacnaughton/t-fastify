'use strict';

/* eslint-disable no-console */

const util = require('util');

const Ajv = require('ajv');

const {Evaluator} = require('./evaluator');

const addressSchema = {
  $id: 'addressSchema',
  type: 'object',
  definitions: {
    random: {
      type: 'integer',
      minimum: 0, maximum: 100,
    },
    random0: false,
    positive: {
      type: 'integer',
      minimum: 0, maximum: 99999
    },
  },
  properties: {
    address: {
      type: 'object',
      properties: {
        address: {type: 'string'},
        //zip: {type: 'number'},
        zip: {$ref: '#/definitions/positive'}
      }
    }
  },
};

// the following schema fails in strict mode ('address is not valid keyword') and
// generates a no-op validation function in not-strict mode because address and zip
// are ignored.
const looseAddressSchema = {
  $id: 'looseAddressSchema',
  address: {type: 'string'},
  zip: {type: 'string'},
};

// multiple unnamed schema throw - duplicate ID: ''
const anonymousSchema = {
  type: 'object',
  $defs: {
    internal: {type: 'string', const: 'internal'},
  },
  properties: {
    splish: {type: 'string'},
    splash: {type: 'string'},
    bath: {type: 'integer'},
    adventure: {type: 'string', enum: ['xyzzy', 'dragon', 'plover']},
    colossal: {type: 'string', const: 'cave'},
    plover: true,
    descending: {
      type: 'object',
      properties: {
        to: {type: 'string', const: 'yet'},
        another: {type: 'string', enum: ['level', 'mode', 'nightmare']},
        points: {type: 'integer'},
      }
    },
    'check-enum': {
      type: 'object',
      enum: [
        {bruce: 'wenxin', heihei: 'tuna'},
      ],
    },
    testArray: {
      type: 'array',
      items: {type: 'string'},
    },
    testArrayRef: {
      type: 'array',
      items: {$ref: 'addressSchema'},
      additionalItems: {type: 'string', const: 'should be ignored'},
    },
    testMultiArrayRef: {
      type: 'array',
      items: [{type: 'string'}, {type: 'number'}],
      additionalItems: {type: 'integer'},
    },
    aPointerRef: {$ref: 'addressSchema#/definitions/positive'},
    internalRef: {$ref: '#/$defs/internal'},
  }
};

const bodyJsonSchema = {
  $id: 'bodyJSONSchema',        // not returned as separate items
  type: 'object',               //
  required: ['requiredKey'],    //
  properties: {                 // the contents of properties are iterated
    someKey: {type: 'string'},
    someOtherKey: {type: 'number'},
    requiredKey: {
      type: 'array',
      maxItems: 3,
      items: {type: 'integer'}
    },
    nullableKey: {type: ['number', 'null']}, // or { type: 'number', nullable: true }
    // following is illegal in strict mode (big v7 introduction)
    //multipleTypesKey: {type: ['boolean', 'number']},
    multipleRestrictedTypesKey: {
      oneOf: [
        {type: 'string', maxLength: 5},
        {type: 'number', minimum: 10}
      ]
    },
    enumKey: {
      type: 'string',
      enum: ['John', 'Foo']
    },
    notTypeKey: {
      not: {type: 'array'}
    },
    addresses: {$ref: 'addressSchema#/properties/address'},
    weird: {$ref: 'addressSchema#'},
    //emptyRef: {$ref: ''},
    //addresses: {$ref: 'addressSchema#/properties/address'},
  }
};

const conflict = {
  $id: 'conflict',
  type: 'object',
  // passes if equal to this but x is required and props says integer
  enum: [{x: 'y'}],
  // required must be present in properties, enum doesn't satisfy it
  required: ['x'],
  // properties take precedence over enum if both specify a given key
  properties: {
    x: {type: 'integer'}
  }
};

// the following will ALWAYS FAIL because it has two mutually exclusive
// validations in const and enum
const conflict2 = {
  $id: 'conflict2',
  type: 'object',
  const: {x: 'z'},
  enum: [{x: 'y'}],
};

// this will ALWAYS FAIL because it cannot meet either the const or enum
// criteria and be a number.
const conflict3 = {
  $id: 'conflict3',
  type: 'number',
  const: 'x',
  enum: [{not: 'a number'}],
};

const noConflict = {
  $id: 'noConflict',
  type: 'object',
  // enum must be satisfied if key 'x' doesn't appear in properties.
  enum: [{x: 'y'}],
  properties: {
    y: {type: 'string'}
  },
};

const simpleNumber = {
  $id: 'simpleNumber',
  type: 'number',
};

const simpleString = {
  $id: 'simpleString',
  type: 'string',
};

const arrayWithValidation = {
  $id: 'arrayWithValidation',
  type: 'array',
  items: [
    {type: 'string'}, {type: 'string'},
  ],
  //const: ['xyzzy', 123],
  enum: [['a', 'b'], ['c', 'd']],
};

const withPatternProps = {
  $id: 'withPatternProps',
  type: 'object',
  properties: {
    Prop1: {type: 'string'},
  },
  patternProperties: {
    '^prop.$': {type: 'number'},
  },
};

//*

//
// instantiate ajv and add schemas.
// note they aren't checked until either getSchema or validate is called.
//
const ajv = new Ajv({strict: 'log', coerceTypes: false});

const schemas = {
  allowed: {$id: 'allowed', type: 'object', enum: [{x: 'y'}, {z: '?'}]},
  looseAddressSchema,
  bodyJsonSchema,
  addressSchema,
  anonymousSchema,
  conflict,
  conflict2,
  conflict3,
  noConflict,
  simpleNumber,
  simpleString,
  withPatternProps,
  arrayWithValidation,
};
for (const schema in schemas) {
  console.log(`[adding schema ${schema}]`);
  ajv.addSchema(schemas[schema]);
}

//
// tests of various schema configurations
//
const schemaTests = [
  {schema: 'bodyJSONSchema', data: {
    requiredKey: [1, 2, 3],
    addresses: {address: 'bruce lane', zip: 9},
    //emptyRef: {x: 'bruce'},
    weird: {randomKey: 777},
  }},
  {schema: 'addressSchema', data: {
    address: {address: 'bruce lane', zip: 98098}, randomKey: 7
  }},
  {schema: 'looseAddressSchema', data: {
    address: 'wenxin court', zip: 99
  }},
  {schema: '', data: {
    splish: 'splash', splash: 'splish', bath: 10
  }},
  {schema: 'allowed', data: {
    x: 'y'
  }},
  {skip: true, schema: 'conflict', data: {
    x: 'z'
  }},
  {skip: true, schema: 'conflict2', data: {
    x: 'z'
  }},
  {skip: true, schema: 'conflict3', data:
    'x'
  },
  {schema: 'noConflict', data: {
    y: 'zzz'
  }},
  {schema: 'simpleNumber', data:
    12.3
  },
  {
    schema: 'arrayWithValidation',
    dumpCode: false,
    data: ['a', 'b'],
  },
];

// set to $id of schema to run a single test
const onlySchemaTests = undefined;
for (const t of schemaTests) {
  if (onlySchemaTests && t.schema !== onlySchemaTests) {
    console.log(`% skipping ${t.schema}`);
    continue;
  }
  const {schema, data, skip} = t;
  const name = schema || '(anonymous)';
  if (skip) {
    console.log(`% skipping ${name} to validate %o`, data);
    continue;
  }
  console.log(`[using ${name} to validate %o]`, data);
  const validatorFunc = ajv.getSchema(schema);
  //const result = ajv.validate(schema, data);
  const result = validatorFunc(data);
  if (t.dumpCode) {
    console.log(validatorFunc.toString());
  }
  console.log(`-> ${result ? 'passed' : 'failed'}`);
  if (!result) {
    console.log(`-> ${util.format(validatorFunc.errors)}`);
  }
}

// recursive descent evaluator tests
const rdeTests = [
  {schema: 'simpleNumber', data: 4},
  {schema: 'simpleString', data: 'string'},
  {schema: '', data: {
    splish: 'splash',
    splash: 'i was taking a',
    bath: 16,
    adventure: 'xyzzy',
    colossal: 'cave',
    plover: 'iam a very & ; rm -rf /',        // this string validates b/c schema === true
    //descending: true, // will fail - isn't an object
    descending: {
      to: 'yet',
      another: 'level',
      points: 25,
    },
    'check-enum': {
      bruce: 'wenxin',
      heihei: 'tuna',
    },
    testArray: ['bruce', 'a', 'macnaughton', 'jr'],
    testArrayRef: [{address: {address: '507 South Delaware', zip: 74003}}],
    testMultiArrayRef: [
      'string',
      3.141592654,
      42, 42, 42,
    ],
    aPointerRef: 99887,
    internalRef: 'internal',
  }},
  {schema: 'withPatternProps', data: {
    Prop1: 'i am a string',
    propX: 99,
    propY: 77,
  }},
  {schema: 'arrayWithValidation', data: ['a', 'b']},
];

const bRed = '\u001b[31;1m';
const bBlue = '\u001b[34;1m';
const clear = '\u001b[0m';

const options = {
  enter(evaluator, prop) {
    const prefix = '\u2193'.repeat(this.path.length);
    let msg = 'descending to';
    if (typeof prop === 'object') {
      msg = prop.message;
    }
    console.log(`${prefix} ${msg} ${this.path.join('.')}`);
  },
  exit(evaluator, result) {
    const n = this.path.length;
    const prefix = '\u2191'.repeat(n);
    const from = n ? this.path.join('.') : 'hmmm.';
    const msg = result.message || 'returning from';
    action(result, n);
    console.log(`${prefix} ${msg} ${from}`);
  }
};

const skipRdeTests = false;
for (const t of rdeTests) {
  if (skipRdeTests) {
    continue;
  }
  const {schema, data, skip} = t;
  if (skip) {
    continue;
  }
  const name = schema || 'anonymous';
  console.log(`${bRed}[using ${name} to validate${clear} %o]`, data);
  // getSchema() returns the validator function. the schema object is
  // a property on the function.
  const validator = ajv.getSchema(schema);
  const schemaObject = validator.schema;
  console.log(`${bBlue}schema ${name} is ${util.format(schemaObject)}${clear}`);
  const validation = validator(data);
  const evaluator = new Evaluator(ajv, schema, schemaObject, options);
  evaluator.evaluate(data);
  console.log(`[schema validation ${validation ? 'passed' : 'failed'}]`);
  if (!validation) {
    util.format(`-> ${validator.errors}`);
  }
}

//
// this function becomes the tagging/tracking function
//
function action(result, n) {
  const [tag, status] = result;
  const type = status.error || status;
  const prefix = `${' '.repeat(2 * n)}\u2192`;
  if (tag === null) {
    console.log(`${prefix} REMOVE TRACKING (<${tag}>/${type})`);
  } else if (tag === '?') {
    if (status.error) {
      console.log(`${prefix} '? ERROR (${status.error})`);
    } else {
      console.log(`${prefix} ? NO CHANGE (${type})`);
    }
  } else {
    console.log(`${prefix} ADD ${tag} (${type})`);
  }
}


/*
const traverse = require('json-schema-traverse');
const {homeGrown} = require('./schema-traversal');
const {walkJSONSchema} = require('./walkers');

const options = {pre: homeGrown};
console.log(`${options.pre ? 'pre' : 'post'}-traversal`);

console.log('bodyJsonSchema');
traverse(bodyJsonSchema, {allKeys: true}, options);
//traverse(looseAddressSchema, {allKeys: true}, options);
//traverse({x: {type: 'string'}}, {allKeys: true}, options);
// */
