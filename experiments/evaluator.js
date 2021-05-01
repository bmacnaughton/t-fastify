'use strict';

/* eslint-disable no-console */

const util = require('util');
const fastDeepEqual = require('fast-deep-equal');
const objectWalk = require('./object-walk');

// https://json-schema.org/specification-links.html
// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#page-13
// TODO support 2019-09 https://json-schema.org/draft/2019-09/release-notes.html

class Evaluator {
  constructor(ajv, schema, schemaObject, options = {}) {
    this.ajv = ajv;
    this.schemaName = schema;
    this.schema = schemaObject;
    // keep track of the path to the target.
    this.path = [];
    this.container = undefined;

    // these functions are called on eval enter and exit. for production
    // they implement the tagging functions; for testing, verification.
    this.enter = options.enter || (() => undefined);
    this.exit = options.exit || (() => undefined);
    // this function is called when a value is returned after passing validation.
    this.passed = options.passed || ((result) => result.value);

    // used to avoid 1) recreating regexes and 2) relying on ajv's internal
    // cache of regexes.
    // they're in the ajv.scope._values.pattern.get(regex-string).value.ref
    // but that seems like a very specific implementation detail to rely on.
    this.regexCache = new Map();
  }

  /**
   * this function returns the type of schema that was used to validate as
   * well as additional information. in some cases it needs to do evaluation
   * in order to determine which element of the schema resulted in the passing the
   * target value.
   *
   * many target values can pass the schema either because they are not checked
   * in any way or because the checks that were in place don't check anything
   * that matters from a security perspective.
   *
   * @param schema - the schema applicable to the target
   * @param target - the target to be checked against the schema
   * @returns [tag-info, additional-info]
   *  tag-info - null if target matched a const or enum (implies remove-tracking)
   *           - '?' if no useful information so no tag modifications
   *           - 'tag' tag to be added (agent code decides whether to remove untrusted)
   *  additional-info - 'explanatory-string' | {error: 'explanatory-message'}
   */
  evaluate(object, key, target) {
    const result = this.eval(this.schema, target);
    // was target a primitive value?
    if (result.type === 'value') {
      object[key] = this.passed(target, result.tag);
      // as the item to be evaluated was a primitive the return value makes
      // perfect sense to pass on.
      return result;
    }
    // maybe result should be something else here. this particular result
    // might not be generally applicable.
    // TODO consider aggregating all calls made to this.passing()? reasonable
    // for relatively small targets but 150K targets might be taxing.
    return result;
  }

  /**
   * recurse a deeper level into target
   */
  evalInto(schema, target, prop) {
    this.pathPush(prop);
    const result = this.eval(schema, target[prop]);
    if (result.type === 'value') {
      // is result.value needed? this implies that container[prop] is the
      // value.
      target[prop] = this.passed(result.value, result.tag);
    }
    this.pathPop(result);
    return result;
  }

  /**
   * eval is called for each schema when there is a target to be evaluated.
   *
   * when a schema has sub-schemas it recurses. all errors are returned in
   * the normal return object with some information encoded.
   *
   * TODO - codify return object/array
   * TODO - return object of all return values (only for testing/debugging)?
   *
   * @param {object|boolean} schema - the schema to use for validation
   * @param {any} target - the item the schema validates
   * @returns {object} {type: value|error|info, ...variant-properties}
   *   eval returns an object of type 'value', 'error', or 'info'.
   *   {type: 'value', tag: 'tag'|null, value: string|string-object}
   *   {type: 'error', message: 'message'}
   *   {type: 'info', message: 'message'}
   *
   *   when a type value is returned the callback, this.passed() will be called with
   *   the value and the return value from this.passed() will replace the existing
   *   value in the object/array. this.passed() should return the original value if
   *   no change is desired.
   *
   *   type 'error' is returned when an inconsistency is detected that should not
   *   happen, e.g., the schema is not valid or a value does not satisfy constraints.
   *
   *   type 'info' is returned when eval processed an array/object and there is not a
   *   value associated with it.
   *
   */
  eval(schema, target) {
    // this provides no validation of any sort; it either always passes
    // or always fails.
    if (typeof schema === 'boolean') {
      return this.infoReturn('schema:boolean');
    }
    // if it's not an object then ajv should not have validated the schema, so
    // it's not clear how we got here.
    if (typeof schema !== 'object') {
      return this.errorReturn(`invalid-schema: ${util.format(schema)}`);
    }

    // this is most likely less common than an object, but the test has to
    // be done anyway to make sure the schema is a non-array object.
    //
    // i don't believe this is allowed so ajv should not have validated the
    // schema, so just return the 'no modifications' question mark and the
    // non-conforming schema.
    if (Array.isArray(schema)) {
      return this.errorReturn(`invalid-schema: ${util.format(schema)}`);
    }

    // see if it's a reference. all the examples i can find show an object
    // with a single property, $ref, e.g., {$ref: 'reference'}
    if ('$ref' in schema) {
      const refSchema = this.getSchema(schema.$ref);
      if (!refSchema || !refSchema.schema) {
        //  not sure how the validation could have succeeded, but
        return this.errorReturn(`$ref: cannot resolve ${schema.$ref}`)
      }
      // do not evalInto() because the target hasn't changed; just the schema.
      //
      // TODO how to handle primitive here - need multiple levels of message?
      // no push/pop because the target hasn't changed, but want to record
      // the flow of control.
      this.enter(this, {message: `evaluating $ref: ${schema.$ref}`});
      const result = this.eval(refSchema.schema, target);
      result.message = 'evaluated $ref';
      this.exit(this, result);
      delete result.message;
      return result;
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
      return this.returnError(`types-not-compat: ${type} & ${util.format(target)}`);
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
    const entry = Evaluator.dispatch.get(type);

    if (!entry) {
      debugger;
      // while developing throw; in production just return this.errorReturn()
      throw new Error(`Found ${type} when expecting valid schema type`);
      // eslint-disable-next-line no-unreachable
      return this.returnError(`found ${type} when expected valid schema type`);
    }
    // add validations if present.
    if (validations) {
      args.validator = validator;
      args.validations = validations;
    }

    return this[entry.method](args);
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
        // TODO make sure this doesn't mess up ajv; we could be messing with its
        // schema.
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
      return this.valueReturn(null, `${type}:${validator}`);
    }
    return this.valueReturn('alphanum', type);
  }

  /**
   * handle schema type string.
   */
  string({validator}) {
    // keywords and formats can make a difference but for now just look
    // at enum and const.
    if (validator) {
      return this.valueReturn(null, `string:${validator}`);
    }
    return this.valueReturn('string-type-checked', 'string');
  }

  /**
   * handle schema type array.
   */
  array({schema, target, validator, validations}) {
    // validation impacting tagging keywords: items, additionalItems.
    // contains could be relevant but requires finding which items match
    // the contains schema.
    // TODO keyword contains - probably low value, defer.

    if (validator) {
      return this.enumerations({target, validator, validations});
    }

    const {items, additionalItems} = schema;

    // if no items then the array passes validation automatically, so
    // nothing can be inferred.
    if (!items) {
      return this.infoReturn('array:items-not-specified');
    }

    // if items is not an array then items is the schema by which all array
    // elements are validated. additionalItems *must* be ignored.
    if (!Array.isArray(items)) {
      for (let i = 0; i < target.length; i++) {
        this.evalInto(items, target, i);
        //this.pathPush(i);
        //const result = this.eval(items, target[i]);
        //if (result.value) {
        //  target[i] = this.passed(result);
        //}
        //this.pathPop(result);
      }
      return this.infoReturn('array:items-schema');
    }

    // items is an array of schema by which the first items.length elements
    // are evaluated.
    const max = target.length > items.length ? items.length : target.length;
    for (let i = 0; i < max; i++) {
      this.evalInto(items[i], target, i);
      //this.pathPush(i);
      //const result = this.eval(items[i], target[i]);
      //this.pathPop(result);
    }

    // additionalItems, if present is either a schema for validating
    // additional items or an array of schemas for doing so.
    if (!additionalItems || target.length <= max) {
      return this.infoReturn('array:[items]-schema)');
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
      this.evalInto(isArray ? additionalItems[i] : additionalItems, target, i);
      //this.pathPush(i);
      //const item = isArray ? additionalItems[i] : additionalItems;
      //const result = this.eval(item, target[i]);
      //this.pathPop(result);
    }
    return this.infoReturn('array:additionalItems');
  }

  /**
   * handle schema type object
   */
  object({schema, target, validator, validations}) {
    // TODO how to custom keywords? either attach property to return
    //   value or use async context. possibly attach symbol property to validated
    //   string or object? probably cheaper than async context.
    // TODO keyword dependencies - complex, big change in 2019-09. defer.
    // TODO strict mode complains if additional items is not the same
    //   length as items and minItems/maxItems is not specified. i'm not
    //   sure what relationship is required. defer.
    // TODO handle IF/THEN/ELSE and allOf/anyOf/oneOf, deffer
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
      // TODO - may need to check dependencies to completely evaluate.
      //
      // if the property exists in the target then it might have been validated as
      // a string, an enum, or a const (or keyword or format).
      if (prop in target) {
        this.evalInto(properties[prop], target, prop);
        //this.pathPush(prop);
        //const result = this.eval(properties[prop], target[prop]);
        //this.pathPop(result);
        // add to properties seen
        propsSeen.set(prop, true);
      }
    }

    // TODO it's possible that pattern properties specifies the same prop
    // and specifies a more restrictive schema, but that causes a strict
    // mode error and significantly complicates this logic, so defer it
    // until hopefully it's not an issue in the future because strict mode
    // becomes "normal".
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
          this.evalInto(schema, target, prop);
          //this.pathPush(prop);
          //const result = this.eval(schema, target[prop]);
          //this.pathPop(result);
          // add to properties seen
          propsSeen.set(prop, true);
        }
      }
    }

    // now come additionalProperties. this schema is only used to validate
    // properties that did not match either properties or patternPropertise.
    if (additionalProperties) {
      for (const prop in target) {
        if (propsSeen.get(prop)) {
          continue;
        }
        this.evalInto(additionalProperties, target, prop);
        //this.pathPush(prop);
        //const result = this.eval(additionalProperties, target[prop]);
        //this.pathPop(result);
      }
    }

    // return something when an object is evaluated. this will not be used
    // because it's not possible to tag an object, but it assures that return
    // values are a consistent format and can be used for testing.
    return this.infoReturn('object:evaluated');
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
      return this.errorReturn(`${validator} failed validation: ${util.format(target)}`);
    }

    // if one of the const/enum values resulted in the target being validated
    // then the target must be walked to tag/untag values in the validations.
    //
    // this will walk both objects and arrays.
    for (const [object, key] of objectWalk(target)) {
      if (typeof object[key] === 'string') {
        // push and pop so the validation context is reported. because there is
        // not really a schema (it matched a const/enum) this.passed() is called
        // directly.
        this.pathPush(key);
        // parallel handling a return value by passing value and tag
        object[key] = this.passed(object[key], null);
        this.pathPop(this.infoReturn(`${validator}:${util.format(object)}[${key}]`));
      }
    }
    return this.infoReturn(`${validator}:walked`);
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

  /**
   * generator function to return schemas for each pattern that matches the
   * specified property name. it caches the RegExp objects generated from the
   * string-regex keys to avoid re-generating RegExp objects.
   *
   * @param {object} patternProps contains {[string-regex]: schema, ...}
   * @param {string} prop the property name to be checked against the regexes
   * @returns {object} schemas when pattern matches property name
   */
  *matching(patternProps, prop) {
    for (const [key, value] of Object.entries(patternProps)) {
      let re = this.regexCache.get(key);
      if (re === null) {
        // don't try to regenerate regex-strings that fail to compile.
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
    this.enter(this, prop);
  }

  pathPop(result) {
    this.exit(this, result);
    this.path.pop();
    return result;
  }

  valueReturn(tag, message) {
    return {type: 'value', tag, message};
  }

  infoReturn(message) {
    return {type: 'info', message};
  }

  errorReturn(message) {
    return {type: 'error', message};
  }
}

// map each JSON Schema type to the method name for it
Evaluator.dispatch = new Map([
  ['boolean', {method: 'scalar', primitive: true}],
  ['number', {method: 'scalar', primitive: true}],
  ['integer', {method: 'scalar', primitive: true}],
  ['string', {method: 'string', primitive: true}],
  ['array', {method: 'array'}],
  ['object', {method: 'object'}]
]);

module.exports = {
  Evaluator,
};
