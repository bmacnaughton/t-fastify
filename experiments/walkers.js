'use strict';

const getSchemaRefs = require('./resolve.js');

function walkJSONSchema(schema) {
  let id;
  let refs = {};

  if (typeof schema === 'object') {
    id = schema.$id;
  } else if (typeof schema !== 'boolean') {
    throw new Error('schema must be object or boolean');
  }

  const localRefs = getSchemaRefs(schema, refs);

}

module.exports = {
  walkJSONSchema,
};
