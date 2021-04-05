const bodyJsonSchema = {
  $id: '$bodyJsonSchema',
  type: 'object',
  required: ['requiredKey'],
  properties: {
    someKey: { type: 'string' },
    someOtherKey: { type: 'number' },
    requiredKey: {
      type: 'array',
      maxItems: 3,
      items: { type: 'integer' }
    },
    nullableKey: { type: ['number', 'null'] }, // or { type: 'number', nullable: true }
    multipleTypesKey: { type: ['boolean', 'number'] },
    multipleRestrictedTypesKey: {
      oneOf: [
        { type: 'string', maxLength: 5 },
        { type: 'number', minimum: 10 }
      ]
    },
    enumKey: {
      type: 'string',
      enum: ['John', 'Foo']
    },
    notTypeKey: {
      not: { type: 'array' }
    }
  }
};

const queryStringJsonSchema = {
  $id: 'queryStringJsonSchema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    excitement: { type: 'integer' }
  }
}

const paramsJsonSchema = {
  $id: 'paramsJsonSchema',
  type: 'object',
  properties: {
    par1: { type: 'string' },
    par2: { type: 'number', nullable: true },
  },
};

const headersJsonSchema = {
  $id: 'headersJsonSchema',
  type: 'object',
  properties: {
    'x-foo': { type: 'string' }
  },
  required: ['x-foo']
}

const schema = {
  body: bodyJsonSchema,
  querystring: queryStringJsonSchema,
  params: paramsJsonSchema,
  headers: headersJsonSchema
}

async function routes (fastify, options) {
  fastify.post('/secret/path', {schema}, async (req, reply) => {
    return {
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    };
  });

  fastify.post('/secret/path/:par1/:par2', {schema: {params: paramsJsonSchema}}, async (req, res) => {
    return {
      params: req.params
    };
  })
}

module.exports = routes;
