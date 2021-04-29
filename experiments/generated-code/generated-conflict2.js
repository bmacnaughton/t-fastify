'use strict';
/* eslint-disable */
// generated from:
/**
  const conflict2 = {
    $id: 'conflict2',
    type: 'object',
    const: {x: 'z'},
    enum: [{x: 'y'}],
  };

  const data = {x: 'z'};

  // fails on enum: 'must be equal to one of the allowed values'
 */

function validate16(
  data,
  { instancePath = "", parentData, parentDataProperty, rootData = data } = {}
) {
  let vErrors = null;
  let errors = 0;
  if (!(data && typeof data == "object" && !Array.isArray(data))) {
    validate16.errors = [
      {
        instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: { type: "object" },
        message: "must be object"
      }
    ];
    return false;
  }
  if (!func0(data, schema19.const)) {
    validate16.errors = [
      {
        instancePath,
        schemaPath: "#/const",
        keyword: "const",
        params: { allowedValue: schema19.const },
        message: "must be equal to constant"
      }
    ];
    return false;
  } else {
    const vSchema0 = schema19.enum;
    if (!func0(data, vSchema0[0])) {
      validate16.errors = [
        {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: { allowedValues: schema19.enum },
          message: "must be equal to one of the allowed values"
        }
      ];
      return false;
    }
  }
  validate16.errors = vErrors;
  return errors === 0;
}
