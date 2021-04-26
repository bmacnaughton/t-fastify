'use strict';

const util = require('util');

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
  const propPath = [];

  return evaluate(schema, target);

  /**
   * this function returns the type of schema that was used to validate as
   * well as the schema. in some cases it needs to do evaluation in order to
   * determine which element of the schema resulted in the passing the target
   * value.
   *
   * many target values can pass the schema either because they are not checked
   * in any way or because the checks that were in place don't check anything
   * that matters from a security perspective.
   */
  function evaluate (schema, target) {
    console.log('evaluate', schema, target);
    // this provides no validation of any sort; it either always passes
    // or always fails.
    if (typeof schema === 'boolean') {
      return ['boolean'];
    }
    // if it's not an object then ajv should not have validated the schema, so
    // it's not clear how we got here.
    if (typeof schema !== 'object') {
      return ['?', schema];
    }

    // this is most likely less common than an object, but the test has to
    // be done anyway to tell if it's a non-array object, so this comes first.
    //
    // i don't believe this is allowed so ajv should not have validated the
    // schema.
    if (Array.isArray(schema)) {
      return ['?', schema];
    }

    //
    // it's an object. this is the most common case.
    //
    const {type, enum: _enum, const: _const, format} = schema;

    let validation;
    // if both const and enum are present then const must be an element of
    // enum or the validation would have failed.
    if ('const' in schema) {
      validation = _const;
    } else if (_enum) {
      validation = _enum;
    }
    if ('const' in schema && _enum) {
      validation = _const;
    }

    // how to handle keywords?

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
        // TODO - may need to check keywords patternProperties and additionalProperties
        // and possibly dependencies in order to completely evaluate.
        //
        // if the property exists in the target then it might have been validated as
        // a string, an enum, or a const (or keyword or format).
        if (target[prop]) {
          const result = evaluate(properties[prop], target[prop]);
          action(properties[prop], target[prop], result);
        }
      }
      return;
    }

    if (type === 'array') {
      return;
    }

    // it's a primitive of some sort. it should not be possible for it to be
    // an error because the validation should have failed if that were the case.
    // if formats are present then different tags might need to be applied. right
    // now the only keywords that matter are enum and const. the sequence for checks
    // is 1) type, 2) const, 3) enum. and only type really matters because const
    // and enum can cause the validation to fail but not for an incorrect type
    // to pass. if both const and enum are present it must pass the const check
    // before the enum check is executed, so using const and enum is really not
    // useful at all.
    switch(type) {
      case 'number':
      case 'integer':
        // this passes as alphanum. it's possible that the value was coerced to
        // a number.
        return ['alphanum'];
      case 'string':
        // in this case an enum or const value matters (in addition to formats and
        // keywords). if none of the previous are present then the tags don't change.
        return [_enum ? 'enum' : 'string'];
      case 'boolean':
        // this passes as alphanum though it is most often a boolean value, i.e.,
        // true or false, not "true" or "false".
        return ['alphanum'];
      case 'null':
        return ['null'];
      default:
        // this is some kind of error. not sure what but ajv should have failed the
        // schema validation if strict mode. if not strict mode, then it's noise.
        return ['?'];
    }
  }
}

function action(schema, prop, result) {
  schema = util.format(schema);
  result = util.format(result);
  if (typeof prop === 'string') {
    prop = `"${prop}"`;
  }
  console.log(`s${schema} p:${prop} r${result}`);
}

function setTracking(prop, string, tag) {

  console.log(`@TRACK ${prop} ${string} as ${tag}`);
}


module.exports = {
  homeGrown,
  rdeval,
}