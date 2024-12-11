import React from "react";
import clsx from "clsx";

import { withStyles, withTheme } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay";

import { Form, ProgressOrError, combine, ErrorBoundary } from "@openimis/fe-core";
import MainPanelForm from "./MainPanelForm";
import TabsForm from "./TabsForm";

const styles = (theme) => ({
  page: theme.page,
  locked: theme.page.locked,
});

const ProductForm = (props) => {
  const { readOnly, onBack, onSave, product, canSave, onReset, onChange, autoFocus, isDuplicate, error, classes } =
    props;

  return (
    <div className={clsx(classes.page, readOnly && classes.locked)}>
      <ErrorBoundary>
        <ProgressOrError error={error} />
        <Form
          module="product"
          title={product?.uuid ? "product.ProductForm.title" : "product.ProductForm.emptyTitle"}
          titleParams={{ label: product.name ?? "" }}
          readOnly={readOnly}
          canSave={canSave}
          onEditedChanged={onChange}
          edited={product}
          isDuplicate={isDuplicate}
          edited_id={product.uuid}
          HeadPanel={MainPanelForm}
          Panels={[TabsForm]}
          save={onSave}
          autoFocus={autoFocus}
          back={onBack}
          openDirty={onSave}
          actions={[
            {
              doIt: onReset,
              icon: <ReplayIcon />,
              onlyIfDirty: !readOnly,
            },
          ]}
        />
      </ErrorBoundary>
    </div>
  );
};

const enhance = combine(withTheme, withStyles(styles));

export default enhance(ProductForm);
