
const opts = {
  body: {
    $id: 'csi-name-visits',
    type: 'object',
    properties: {
      name: {type: 'string'},
      visits: {type: 'integer'}
    }
  }
};

//
// reference portions of a schema defined elsewhere.
// also use the "alphanum" format that was added.
//
// test with something like:
// curl -H 'Content-type: application/json' -X POST -d '["bruce", "1954-04-22", "xyzz@23"]' localhost:3000/array
// varying the elements of the array to generate errors or not.
// or
// curl -H 'Content-type: application/json' -X POST -d '{"name": "bruce", "visits": 9}' localhost:3000/
//
const arrayOpts = {
  body: {
    $id: 'csi-arrayWithRef',
    type: 'array',
    items: [
      {$ref: 'myPrivateSchema#/properties/text'},
      {$ref: 'myPrivateSchema#/properties/date'},
      {type: 'string', format: 'alphanum'},
    ],
  },
};

async function routes (fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  });
  fastify.post('/', {schema: opts}, async (request, reply) => {
    const {name, visits} = request.body;
    return {hello: name, visits};
  });
  fastify.post('/array', {schema: arrayOpts}, async(request, reply) => {
    const textArray = request.body;
    return {echo: textArray};
  });
}

module.exports = routes;
