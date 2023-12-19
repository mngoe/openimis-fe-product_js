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
    ageMinimal
    ageMaximal
    dateTo 
    maxMembers
    validityFrom
    validityTo
    program {id idProgram nameProgram validityDateFrom}
  } 
`;

export const useProductsQuery = ({ filters }, config) => {
  const modulesManager = useModulesManager();
  const { isLoading, error, data, refetch } = useGraphqlQuery(
    `
  query (
    $first: Int, $last: Int, $before: String, $after: String, $code: String, $name: String, 
    $dateFrom: DateTime, $dateTo: DateTime, $location: Int, $showHistory: Boolean
    ) {
    products (
      first: $first, last: $last, before: $before, after: $after, code_Icontains: $code, showHistory: $showHistory,
      name_Icontains: $name, dateFrom_Gte: $dateFrom, dateTo_Lte: $dateTo, location: $location
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
    ageMaximal
    ageMinimal
    maxMembers
    threshold
    location {id uuid code name parent {id uuid name code}}
    program {id idProgram nameProgram validityDateFrom}
    
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
    
    relativePrices {
      careType
      periods
    }
    
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
