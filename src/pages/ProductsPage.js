import React from "react";
import ProductSearcher from "../components/ProductSearcher";
import { withTheme, withStyles } from "@material-ui/styles";
import { Fab } from "@material-ui/core";
import { combine, withTooltip, useTranslations, withHistory, historyPush, useModulesManager } from "@openimis/fe-core";
import AddIcon from "@material-ui/icons/Add";

import { useSelector } from "react-redux";
import { RIGHT_PRODUCT_DELETE, RIGHT_PRODUCT_ADD } from "../constants";
import { useProductDeleteMutation } from "../hooks";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
});

const ProductsPage = (props) => {
  const { classes, history } = props;
  const modulesManager = useModulesManager();
  const rights = useSelector((state) => state.core.user?.i_user?.rights ?? []);
  const { formatMessage } = useTranslations("product");
  const deleteMutation = useProductDeleteMutation();

  const onDelete = async (product) => {
    await deleteMutation.mutate({ uuids: [product.uuid] });
  };

  const canDelete = (product) => rights.includes(RIGHT_PRODUCT_DELETE) && !product.validityTo;
  const onDoubleClick = (product, newTab = false) => {
    historyPush(modulesManager, history, "product.productDetails", [product.uuid], newTab);
  };

  return (
    <div className={classes.page}>
      <ProductSearcher onDelete={onDelete} canDelete={canDelete} onDoubleClick={onDoubleClick} />
      {rights.includes(RIGHT_PRODUCT_ADD) &&
        withTooltip(
          <div className={classes.fab}>
            <Fab color="primary" onClick={() => historyPush(modulesManager, history, "product.newProduct")}>
              <AddIcon />
            </Fab>
          </div>,
          formatMessage("ProductsPage.addNewProduct"),
        )}
    </div>
  );
};

const enhance = combine(withTheme, withStyles(styles), withHistory);

export default enhance(ProductsPage);
