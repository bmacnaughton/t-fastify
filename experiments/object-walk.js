'use strict';

// https://stackoverflow.com/questions/722668/traverse-all-the-nodes-of-a-json-object-tree-with-javascript

// the presumption is that this code will be walking the result of parsing
// a JSON object. it should not need to handle all types of JavaScript value,
// only those that can be represented as JSON. if that changes then this can
// add support for set, map, etc.

function* objectWalk(o) {
  const memory = new Set();

  function* innerWalk (o) {
    // make sure not to loop on self-referential objects
    if(memory.has(o)) {
      return;
    }
    memory.add(o);

    for (var key of Object.keys(o)) {
      yield [o, key];

      // check type first as null is far less common.
      if (typeof o[key] === 'object' && o[key]) {
        yield* innerWalk(o[key]);
      }
    }
  }
  yield* innerWalk(o);
}

module.exports = objectWalk;

//your object
var o = {
  foo: 'bar',
  arr:[1, 2, 'three'],
  subo: {
    foo2: 'bar2'
  }
};

// make self-referential
o.o = o;

//that's all... no magic, no bloated framework
for (const [object, key] of objectWalk(o)) {
  if (typeof object[key] === 'string') {
    console.log(`action on ${key}:${object[key]} in`, object);
  }
}