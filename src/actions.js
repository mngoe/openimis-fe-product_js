import { graphqlWithVariables } from "@openimis/fe-core";

export const productCodeValidationCheck = (mm, variables) => {
  return graphqlWithVariables(
    `
      query ($productCode: String!) {
        isValid: validateProductCode(productCode: $productCode)
      }
      `,
    variables,
    `PRODUCT_CODE_FIELDS_VALIDATION`,
  );
};

export const productCodeSetValid = () => {
  return (dispatch) => {
    dispatch({ type: `PRODUCT_CODE_SET_VALID` });
  };
};

export const productCodeValidationClear = () => {
  return (dispatch) => {
    dispatch({
      type: `PRODUCT_CODE_FIELDS_VALIDATION_CLEAR`,
    });
  };
};

export const fetchProduct = (mm, variables) => {
  return graphqlWithVariables(
    `
    query ($productId: ID) {
        product: products(id: $productId) {
          edges {
            node {
              id
              uuid
              code
              name
              ceilingType
            }
          }
        }
      }
        `,
    variables,
    `PRODUCT_FETCH_PRODUCT`,
  );
};

export const clearProduct = () => {
  return (dispatch) => {
    dispatch({
      type: `PRODUCT_FETCH_PRODUCT_CLEAR`,
    });
  };
};
