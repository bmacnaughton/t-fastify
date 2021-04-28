'use strict';

/* eslint-disable no-console */

const util = require('util');
const fastDeepEqual = require('fast-deep-equal');
const objectWalk = require('./object-walk');

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#page-13

// eslint-disable-next-line no-unused-vars
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

function rdeval(schema, target) {
  const root = schema;
  const propPath = [];

  /**
   * the return value of this function determines what tags are applied
   * or removed.
   *
   * @param {object|boolean} schema - JSON Schema
   * @param {any} target - the item being validated
   * @returns [tag, determinant]
   *           tag === null -> remove tracking
   *           typeof tag === string && tag !== '?' -> add tag to item
   *
   *           determinant is the modifier:type of item
   *           - not sure if it is needed but useful for explortation
   *             and debugging.
   */
  return evaluate(schema, target);

  /**
   * this function returns the type of schema that was used to validate as
   * well as the validator in the schema. in some cases it needs to do evaluation
   * in order to determine which element of the schema resulted in the passing the
   * target value.
   *
   * many target values can pass the schema either because they are not checked
   * in any way or because the checks that were in place don't check anything
   * that matters from a security perspective.
   *
   * @param schema - the schema applicable to the target
   * @param target - the target to be checked against the schema
   * @returns ['validation-type', 'validator']
   */
  function evaluate(schema, target) {
    // this provides no validation of any sort; it either always passes
    // or always fails.
    if (typeof schema === 'boolean') {
      return ['?', 'schema:boolean'];
    }
    // if it's not an object then ajv should not have validated the schema, so
    // it's not clear how we got here.
    if (typeof schema !== 'object') {
      return ['?', `(invalid: ${schema})`];
    }

    // this is most likely less common than an object, but the test has to
    // be done anyway to make sure the schema is a non-array object.
    //
    // i don't believe this is allowed so ajv should not have validated the
    // schema, so just return the 'no modifications' question mark and the
    // non-conforming schema.
    if (Array.isArray(schema)) {
      return ['?', `(invalid: ${schema})`];
    }

    // now both the target and the schema both have to be considered; they're
    // not independent any longer.
    //
    // if the target is an object it must be evaluated against the schema to
    // determine what properties (at any depth) might have been validated.
    //
    // if the target is a string then it must be evaluated against const, enum,
    // formats and keywords.
    //
    // (NEXT MAYBE NOT, float and integer don't matter tag-wise)
    // if the target is a number the schema must be checked to see if an integer
    // was specified?
    //
    // if the target is a boolean then the schema doesn't matter. we can add
    // alphanum. if the value has been coerced or is a natural boolean then it
    // just won't be tagged.
    //

    //
    // the schema is an object. this is the only useful case.
    //
    // possible types: null, boolean, object, array, number, integer, string
    //
    //
    const {type} = schema;

    const allowed = () => {
      if (type === typeof target) {
        return true;
      }
      if (!(type === 'integer' && typeof target === 'number')) {
        return true;
      }
      if (!(type === 'array' && Array.isArray(target))) {
        return true;
      }
      return false;
    };

    if (!allowed()) {
      // TODO consider logging because this code should only be called if the
      // validation succeeded and yet this target is the wrong type. it must mean
      // that the logic behind this approach is flawed.
      // (also, it could mean that coercion is active and the value was coerced.)
      return ['?', type];
    }

    // check enum and const now because they cause any type to become untracked.
    // todo - should we do this when the value of const or at least one enum element
    // is an object? yes, we should not second-guess the user.
    let validator;
    let validations;
    // if both const and enum are present then const must be an element of
    // enum or the validation would have failed. given the loose standard and the
    // fact that const could a falsey value, check for the presence of enum and
    // const as opposed to a truthy value.
    if ('enum' in schema && Array.isArray(schema.enum)) {
      validator = 'enum';
      validations = schema.enum;
    }
    if ('const' in schema) {
      validator = 'const';
      validations = [schema.const];
    }

    if (type === 'number' || type === 'integer' || type === 'boolean') {
      // don't care about any keywords or formats but if constrained by
      // an enum or const remove tracking.
      if (validator) {
        return [null, `${type}:${validator}`];
      }
      return ['alphanum', type];
    }

    if (type === 'string') {
      // keywords and formats can make a difference but for now just look
      // at enum and const.
      if (validator) {
        return [null, `string:${validator}`];
      }
      return ['string-type-checked', 'string'];
    }

    // validation impacting tagging keywords: items, additionalItems
    if (type === 'array') {
      if (validator) {
        return [null, `array:${validator} (TODO - walk array)`];
      }
      return ['?', `array (TODO items, additionalItems)`];
    }

    // it must be an object
    if (type !== 'object') {
      throw new Error(`Found ${type} when expecting object`);
    }

    // how to handle keywords?

    // TODO handle IF/THEN/ELSE and allOf/anyOf/oneOf
    //
    // if enum and properties exist then properties takes precedence if a prop
    // appears in both. so when following path in object, check to see if it
    // appears in properties first. if it does then that was the validation done
    // (if any). if it doesn't appear in properties AND there is an enum then the
    // entire object is trusted (because it passed an enum).
    const {definitions, properties} = schema;

    // the id isn't important - we'll use getSchema() to fetch any schemas. but
    // definitions can be refered to from within the schema so capture them.
    // question - are they global even if embedded in a lower level object?
    if (definitions) {
      const evaluateDefinitions = () => null;
      evaluateDefinitions(definitions);
    }

    // if enum or const then the object must be deeply compared against those,
    // as opposed to descending and evaluating schemas. "an instance validates
    // if its value is equal to one of the elements in this keyword's array
    // value".
    if (validator) {
      let validated = false;
      const identical = new Array(validations.length);
      for (let i = 0; i < validations.length; i++) {
        const r = fastDeepEqual(validations[i], target);
        if (r) {
          identical[i] = validations[i];
          validated = true;
        }
      }
      // if one of the const/enum values resulted in the target being validated
      // then the target must be walked to tag/untag values in the validations.
      //
      // this will walk both objects and arrays.
      if (validated) {
        for (const [object, key] of objectWalk(target)) {
          if (typeof object[key] === 'string') {
            action([null, `${validator}:${util.format(object)}[${key}]`]);
          }
        }
        return ['?', 'enum:walked'];
      } else {
        throw new Error(`enum/const failed validation ${util.format(target)}`);
      }
    }


    // only properties that are in the schema can possibly be validated, so don't
    // consider properties that exist in the target but not the schema.
    for (const prop in properties) {
      // TODO - may need to check keywords patternProperties and additionalProperties
      // and possibly dependencies in order to completely evaluate.
      //
      // if the property exists in the target then it might have been validated as
      // a string, an enum, or a const (or keyword or format).
      if (prop in target) {
        propPathPush(prop);
        const result = evaluate(properties[prop], target[prop]);
        if (!Array.isArray(result)) {
          throw new Error(`evaluate ${prop} returned ${result}`);
        }
        propPathPop(result);
        //console.log(`result from evaluate() ${util.format(result)}`);
        //action(prop, properties, target, result);
      }
    }
    // return something when an object is evaluated. this will not be used
    // because it's not possible to tag an object, but it assures that return
    // values are a consistent format.
    return ['?', '(evaluated-object)'];

    function propPathPush(prop) {
      propPath.push(prop);
      const prefix = '\u2193'.repeat(propPath.length);
      console.log(`${prefix} descending to ${propPath.join('.')}`);
    }
    function propPathPop(result) {
      const n = propPath.length;
      const prefix = '\u2191'.repeat(n);
      const from = n ? propPath.join('.') : 'hmmm.';
      propPath.pop();
      action(result, n);
      console.log(`${prefix} returning from ${from}`);
    }
    //
    // this function becomes the tagging/tracking function
    //
    function action(result, n) {
      const [tag, type, ...rest] = result;
      const prefix = `${' '.repeat(2 * n)}\u2192`;
      if (tag === null) {
        console.log(`${prefix} REMOVE TRACKING (<${tag}>/${type})`);
      } else if (tag === '?') {
        console.log(`${prefix} ? NO CHANGE (${type})`);
      } else {
        console.log(`${prefix} ADD ${tag} (${type})`);
      }
    }
  }
}

module.exports = {
  rdeval,
};
