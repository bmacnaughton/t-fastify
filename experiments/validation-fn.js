function validate0 (
  data,
  {instancePath = "", parentData, parentDataProperty, rootData = data} = {}
) {
  let vErrors = null;
  let errors = 0;
  if (
    !(data && typeof data == "object" && !Array.isArray(data)) &&
    typeof data !== "boolean"
  ) {
    validate0.errors = [
      {
        instancePath,
        schemaPath: "#/type",
        keyword: "type",
        params: {type: schema0.type},
        message: "must be object,boolean"
      }
    ];
    return false;
  }
  if (errors === 0) {
    if (data && typeof data == "object" && !Array.isArray(data)) {
      if (data.$id !== undefined) {
        const _errs1 = errors;
        if (errors === _errs1) {
          if (errors === _errs1) {
            if (!(typeof data.$id === "string")) {
              validate0.errors = [
                {
                  instancePath: instancePath + "/$id",
                  schemaPath: "#/properties/%24id/type",
                  keyword: "type",
                  params: {type: "string"},
                  message: "must be string"
                }
              ];
              return false;
            }
          }
        }
        var valid0 = _errs1 === errors;
      } else {
        var valid0 = true;
      }
      if (valid0) {
        if (data.$schema !== undefined) {
          const _errs3 = errors;
          if (errors === _errs3) {
            if (errors === _errs3) {
              if (!(typeof data.$schema === "string")) {
                validate0.errors = [
                  {
                    instancePath: instancePath + "/$schema",
                    schemaPath: "#/properties/%24schema/type",
                    keyword: "type",
                    params: {type: "string"},
                    message: "must be string"
                  }
                ];
                return false;
              }
            }
          }
          var valid0 = _errs3 === errors;
        } else {
          var valid0 = true;
        }
        if (valid0) {
          if (data.$ref !== undefined) {
            const _errs5 = errors;
            if (errors === _errs5) {
              if (errors === _errs5) {
                if (!(typeof data.$ref === "string")) {
                  validate0.errors = [
                    {
                      instancePath: instancePath + "/$ref",
                      schemaPath: "#/properties/%24ref/type",
                      keyword: "type",
                      params: {type: "string"},
                      message: "must be string"
                    }
                  ];
                  return false;
                }
              }
            }
            var valid0 = _errs5 === errors;
          } else {
            var valid0 = true;
          }
          if (valid0) {
            if (data.$comment !== undefined) {
              const _errs7 = errors;
              if (typeof data.$comment !== "string") {
                validate0.errors = [
                  {
                    instancePath: instancePath + "/$comment",
                    schemaPath: "#/properties/%24comment/type",
                    keyword: "type",
                    params: {type: "string"},
                    message: "must be string"
                  }
                ];
                return false;
              }
              var valid0 = _errs7 === errors;
            } else {
              var valid0 = true;
            }
            if (valid0) {
              if (data.title !== undefined) {
                const _errs9 = errors;
                if (typeof data.title !== "string") {
                  validate0.errors = [
                    {
                      instancePath: instancePath + "/title",
                      schemaPath: "#/properties/title/type",
                      keyword: "type",
                      params: {type: "string"},
                      message: "must be string"
                    }
                  ];
                  return false;
                }
                var valid0 = _errs9 === errors;
              } else {
                var valid0 = true;
              }
              if (valid0) {
                if (data.description !== undefined) {
                  const _errs11 = errors;
                  if (typeof data.description !== "string") {
                    validate0.errors = [
                      {
                        instancePath: instancePath + "/description",
                        schemaPath: "#/properties/description/type",
                        keyword: "type",
                        params: {type: "string"},
                        message: "must be string"
                      }
                    ];
                    return false;
                  }
                  var valid0 = _errs11 === errors;
                } else {
                  var valid0 = true;
                }
                if (valid0) {
                  if (data.readOnly !== undefined) {
                    const _errs13 = errors;
                    if (typeof data.readOnly !== "boolean") {
                      validate0.errors = [
                        {
                          instancePath: instancePath + "/readOnly",
                          schemaPath: "#/properties/readOnly/type",
                          keyword: "type",
                          params: {type: "boolean"},
                          message: "must be boolean"
                        }
                      ];
                      return false;
                    }
                    var valid0 = _errs13 === errors;
                  } else {
                    var valid0 = true;
                  }
                  if (valid0) {
                    if (data.examples !== undefined) {
                      const _errs15 = errors;
                      if (errors === _errs15) {
                        if (!Array.isArray(data.examples)) {
                          validate0.errors = [
                            {
                              instancePath: instancePath + "/examples",
                              schemaPath: "#/properties/examples/type",
                              keyword: "type",
                              params: {type: "array"},
                              message: "must be array"
                            }
                          ];
                          return false;
                        }
                      }
                      var valid0 = _errs15 === errors;
                    } else {
                      var valid0 = true;
                    }
                    if (valid0) {
                      if (data.multipleOf !== undefined) {
                        let data8 = data.multipleOf;
                        const _errs17 = errors;
                        if (errors === _errs17) {
                          if (typeof data8 == "number" && isFinite(data8)) {
                            if (data8 <= 0 || isNaN(data8)) {
                              validate0.errors = [
                                {
                                  instancePath: instancePath + "/multipleOf",
                                  schemaPath:
                                    "#/properties/multipleOf/exclusiveMinimum",
                                  keyword: "exclusiveMinimum",
                                  params: {comparison: ">", limit: 0},
                                  message: "must be > 0"
                                }
                              ];
                              return false;
                            }
                          } else {
                            validate0.errors = [
                              {
                                instancePath: instancePath + "/multipleOf",
                                schemaPath: "#/properties/multipleOf/type",
                                keyword: "type",
                                params: {type: "number"},
                                message: "must be number"
                              }
                            ];
                            return false;
                          }
                        }
                        var valid0 = _errs17 === errors;
                      } else {
                        var valid0 = true;
                      }
                      if (valid0) {
                        if (data.maximum !== undefined) {
                          let data9 = data.maximum;
                          const _errs19 = errors;
                          if (!(typeof data9 == "number" && isFinite(data9))) {
                            validate0.errors = [
                              {
                                instancePath: instancePath + "/maximum",
                                schemaPath: "#/properties/maximum/type",
                                keyword: "type",
                                params: {type: "number"},
                                message: "must be number"
                              }
                            ];
                            return false;
                          }
                          var valid0 = _errs19 === errors;
                        } else {
                          var valid0 = true;
                        }
                        if (valid0) {
                          if (data.exclusiveMaximum !== undefined) {
                            let data10 = data.exclusiveMaximum;
                            const _errs21 = errors;
                            if (
                              !(typeof data10 == "number" && isFinite(data10))
                            ) {
                              validate0.errors = [
                                {
                                  instancePath:
                                    instancePath + "/exclusiveMaximum",
                                  schemaPath:
                                    "#/properties/exclusiveMaximum/type",
                                  keyword: "type",
                                  params: {type: "number"},
                                  message: "must be number"
                                }
                              ];
                              return false;
                            }
                            var valid0 = _errs21 === errors;
                          } else {
                            var valid0 = true;
                          }
                          if (valid0) {
                            if (data.minimum !== undefined) {
                              let data11 = data.minimum;
                              const _errs23 = errors;
                              if (
                                !(typeof data11 == "number" && isFinite(data11))
                              ) {
                                validate0.errors = [
                                  {
                                    instancePath: instancePath + "/minimum",
                                    schemaPath: "#/properties/minimum/type",
                                    keyword: "type",
                                    params: {type: "number"},
                                    message: "must be number"
                                  }
                                ];
                                return false;
                              }
                              var valid0 = _errs23 === errors;
                            } else {
                              var valid0 = true;
                            }
                            if (valid0) {
                              if (data.exclusiveMinimum !== undefined) {
                                let data12 = data.exclusiveMinimum;
                                const _errs25 = errors;
                                if (
                                  !(
                                    typeof data12 == "number" &&
                                    isFinite(data12)
                                  )
                                ) {
                                  validate0.errors = [
                                    {
                                      instancePath:
                                        instancePath + "/exclusiveMinimum",
                                      schemaPath:
                                        "#/properties/exclusiveMinimum/type",
                                      keyword: "type",
                                      params: {type: "number"},
                                      message: "must be number"
                                    }
                                  ];
                                  return false;
                                }
                                var valid0 = _errs25 === errors;
                              } else {
                                var valid0 = true;
                              }
                              if (valid0) {
                                if (data.maxLength !== undefined) {
                                  let data13 = data.maxLength;
                                  const _errs27 = errors;
                                  const _errs28 = errors;
                                  if (
                                    !(
                                      typeof data13 == "number" &&
                                      !(data13 % 1) && !isNaN(data13) &&
                                      isFinite(data13)
                                    )
                                  ) {
                                    validate0.errors = [
                                      {
                                        instancePath:
                                          instancePath + "/maxLength",
                                        schemaPath:
                                          "#/definitions/nonNegativeInteger/type",
                                        keyword: "type",
                                        params: {type: "integer"},
                                        message: "must be integer"
                                      }
                                    ];
                                    return false;
                                  }
                                  if (errors === _errs28) {
                                    if (
                                      typeof data13 == "number" &&
                                      isFinite(data13)
                                    ) {
                                      if (data13 < 0 || isNaN(data13)) {
                                        validate0.errors = [
                                          {
                                            instancePath:
                                              instancePath + "/maxLength",
                                            schemaPath:
                                              "#/definitions/nonNegativeInteger/minimum",
                                            keyword: "minimum",
                                            params: {
                                              comparison: ">=",
                                              limit: 0
                                            },
                                            message: "must be >= 0"
                                          }
                                        ];
                                        return false;
                                      }
                                    }
                                  }
                                  var valid0 = _errs27 === errors;
                                } else {
                                  var valid0 = true;
                                }
                                if (valid0) {
                                  if (data.minLength !== undefined) {
                                    const _errs30 = errors;
                                    if (
                                      !validate1(data.minLength, {
                                        instancePath:
                                          instancePath + "/minLength",
                                        parentData: data,
                                        parentDataProperty: "minLength",
                                        rootData
                                      })
                                    ) {
                                      vErrors =
                                        vErrors === null
                                          ? validate1.errors
                                          : vErrors.concat(validate1.errors);
                                      errors = vErrors.length;
                                    }
                                    var valid0 = _errs30 === errors;
                                  } else {
                                    var valid0 = true;
                                  }
                                  if (valid0) {
                                    if (data.pattern !== undefined) {
                                      const _errs31 = errors;
                                      if (errors === _errs31) {
                                        if (errors === _errs31) {
                                          if (
                                            !(typeof data.pattern === "string")
                                          ) {
                                            validate0.errors = [
                                              {
                                                instancePath:
                                                  instancePath + "/pattern",
                                                schemaPath:
                                                  "#/properties/pattern/type",
                                                keyword: "type",
                                                params: {type: "string"},
                                                message: "must be string"
                                              }
                                            ];
                                            return false;
                                          }
                                        }
                                      }
                                      var valid0 = _errs31 === errors;
                                    } else {
                                      var valid0 = true;
                                    }
                                    if (valid0) {
                                      if (data.additionalItems !== undefined) {
                                        const _errs33 = errors;
                                        if (
                                          !validate0(data.additionalItems, {
                                            instancePath:
                                              instancePath + "/additionalItems",
                                            parentData: data,
                                            parentDataProperty:
                                              "additionalItems",
                                            rootData
                                          })
                                        ) {
                                          vErrors =
                                            vErrors === null
                                              ? validate0.errors
                                              : vErrors.concat(
                                                validate0.errors
                                              );
                                          errors = vErrors.length;
                                        }
                                        var valid0 = _errs33 === errors;
                                      } else {
                                        var valid0 = true;
                                      }
                                      if (valid0) {
                                        if (data.items !== undefined) {
                                          let data17 = data.items;
                                          const _errs34 = errors;
                                          const _errs35 = errors;
                                          let valid2 = false;
                                          const _errs36 = errors;
                                          if (
                                            !validate0(data17, {
                                              instancePath:
                                                instancePath + "/items",
                                              parentData: data,
                                              parentDataProperty: "items",
                                              rootData
                                            })
                                          ) {
                                            vErrors =
                                              vErrors === null
                                                ? validate0.errors
                                                : vErrors.concat(
                                                  validate0.errors
                                                );
                                            errors = vErrors.length;
                                          }
                                          var _valid0 = _errs36 === errors;
                                          valid2 = valid2 || _valid0;
                                          if (!valid2) {
                                            const _errs37 = errors;
                                            if (
                                              !validate3(data17, {
                                                instancePath:
                                                  instancePath + "/items",
                                                parentData: data,
                                                parentDataProperty: "items",
                                                rootData
                                              })
                                            ) {
                                              vErrors =
                                                vErrors === null
                                                  ? validate3.errors
                                                  : vErrors.concat(
                                                    validate3.errors
                                                  );
                                              errors = vErrors.length;
                                            }
                                            var _valid0 = _errs37 === errors;
                                            valid2 = valid2 || _valid0;
                                          }
                                          if (!valid2) {
                                            const err0 = {
                                              instancePath:
                                                instancePath + "/items",
                                              schemaPath:
                                                "#/properties/items/anyOf",
                                              keyword: "anyOf",
                                              params: {},
                                              message:
                                                "must match a schema in anyOf"
                                            };
                                            if (vErrors === null) {
                                              vErrors = [err0];
                                            } else {
                                              vErrors.push(err0);
                                            }
                                            errors++;
                                            validate0.errors = vErrors;
                                            return false;
                                          } else {
                                            errors = _errs35;
                                            if (vErrors !== null) {
                                              if (_errs35) {
                                                vErrors.length = _errs35;
                                              } else {
                                                vErrors = null;
                                              }
                                            }
                                          }
                                          var valid0 = _errs34 === errors;
                                        } else {
                                          var valid0 = true;
                                        }
                                        if (valid0) {
                                          if (data.maxItems !== undefined) {
                                            let data18 = data.maxItems;
                                            const _errs38 = errors;
                                            const _errs39 = errors;
                                            if (
                                              !(
                                                typeof data18 == "number" &&
                                                !(data18 % 1) &&
                                                !isNaN(data18) &&
                                                isFinite(data18)
                                              )
                                            ) {
                                              validate0.errors = [
                                                {
                                                  instancePath:
                                                    instancePath + "/maxItems",
                                                  schemaPath:
                                                    "#/definitions/nonNegativeInteger/type",
                                                  keyword: "type",
                                                  params: {type: "integer"},
                                                  message: "must be integer"
                                                }
                                              ];
                                              return false;
                                            }
                                            if (errors === _errs39) {
                                              if (
                                                typeof data18 == "number" &&
                                                isFinite(data18)
                                              ) {
                                                if (
                                                  data18 < 0 ||
                                                  isNaN(data18)
                                                ) {
                                                  validate0.errors = [
                                                    {
                                                      instancePath:
                                                        instancePath +
                                                        "/maxItems",
                                                      schemaPath:
                                                        "#/definitions/nonNegativeInteger/minimum",
                                                      keyword: "minimum",
                                                      params: {
                                                        comparison: ">=",
                                                        limit: 0
                                                      },
                                                      message: "must be >= 0"
                                                    }
                                                  ];
                                                  return false;
                                                }
                                              }
                                            }
                                            var valid0 = _errs38 === errors;
                                          } else {
                                            var valid0 = true;
                                          }
                                          if (valid0) {
                                            if (data.minItems !== undefined) {
                                              const _errs41 = errors;
                                              if (
                                                !validate1(data.minItems, {
                                                  instancePath:
                                                    instancePath + "/minItems",
                                                  parentData: data,
                                                  parentDataProperty:
                                                    "minItems",
                                                  rootData
                                                })
                                              ) {
                                                vErrors =
                                                  vErrors === null
                                                    ? validate1.errors
                                                    : vErrors.concat(
                                                      validate1.errors
                                                    );
                                                errors = vErrors.length;
                                              }
                                              var valid0 = _errs41 === errors;
                                            } else {
                                              var valid0 = true;
                                            }
                                            if (valid0) {
                                              if (
                                                data.uniqueItems !== undefined
                                              ) {
                                                const _errs42 = errors;
                                                if (
                                                  typeof data.uniqueItems !==
                                                  "boolean"
                                                ) {
                                                  validate0.errors = [
                                                    {
                                                      instancePath:
                                                        instancePath +
                                                        "/uniqueItems",
                                                      schemaPath:
                                                        "#/properties/uniqueItems/type",
                                                      keyword: "type",
                                                      params: {
                                                        type: "boolean"
                                                      },
                                                      message: "must be boolean"
                                                    }
                                                  ];
                                                  return false;
                                                }
                                                var valid0 = _errs42 === errors;
                                              } else {
                                                var valid0 = true;
                                              }
                                              if (valid0) {
                                                if (
                                                  data.contains !== undefined
                                                ) {
                                                  const _errs44 = errors;
                                                  if (
                                                    !validate0(data.contains, {
                                                      instancePath:
                                                        instancePath +
                                                        "/contains",
                                                      parentData: data,
                                                      parentDataProperty:
                                                        "contains",
                                                      rootData
                                                    })
                                                  ) {
                                                    vErrors =
                                                      vErrors === null
                                                        ? validate0.errors
                                                        : vErrors.concat(
                                                          validate0.errors
                                                        );
                                                    errors = vErrors.length;
                                                  }
                                                  var valid0 =
                                                    _errs44 === errors;
                                                } else {
                                                  var valid0 = true;
                                                }
                                                if (valid0) {
                                                  if (
                                                    data.maxProperties !==
                                                    undefined
                                                  ) {
                                                    let data22 =
                                                      data.maxProperties;
                                                    const _errs45 = errors;
                                                    const _errs46 = errors;
                                                    if (
                                                      !(
                                                        typeof data22 ==
                                                        "number" &&
                                                        !(data22 % 1) &&
                                                        !isNaN(data22) &&
                                                        isFinite(data22)
                                                      )
                                                    ) {
                                                      validate0.errors = [
                                                        {
                                                          instancePath:
                                                            instancePath +
                                                            "/maxProperties",
                                                          schemaPath:
                                                            "#/definitions/nonNegativeInteger/type",
                                                          keyword: "type",
                                                          params: {
                                                            type: "integer"
                                                          },
                                                          message:
                                                            "must be integer"
                                                        }
                                                      ];
                                                      return false;
                                                    }
                                                    if (errors === _errs46) {
                                                      if (
                                                        typeof data22 ==
                                                        "number" &&
                                                        isFinite(data22)
                                                      ) {
                                                        if (
                                                          data22 < 0 ||
                                                          isNaN(data22)
                                                        ) {
                                                          validate0.errors = [
                                                            {
                                                              instancePath:
                                                                instancePath +
                                                                "/maxProperties",
                                                              schemaPath:
                                                                "#/definitions/nonNegativeInteger/minimum",
                                                              keyword:
                                                                "minimum",
                                                              params: {
                                                                comparison:
                                                                  ">=",
                                                                limit: 0
                                                              },
                                                              message:
                                                                "must be >= 0"
                                                            }
                                                          ];
                                                          return false;
                                                        }
                                                      }
                                                    }
                                                    var valid0 =
                                                      _errs45 === errors;
                                                  } else {
                                                    var valid0 = true;
                                                  }
                                                  if (valid0) {
                                                    if (
                                                      data.minProperties !==
                                                      undefined
                                                    ) {
                                                      const _errs48 = errors;
                                                      if (
                                                        !validate1(
                                                          data.minProperties,
                                                          {
                                                            instancePath:
                                                              instancePath +
                                                              "/minProperties",
                                                            parentData: data,
                                                            parentDataProperty:
                                                              "minProperties",
                                                            rootData
                                                          }
                                                        )
                                                      ) {
                                                        vErrors =
                                                          vErrors === null
                                                            ? validate1.errors
                                                            : vErrors.concat(
                                                              validate1.errors
                                                            );
                                                        errors = vErrors.length;
                                                      }
                                                      var valid0 =
                                                        _errs48 === errors;
                                                    } else {
                                                      var valid0 = true;
                                                    }
                                                    if (valid0) {
                                                      if (
                                                        data.required !==
                                                        undefined
                                                      ) {
                                                        let data24 =
                                                          data.required;
                                                        const _errs49 = errors;
                                                        const _errs50 = errors;
                                                        if (
                                                          errors === _errs50
                                                        ) {
                                                          if (
                                                            Array.isArray(
                                                              data24
                                                            )
                                                          ) {
                                                            var valid6 = true;
                                                            const len0 =
                                                              data24.length;
                                                            for (
                                                              let i0 = 0;
                                                              i0 < len0;
                                                              i0++
                                                            ) {
                                                              const _errs52 = errors;
                                                              if (
                                                                typeof data24[
                                                                i0
                                                                ] !== "string"
                                                              ) {
                                                                validate0.errors = [
                                                                  {
                                                                    instancePath:
                                                                      instancePath +
                                                                      "/required/" +
                                                                      i0,
                                                                    schemaPath:
                                                                      "#/definitions/stringArray/items/type",
                                                                    keyword:
                                                                      "type",
                                                                    params: {
                                                                      type:
                                                                        "string"
                                                                    },
                                                                    message:
                                                                      "must be string"
                                                                  }
                                                                ];
                                                                return false;
                                                              }
                                                              var valid6 =
                                                                _errs52 ===
                                                                errors;
                                                              if (!valid6) {
                                                                break;
                                                              }
                                                            }
                                                            if (valid6) {
                                                              let i1 =
                                                                data24.length;
                                                              let j0;
                                                              if (i1 > 1) {
                                                                const indices0 = {};
                                                                for (; i1--;) {
                                                                  let item0 =
                                                                    data24[i1];
                                                                  if (
                                                                    typeof item0 !==
                                                                    "string"
                                                                  ) {
                                                                    continue;
                                                                  }
                                                                  if (
                                                                    typeof indices0[
                                                                    item0
                                                                    ] ==
                                                                    "number"
                                                                  ) {
                                                                    j0 =
                                                                      indices0[
                                                                      item0
                                                                      ];
                                                                    validate0.errors = [
                                                                      {
                                                                        instancePath:
                                                                          instancePath +
                                                                          "/required",
                                                                        schemaPath:
                                                                          "#/definitions/stringArray/uniqueItems",
                                                                        keyword:
                                                                          "uniqueItems",
                                                                        params: {
                                                                          i: i1,
                                                                          j: j0
                                                                        },
                                                                        message:
                                                                          "must NOT have duplicate items (items ## " +
                                                                          j0 +
                                                                          " and " +
                                                                          i1 +
                                                                          " are identical)"
                                                                      }
                                                                    ];
                                                                    return false;
                                                                    break;
                                                                  }
                                                                  indices0[
                                                                    item0
                                                                  ] = i1;
                                                                }
                                                              }
                                                            }
                                                          } else {
                                                            validate0.errors = [
                                                              {
                                                                instancePath:
                                                                  instancePath +
                                                                  "/required",
                                                                schemaPath:
                                                                  "#/definitions/stringArray/type",
                                                                keyword: "type",
                                                                params: {
                                                                  type: "array"
                                                                },
                                                                message:
                                                                  "must be array"
                                                              }
                                                            ];
                                                            return false;
                                                          }
                                                        }
                                                        var valid0 =
                                                          _errs49 === errors;
                                                      } else {
                                                        var valid0 = true;
                                                      }
                                                      if (valid0) {
                                                        if (
                                                          data.additionalProperties !==
                                                          undefined
                                                        ) {
                                                          const _errs54 = errors;
                                                          if (
                                                            !validate0(
                                                              data.additionalProperties,
                                                              {
                                                                instancePath:
                                                                  instancePath +
                                                                  "/additionalProperties",
                                                                parentData: data,
                                                                parentDataProperty:
                                                                  "additionalProperties",
                                                                rootData
                                                              }
                                                            )
                                                          ) {
                                                            vErrors =
                                                              vErrors === null
                                                                ? validate0.errors
                                                                : vErrors.concat(
                                                                  validate0.errors
                                                                );
                                                            errors =
                                                              vErrors.length;
                                                          }
                                                          var valid0 =
                                                            _errs54 === errors;
                                                        } else {
                                                          var valid0 = true;
                                                        }
                                                        if (valid0) {
                                                          if (
                                                            data.definitions !==
                                                            undefined
                                                          ) {
                                                            let data27 =
                                                              data.definitions;
                                                            const _errs55 = errors;
                                                            if (
                                                              errors === _errs55
                                                            ) {
                                                              if (
                                                                data27 &&
                                                                typeof data27 ==
                                                                "object" &&
                                                                !Array.isArray(
                                                                  data27
                                                                )
                                                              ) {
                                                                for (const key0 in data27) {
                                                                  const _errs58 = errors;
                                                                  if (
                                                                    !validate0(
                                                                      data27[
                                                                      key0
                                                                      ],
                                                                      {
                                                                        instancePath:
                                                                          instancePath +
                                                                          "/definitions/" +
                                                                          key0
                                                                            .replace(
                                                                              /~/g,
                                                                              "~0"
                                                                            )
                                                                            .replace(
                                                                              /\//g,
                                                                              "~1"
                                                                            ),
                                                                        parentData: data27,
                                                                        parentDataProperty: key0,
                                                                        rootData
                                                                      }
                                                                    )
                                                                  ) {
                                                                    vErrors =
                                                                      vErrors ===
                                                                        null
                                                                        ? validate0.errors
                                                                        : vErrors.concat(
                                                                          validate0.errors
                                                                        );
                                                                    errors =
                                                                      vErrors.length;
                                                                  }
                                                                  var valid8 =
                                                                    _errs58 ===
                                                                    errors;
                                                                  if (!valid8) {
                                                                    break;
                                                                  }
                                                                }
                                                              } else {
                                                                validate0.errors = [
                                                                  {
                                                                    instancePath:
                                                                      instancePath +
                                                                      "/definitions",
                                                                    schemaPath:
                                                                      "#/properties/definitions/type",
                                                                    keyword:
                                                                      "type",
                                                                    params: {
                                                                      type:
                                                                        "object"
                                                                    },
                                                                    message:
                                                                      "must be object"
                                                                  }
                                                                ];
                                                                return false;
                                                              }
                                                            }
                                                            var valid0 =
                                                              _errs55 ===
                                                              errors;
                                                          } else {
                                                            var valid0 = true;
                                                          }
                                                          if (valid0) {
                                                            if (
                                                              data.properties !==
                                                              undefined
                                                            ) {
                                                              let data29 =
                                                                data.properties;
                                                              const _errs59 = errors;
                                                              if (
                                                                errors ===
                                                                _errs59
                                                              ) {
                                                                if (
                                                                  data29 &&
                                                                  typeof data29 ==
                                                                  "object" &&
                                                                  !Array.isArray(
                                                                    data29
                                                                  )
                                                                ) {
                                                                  for (const key1 in data29) {
                                                                    const _errs62 = errors;
                                                                    if (
                                                                      !validate0(
                                                                        data29[
                                                                        key1
                                                                        ],
                                                                        {
                                                                          instancePath:
                                                                            instancePath +
                                                                            "/properties/" +
                                                                            key1
                                                                              .replace(
                                                                                /~/g,
                                                                                "~0"
                                                                              )
                                                                              .replace(
                                                                                /\//g,
                                                                                "~1"
                                                                              ),
                                                                          parentData: data29,
                                                                          parentDataProperty: key1,
                                                                          rootData
                                                                        }
                                                                      )
                                                                    ) {
                                                                      vErrors =
                                                                        vErrors ===
                                                                          null
                                                                          ? validate0.errors
                                                                          : vErrors.concat(
                                                                            validate0.errors
                                                                          );
                                                                      errors =
                                                                        vErrors.length;
                                                                    }
                                                                    var valid9 =
                                                                      _errs62 ===
                                                                      errors;
                                                                    if (
                                                                      !valid9
                                                                    ) {
                                                                      break;
                                                                    }
                                                                  }
                                                                } else {
                                                                  validate0.errors = [
                                                                    {
                                                                      instancePath:
                                                                        instancePath +
                                                                        "/properties",
                                                                      schemaPath:
                                                                        "#/properties/properties/type",
                                                                      keyword:
                                                                        "type",
                                                                      params: {
                                                                        type:
                                                                          "object"
                                                                      },
                                                                      message:
                                                                        "must be object"
                                                                    }
                                                                  ];
                                                                  return false;
                                                                }
                                                              }
                                                              var valid0 =
                                                                _errs59 ===
                                                                errors;
                                                            } else {
                                                              var valid0 = true;
                                                            }
                                                            if (valid0) {
                                                              if (
                                                                data.patternProperties !==
                                                                undefined
                                                              ) {
                                                                let data31 =
                                                                  data.patternProperties;
                                                                const _errs63 = errors;
                                                                if (
                                                                  errors ===
                                                                  _errs63
                                                                ) {
                                                                  if (
                                                                    data31 &&
                                                                    typeof data31 ==
                                                                    "object" &&
                                                                    !Array.isArray(
                                                                      data31
                                                                    )
                                                                  ) {
                                                                    for (const key2 in data31) {
                                                                      const _errs65 = errors;
                                                                      var valid10 =
                                                                        _errs65 ===
                                                                        errors;
                                                                      if (
                                                                        !valid10
                                                                      ) {
                                                                        const err1 = {
                                                                          instancePath:
                                                                            instancePath +
                                                                            "/patternProperties",
                                                                          schemaPath:
                                                                            "#/properties/patternProperties/propertyNames",
                                                                          keyword:
                                                                            "propertyNames",
                                                                          params: {
                                                                            propertyName: key2
                                                                          },
                                                                          message:
                                                                            "property name must be valid"
                                                                        };
                                                                        if (
                                                                          vErrors ===
                                                                          null
                                                                        ) {
                                                                          vErrors = [
                                                                            err1
                                                                          ];
                                                                        } else {
                                                                          vErrors.push(
                                                                            err1
                                                                          );
                                                                        }
                                                                        errors++;
                                                                        validate0.errors = vErrors;
                                                                        return false;
                                                                        break;
                                                                      }
                                                                    }
                                                                    if (
                                                                      valid10
                                                                    ) {
                                                                      for (const key3 in data31) {
                                                                        const _errs67 = errors;
                                                                        if (
                                                                          !validate0(
                                                                            data31[
                                                                            key3
                                                                            ],
                                                                            {
                                                                              instancePath:
                                                                                instancePath +
                                                                                "/patternProperties/" +
                                                                                key3
                                                                                  .replace(
                                                                                    /~/g,
                                                                                    "~0"
                                                                                  )
                                                                                  .replace(
                                                                                    /\//g,
                                                                                    "~1"
                                                                                  ),
                                                                              parentData: data31,
                                                                              parentDataProperty: key3,
                                                                              rootData
                                                                            }
                                                                          )
                                                                        ) {
                                                                          vErrors =
                                                                            vErrors ===
                                                                              null
                                                                              ? validate0.errors
                                                                              : vErrors.concat(
                                                                                validate0.errors
                                                                              );
                                                                          errors =
                                                                            vErrors.length;
                                                                        }
                                                                        var valid11 =
                                                                          _errs67 ===
                                                                          errors;
                                                                        if (
                                                                          !valid11
                                                                        ) {
                                                                          break;
                                                                        }
                                                                      }
                                                                    }
                                                                  } else {
                                                                    validate0.errors = [
                                                                      {
                                                                        instancePath:
                                                                          instancePath +
                                                                          "/patternProperties",
                                                                        schemaPath:
                                                                          "#/properties/patternProperties/type",
                                                                        keyword:
                                                                          "type",
                                                                        params: {
                                                                          type:
                                                                            "object"
                                                                        },
                                                                        message:
                                                                          "must be object"
                                                                      }
                                                                    ];
                                                                    return false;
                                                                  }
                                                                }
                                                                var valid0 =
                                                                  _errs63 ===
                                                                  errors;
                                                              } else {
                                                                var valid0 = true;
                                                              }
                                                              if (valid0) {
                                                                if (
                                                                  data.dependencies !==
                                                                  undefined
                                                                ) {
                                                                  let data33 =
                                                                    data.dependencies;
                                                                  const _errs68 = errors;
                                                                  if (
                                                                    errors ===
                                                                    _errs68
                                                                  ) {
                                                                    if (
                                                                      data33 &&
                                                                      typeof data33 ==
                                                                      "object" &&
                                                                      !Array.isArray(
                                                                        data33
                                                                      )
                                                                    ) {
                                                                      for (const key4 in data33) {
                                                                        let data34 =
                                                                          data33[
                                                                          key4
                                                                          ];
                                                                        const _errs71 = errors;
                                                                        const _errs72 = errors;
                                                                        let valid13 = false;
                                                                        const _errs73 = errors;
                                                                        if (
                                                                          !validate0(
                                                                            data34,
                                                                            {
                                                                              instancePath:
                                                                                instancePath +
                                                                                "/dependencies/" +
                                                                                key4
                                                                                  .replace(
                                                                                    /~/g,
                                                                                    "~0"
                                                                                  )
                                                                                  .replace(
                                                                                    /\//g,
                                                                                    "~1"
                                                                                  ),
                                                                              parentData: data33,
                                                                              parentDataProperty: key4,
                                                                              rootData
                                                                            }
                                                                          )
                                                                        ) {
                                                                          vErrors =
                                                                            vErrors ===
                                                                              null
                                                                              ? validate0.errors
                                                                              : vErrors.concat(
                                                                                validate0.errors
                                                                              );
                                                                          errors =
                                                                            vErrors.length;
                                                                        }
                                                                        var _valid1 =
                                                                          _errs73 ===
                                                                          errors;
                                                                        valid13 =
                                                                          valid13 ||
                                                                          _valid1;
                                                                        if (
                                                                          !valid13
                                                                        ) {
                                                                          const _errs74 = errors;
                                                                          const _errs75 = errors;
                                                                          if (
                                                                            errors ===
                                                                            _errs75
                                                                          ) {
                                                                            if (
                                                                              Array.isArray(
                                                                                data34
                                                                              )
                                                                            ) {
                                                                              var valid15 = true;
                                                                              const len1 =
                                                                                data34.length;
                                                                              for (
                                                                                let i2 = 0;
                                                                                i2 <
                                                                                len1;
                                                                                i2++
                                                                              ) {
                                                                                const _errs77 = errors;
                                                                                if (
                                                                                  typeof data34[
                                                                                  i2
                                                                                  ] !==
                                                                                  "string"
                                                                                ) {
                                                                                  const err2 = {
                                                                                    instancePath:
                                                                                      instancePath +
                                                                                      "/dependencies/" +
                                                                                      key4
                                                                                        .replace(
                                                                                          /~/g,
                                                                                          "~0"
                                                                                        )
                                                                                        .replace(
                                                                                          /\//g,
                                                                                          "~1"
                                                                                        ) +
                                                                                      "/" +
                                                                                      i2,
                                                                                    schemaPath:
                                                                                      "#/definitions/stringArray/items/type",
                                                                                    keyword:
                                                                                      "type",
                                                                                    params: {
                                                                                      type:
                                                                                        "string"
                                                                                    },
                                                                                    message:
                                                                                      "must be string"
                                                                                  };
                                                                                  if (
                                                                                    vErrors ===
                                                                                    null
                                                                                  ) {
                                                                                    vErrors = [
                                                                                      err2
                                                                                    ];
                                                                                  } else {
                                                                                    vErrors.push(
                                                                                      err2
                                                                                    );
                                                                                  }
                                                                                  errors++;
                                                                                }
                                                                                var valid15 =
                                                                                  _errs77 ===
                                                                                  errors;
                                                                                if (
                                                                                  !valid15
                                                                                ) {
                                                                                  break;
                                                                                }
                                                                              }
                                                                              if (
                                                                                valid15
                                                                              ) {
                                                                                let i3 =
                                                                                  data34.length;
                                                                                let j1;
                                                                                if (
                                                                                  i3 >
                                                                                  1
                                                                                ) {
                                                                                  const indices1 = {};
                                                                                  for (
                                                                                    ;
                                                                                    i3--;

                                                                                  ) {
                                                                                    let item1 =
                                                                                      data34[
                                                                                      i3
                                                                                      ];
                                                                                    if (
                                                                                      typeof item1 !==
                                                                                      "string"
                                                                                    ) {
                                                                                      continue;
                                                                                    }
                                                                                    if (
                                                                                      typeof indices1[
                                                                                      item1
                                                                                      ] ==
                                                                                      "number"
                                                                                    ) {
                                                                                      j1 =
                                                                                        indices1[
                                                                                        item1
                                                                                        ];
                                                                                      const err3 = {
                                                                                        instancePath:
                                                                                          instancePath +
                                                                                          "/dependencies/" +
                                                                                          key4
                                                                                            .replace(
                                                                                              /~/g,
                                                                                              "~0"
                                                                                            )
                                                                                            .replace(
                                                                                              /\//g,
                                                                                              "~1"
                                                                                            ),
                                                                                        schemaPath:
                                                                                          "#/definitions/stringArray/uniqueItems",
                                                                                        keyword:
                                                                                          "uniqueItems",
                                                                                        params: {
                                                                                          i: i3,
                                                                                          j: j1
                                                                                        },
                                                                                        message:
                                                                                          "must NOT have duplicate items (items ## " +
                                                                                          j1 +
                                                                                          " and " +
                                                                                          i3 +
                                                                                          " are identical)"
                                                                                      };
                                                                                      if (
                                                                                        vErrors ===
                                                                                        null
                                                                                      ) {
                                                                                        vErrors = [
                                                                                          err3
                                                                                        ];
                                                                                      } else {
                                                                                        vErrors.push(
                                                                                          err3
                                                                                        );
                                                                                      }
                                                                                      errors++;
                                                                                      break;
                                                                                    }
                                                                                    indices1[
                                                                                      item1
                                                                                    ] = i3;
                                                                                  }
                                                                                }
                                                                              }
                                                                            } else {
                                                                              const err4 = {
                                                                                instancePath:
                                                                                  instancePath +
                                                                                  "/dependencies/" +
                                                                                  key4
                                                                                    .replace(
                                                                                      /~/g,
                                                                                      "~0"
                                                                                    )
                                                                                    .replace(
                                                                                      /\//g,
                                                                                      "~1"
                                                                                    ),
                                                                                schemaPath:
                                                                                  "#/definitions/stringArray/type",
                                                                                keyword:
                                                                                  "type",
                                                                                params: {
                                                                                  type:
                                                                                    "array"
                                                                                },
                                                                                message:
                                                                                  "must be array"
                                                                              };
                                                                              if (
                                                                                vErrors ===
                                                                                null
                                                                              ) {
                                                                                vErrors = [
                                                                                  err4
                                                                                ];
                                                                              } else {
                                                                                vErrors.push(
                                                                                  err4
                                                                                );
                                                                              }
                                                                              errors++;
                                                                            }
                                                                          }
                                                                          var _valid1 =
                                                                            _errs74 ===
                                                                            errors;
                                                                          valid13 =
                                                                            valid13 ||
                                                                            _valid1;
                                                                        }
                                                                        if (
                                                                          !valid13
                                                                        ) {
                                                                          const err5 = {
                                                                            instancePath:
                                                                              instancePath +
                                                                              "/dependencies/" +
                                                                              key4
                                                                                .replace(
                                                                                  /~/g,
                                                                                  "~0"
                                                                                )
                                                                                .replace(
                                                                                  /\//g,
                                                                                  "~1"
                                                                                ),
                                                                            schemaPath:
                                                                              "#/properties/dependencies/additionalProperties/anyOf",
                                                                            keyword:
                                                                              "anyOf",
                                                                            params: {},
                                                                            message:
                                                                              "must match a schema in anyOf"
                                                                          };
                                                                          if (
                                                                            vErrors ===
                                                                            null
                                                                          ) {
                                                                            vErrors = [
                                                                              err5
                                                                            ];
                                                                          } else {
                                                                            vErrors.push(
                                                                              err5
                                                                            );
                                                                          }
                                                                          errors++;
                                                                          validate0.errors = vErrors;
                                                                          return false;
                                                                        } else {
                                                                          errors = _errs72;
                                                                          if (
                                                                            vErrors !==
                                                                            null
                                                                          ) {
                                                                            if (
                                                                              _errs72
                                                                            ) {
                                                                              vErrors.length = _errs72;
                                                                            } else {
                                                                              vErrors = null;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid12 =
                                                                          _errs71 ===
                                                                          errors;
                                                                        if (
                                                                          !valid12
                                                                        ) {
                                                                          break;
                                                                        }
                                                                      }
                                                                    } else {
                                                                      validate0.errors = [
                                                                        {
                                                                          instancePath:
                                                                            instancePath +
                                                                            "/dependencies",
                                                                          schemaPath:
                                                                            "#/properties/dependencies/type",
                                                                          keyword:
                                                                            "type",
                                                                          params: {
                                                                            type:
                                                                              "object"
                                                                          },
                                                                          message:
                                                                            "must be object"
                                                                        }
                                                                      ];
                                                                      return false;
                                                                    }
                                                                  }
                                                                  var valid0 =
                                                                    _errs68 ===
                                                                    errors;
                                                                } else {
                                                                  var valid0 = true;
                                                                }
                                                                if (valid0) {
                                                                  if (
                                                                    data.propertyNames !==
                                                                    undefined
                                                                  ) {
                                                                    const _errs79 = errors;
                                                                    if (
                                                                      !validate0(
                                                                        data.propertyNames,
                                                                        {
                                                                          instancePath:
                                                                            instancePath +
                                                                            "/propertyNames",
                                                                          parentData: data,
                                                                          parentDataProperty:
                                                                            "propertyNames",
                                                                          rootData
                                                                        }
                                                                      )
                                                                    ) {
                                                                      vErrors =
                                                                        vErrors ===
                                                                          null
                                                                          ? validate0.errors
                                                                          : vErrors.concat(
                                                                            validate0.errors
                                                                          );
                                                                      errors =
                                                                        vErrors.length;
                                                                    }
                                                                    var valid0 =
                                                                      _errs79 ===
                                                                      errors;
                                                                  } else {
                                                                    var valid0 = true;
                                                                  }
                                                                  if (valid0) {
                                                                    if (
                                                                      data.enum !==
                                                                      undefined
                                                                    ) {
                                                                      let data37 =
                                                                        data.enum;
                                                                      const _errs80 = errors;
                                                                      if (
                                                                        errors ===
                                                                        _errs80
                                                                      ) {
                                                                        if (
                                                                          Array.isArray(
                                                                            data37
                                                                          )
                                                                        ) {
                                                                          if (
                                                                            data37.length <
                                                                            1
                                                                          ) {
                                                                            validate0.errors = [
                                                                              {
                                                                                instancePath:
                                                                                  instancePath +
                                                                                  "/enum",
                                                                                schemaPath:
                                                                                  "#/properties/enum/minItems",
                                                                                keyword:
                                                                                  "minItems",
                                                                                params: {
                                                                                  limit: 1
                                                                                },
                                                                                message:
                                                                                  "must NOT have fewer than 1 items"
                                                                              }
                                                                            ];
                                                                            return false;
                                                                          } else {
                                                                            let i4 =
                                                                              data37.length;
                                                                            let j2;
                                                                            if (
                                                                              i4 >
                                                                              1
                                                                            ) {
                                                                              outer0: for (
                                                                                ;
                                                                                i4--;

                                                                              ) {
                                                                                for (
                                                                                  j2 = i4;
                                                                                  j2--;

                                                                                ) {
                                                                                  if (
                                                                                    func0(
                                                                                      data37[
                                                                                      i4
                                                                                      ],
                                                                                      data37[
                                                                                      j2
                                                                                      ]
                                                                                    )
                                                                                  ) {
                                                                                    validate0.errors = [
                                                                                      {
                                                                                        instancePath:
                                                                                          instancePath +
                                                                                          "/enum",
                                                                                        schemaPath:
                                                                                          "#/properties/enum/uniqueItems",
                                                                                        keyword:
                                                                                          "uniqueItems",
                                                                                        params: {
                                                                                          i: i4,
                                                                                          j: j2
                                                                                        },
                                                                                        message:
                                                                                          "must NOT have duplicate items (items ## " +
                                                                                          j2 +
                                                                                          " and " +
                                                                                          i4 +
                                                                                          " are identical)"
                                                                                      }
                                                                                    ];
                                                                                    return false;
                                                                                    break outer0;
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        } else {
                                                                          validate0.errors = [
                                                                            {
                                                                              instancePath:
                                                                                instancePath +
                                                                                "/enum",
                                                                              schemaPath:
                                                                                "#/properties/enum/type",
                                                                              keyword:
                                                                                "type",
                                                                              params: {
                                                                                type:
                                                                                  "array"
                                                                              },
                                                                              message:
                                                                                "must be array"
                                                                            }
                                                                          ];
                                                                          return false;
                                                                        }
                                                                      }
                                                                      var valid0 =
                                                                        _errs80 ===
                                                                        errors;
                                                                    } else {
                                                                      var valid0 = true;
                                                                    }
                                                                    if (
                                                                      valid0
                                                                    ) {
                                                                      if (
                                                                        data.type !==
                                                                        undefined
                                                                      ) {
                                                                        let data38 =
                                                                          data.type;
                                                                        const _errs82 = errors;
                                                                        const _errs83 = errors;
                                                                        let valid18 = false;
                                                                        const _errs84 = errors;
                                                                        if (
                                                                          !(
                                                                            data38 ===
                                                                            "array" ||
                                                                            data38 ===
                                                                            "boolean" ||
                                                                            data38 ===
                                                                            "integer" ||
                                                                            data38 ===
                                                                            "null" ||
                                                                            data38 ===
                                                                            "number" ||
                                                                            data38 ===
                                                                            "object" ||
                                                                            data38 ===
                                                                            "string"
                                                                          )
                                                                        ) {
                                                                          const err6 = {
                                                                            instancePath:
                                                                              instancePath +
                                                                              "/type",
                                                                            schemaPath:
                                                                              "#/definitions/simpleTypes/enum",
                                                                            keyword:
                                                                              "enum",
                                                                            params: {
                                                                              allowedValues:
                                                                                schema9.enum
                                                                            },
                                                                            message:
                                                                              "must be equal to one of the allowed values"
                                                                          };
                                                                          if (
                                                                            vErrors ===
                                                                            null
                                                                          ) {
                                                                            vErrors = [
                                                                              err6
                                                                            ];
                                                                          } else {
                                                                            vErrors.push(
                                                                              err6
                                                                            );
                                                                          }
                                                                          errors++;
                                                                        }
                                                                        var _valid2 =
                                                                          _errs84 ===
                                                                          errors;
                                                                        valid18 =
                                                                          valid18 ||
                                                                          _valid2;
                                                                        if (
                                                                          !valid18
                                                                        ) {
                                                                          const _errs86 = errors;
                                                                          if (
                                                                            errors ===
                                                                            _errs86
                                                                          ) {
                                                                            if (
                                                                              Array.isArray(
                                                                                data38
                                                                              )
                                                                            ) {
                                                                              if (
                                                                                data38.length <
                                                                                1
                                                                              ) {
                                                                                const err7 = {
                                                                                  instancePath:
                                                                                    instancePath +
                                                                                    "/type",
                                                                                  schemaPath:
                                                                                    "#/properties/type/anyOf/1/minItems",
                                                                                  keyword:
                                                                                    "minItems",
                                                                                  params: {
                                                                                    limit: 1
                                                                                  },
                                                                                  message:
                                                                                    "must NOT have fewer than 1 items"
                                                                                };
                                                                                if (
                                                                                  vErrors ===
                                                                                  null
                                                                                ) {
                                                                                  vErrors = [
                                                                                    err7
                                                                                  ];
                                                                                } else {
                                                                                  vErrors.push(
                                                                                    err7
                                                                                  );
                                                                                }
                                                                                errors++;
                                                                              } else {
                                                                                var valid20 = true;
                                                                                const len2 =
                                                                                  data38.length;
                                                                                for (
                                                                                  let i5 = 0;
                                                                                  i5 <
                                                                                  len2;
                                                                                  i5++
                                                                                ) {
                                                                                  let data39 =
                                                                                    data38[
                                                                                    i5
                                                                                    ];
                                                                                  const _errs88 = errors;
                                                                                  if (
                                                                                    !(
                                                                                      data39 ===
                                                                                      "array" ||
                                                                                      data39 ===
                                                                                      "boolean" ||
                                                                                      data39 ===
                                                                                      "integer" ||
                                                                                      data39 ===
                                                                                      "null" ||
                                                                                      data39 ===
                                                                                      "number" ||
                                                                                      data39 ===
                                                                                      "object" ||
                                                                                      data39 ===
                                                                                      "string"
                                                                                    )
                                                                                  ) {
                                                                                    const err8 = {
                                                                                      instancePath:
                                                                                        instancePath +
                                                                                        "/type/" +
                                                                                        i5,
                                                                                      schemaPath:
                                                                                        "#/definitions/simpleTypes/enum",
                                                                                      keyword:
                                                                                        "enum",
                                                                                      params: {
                                                                                        allowedValues:
                                                                                          schema9.enum
                                                                                      },
                                                                                      message:
                                                                                        "must be equal to one of the allowed values"
                                                                                    };
                                                                                    if (
                                                                                      vErrors ===
                                                                                      null
                                                                                    ) {
                                                                                      vErrors = [
                                                                                        err8
                                                                                      ];
                                                                                    } else {
                                                                                      vErrors.push(
                                                                                        err8
                                                                                      );
                                                                                    }
                                                                                    errors++;
                                                                                  }
                                                                                  var valid20 =
                                                                                    _errs88 ===
                                                                                    errors;
                                                                                  if (
                                                                                    !valid20
                                                                                  ) {
                                                                                    break;
                                                                                  }
                                                                                }
                                                                                if (
                                                                                  valid20
                                                                                ) {
                                                                                  let i6 =
                                                                                    data38.length;
                                                                                  let j3;
                                                                                  if (
                                                                                    i6 >
                                                                                    1
                                                                                  ) {
                                                                                    outer1: for (
                                                                                      ;
                                                                                      i6--;

                                                                                    ) {
                                                                                      for (
                                                                                        j3 = i6;
                                                                                        j3--;

                                                                                      ) {
                                                                                        if (
                                                                                          func0(
                                                                                            data38[
                                                                                            i6
                                                                                            ],
                                                                                            data38[
                                                                                            j3
                                                                                            ]
                                                                                          )
                                                                                        ) {
                                                                                          const err9 = {
                                                                                            instancePath:
                                                                                              instancePath +
                                                                                              "/type",
                                                                                            schemaPath:
                                                                                              "#/properties/type/anyOf/1/uniqueItems",
                                                                                            keyword:
                                                                                              "uniqueItems",
                                                                                            params: {
                                                                                              i: i6,
                                                                                              j: j3
                                                                                            },
                                                                                            message:
                                                                                              "must NOT have duplicate items (items ## " +
                                                                                              j3 +
                                                                                              " and " +
                                                                                              i6 +
                                                                                              " are identical)"
                                                                                          };
                                                                                          if (
                                                                                            vErrors ===
                                                                                            null
                                                                                          ) {
                                                                                            vErrors = [
                                                                                              err9
                                                                                            ];
                                                                                          } else {
                                                                                            vErrors.push(
                                                                                              err9
                                                                                            );
                                                                                          }
                                                                                          errors++;
                                                                                          break outer1;
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            } else {
                                                                              const err10 = {
                                                                                instancePath:
                                                                                  instancePath +
                                                                                  "/type",
                                                                                schemaPath:
                                                                                  "#/properties/type/anyOf/1/type",
                                                                                keyword:
                                                                                  "type",
                                                                                params: {
                                                                                  type:
                                                                                    "array"
                                                                                },
                                                                                message:
                                                                                  "must be array"
                                                                              };
                                                                              if (
                                                                                vErrors ===
                                                                                null
                                                                              ) {
                                                                                vErrors = [
                                                                                  err10
                                                                                ];
                                                                              } else {
                                                                                vErrors.push(
                                                                                  err10
                                                                                );
                                                                              }
                                                                              errors++;
                                                                            }
                                                                          }
                                                                          var _valid2 =
                                                                            _errs86 ===
                                                                            errors;
                                                                          valid18 =
                                                                            valid18 ||
                                                                            _valid2;
                                                                        }
                                                                        if (
                                                                          !valid18
                                                                        ) {
                                                                          const err11 = {
                                                                            instancePath:
                                                                              instancePath +
                                                                              "/type",
                                                                            schemaPath:
                                                                              "#/properties/type/anyOf",
                                                                            keyword:
                                                                              "anyOf",
                                                                            params: {},
                                                                            message:
                                                                              "must match a schema in anyOf"
                                                                          };
                                                                          if (
                                                                            vErrors ===
                                                                            null
                                                                          ) {
                                                                            vErrors = [
                                                                              err11
                                                                            ];
                                                                          } else {
                                                                            vErrors.push(
                                                                              err11
                                                                            );
                                                                          }
                                                                          errors++;
                                                                          validate0.errors = vErrors;
                                                                          return false;
                                                                        } else {
                                                                          errors = _errs83;
                                                                          if (
                                                                            vErrors !==
                                                                            null
                                                                          ) {
                                                                            if (
                                                                              _errs83
                                                                            ) {
                                                                              vErrors.length = _errs83;
                                                                            } else {
                                                                              vErrors = null;
                                                                            }
                                                                          }
                                                                        }
                                                                        var valid0 =
                                                                          _errs82 ===
                                                                          errors;
                                                                      } else {
                                                                        var valid0 = true;
                                                                      }
                                                                      if (
                                                                        valid0
                                                                      ) {
                                                                        if (
                                                                          data.format !==
                                                                          undefined
                                                                        ) {
                                                                          const _errs90 = errors;
                                                                          if (
                                                                            typeof data.format !==
                                                                            "string"
                                                                          ) {
                                                                            validate0.errors = [
                                                                              {
                                                                                instancePath:
                                                                                  instancePath +
                                                                                  "/format",
                                                                                schemaPath:
                                                                                  "#/properties/format/type",
                                                                                keyword:
                                                                                  "type",
                                                                                params: {
                                                                                  type:
                                                                                    "string"
                                                                                },
                                                                                message:
                                                                                  "must be string"
                                                                              }
                                                                            ];
                                                                            return false;
                                                                          }
                                                                          var valid0 =
                                                                            _errs90 ===
                                                                            errors;
                                                                        } else {
                                                                          var valid0 = true;
                                                                        }
                                                                        if (
                                                                          valid0
                                                                        ) {
                                                                          if (
                                                                            data.contentMediaType !==
                                                                            undefined
                                                                          ) {
                                                                            const _errs92 = errors;
                                                                            if (
                                                                              typeof data.contentMediaType !==
                                                                              "string"
                                                                            ) {
                                                                              validate0.errors = [
                                                                                {
                                                                                  instancePath:
                                                                                    instancePath +
                                                                                    "/contentMediaType",
                                                                                  schemaPath:
                                                                                    "#/properties/contentMediaType/type",
                                                                                  keyword:
                                                                                    "type",
                                                                                  params: {
                                                                                    type:
                                                                                      "string"
                                                                                  },
                                                                                  message:
                                                                                    "must be string"
                                                                                }
                                                                              ];
                                                                              return false;
                                                                            }
                                                                            var valid0 =
                                                                              _errs92 ===
                                                                              errors;
                                                                          } else {
                                                                            var valid0 = true;
                                                                          }
                                                                          if (
                                                                            valid0
                                                                          ) {
                                                                            if (
                                                                              data.contentEncoding !==
                                                                              undefined
                                                                            ) {
                                                                              const _errs94 = errors;
                                                                              if (
                                                                                typeof data.contentEncoding !==
                                                                                "string"
                                                                              ) {
                                                                                validate0.errors = [
                                                                                  {
                                                                                    instancePath:
                                                                                      instancePath +
                                                                                      "/contentEncoding",
                                                                                    schemaPath:
                                                                                      "#/properties/contentEncoding/type",
                                                                                    keyword:
                                                                                      "type",
                                                                                    params: {
                                                                                      type:
                                                                                        "string"
                                                                                    },
                                                                                    message:
                                                                                      "must be string"
                                                                                  }
                                                                                ];
                                                                                return false;
                                                                              }
                                                                              var valid0 =
                                                                                _errs94 ===
                                                                                errors;
                                                                            } else {
                                                                              var valid0 = true;
                                                                            }
                                                                            if (
                                                                              valid0
                                                                            ) {
                                                                              if (
                                                                                data.if !==
                                                                                undefined
                                                                              ) {
                                                                                const _errs96 = errors;
                                                                                if (
                                                                                  !validate0(
                                                                                    data.if,
                                                                                    {
                                                                                      instancePath:
                                                                                        instancePath +
                                                                                        "/if",
                                                                                      parentData: data,
                                                                                      parentDataProperty:
                                                                                        "if",
                                                                                      rootData
                                                                                    }
                                                                                  )
                                                                                ) {
                                                                                  vErrors =
                                                                                    vErrors ===
                                                                                      null
                                                                                      ? validate0.errors
                                                                                      : vErrors.concat(
                                                                                        validate0.errors
                                                                                      );
                                                                                  errors =
                                                                                    vErrors.length;
                                                                                }
                                                                                var valid0 =
                                                                                  _errs96 ===
                                                                                  errors;
                                                                              } else {
                                                                                var valid0 = true;
                                                                              }
                                                                              if (
                                                                                valid0
                                                                              ) {
                                                                                if (
                                                                                  data.then !==
                                                                                  undefined
                                                                                ) {
                                                                                  const _errs97 = errors;
                                                                                  if (
                                                                                    !validate0(
                                                                                      data.then,
                                                                                      {
                                                                                        instancePath:
                                                                                          instancePath +
                                                                                          "/then",
                                                                                        parentData: data,
                                                                                        parentDataProperty:
                                                                                          "then",
                                                                                        rootData
                                                                                      }
                                                                                    )
                                                                                  ) {
                                                                                    vErrors =
                                                                                      vErrors ===
                                                                                        null
                                                                                        ? validate0.errors
                                                                                        : vErrors.concat(
                                                                                          validate0.errors
                                                                                        );
                                                                                    errors =
                                                                                      vErrors.length;
                                                                                  }
                                                                                  var valid0 =
                                                                                    _errs97 ===
                                                                                    errors;
                                                                                } else {
                                                                                  var valid0 = true;
                                                                                }
                                                                                if (
                                                                                  valid0
                                                                                ) {
                                                                                  if (
                                                                                    data.else !==
                                                                                    undefined
                                                                                  ) {
                                                                                    const _errs98 = errors;
                                                                                    if (
                                                                                      !validate0(
                                                                                        data.else,
                                                                                        {
                                                                                          instancePath:
                                                                                            instancePath +
                                                                                            "/else",
                                                                                          parentData: data,
                                                                                          parentDataProperty:
                                                                                            "else",
                                                                                          rootData
                                                                                        }
                                                                                      )
                                                                                    ) {
                                                                                      vErrors =
                                                                                        vErrors ===
                                                                                          null
                                                                                          ? validate0.errors
                                                                                          : vErrors.concat(
                                                                                            validate0.errors
                                                                                          );
                                                                                      errors =
                                                                                        vErrors.length;
                                                                                    }
                                                                                    var valid0 =
                                                                                      _errs98 ===
                                                                                      errors;
                                                                                  } else {
                                                                                    var valid0 = true;
                                                                                  }
                                                                                  if (
                                                                                    valid0
                                                                                  ) {
                                                                                    if (
                                                                                      data.allOf !==
                                                                                      undefined
                                                                                    ) {
                                                                                      const _errs99 = errors;
                                                                                      if (
                                                                                        !validate3(
                                                                                          data.allOf,
                                                                                          {
                                                                                            instancePath:
                                                                                              instancePath +
                                                                                              "/allOf",
                                                                                            parentData: data,
                                                                                            parentDataProperty:
                                                                                              "allOf",
                                                                                            rootData
                                                                                          }
                                                                                        )
                                                                                      ) {
                                                                                        vErrors =
                                                                                          vErrors ===
                                                                                            null
                                                                                            ? validate3.errors
                                                                                            : vErrors.concat(
                                                                                              validate3.errors
                                                                                            );
                                                                                        errors =
                                                                                          vErrors.length;
                                                                                      }
                                                                                      var valid0 =
                                                                                        _errs99 ===
                                                                                        errors;
                                                                                    } else {
                                                                                      var valid0 = true;
                                                                                    }
                                                                                    if (
                                                                                      valid0
                                                                                    ) {
                                                                                      if (
                                                                                        data.anyOf !==
                                                                                        undefined
                                                                                      ) {
                                                                                        const _errs100 = errors;
                                                                                        if (
                                                                                          !validate3(
                                                                                            data.anyOf,
                                                                                            {
                                                                                              instancePath:
                                                                                                instancePath +
                                                                                                "/anyOf",
                                                                                              parentData: data,
                                                                                              parentDataProperty:
                                                                                                "anyOf",
                                                                                              rootData
                                                                                            }
                                                                                          )
                                                                                        ) {
                                                                                          vErrors =
                                                                                            vErrors ===
                                                                                              null
                                                                                              ? validate3.errors
                                                                                              : vErrors.concat(
                                                                                                validate3.errors
                                                                                              );
                                                                                          errors =
                                                                                            vErrors.length;
                                                                                        }
                                                                                        var valid0 =
                                                                                          _errs100 ===
                                                                                          errors;
                                                                                      } else {
                                                                                        var valid0 = true;
                                                                                      }
                                                                                      if (
                                                                                        valid0
                                                                                      ) {
                                                                                        if (
                                                                                          data.oneOf !==
                                                                                          undefined
                                                                                        ) {
                                                                                          const _errs101 = errors;
                                                                                          if (
                                                                                            !validate3(
                                                                                              data.oneOf,
                                                                                              {
                                                                                                instancePath:
                                                                                                  instancePath +
                                                                                                  "/oneOf",
                                                                                                parentData: data,
                                                                                                parentDataProperty:
                                                                                                  "oneOf",
                                                                                                rootData
                                                                                              }
                                                                                            )
                                                                                          ) {
                                                                                            vErrors =
                                                                                              vErrors ===
                                                                                                null
                                                                                                ? validate3.errors
                                                                                                : vErrors.concat(
                                                                                                  validate3.errors
                                                                                                );
                                                                                            errors =
                                                                                              vErrors.length;
                                                                                          }
                                                                                          var valid0 =
                                                                                            _errs101 ===
                                                                                            errors;
                                                                                        } else {
                                                                                          var valid0 = true;
                                                                                        }
                                                                                        if (
                                                                                          valid0
                                                                                        ) {
                                                                                          if (
                                                                                            data.not !==
                                                                                            undefined
                                                                                          ) {
                                                                                            const _errs102 = errors;
                                                                                            if (
                                                                                              !validate0(
                                                                                                data.not,
                                                                                                {
                                                                                                  instancePath:
                                                                                                    instancePath +
                                                                                                    "/not",
                                                                                                  parentData: data,
                                                                                                  parentDataProperty:
                                                                                                    "not",
                                                                                                  rootData
                                                                                                }
                                                                                              )
                                                                                            ) {
                                                                                              vErrors =
                                                                                                vErrors ===
                                                                                                  null
                                                                                                  ? validate0.errors
                                                                                                  : vErrors.concat(
                                                                                                    validate0.errors
                                                                                                  );
                                                                                              errors =
                                                                                                vErrors.length;
                                                                                            }
                                                                                            var valid0 =
                                                                                              _errs102 ===
                                                                                              errors;
                                                                                          } else {
                                                                                            var valid0 = true;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  validate0.errors = vErrors;
  return errors === 0;
}
