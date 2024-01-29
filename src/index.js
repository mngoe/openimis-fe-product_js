import messages_en from "./translations/en.json";
import messages_fr from "./translations/fr.json";
import ProductPicker from "./pickers/ProductPicker";

import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import {
  GRAPHQL_USE_PRODUCTS_PRODUCT_FRAGMENT,
  GRAPHQL_USE_PRODUCT_PRODUCT_FRAGMENT,
  useProductsQuery,
  useProductQuery,
} from "./hooks";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }, {key: "fr", messages: messages_fr}],
  "core.Router": [
    { path: "admin/products", component: ProductsPage },
    { path: "admin/products/new", component: ProductDetailsPage },
    { path: "admin/products/:product_id", component: ProductDetailsPage },
  ],
  "refs": [
    { key: "product.ProductPicker", ref: ProductPicker },
    { key: "product.ProductPicker.projection", ref: ["id", "code", "name", "location{id}", "program {id code idProgram nameProgram validityDateFrom}"] },
    { key: "product.ProductPicker.sort", ref: "product__code" },

    // Routes
    { key: "product.productsList", ref: "admin/products" },
    { key: "product.productDetails", ref: "admin/products" },
    { key: "product.newProduct", ref: "admin/products/new" },

    // Hooks
    { key: "product.hooks.useProductsQuery", ref: useProductsQuery },
    { key: "product.hooks.useProductQuery", ref: useProductQuery },
    { key: "product.hooks.useProductsQuery.productFragment", ref: GRAPHQL_USE_PRODUCTS_PRODUCT_FRAGMENT },
    { key: "product.hooks.useProductQuery.productFragment", ref: GRAPHQL_USE_PRODUCT_PRODUCT_FRAGMENT },
  ],
};

export const ProductModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
};
