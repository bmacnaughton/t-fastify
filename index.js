'use strict';

/* eslint-disable no-console */

const util = require('util');

const fastify = require('fastify')({
  logger: true
});
const Ajv = require('ajv');

// create an ajv instance rather than using fastify's internal
// instance.
const ajv = new Ajv({
  remoteAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  nullable: true,
});
require('ajv-formats')(ajv);

//
// add a keyword that could be used for adding tags
//
ajv.addKeyword({
  keyword: 'csi-tags',
  type: 'string',
  //schema: false, (2 args: bruce, dataCxt: DataValidationCxt)
  //schema: true, {4 args: value of csi-tags property, value being evaluated,
  //  schema-for-validation, e.g., "{type: string, csi-tags: '+trusted'}"},
  //  dataCxt}
  // schema is the data being validated, data is the context it's being
  // validated within (instancePath, parentData, parentDataProperty, rootData)
  validate(tagValue, data, schema, dataCxt) {
    debugger
    console.log(`[CSI-TAGS: ${data} AGAINST ${fmt(tagValue)} FOR ${fmt(schema)}]`);
    // return boolean or promise if async
    return data.startsWith('bruce');
  },
  errors: false,
});

function fmt(thing) {
  const options = {
    depth: Infinity,
    maxArrayLength: Infinity,
    breakLength: Infinity,
    compact: true,
  };
  return util.inspect(thing, options);
}

// tell fastify to use our instance of ajv for compilation so we
// can work with methods that fastify doesn't provide access to,
// like `addFormat()` and `addKeyword()`.
fastify.setValidatorCompiler((obj) => {
  return ajv.compile(obj.schema);
});

// now "patch" ajv so we can check the validator's result. this is
// part of what the agent will need to do when patching Ajv.
const original = ajv._compileSchemaEnv;

ajv._compileSchemaEnv = function(schemaEnv) {
  const name = schemaEnv.schema.$id || 'no-id';
  console.log(`[COMPILING: ${name}]`);
  const validator = original.call(ajv, schemaEnv);

  const wrappedValidator = function(...args) {
    console.log(`[VALIDATING ${fmt(args[0])} AGAINST ${fmt(validator.schema)})}]`);
    const xyzzy = schemaEnv; debugger;
    const result = validator(...args);
    // if the errors aren't propagated then ajv ignores the fact that
    // the validator returns false.
    wrappedValidator.errors = validator.errors;
    return result;
  };

  return wrappedValidator;
};

//
// make a target for a $ref.
//
// myPrivateSchema is $ref'd by arrayOpts in hello-world.js
//
ajv.addSchema({
  $id: 'myPrivateSchema',
  type: 'object',
  properties: {
    text: {type: 'string', 'csi-tags': '+trusted', maxLength: 6},
    date: {type: 'string', format: 'date'},
  },
});

// create a format
ajv.addFormat('alphanum', {
  //validate: /^[A-Za-z0-9]*$/,
  validate(data) {
    const result = /^[A-Za-z0-9]*$/.test(data);
    console.log(`[FORMAT ALPHANUM: ${result}]`);
    return result;
  }
});

// create a keyword. it must be used as "alphanum": true so it meets
// the schema syntax. so maybe it would be better to have something
// like "csi-category": "alphanum" or "numeric" or "sql-clean".
ajv.addKeyword({
  keyword: 'alphanum',
  type: 'string',
  schema: false,
  validate(data, dataCxt) {
    const result = typeof data === 'string' && /^[A-Za-z0-9]*$/.test(data);
    console.log(`[ALPHANUM: ${data}: ${result}]`);
    return result;
  },
  errors: false,
})

//
// run fastify
//
fastify.register(require('./routes/hello-world'));
fastify.register(require('./routes/validations'));

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
