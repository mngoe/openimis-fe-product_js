import { useModulesManager, useGraphqlQuery, useGraphqlMutation } from "@openimis/fe-core";
import { useMemo } from "react";
import _ from "lodash";

export const GRAPHQL_USE_PRODUCTS_PRODUCT_FRAGMENT = `
  fragment ProductFragment on ProductGQLType {
    id
    uuid
    name
    code
    location {id name uuid code parent {id name uuid code}}
    dateFrom
    dateTo
    maxMembers
    validityFrom
    validityTo
  }
`;

export const useProductsQuery = ({ filters }, config) => {
  const modulesManager = useModulesManager();
  // NOTE: The usage of `dateFrom_Lte: $dateFrom` and `dateTo_Gte: $dateTo` in the GraphQL query
  // seems to imply a reserved naming convention. This might indicate a potential issue or limitation
  // in the backend's handling of date range filters. The current solution is adjusted to align with 
  // the backend's existing implementation. Further investigation or backend adjustments may be required
  // for a more intuitive approach.
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
  query (
    $search: String, $first: Int, $last: Int, $before: String, $after: String, $code: String, $name: String, 
    $dateFrom: DateTime, $dateTo: DateTime, $location: Int, $showHistory: Boolean
    ) {
    products (
      search: $search, first: $first, last: $last, before: $before, after: $after, code_Icontains: $code, showHistory: $showHistory,
      name_Icontains: $name, dateFrom_Lte: $dateFrom, dateTo_Gte: $dateTo, location: $location
      ) {
      edges {
        node {
          ...ProductFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${modulesManager.getRef("product.hooks.useProductsQuery.productFragment")}
  `,
    filters,
    config,
  );

  const products = useMemo(() => (data ? _.map(data.products?.edges, "node") : []), [data]);
  const pageInfo = useMemo(
    () => (data ? Object.assign({ totalCount: data.products?.totalCount }, data.products?.pageInfo) : {}),
    [data],
  );
  return { isLoading, error, data: { products, pageInfo }, refetch };
};

export const GRAPHQL_USE_PRODUCT_PRODUCT_FRAGMENT = `
  fragment ProductFragment on ProductGQLType {
    id
    uuid
    code
    name
    maxMembers
    threshold
    location {id uuid code name parent {id uuid name code}}

    validityFrom
    validityTo
    dateFrom
    dateTo

    recurrence
    insurancePeriod
    lumpSum
    premiumAdult
    premiumChild
    maxInstallments
    registrationLumpSum
    registrationFee
    generalAssemblyLumpSum
    generalAssemblyFee

    startCycle1
    startCycle2
    startCycle3
    startCycle4

    renewalDiscountPerc
    renewalDiscountPeriod
    enrolmentDiscountPerc
    enrolmentDiscountPeriod
    ceilingInterpretation

    gracePeriodEnrolment
    gracePeriodRenewal
    gracePeriodPayment

    accCodePremiums
    accCodeRemuneration

    maxPolicyExtraMember
    maxPolicyExtraMemberIp
    maxPolicyExtraMemberOp

    maxCeilingPolicy
    maxCeilingPolicyIp
    maxCeilingPolicyOp

    maxNoConsultation
    maxNoSurgery
    maxNoDelivery
    maxNoHospitalization
    maxNoVisits
    maxNoAntenatal
    maxAmountConsultation
    maxAmountSurgery
    maxAmountDelivery
    maxAmountHospitalization
    maxAmountAntenatal

    deductible
    deductibleIp
    deductibleOp

    ceiling
    ceilingIp
    ceilingOp

    conversionProduct {
      id
      name
      code
      }

    administrationPeriod
  }
`;

export const useProductQuery = ({ id, uuid }, config) => {
  const modulesManager = useModulesManager();
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
  query ($uuid: String, $id: ID) {
    product(id: $id, uuid: $uuid) {
      id
      ...ProductFragment
    }
  }
  ${modulesManager.getRef("product.hooks.useProductQuery.productFragment")}
  `,
    { id, uuid },
    config,
  );

  return {
    isLoading,
    error,
    refetch,
    data: data?.product,
  };
};

export const usePageDisplayRulesQuery = (config) => {
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
    query {
      pageDisplayRules {
        minLimitValue
        maxLimitValue
    }
  }
  `,
    config,
  );

  return {
    isLoadingRules: isLoading,
    errorRules: error,
    refetchRules: refetch,
    dataRules: data,
  };
};

export const useLimitDefaultsQuery = (config) => {
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
    query {
      limitDefaults {
        defaultPriceOrigin
        defaultLimit
        defaultLimitCoInsuranceValue
        defaultLimitFixedValue
    }
  }
  `,
    config,
  );

  return {
    isLoadingLimitDefaults: isLoading,
    errorLimitDefaults: error,
    refetchLimitDefaults: refetch,
    dataLimitDefaults: data,
  };
};

export const useProductCreateMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation ($input: CreateProductMutationInput!) {
      createProduct(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.createProduct },
  );

  return mutation;
};

export const useProductUpdateMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation ($input: UpdateProductMutationInput!) {
      updateProduct(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.updateProduct },
  );

  return mutation;
};

export const useProductDuplicateMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation ($input: DuplicateProductMutationInput!) {
      duplicateProduct(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.duplicateProduct },
  );

  return mutation;
};

export const useProductDeleteMutation = () => {
  const mutation = useGraphqlMutation(
    `
    mutation ($input: DeleteProductMutationInput!) {
      deleteProduct(input: $input) {
        internalId
        clientMutationId
      }
    }
  `,
    { onSuccess: (data) => data?.deleteProduct },
  );

  return mutation;
};
