import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import { useTranslations, useModulesManager } from "@openimis/fe-core";

const ProductItemsDialog = (props) => {
  const { onSubmit, onCancel, title, open, Picker } = props;
  const [selection, setSelection] = useState([]);
  const modulesManager = useModulesManager();
  const { formatMessageWithValues, formatMessage } = useTranslations("product.ProductItemsDialog", modulesManager);

  const handleSubmit = () => {
    onSubmit(selection);
    setSelection([]);
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={onCancel}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{formatMessage("description")}</DialogContentText>
          <Picker required value={selection} onChange={setSelection} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{formatMessage("cancel")}</Button>
          <Button onClick={handleSubmit} disabled={!selection.length}>
            {selection.length > 0
              ? formatMessageWithValues("submit", { count: selection.length })
              : formatMessage("emptySubmit")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductItemsDialog;
