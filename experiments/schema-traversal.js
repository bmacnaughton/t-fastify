'use strict';

/* eslint-disable no-console */


let schemaDepth = 0;
let lastJSONPtr = -1;     // impossible value
let state = 'root';

function homeGrown(schema, JSONPtr, rootSchema, parentJSONPtr, parentKeyword, parentSchema, indexProp) {
  let prefix = '';
  switch (state) {
    case 'root': {
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
    }
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

module.exports = {
  homeGrown,
};
