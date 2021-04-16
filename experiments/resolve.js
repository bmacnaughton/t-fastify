//import type {AnySchema, AnySchemaObject} from '../types'
const equal = require('fast-deep-equal');
//import * as traverse from 'json-schema-traverse'
const URI = require('uri-js');
//import * as URI from 'uri-js'

const traverse = require('json-schema-traverse');

// TODO refactor to use keyword definitions
const SIMPLE_INLINED = new Set([
  'type',
  'format',
  'pattern',
  'maxLength',
  'minLength',
  'maxProperties',
  'minProperties',
  'maxItems',
  'minItems',
  'maximum',
  'minimum',
  'uniqueItems',
  'multipleOf',
  'required',
  'enum',
  'const',
])

function inlineRef(schema, limit) {
  if (typeof schema == 'boolean') {
    return true;
  }
  if (limit === true) {
    return !hasRef(schema);
  }
  if (!limit) {
    return false;
  }
  return countKeys(schema) <= limit
}

const REF_KEYWORDS = new Set([
  '$ref',
  '$recursiveRef',
  '$recursiveAnchor',
  '$dynamicRef',
  '$dynamicAnchor',
])

module.exports = getSchemaRefs;

/**
 * @param {object|boolean} schema
 * @param {object} refs to update
 *
 * @returns {object} localRefs
 */
function getSchemaRefs (schema, refs) {
  // a schema can be true, false or an object. if true
  // or false it is either always valid or invalid.
  if (typeof schema == 'boolean') {
    return {};
  }
  const schemaId = normalizeId(schema.$id)
  const baseIds = {'': schemaId};
  const pathPrefix = getFullPath(normalizeId(schemaId));
  const localRefs = Object.create(null);
  const schemaRefs = new Set()

  traverse(schema, {allKeys: true}, (sch, jsonPtr, _, parentJsonPtr) => {
    if (parentJsonPtr === undefined) {
      return;
    }
    const fullPath = pathPrefix + jsonPtr;
    let baseId = baseIds[parentJsonPtr];
    if (typeof sch.$id == 'string') {
      baseId = addRef.call(this, sch.$id);
    }
    addAnchor(sch.$anchor);
    addAnchor(sch.$dynamicAnchor);
    baseIds[jsonPtr] = baseId;

    function addRef (ref) {
      ref = normalizeId(baseId ? URI.resolve(baseId, ref) : ref);
      if (schemaRefs.has(ref)) {
        throw ambiguous(ref);
      }
      schemaRefs.add(ref);
      let schOrRef = refs[ref];
      if (typeof schOrRef == 'string') {
        schOrRef = refs[schOrRef];
      }
      if (typeof schOrRef == 'object') {
        if (ambiguousRef(sch, schOrRef.schema)) {
          throw ambiguous(ref);
        }
      } else if (ref !== normalizeId(fullPath)) {
        if (ref[0] === '#') {
          if (ambiguousRef(sch, localRefs[ref])) {
            throw ambiguous(ref);
          }
          localRefs[ref] = sch;
        } else {
          refs[ref] = fullPath;
        }
      }
      return ref;
    }

    function addAnchor (anchor) {
      if (typeof anchor == 'string') {
        if (!ANCHOR.test(anchor)) {
          console.error(`invalid anchor '${anchor}'`);
          return;
        }
        try {
          addRef(`#${anchor}`);
        } catch (e) {
          console.error(e);
          return;
        }
      }
    }
  })

  return localRefs;
}

function ambiguous (ref) {
  return new Error(`reference '${ref}' resolves to more than one schema`);
}

function hasRef(schema) {
  for (const key in schema) {
    if (REF_KEYWORDS.has(key)) return true
    const sch = schema[key]
    if (Array.isArray(sch) && sch.some(hasRef)) return true
    if (typeof sch == 'object' && hasRef(sch)) return true
  }
  return false
}

function countKeys(schema) {
  let count = 0;
  for (const key in schema) {
    if (key === '$ref') return Infinity;
    count++;
    if (SIMPLE_INLINED.has(key)) continue;
    if (typeof schema[key] == 'object') {
      for (const x of schema[key]) {
        count += countKeys(x);
      }
      //eachItem(schema[key], (sch) => (count += countKeys(sch)))
    }
    if (count === Infinity) return Infinity;
  }
  return count;
}

function getFullPath(id = '') {
  const p = URI.parse(id)
  return _getFullPath(p)
}

/**
 *
 */
function _getFullPath(p) {
  return URI.serialize(p).split('#')[0] + '#';
}

//const TRAILING_SLASH_HASH = /#\/?$/
/**
 * remove hash-trailing-slash if present
 */
function normalizeId(id) {
  return id ? id.replace(/#\/?$/, '') : '';
}

function resolveUrl(baseId, id) {
  id = normalizeId(id)
  return URI.resolve(baseId, id)
}

const ANCHOR = /^[a-z_][-a-z0-9._]*$/i


