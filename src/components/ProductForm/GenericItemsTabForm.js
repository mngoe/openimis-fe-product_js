import React, { useState, useMemo, useEffect } from "react";
import _ from "lodash";

import { Grid, Button } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";

import { combine, useTranslations, useModulesManager, ErrorBoundary } from "@openimis/fe-core";
import {
  LIMIT_TYPES,
  PRICE_ORIGINS,
  CEILING_EXCLUSIONS,
  LIMIT_COLUMNS,
  LIMIT_ADULT,
  LIMIT_ADULT_R, LIMIT_ADULT_E, LIMIT_CHILD, LIMIT_CHILD_R, LIMIT_CHILD_E
} from "../../constants";
import { usePageDisplayRulesQuery } from "../../hooks";
import { rulesToFormValues } from "../../utils";
import DataGrid from "./DataGrid";
import ProductItemsDialog from "./ProductItemsDialog";

const ItemsTabForm = (props) => {
  const {
    classes,
    className,
    isLoading,
    onChange,
    onAdd,
    readOnly,
    rows = [],
    itemColumns,
    Picker,
    getLimitValueSwitch,
    addButtonLabel,
  } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product", modulesManager);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { isLoadingRules, errorRules, dataRules, refetchRules } = usePageDisplayRulesQuery({ skip: true });
  const [valuesRules, setValuesRules] = useState({});
  const [isLoadedRules, setLoadedRules] = useState(false);
  const [MIN_VALUE, setMinValue] = useState(0);
  const [MAX_VALUE, setMaxValue] = useState(100);

  const getLimitationTypeForFieldName = (rowData, fieldName) => {
    switch (fieldName) {
      case LIMIT_ADULT:
      case LIMIT_CHILD:
        return rowData?.limitationType;
      case LIMIT_ADULT_E:
      case LIMIT_CHILD_E:
        return rowData?.limitationTypeE;
      case LIMIT_ADULT_R:
      case LIMIT_CHILD_R:
        return rowData?.limitationTypeR;
    }
  }

  const parserLimits = (value, params, fieldName) => {
    const limitationType = getLimitationTypeForFieldName(params.row, fieldName);
    value = Number(value);

    const itemOrServiceValue = Number(params?.row?.service?.price || params?.row?.item?.price || MAX_VALUE);
    const isLimitTypeC = limitationType === LIMIT_TYPES.C;
    const isValueGreaterThanMax = isLimitTypeC ? value > MAX_VALUE : value > itemOrServiceValue;
    const isValueLessThanMin = value < MIN_VALUE;

    if (isValueGreaterThanMax) {
      value = MIN_VALUE;
    } else if (isValueLessThanMin) {
      value = isLimitTypeC ? MAX_VALUE : itemOrServiceValue;
    }

    return value.toFixed(2);
  };


  const bindLimitTypesWithDefaultValues = (itemsOrServices, prevItemsOrServices) => {
    Object.keys(itemsOrServices).forEach(key => {
      for (const prop in itemsOrServices[key]) {
        if (prevItemsOrServices && prevItemsOrServices.hasOwnProperty(key) && prevItemsOrServices[key].hasOwnProperty(prop)) {
          if ((!prevItemsOrServices[key].hasOwnProperty(prop) || itemsOrServices[key][prop] !== prevItemsOrServices[key][prop])) {
            if (prop === "limitationType") {
              itemsOrServices[key].limitAdult.value = getLimitValueSwitch(itemsOrServices[key][prop].value)
              itemsOrServices[key].limitChild.value = getLimitValueSwitch(itemsOrServices[key][prop].value)
            }
            else if (prop === "limitationTypeE") {
              itemsOrServices[key].limitAdultE.value = getLimitValueSwitch(itemsOrServices[key][prop].value)
              itemsOrServices[key].limitChildE.value = getLimitValueSwitch(itemsOrServices[key][prop].value)
            }
            else if (prop === "limitationTypeR") {
              itemsOrServices[key].limitAdultR.value = getLimitValueSwitch(itemsOrServices[key][prop].value)
              itemsOrServices[key].limitChildR.value = getLimitValueSwitch(itemsOrServices[key][prop].value)
            }
          }
        }
      }
    })
  }

  useEffect(() => {
    if (!isLoadingRules && !isLoadedRules) {
      setValuesRules(rulesToFormValues(dataRules.pageDisplayRules ?? {}));
      setMinValue(valuesRules.minLimitValue)
      setMaxValue(valuesRules.maxLimitValue)
      setLoadedRules(true)
    }
  }, [dataRules, isLoadingRules]);

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
        valueOptions: Object.values(PRICE_ORIGINS).map((v) => ({
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
        valueOptions: Object.values(LIMIT_TYPES).map((v) => ({
          label: v && formatMessage(`ItemsOrServicesGrid.limitTypes.${v}`),
          value: v,
        })),
      })),
      ...LIMIT_COLUMNS.map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 90,
        editable: true,
        type: "number",
        disableColumnMenu: true,
        sortable: false,
        valueGetter: (params) => Number(params.value).toFixed(2),
        valueParser: (value, params) => parserLimits(value, params, fieldName),
      })),
      ...["limitNoAdult", "limitNoChild", "waitingPeriodAdult", "waitingPeriodChild"].map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 100,
        type: "number",
        editable: true,
        disableColumnMenu: true,
        sortable: false,
        valueParser: (value) => value,
        valueGetter: ({ value }) => {
          if (typeof value === 'number') return value.toString();
          return value;
        },
      })),
      ...["ceilingExclusionAdult", "ceilingExclusionChild"].map((fieldName) => ({
        field: fieldName,
        headerName: formatMessage(`ItemsOrServicesGrid.${fieldName}`),
        width: 120,
        editable: true,
        type: "singleSelect",
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: (params) => {
          return params.value ? formatMessage(`ItemsOrServicesGrid.ceilingExclusion.${params.value}`) : "";
        },
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
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)} disabled={readOnly}>
            {addButtonLabel}
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.dataGridWrapper}>
          <ErrorBoundary>
            {isLoadedRules && (
              <DataGrid
                className={classes.dataGrid}
                onChange={onChange}
                isLoading={isLoading}
                columns={columns}
                density="compact"
                rows={rows}
                readOnly={readOnly}
                bindLimitTypesWithDefaultValues={bindLimitTypesWithDefaultValues}
              />
            )}
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
