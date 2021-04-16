'use strict';

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#page-13

const keywords = {
  any: [
    'type',         // string | atring[] enum: null, boolean, object, array, number, string, integer
    'enum',         // any[]
    'const',        // any
    'definitions'   // object (not clear this can be anywhere but it appears so)
  ],
  numeric: ['multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum'],
  string: ['maxLength', 'minLength', 'pattern'],
  array: [
    'items',
    'additionalItems',
    'maxItems',
    'minItems',
    'uniqueItems',
    'contains'
  ],
  object: [
    'maxProperties', 'minProperties',   // must be non-negative integer
    'required',                         // must be array
    'properties',                       // must be object. each value must be valid JSON Schema
    'patternProperties',                // must be object. see 6.5.5 in draft-spec link
    'additionalProperties',             // must be JSON Schema. see 6.5.6
    'dependencies',                     // must be object. see 6.5.7
    'propertyNames',                    // must be JSON Schema. see 6.5.8
  ],
  conditional: ['if', 'then', 'else'],
  group: ['allOf', 'anyOf', 'oneOf', 'not'],
  semantic: ['format'],
};

let schemaDepth = 0;
let lastJSONPtr = -1;     // impossible value
let state = 'root';

function homeGrown (schema, JSONPtr, rootSchema, parentJSONPtr, parentKeyword, parentSchema, indexProp) {
  let prefix = '';
  switch (state) {
    case 'root':
      if (typeof schema === 'boolean') {
        console.log(`this schema always ${schema ? 'succeeds' : 'fails'}`);
        // there is nothing more to this schema
        return;
      }
      const id = schema.$id;
      const type = schema.type;
      const otherKeys = Object.getOwnPropertyNames(schema).filter(k => !~['$id', 'type'].indexOf(k));

      console.log(`$id: ${id} type ${type} ${otherKeys}`);
      for (const k of otherKeys) {
        console.log(`  ${k}: ${schema[k]}`);
      }
      schemaDepth += 1;
      state = 'scan';
      break;
    case 'scan':
      if (JSONPtr.startsWith(lastJSONPtr)) {
        prefix = `${' '.repeat(schemaDepth * 2)}--> `;
        //schemaDepth += 1;
        state = 'in-schema';
      } else {
        lastJSONPtr = JSONPtr;
      }
      console.log(`${prefix}${JSONPtr}:`, schema);
      break;
    case 'in-schema':
      if (!JSONPtr.startsWith(lastJSONPtr)) {
        //schemaDepth -= 1;
        state = 'scan';
        break;
      }
      prefix = `${' '.repeat(schemaDepth * 2)}--> `;
      console.log(`${prefix}${JSONPtr}:`, schema);
      break;
  }
}

function rdeval(schema, target) {
  const root = schema;

  return evaluate(schema, target);

  function evaluate (schema, target) {
    // this provides no validation of any sort; it either always passes
    // or always fails.
    if (typeof schema === 'boolean') {
      return [schema ? 'pass' : 'fail', ''];
    }
    if (typeof schema !== 'object') {
      return ['fail', '', schema];
    }

    // this is certainly less common than an object, but the test has to
    // be done anyway to tell if it's a non-array object, so this comes first.
    if (Array.isArray(schema)) {
      // handle array
      return;
    }

    // it's an object

    const {type} = schema;

    if (type === 'object') {
      // TODO handle IF/THEN/ELSE and allOf/anyOf/oneOf
      //
      // if enum and properties exist then properties takes precedence if a prop
      // appears in both. so when following path in object, check to see if it
      // appears in properties first. if it does then that was the validation done
      // (if any). if it doesn't appear in properties AND there is an enum then the
      // entire object is trusted (because it passed an enum).
      const {definitions, properties} = schema;

      // the id isn't important - we'll use getSchema() to fetch any schemas.
      if (definitions) {
        evaluateDefinitions(definitions);
      }
      for (const prop in properties) {
        // TODO construct object path to be able to map to result in target
        evaluate(prop);
      }
      return;
    }

    if (type === 'array') {
      return;
    }

    // it's a primitive of some sort. it should not be possible for it to be
    // an error because the validation should have failed if that were the case.
    // if formats are present then different tags might need to be applied. right
    // now the only tags that matter are enum and const. the sequence for checks
    // is 1) type, 2) const, 3) enum. and only type really matters because const
    // and enum can cause the validation to fail but not for an incorrect type
    // to pass. if both const and enum are present it must pass the const check
    // before the enum check is executed, so using const and enum is really not
    // useful at all.
    switch(type) {
      case 'number':
        return ['pass', 'alphanum'];
      case 'string':
        return ['pass', ''];
      case 'integer':
        return ['pass', 'alphanum'];
      case 'boolean':
        return ['pass', 'alphanum'];
      case 'null':
        return ['pass', ''];
      default:
        // this is some kind of error. not sure what.
        return ['fail', ''];
    }
  }
}

function setTracking(prop, string, tag) {
  console.log(`@TRACK ${prop} ${string} as ${tag}`);
}


module.exports = {
  homeGrown,
  rdeval,
}