'use strict';

// withPatternProps
/* eslint-disable */

"use strict";

// this has properties and patternProperties.
// the code checks properties followed by patternProperties, so if they contradict one
// another the validation will always fail.

/**
 * schema generating this code:
 *
  const withPatternProps = {
  $id: 'withPatternProps',
  type: 'object',
  properties: {
    prop1: {type: 'string'},
  },
  patternProperties: {
    '^propX$': {type: 'number'},
  },
};
 */
function validate21 (
  data,
  {instancePath = "", parentData, parentDataProperty, rootData = data} = {}
) {
  let vErrors = null;
  let errors = 0;
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      if (data.prop1 !== undefined) {
        const _errs1 = errors;
        if (typeof data.prop1 !== "string") {
          validate21.errors = [
            {
              instancePath: instancePath + "/prop1",
              schemaPath: "#/properties/prop1/type",
              keyword: "type",
              params: {type: "string"},
              message: "must be string"
            }
          ];
          return false;
        }
        var valid0 = _errs1 === errors;
      } else {
        var valid0 = true;
      }
      if (valid0) {
        var valid1 = true;
        for (const key0 in data) {
          if (pattern0.test(key0)) {
            let data1 = data[key0];
            const _errs3 = errors;
            if (!(typeof data1 == "number" && isFinite(data1))) {
              validate21.errors = [
                {
                  instancePath:
                    instancePath +
                    "/" +
                    key0.replace(/~/g, "~0").replace(/\//g, "~1"),
                  schemaPath: "#/patternProperties/%5EpropX%24/type",
                  keyword: "type",
                  params: {type: "number"},
                  message: "must be number"
                }
              ];
              return false;
            }
            var valid1 = _errs3 === errors;
            if (!valid1) {
              break;
            }
          }
        }
      }
    } else {
      validate21.errors = [
        {
          instancePath,
          schemaPath: "#/type",
          keyword: "type",
          params: {type: "object"},
          message: "must be object"
        }
      ];
      return false;
    }
  }
  validate21.errors = vErrors;
  return errors === 0;
}
