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
  function evaluate (schema, target) {
    console.log(`evaluate data "${util.format(target)}" using schema ${util.format(schema)}`);

    // this provides no validation of any sort; it either always passes
    // or always fails.
    if (typeof schema === 'boolean') {
      return booleanSchema(target);
    }
    // if it's not an object then ajv should not have validated the schema, so
    // it's not clear how we got here.
    if (typeof schema !== 'object') {
      return ['?', schema];
    }

    // this is most likely less common than an object, but the test has to
    // be done anyway to make sure the schema is a non-array object.
    //
    // i don't believe this is allowed so ajv should not have validated the
    // schema, so just return the 'no modifications' question mark and the
    // non-conforming schema.
    if (Array.isArray(schema)) {
      return ['?', schema];
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
    let {type} = schema;
    if (type !== typeof target && type !== 'integer') {
      // TODO consider logging because this code should only be called if the
      // validation succeeded and yet this target is the wrong type. it must mean
      // that the logic behind this approach is flawed.
      return ['?', type];
    }



    // check enum and const now because they cause any type to become untracked.
    // todo - should we do this when the value of const or at least one enum element
    // is an object? yes, we're just counting on the user to do things right.
    let validation;
    // if both const and enum are present then const must be an element of
    // enum or the validation would have failed. given the loose standard and the
    // fact that const could a falsey value, check for the presence of enum and
    // const as opposed to a truthy value.
    if ('enum' in schema) {
      validation = 'enum';
    }
    if ('const' in schema) {
      validation = 'const';
    }

    if (type === 'number' || type === 'integer' || type === 'boolean') {
      // don't care about any keywords or formats but if constrained by
      // an enum or const remove tracking.
      if (validation) {
        return [null, `${type}:${validation}`];
      }
      return ['alphanum', type];
    }

    if (type === 'string') {
      // keywords and formats can make a difference but for now just look
      // at enum and const.
      if (validation) {
        return [null, `string:${validation}`];
      }
      return ['string-type-checked', 'string'];
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
      if (prop in target) {
        propPathPush(prop);
        const result = evaluate(properties[prop], target[prop]);
        propPathPop();
        if (!Array.isArray(result)) {
          throw new Error(`evaluate ${prop} returned ${result}`);
        }
        action(prop, properties, target, result);
      }
    }
    return ['?', 'multiple-maybe'];
  }

  function popPropPath(tag, validator) {
    //console.log(`[returning from ${propPath.pop()}]`);
    return [tag, validator];
  }

  function propPathPush(prop) {
    propPath.push(prop);
    console.log(`[descending to ${propPath.join('.')}]`);
  }
  function propPathPop() {
    propPath.pop();
    if (propPath.length) {
      console.log(`[returning to ${propPath.join('.')}]`);
    } else {
      console.log('[returning to {}]');
    }
  }
}

function schemaType(thing) {
  if (typeof thing !== 'object') {
    return typeof thing;
  }
  return Array.isArray(thing) ? 'array' : 'object';
}

// boolean schema just passes or fails; nothing is known about target.
function booleanSchema(target) {
  return ['?', schemaType(target)];
}
//
// this function becomes the tagging/tracking function
//
function action(prop, schema, target, result) {
  const [tag, type, ...rest] = result;
  if (tag === null) {
    console.log(`-> REMOVE TRACKING (<${tag}>/${type})`);
  } else if (tag === '?') {
    console.log(`-> ? NO CHANGE`);
  } else {
    console.log(`-> ADD ${tag} (${type})`);
}
  /*
  schema = util.format(schema[prop]);
  target = util.format(target[prop]);
  result = util.format(result);
  if (typeof target === 'string') {
    target = `"${target}"`;
  }
  console.log(`-> action on property '${prop}' value '${target}'`);
  console.log(`   with schema ${schema} => results ${result}`);
  // */
}

module.exports = {
  homeGrown,
  rdeval,
}