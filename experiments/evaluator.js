'use strict';

/* eslint-disable no-console */

const util = require('util');
const fastDeepEqual = require('fast-deep-equal');
const objectWalk = require('./object-walk');

// https://json-schema.org/specification-links.html
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#page-13
// TODO support 2019-09 https://json-schema.org/draft/2019-09/release-notes.html

// i don't think the keywords are needed but i'm going to leave them here
// until i get through the code without needing them.
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

class Evaluator {
  constructor(ajv, schema, schemaObject) {
    this.ajv = ajv;
    this.schemaName = schema;
    this.schema = schemaObject;
    this.path = [];

    // used to avoid 1) recreating regexes and 2) relying on ajv's internal
    // cache of regexes.
    // they're in the ajv.scope._values.pattern.get(regex-string).value.ref
    // but that seems like a very specific implementation detail to rely on.
    this.regexCache = new Map();
  }

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
  evaluate(target) {
    return this.eval(this.schema, target);
  }

  /**
   * eval is called for each schema when there is a target to be evaluated.
   *
   * when a schema has sub-schemas it recurses. all errors are returned in
   * the normal return object with some information encoded.
   *
   * TODO - codify return object/array
   *
   *
   * @param {object|boolean} schema - the schema to use for validation
   * @param {any} target - the item the schema validates
   * @returns {array} - return things
   */
  eval(schema, target) {
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
      return ['?', `(invalid-schema: ${schema})`];
    }

    // see if it's a reference. all the examples i can find show an object
    // with a single property, $ref, e.g., {$ref: 'reference'}
    if ('$ref' in schema) {
      const refSchema = this.getSchema(schema.$ref);
      if (!refSchema || !refSchema.schema) {
        //  not sure how the validation could have succeeded, but
        return ['?', {error: `$ref: cannot resolve ${schema.$ref}`}];
      }
      // no push/pop because the target hasn't changed.
      return this.eval(refSchema.schema, target);
    }

    //
    // the schema is an object. this is the only valid type of schema other
    // than boolean, which unconditionally passes or fails.
    //
    // possible types specified by the schema object:
    //  - null, boolean, object, array, number, integer, string
    //
    const {type} = schema;

    //
    // now both the target and the schema type have to be compatible.
    //
    // if the target is an object it must be evaluated against the schema to
    // determine what properties (at any depth) might have been validated.
    //
    // if the target is a string then it must be evaluated against const, enum,
    // formats and keywords.
    //
    // if the target is a boolean, float, or number then the schema doesn't
    // matter. add the "alphanum" tag; if the value was a string and has been
    // coerced or was a natural boolean or number then it won't be tagged.
    //
    if (!this.typesAreCompatible(type, target)) {
      // TODO consider logging because this code should only be called if the
      // validation succeeded and yet this target is the wrong type. it must mean
      // that the logic behind this approach is flawed.
      // (also, could it mean that coercion is active and the value was coerced?
      // i don't think so because the uncoerced value would not be present.)
      return ['?', type];
    }

    // arguments for schema-type specific method. type is needed because all
    // scalars are handled by a single method.
    const args = {type, schema, target};

    // check enum and const now because they cause any type to be untracked.
    let validator;
    let validations;
    // if both const and enum are present then const must be an element of
    // enum or the validation would have failed. so if const is present, no
    // need to check for enum.
    //
    // check for the presence of const because it could be falsey, e.g.,
    // '' or null.
    if ('const' in schema) {
      validator = 'const';
      validations = [schema.const]; // make it the array it's sugar for
    } else if (Array.isArray(schema.enum)) {
      validator = 'enum';
      validations = schema.enum;
    }

    // get the type-specific method to execute.
    const method = Evaluator.dispatch.get(type);

    if (!method) {
      debugger;
      // while developing throw; in production just return ['?', 'error']
      throw new Error(`Found ${type} when expecting valid schema type`);
    }
    // add validations if present.
    if (validations) {
      args.validator = validator;
      args.validations = validations;
    }

    return this[method](args);
  }

  /**
   * use ajv.getSchema to fetch a schema given a reference to the schema.
   * the reference can be
   * - uri-ref (from $id)
   * - uri-ref#/json-pointer
   * - #/json-pointer
   * https://cswr.github.io/JsonSchema/spec/definitions_references/
   */
  getSchema(schema) {
    // any truly remote reference that was required should have been fetched
    // by ajv in order to validate, so using ajv.getSchema() should fetch from
    // cache.

    // consider:
    // addressSchema defines {$defs: {street: {...}}}
    // addressSchema references it: {streetAddress: {$ref: '#/$defs/street/}}
    // userSchema has a reference to addressSchema: {address: {$ref: 'addressSchema#/streetAddress}}
    //
    // when userSchema references addressSchema#/streetAddress it loads {$ref: '#/$defs/street'}.
    // when userSchema sees '#/$defs/street' it tries to dereference it as a *local* reference
    // because it has lost the addressSchema context.
    //
    // so walk loaded $ref objects and convert relative references to absolute references so
    // that ajv.getSchema() will resolve them.
    //
    const schemaValidationFunction = this.ajv.getSchema(schema);
    if (!schemaValidationFunction) {
      return undefined;
    }

    const schemaReference = schemaValidationFunction.schema;
    for (const [object, key] of objectWalk(schemaReference)) {
      // is it a relative reference in the context of the just loaded schema?
      if (key === '$ref' && object[key][0] === '#') {
        // it appears to be, make it an absolute reference.
        object[key] = `${schema}${object[key]}`;
      }
    }
    return schemaValidationFunction;
  }

  /*
   * handle schema types number, integer, boolean.
   */
  scalar({type, validator}) {
    // don't care about any keywords or formats but if constrained by
    // an enum or const remove tracking.
    if (validator) {
      return [null, `${type}:${validator}`];
    }
    return ['alphanum', type];
  }

  /**
   * handle schema type string.
   */
  string({validator}) {
    // keywords and formats can make a difference but for now just look
    // at enum and const.
    if (validator) {
      return [null, `string:${validator}`];
    }
    return ['string-type-checked', 'string'];
  }

  /**
   * handle schema type array.
   */
  array({schema, target, validator, validations}) {
    // validation impacting tagging keywords: items, additionalItems.
    // contains could be relevant but requires finding which items match
    // the contains schema.
    // TODO keyword contains
    if (validator) {
      return [null, `array:${validator} (TODO - walk array)`];
    }

    const {items, additionalItems} = schema;

    // if no items then the array passes validation automatically, so
    // nothing can be inferred.
    if (!items) {
      return ['?', 'array:items-not-specified'];
    }

    // if items is not an array then items is the schema by which all array
    // elements are validated.
    if (!Array.isArray(items)) {
      for (let i = 0; i < target.length; i++) {
        this.pathPush(i);
        const result = this.eval(items, target[i]);
        this.pathPop(result);
      }
      return ['?', 'array:(applied items schema)'];
    }

    // items is an array of schema by which the first items.length elements
    // are evaluated.
    const max = target.length > items.length ? items.length : target.length;
    for (let i = 0; i < max; i++) {
      this.pathPush(i);
      const result = this.eval(items[i], target[i]);
      this.pathPop(result);
    }

    // additionalItems, if present is either a schema for validating
    // additional items or an array of schemas for doing so.
    if (!additionalItems || target.length <= max) {
      return ['?', 'array:(applied [items] schema)'];
    }

    const isArray = Array.isArray(additionalItems);
    const uncheckedCount = target.length - max;
    // if it's not an array then all the target array elements will be checked.
    let nextMax = uncheckedCount;
    if (isArray && additionalItems.length < uncheckedCount) {
      // it's an array so only check what is specified.
      nextMax = additionalItems.length;
    }

    for (let i = max; i < nextMax; i++) {
      this.pathPush(i);
      const item = isArray ? additionalItems[i] : additionalItems;
      const result = this.eval(item, target[i]);
      this.pathPop(result);
    }
    return ['?', 'array:(applied additionalItems)'];
  }

  /**
   * handle schema type object
   */
  object({schema, target, validator, validations}) {
    // TODO how to custom keywords? either attach property to return
    // value or use async context. possibly attach symbol property to validated
    // string or object? probably cheaper than async context.
    // TODO handle pattern properties (probably should cache regexes)
    // TODO handle additionalProperties (not in properties or patternProperties)
    // TODO handle dependencies
    // TODO handle IF/THEN/ELSE and allOf/anyOf/oneOf
    //
    // if enum and properties exist then properties takes precedence if a prop
    // appears in both. so when following path in object, check to see if it
    // appears in properties first. if it does then that was the validation done
    // (if any). if it doesn't appear in properties AND there is an enum then the
    // entire object is trusted (because it passed an enum).
    //
    // draft 2019-09 definitions => $defs (but much bigger changes too). it
    // doesn't appear that definitions or $defs is used directly; it's just
    // a "standard" place to put reusable definitions but a JSON pointer can
    // reference a definition anywhere, so ignore definitions.
    const {properties, patternProperties, additionalProperties} = schema;

    // if enum or const then the object must be deeply compared against those,
    // as opposed to descending and evaluating schemas. "an instance validates
    // if its value is equal to one of the elements in this keyword's array
    // value".
    if (validator) {
      return this.enumerations({target, validator, validations});
    }

    const propsSeen = new Map();
    // only properties that are in the schema can possibly be validated, so don't
    // consider properties that exist in the target but not the schema.
    for (const prop in properties) {
      // TODO - may need to check keywords patternProperties and additionalProperties
      // and possibly dependencies in order to completely evaluate.
      //
      // if the property exists in the target then it might have been validated as
      // a string, an enum, or a const (or keyword or format).
      if (prop in target) {
        this.pathPush(prop);
        const result = this.eval(properties[prop], target[prop]);
        this.pathPop(result);
        // add to properties seen
        propsSeen.set(prop, true);
      }
    }

    // TODO it's possible that pattern properties specifies the same prop
    // and specifies a more restrictive schema, but that causes a strict
    // mode error and significantly complicates this logic, so defer it
    // until hopefully it's not an issue in the future because strict mode
    // is "normal".
    //
    // now do patternProperties. when ajv executes with {strict: 'log'} option
    // it logs what would be errors if {strict: true} or ignored if {strict: false}.
    // if a patternProperties key matches a properties key it is a strict mode
    // error, so the schema wouldn't compile, but ignoring it allows the two
    // to specify mutually exclusive validation criteria.
    if (patternProperties) {
      for (const prop in target) {
        if (propsSeen.get(prop)) {
          continue;
        }
        for (const schema of this.matching(patternProperties, prop)) {
          this.pathPush(prop);
          const result = this.eval(schema, target[prop]);
          this.pathPop(result);
          // add to properties seen
          propsSeen.set(prop, true);
        }
      }
    }

    // now come additionalProperties
    if (additionalProperties) {
      for (const prop in target) {
        // only look at props not seen
        if (propsSeen.get(prop)) {
          continue;
        }
        this.pathPush(prop);
        const result = this.eval(additionalProperties, target[prop]);
        this.pathPop(result);
      }
    }

    // return something when an object is evaluated. this will not be used
    // because it's not possible to tag an object, but it assures that return
    // values are a consistent format.
    return ['?', '(evaluated-object)'];
  }

  /**
   * walk either an array or object and find the enumerated valid match. this
   * must not be called unless there is a validator and validations.
   *
   * if enum or const then the object must be deeply compared against those,
   * as opposed to descending and evaluating schemas. enum: "an instance
   * validates if its value is equal to one of the elements in this keyword's
   * array value". and const is just sugar for a one element enum.
   */
  enumerations({target, validator, validations}) {
    let validated = false;
    const identical = new Array(validations.length);
    for (let i = 0; i < validations.length; i++) {
      const r = fastDeepEqual(validations[i], target);
      if (r) {
        validated = true;
        identical[i] = validations[i];
      }
    }

    if (!validated) {
      return ['?', `${validator} failed validation: ${util.format(target)}`];
    }

    // if one of the const/enum values resulted in the target being validated
    // then the target must be walked to tag/untag values in the validations.
    //
    // this will walk both objects and arrays.
    for (const [object, key] of objectWalk(target)) {
      if (typeof object[key] === 'string') {
        this.action([null, `${validator}:${util.format(object)}[${key}]`]);
      }
    }
    return ['?', 'enum:walked'];


  }

  /**
   * @returns {boolean} - schema type compatible with target type
   */
  typesAreCompatible(type, target) {
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
  }

  *matching(patternProps, prop) {
    for (const [key, value] of Object.entries(patternProps)) {
      let re = this.regexCache.get(key);
      if (re === null) {
        continue;
      }
      if (!re) {
        try {
          re = new RegExp(key);
          this.regexCache.set(key, re);
        } catch (e) {
          this.regexCache.set(key, null);
          continue;
        }
      }
      if (re.test(prop)) {
        yield value;
      }
    }
  }

  pathPush(prop) {
    this.path.push(prop);
    const prefix = '\u2193'.repeat(this.path.length);
    console.log(`${prefix} descending to ${this.path.join('.')}`);
  }

  pathPop(result) {
    const n = this.path.length;
    const prefix = '\u2191'.repeat(n);
    const from = n ? this.path.join('.') : 'hmmm.';
    this.path.pop();
    this.action(result, n);
    console.log(`${prefix} returning from ${from}`);
    return result;
  }
  //
  // this function becomes the tagging/tracking function
  //
  action(result, n) {
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
}

// map each JSON Schema type to the method name for it
Evaluator.dispatch = new Map([
  ['boolean', 'scalar'],
  ['number', 'scalar'],
  ['integer', 'scalar'],
  ['string', 'string'],
  ['array', 'array'],
  ['object', 'object']
]);

module.exports = {
  Evaluator,
};
