import React, { useState, useMemo, useRef, useEffect } from "react";
import _ from "lodash";

import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Close";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";

import { ErrorBoundary, useTranslations, useModulesManager } from "@openimis/fe-core";

const useActionsStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

const CellActions = (props) => {
  const { api, id, onRowDelete } = props;
  const classes = useActionsStyles();
  const isInEditMode = api.getRowMode(id) === "edit";

  const handleEditClick = (event) => {
    event.stopPropagation();
    api.setRowMode(id, "edit");
  };
  const handleSaveClick = (event) => {
    event.stopPropagation();
    api.commitRowChange(id);
    api.setRowMode(id, "view");
  };
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onRowDelete(id, event);
  };
  const handleCancelClick = (event) => {
    event.stopPropagation();
    api.setRowMode(id, "view");

    const row = api.getRow(id);
    if (row.isNew) {
      api.updateRows([{ id, _action: "delete" }]);
      onRowDelete(id, event);
    }
  };

  if (isInEditMode) {
    return (
      <div className={classes.root}>
        <IconButton color="primary" size="small" aria-label="save" onClick={handleSaveClick}>
          <SaveIcon fontSize="small" />
        </IconButton>
        <IconButton
          color="inherit"
          size="small"
          aria-label="cancel"
          className={classes.textPrimary}
          onClick={handleCancelClick}
        >
          <CancelIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <IconButton
        color="inherit"
        className={classes.textPrimary}
        size="small"
        aria-label="edit"
        onClick={handleEditClick}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton color="inherit" size="small" aria-label="delete" onClick={handleDeleteClick}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const DataGrid = (props) => {
  const {
    className,
    onChange,
    error,
    isLoading,
    density,
    readOnly,
    rows = [],
    bindLimitTypesWithDefaultValues,
  } = props;
  const [editRowsModel, setEditRowsModel] = useState({});
  const [rowId, setRowId] = useState(null);
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.DataGrid", modulesManager);
  const prevItemsOrServicesRef = useRef();

  const preventRowEdit = (_, event) => (event.defaultMuiPrevented = true);
  const onRowEditCommit = (id, event) => {
    const idx = _.findIndex(rows, { id });
    const newRow = { ...rows[idx] };
    if (Object.keys(editRowsModel).length !== 0) {
      for (const [key, field] of Object.entries(editRowsModel[id])) {
        newRow[key] = field.value;
      }
    }

    const newRows = [...rows];
    newRows.splice(idx, 1, newRow);
    onChange(newRows);
  };

  const onRowDelete = (id) => {
    onChange(rows.filter((x) => x.id !== id));
  };

  const renderCellActions = (props) => <CellActions {...props} onRowDelete={onRowDelete} />;

  const columns = useMemo(() => {
    const baseColumns = props.columns;
    if (readOnly) return baseColumns;
    return [
      {
        field: "actions",
        headerName: formatMessage("actions"),
        renderCell: renderCellActions,
        sortable: false,
        disableColumnMenu: true,
        width: 100,
      },
      ...baseColumns,
    ];
  }, [props.columns, readOnly, rows]);

  const getLastedEditedRowId = (prevRows, currentRows) => {
    for (const key of Object.keys(currentRows)) {
      if (prevRows && prevRows.hasOwnProperty(key)) {
        if (!_.isEqual(prevRows[key], currentRows[key])){
          return key;
        }
      }
    }
    return Object.keys(currentRows)[0];
  }

  useEffect(() => {
    if (rowId) {
      onRowEditCommit(rowId)
    }
  }, [editRowsModel])

  const handleEditRowsModel = (itemsOrServices) => {
    setRowId(getLastedEditedRowId(prevItemsOrServicesRef.current, itemsOrServices));
    bindLimitTypesWithDefaultValues(itemsOrServices, prevItemsOrServicesRef.current);
    setEditRowsModel(itemsOrServices);
    prevItemsOrServicesRef.current = itemsOrServices;
  }

  return (
    <ErrorBoundary>
      <MuiDataGrid
        error={error}
        onRowEditStart={preventRowEdit}
        onRowEditStop={preventRowEdit}
        onRowEditCommit={onRowEditCommit}
        loading={isLoading}
        columns={columns}
        density={density}
        editMode="row"
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModel}
        className={className}
        rows={rows}
      />
    </ErrorBoundary>
  );
};
export default DataGrid;
