'use strict';

/* eslint-disable */

/**
const arrayWithValidation = {
  $id: 'arrayWithValidation',
  type: 'array',
  items: [
    {type: 'string'}, {type: 'string'},
  ],
  //const: ['xyzzy', 123],
  enum: [['a', 'b'], ['c', 'd']],
};
 */

function validate10 (
  data,
  {instancePath = "", parentData, parentDataProperty, rootData = data} = {}
) {
  let vErrors = null;
  let errors = 0;
  if (!func0(data, schema11.const)) {
    validate10.errors = [
      {
        instancePath,
        schemaPath: "#/const",
        keyword: "const",
        params: {allowedValue: schema11.const},
        message: "must be equal to constant"
      }
    ];
    return false;
  } else {
    const vSchema0 = schema11.enum;
    if (!(func0(data, vSchema0[0]) || func0(data, vSchema0[1]))) {
      validate10.errors = [
        {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: {allowedValues: schema11.enum},
          message: "must be equal to one of the allowed values"
        }
      ];
      return false;
    }
  }
  if (errors === 0) {
    if (Array.isArray(data)) {
      const len0 = data.length;
      if (len0 > 0) {
        const _errs1 = errors;
        if (typeof data[0] !== "string") {
          validate10.errors = [
            {
              instancePath: instancePath + "/0",
              schemaPath: "#/items/0/type",
              keyword: "type",
              params: {type: "string"},
              message: "must be string"
            }
          ];
          return false;
        }
        var valid0 = _errs1 === errors;
      }
      if (valid0) {
        if (len0 > 1) {
          const _errs3 = errors;
          if (typeof data[1] !== "string") {
            validate10.errors = [
              {
                instancePath: instancePath + "/1",
                schemaPath: "#/items/1/type",
                keyword: "type",
                params: {type: "string"},
                message: "must be string"
              }
            ];
            return false;
          }
          var valid0 = _errs3 === errors;
        }
      }
    } else {
      validate10.errors = [
        {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {type: "array"},
          message: "must be array"
        }
      ];
      return false;
    }
  }
  validate10.errors = vErrors;
  return errors === 0;
}