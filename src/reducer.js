import { formatServerError, formatGraphQLError, parseData } from "@openimis/fe-core";

const initialState = {
  fetchingProduct: false,
  product: {},
  fetchedProduct: false,
  errorProduct: null,
  validationFields: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PRODUCT_FETCH_PRODUCT_REQ":
      return {
        ...state,
        fetchingProduct: true,
        product: {},
        fetchedProduct: false,
        errorProduct: null,
      };
    case "PRODUCT_FETCH_PRODUCT_RESP":
      return {
        ...state,
        fetchingProduct: false,
        product: parseData(action.payload.data?.product)?.[0],
        fetchedProduct: true,
        errorProduct: null,
      };
    case "PRODUCT_FETCH_PRODUCT_ERR":
      return {
        ...state,
        fetchingProduct: false,
        errorProduct: formatServerError(action.payload),
      };
    case "PRODUCT_FETCH_PRODUCT_CLEAR":
      return {
        ...state,
        fetchingProduct: false,
        product: {},
        fetchedProduct: false,
        errorProduct: null,
      };
    case "PRODUCT_CODE_FIELDS_VALIDATION_REQ":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          productCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "PRODUCT_CODE_FIELDS_VALIDATION_RESP":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          productCode: {
            isValidating: false,
            isValid: action.payload?.data.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case "PRODUCT_CODE_FIELDS_VALIDATION_ERR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          productCode: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case "PRODUCT_CODE_FIELDS_VALIDATION_CLEAR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          productCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "PRODUCT_CODE_SET_VALID":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          productCode: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    default:
      return state;
  }
};
