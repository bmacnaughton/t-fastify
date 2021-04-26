'use strict';

const util = require('util');

const Ajv = require('ajv');

const traverse = require('json-schema-traverse');
const {homeGrown, rdeval} = require('./traversers');
const {walkJSONSchema} = require('./walkers');

const addressSchema = {
  $id: 'addressSchema',
  type: 'object',
  definitions: {
    random: {
      type: "integer",
      minimum: 0, maximum: 100,
    },
    random0: false,
  },
  properties: {
    address: {
      type: 'object',
      properties: {
        address: {type: 'string'},
        zip: {type: 'number'},
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
  properties: {
    splish: {type: 'string'},
    splash: {type: 'string'},
    bath: {type: 'integer'},
    adventure: {type: 'string', enum: ['cave', 'dragon', 'plover']}
  }
};

const failingSchema = false;

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
}

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
];

let v;
const skipSchemaTests = true;
for (const t of schemaTests) {
  if (skipSchemaTests) {
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
  if (schema === 'conflict3x') {
    v = validatorFunc;
  }
  console.log(`-> ${result ? 'passed' : 'failed'}`);
  if (!result) {
    console.log(`-> ${util.format(validatorFunc.errors)}`);
  }
}
if (v) {
  console.log(v.toString());
}

// recursive descent evaluator tests
const rdeTests = [
  {schema: 'simpleNumber', data: 4},
  {schema: 'simpleString', data: 'string'},
  {schema: '', data: {
    splish: 'splash',
    splash: 'i was taking a',
    bath: 16,
  }}
];

for (const t of rdeTests) {
  const {schema, data, skip} = t;
  console.log(`[using ${schema} to validate %o]`, data);
  const validator = ajv.getSchema(schema);
  const realSchema = validator.schema;
  const validation = validator(data);
  rdeval(realSchema, data);
  console.log(`-> validation ${validation ? 'passed' : 'failed'}`);
  if (!validation) {
    util.format(`-> ${validator.errors}`);
  }
}


/*
const options = {pre: homeGrown};
console.log(`${options.pre ? 'pre' : 'post'}-traversal`);

console.log('bodyJsonSchema');
traverse(bodyJsonSchema, {allKeys: true}, options);
//traverse(looseAddressSchema, {allKeys: true}, options);
//traverse({x: {type: 'string'}}, {allKeys: true}, options);
// */
