import { graphqlWithVariables, toISODate } from "@openimis/fe-core";
import _ from "lodash";

export const validateProductForm = (values) => {
  values = { ...values };

  delete values.validityTo;
  delete values.validityFrom;

  const REQUIRED_FIELDS = [
    "code",
    "name",
    "maxMembers",
    "insurancePeriod",
    "maxInstallments",
    "gracePeriodPayment",
    "dateFrom",
    "dateTo",
    "ceilingInterpretation",
  ];
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!values[field]) {
      errors[field] = true;
    }
  });

  if (values.dateFrom > values.dateTo) {
    errors.dateFrom = true;
    errors.dateTo = true;
  }

  if (Object.keys(errors).length > 0) {
    console.warn(errors);
  }

  if (values.relativePrices?.length > 0) {
    values.relativePrices.forEach(({ periods }) => {
      if (_.sum(periods.map((v) => parseFloat(v))) !== 100) {
        errors.relativePrices = true;
      }
    });
  }

  return Object.keys(errors).length === 0;
};

export const toFormValues = (product) => {
  return {
    ...product,
    lumpSum: product.lumpSum ?? 0,
    maxMembers: product.maxMembers ?? 0,
    insurancePeriod: product.insurancePeriod ?? 12,
    maxInstallments: product.maxInstallments ?? 1,
    gracePeriodPayment: product.gracePeriodPayment ?? 1,
    gracePeriodEnrolment: product.gracePeriodEnrolment ?? 0,
    gracePeriodRenewal: product.gracePeriodRenewal ?? 0,
    ceilingInterpretation: product.ceilingInterpretation ?? "HEALTH_FACILITY_TYPE",
  };
};

export const toInputValues = (values) => {
  const {
    uuid,
    id,
    code,
    location,
    conversionProduct,
    validityTo,
    validityFrom,
    hasEditedServices,
    hasEditedItems,
    items,
    services,
    ...inputValues
  } = values;

  const formatService = ({ service, id, ...params }) => ({
    serviceUuid: service.uuid,
    ...params,
  });

  const formatItem = ({ item, id, ...params }) => ({
    itemUuid: item.uuid,
    ...params,
  });

  return {
    ...inputValues,
    services: hasEditedServices ? services.map(formatService) : undefined,
    items: hasEditedItems ? items.map(formatItem) : undefined,
    uuid,
    code: uuid ? undefined : code,
    dateFrom: toISODate(values.dateFrom),
    dateTo: toISODate(values.dateTo),
    locationUuid: location?.uuid,
    conversionProductUuid: conversionProduct?.uuid,
  };
};

export const fetchConnection = (fetchFn) => {
  const loadPage = async (items, pagination) => {
    try {
      const { pageInfo, data } = await fetchFn(pagination);
      items.push(...data);
      if (!pageInfo.hasNextPage) return items;

      return loadPage(items, { after: pageInfo.endCursor });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  return loadPage([], {});
};

export const loadProductItems = async (uuid, dispatch) => {
  return fetchConnection(async (pagination) => {
    const { payload, error } = await dispatch(
      graphqlWithVariables(
        `
    query ($after: String, $uuid: String!) {
      product(uuid: $uuid) {
        items (first: 100, after:$after) {
          edges {
            node {
              id
              priceOrigin
              waitingPeriodAdult
              waitingPeriodChild
              
              limitationType
              limitationTypeR
              limitationTypeE
              
              limitAdult
              limitChild
              limitAdultR
              limitChildR
              limitAdultE
              limitChildE
              limitNoAdult
              limitNoChild
              
              ceilingExclusionAdult
              ceilingExclusionChild
              item {
                id
                uuid
                name
                code
                price
                package
                type
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `,
        { uuid, ...pagination },
      ),
    );
    if (error) {
      console.error(payload);
      throw new Error(payload);
    }
    const { product } = payload.data;
    return { data: _.map(product.items.edges, "node"), pageInfo: product.items.pageInfo };
  });
};

export const loadProductServices = async (uuid, dispatch) => {
  return fetchConnection(async (pagination) => {
    const { payload, error } = await dispatch(
      graphqlWithVariables(
        `
    query ($after: String, $uuid: String!) {
      product(uuid: $uuid) {
        services (first: 100, after:$after) {
          edges {
            node {
              id
              priceOrigin
              waitingPeriodAdult
              waitingPeriodChild
              
              limitationType
              limitationTypeR
              limitationTypeE
              
              limitAdult
              limitChild
              limitAdultR
              limitChildR
              limitAdultE
              limitChildE
              limitNoAdult
              limitNoChild
              
              ceilingExclusionAdult
              ceilingExclusionChild
              service {
                id
                uuid
                name
                code
                price
                level
                type
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `,
        { uuid, ...pagination },
      ),
    );
    if (error) {
      console.error(payload);
      throw new Error(payload);
    }
    const { product } = payload.data;
    return { data: _.map(product.services.edges, "node"), pageInfo: product.services.pageInfo };
  });
};
