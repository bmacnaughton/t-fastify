'use strict';

const traverse = require('json-schema-traverse');

const addressSchema = {
  $id: 'addressSchema',
  address1: {type: 'string'},
  zip: {type: 'number'},
};

const bodyJsonSchema = {
  $id: 'bodyJSONSchema',
  type: 'object',
  required: ['requiredKey'],
  properties: {
    someKey: {type: 'string'},
    someOtherKey: {type: 'number'},
    requiredKey: {
      type: 'array',
      maxItems: 3,
      items: {type: 'integer'}
    },
    nullableKey: {type: ['number', 'null']}, // or { type: 'number', nullable: true }
    multipleTypesKey: {type: ['boolean', 'number']},
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
    addresses: {$ref: 'addressSchema'},
  }
};

const names = [
  'schema',
  '  JSONptr',
  '  rootSchema',
  '  parentJSONptr',
  '  parentKeyword',
  '  parentSchema',
  '  index/prop'
]
traverse(bodyJsonSchema, {allKeys: true}, function (...args) {
  for (let i = 0; i < args.length; i++) {
    if (!names[i].endsWith('Schema')) {
      console.log(`${names[i]}:`, args[i]);
    }
  };
  console.log();
});

