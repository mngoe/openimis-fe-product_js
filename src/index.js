import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json"
import ProductPicker from "./pickers/ProductPicker";
import { reducer } from "./reducer";
import { decodeId } from "@openimis/fe-core";


import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import {
  GRAPHQL_USE_PRODUCTS_PRODUCT_FRAGMENT,
  GRAPHQL_USE_PRODUCT_PRODUCT_FRAGMENT,
  useProductsQuery,
  useProductQuery,
  usePageDisplayRulesQuery,
} from "./hooks";
import ProductSalesReport from "./reports/ProductSalesReport";
import ProductDerivedOperationalIndicators from "./reports/ProductDerivedOperationalIndicators";

const DEFAULT_CONFIG = {
  "translations": [
    { key: "en", messages: messages_en },
    { key: "fr", messages: messages_fr }
  ],
  "reducers": [{ key: "product", reducer }],
  "reports": [
    {
      key: "product_sales",
      component: ProductSalesReport,
      isValid: (values) => values.dateFrom && values.dateTo,
      getParams: (values) => {
        const params = {}
        if (values.region) {
          params.requested_region_id = decodeId(values.region.id);
        }
        if (values.district) {
          params.requested_district_id = decodeId(values.district.id);
        }
        if (values.product) {
          params.requested_product_id = decodeId(values.product.id);
        }
        params.date_start = values.dateFrom;
        params.date_end = values.dateTo;
        return params;
      },
    },
    {
      key: "product_derived_operational_indicators",
      component: ProductDerivedOperationalIndicators,
      isValid: (values) => values.year && values.product,
      getParams: (values) => {
        const params = {}
        if (values.month) {
          params.requested_month = values.month;
        }
        params.requested_product_id = decodeId(values.product.id);
        params.requested_year = values.year;
        return params;
      },
    },
  ],
  "core.Router": [
    { path: "admin/products", component: ProductsPage },
    { path: "admin/products/new", component: ProductDetailsPage },
    { path: "admin/products/:product_id", component: ProductDetailsPage },
    { path: "admin/products/duplicate/:product_id", component: ProductDetailsPage },
  ],
  "refs": [
    { key: "product.ProductPicker", ref: ProductPicker },
    { key: "product.ProductPicker.projection", ref: ["id", "code", "name", "location{id}", "program {id code idProgram nameProgram validityDateFrom}"] },
    { key: "product.ProductPicker.sort", ref: "product__code" },

    // Routes
    { key: "product.productsList", ref: "admin/products" },
    { key: "product.productDetails", ref: "admin/products" },
    { key: "product.newProduct", ref: "admin/products/new" },
    { key: "product.duplicateProduct", ref: "admin/products/duplicate" },

    // Hooks
    { key: "product.hooks.useProductsQuery", ref: useProductsQuery },
    { key: "product.hooks.useProductQuery", ref: useProductQuery },
    { key: "product.hooks.usePageDisplayRulesQuery", ref: usePageDisplayRulesQuery },
    { key: "product.hooks.useProductsQuery.productFragment", ref: GRAPHQL_USE_PRODUCTS_PRODUCT_FRAGMENT },
    { key: "product.hooks.useProductQuery.productFragment", ref: GRAPHQL_USE_PRODUCT_PRODUCT_FRAGMENT },
  ],
};

export const ProductModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
