function validate17 (
  data,
  {instancePath = "", parentData, parentDataProperty, rootData = data} = {}
) {
  let vErrors = null;
  let errors = 0;
  if (!(typeof data == "number" && isFinite(data))) {
    validate17.errors = [
      {
        instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {type: "number"},
        message: "must be number"
      }
    ];
    return false;
  }
  if (!func0(data, "x")) {
    validate17.errors = [
      {
        instancePath,
        schemaPath: "#/const",
        keyword: "const",
        params: {allowedValue: "x"},
        message: "must be equal to constant"
      }
    ];
    return false;
  } else {
    const vSchema0 = schema20.enum;
    if (!func0(data, vSchema0[0])) {
      validate17.errors = [
        {
          instancePath,
          schemaPath: "#/enum",
          keyword: "enum",
          params: {allowedValues: schema20.enum},
          message: "must be equal to one of the allowed values"
        }
      ];
      return false;
    }
  }
  validate17.errors = vErrors;
  return errors === 0;
}