import React from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  ErrorBoundary,
  withHistory,
  historyPush,
  combine,
  useModulesManager,
  ProgressOrError,
} from "@openimis/fe-core";
import { withStyles, withTheme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import ProductForm from "../components/ProductForm/ProductForm";
import { RIGHT_PRODUCT_UPDATE } from "../constants";
import { useProductQuery, useProductCreateMutation, useProductUpdateMutation } from "../hooks";
import { validateProductForm, toFormValues, toInputValues } from "../utils";

const styles = (theme) => ({
  page: theme.page,
  fab: theme.fab,
  locked: theme.page.locked,
});

const ProductDetailsPage = (props) => {
  const { classes, match, history } = props;
  const modulesManager = useModulesManager();
  const rights = useSelector((state) => state.core?.user?.i_user?.rights ?? []);

  const [resetKey, setResetKey] = useState(0);
  const [isLocked, setLocked] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [values, setValues] = useState({});
  const { isLoading, error, data, refetch } = useProductQuery(
    { uuid: match.params.product_id },
    { skip: !match.params.product_id },
  );
  const createMutation = useProductCreateMutation();
  const updateMutation = useProductUpdateMutation();

  const onSave = () => {
    setLocked(true);
    if (values.uuid) {
      updateMutation.mutate(toInputValues(values));
    } else {
      createMutation.mutate(toInputValues(values));
    }
  };

  const onReset = () => {
    setResetKey(Date.now());
    setValues(toFormValues(data ?? {}));
    if (match.params.product_id) {
      refetch();
    }
    setLocked(false);
  };

  useEffect(() => {
    if (!isLoading) {
      setValues(toFormValues(data ?? {}));
      setLoaded(true);
    }
  }, [data, isLoading]);

  return (
    <div className={clsx(classes.page, isLocked && classes.locked)}>
      <ProgressOrError error={error} />
      <ErrorBoundary>
        {isLoaded && (
          <ProductForm
            readOnly={!rights.includes(RIGHT_PRODUCT_UPDATE) || isLocked || values.validityTo}
            key={resetKey}
            onChange={setValues}
            product={values}
            canSave={() => validateProductForm(values)}
            onBack={() => historyPush(modulesManager, history, "product.productsList")}
            onSave={rights.includes(RIGHT_PRODUCT_UPDATE) ? onSave : undefined}
            onReset={onReset}
          />
        )}
      </ErrorBoundary>
    </div>
  );
};

const enhance = combine(withTheme, withStyles(styles), withHistory);

export default enhance(ProductDetailsPage);
