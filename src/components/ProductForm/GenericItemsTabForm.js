import React, { useState, useMemo } from "react";
import { combine, useTranslations, useModulesManager, ErrorBoundary } from "@openimis/fe-core";
import { Grid, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DataGrid from "./DataGrid";
import { withTheme, withStyles } from "@material-ui/styles";
import ProductItemsDialog from "./ProductItemsDialog";
import { LIMIT_TYPES, PRICE_ORIGINS, CEILING_EXCLUSIONS } from "../../constants";
import _ from "lodash";

const ItemsTabForm = (props) => {
  const { classes, className, isLoading, onChange, onAdd, rows = [], itemColumns, Picker } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product", modulesManager);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const columns = useMemo(
    () => [
      ...itemColumns,
      {
        field: "priceOrigin",
        headerName: formatMessage("ItemsOrServicesGrid.priceOrigin"),
        width: 110,
        editable: true,
        type: "singleSelect",
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: (params) => params.value && formatMessage(`ItemsOrServicesGrid.priceOrigin.${params.value}`),
        valueOptions: PRICE_ORIGINS.map((v) => ({
          label: v && formatMessage(`ItemsOrServicesGrid.priceOrigin.${v}`),
          value: v,
        })),
      },
      ...["limitationType", "limitationTypeR", "limitationTypeE"].map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 120,
        editable: true,
        type: "singleSelect",
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: (params) => params.value && formatMessage(`ItemsOrServicesGrid.limitTypes.${params.value}`),
        valueOptions: LIMIT_TYPES.map((v) => ({
          label: v && formatMessage(`ItemsOrServicesGrid.limitTypes.${v}`),
          value: v,
        })),
      })),
      ...[
        "limitAdult",
        "limitAdultR",
        "limitAdultE",
        "limitChild",
        "limitChildR",
        "limitChildE",
        "limitNoAdult",
        "limitNoChild",
      ].map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 90,
        editable: true,
        type: "number",
        disableColumnMenu: true,
        sortable: false,
      })),
      ...["waitingPeriodAdult", "waitingPeriodChild"].map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 100,
        type: "number",
        editable: true,
        disableColumnMenu: true,
        sortable: false,
      })),
      ...["ceilingExclusionAdult", "ceilingExclusionChild"].map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 120,
        editable: true,
        type: "singleSelect",
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: (params) => formatMessage(`ItemsOrServicesGrid.ceilingExclusion.${params.value ?? null}`),
        valueOptions: [null].concat(CEILING_EXCLUSIONS).map((v) => ({
          label: formatMessage(`ItemsOrServicesGrid.ceilingExclusion.${v ?? null}`),
          value: v,
        })),
      })),
    ],
    [itemColumns],
  );

  const onDialogSubmit = (selection) => {
    setDialogOpen(false);
    onAdd(selection);
  };
  return (
    <>
      <ProductItemsDialog
        open={isDialogOpen}
        onSubmit={onDialogSubmit}
        onCancel={() => setDialogOpen(false)}
        title={formatMessage("ItemsOrServicesGrid.dialogTitle")}
        Picker={Picker}
      />
      <Grid container className={className}>
        <Grid item container xs={4} className={classes.item}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
            {formatMessage("ItemsOrServicesGrid.addItemsButton")}
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.dataGridWrapper}>
          <ErrorBoundary>
            <DataGrid
              className={classes.dataGrid}
              onChange={onChange}
              isLoading={isLoading}
              columns={columns}
              density="compact"
              rows={rows}
            />
          </ErrorBoundary>
        </Grid>
      </Grid>
    </>
  );
};

const styles = (theme) => ({
  item: theme.paper.item,
  dataGridWrapper: {
    height: "50vh",
  },
  dataGrid: {
    "& .MuiDataGrid-columnsContainer": {
      fontSize: 10,
    },
    "& .ellipsis": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});

const enhance = combine(withTheme, withStyles(styles));
export default enhance(ItemsTabForm);
