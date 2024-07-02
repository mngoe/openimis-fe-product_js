import React, { useState, useCallback } from "react";
import { useProductsQuery } from "../hooks";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Searcher, useTranslations, combine, useModulesManager, ConfirmDialog } from "@openimis/fe-core";
import ProductFilters from "./ProductFilters";
import { Tooltip, IconButton } from "@material-ui/core";
import { Tab as TabIcon, Delete as DeleteIcon } from "@material-ui/icons";
import FileCopyIcon from '@material-ui/icons/FileCopy';

const isRowDisabled = (_, row) => Boolean(row.validityTo);
const formatLocation = (location) => (location ? `${location.code} - ${location.name}` : null);

const styles = (theme) => ({
  horizontalButtonContainer: theme.buttonContainer.horizontal,
});

const ProductSearcher = (props) => {
  const { cacheFiltersKey, classes, onDelete, canDelete, onDoubleClick, onDuplicate, canDuplicate } = props;
  const modulesManager = useModulesManager();
  const { formatMessage, formatDateFromISO, formatMessageWithValues } = useTranslations("product", modulesManager);
  const [filters, setFilters] = useState({});
  const [productToDelete, setProductToDelete] = useState(null);
  const { data, isLoading, error, refetch } = useProductsQuery({ filters }, { skip: true, keepStale: true });
  const filtersToQueryParam = useCallback((state) => {
    let params = {};
    if (!state.beforeCursor && !state.afterCursor) {
      params = {first: state.pageSize};
    }
    if (state.afterCursor) {
      params = {
        after: state.afterCursor,
        first: state.pageSize,
      }
    }
    if (state.beforeCursor) {
      params = {
        before: state.beforeCursor,
        last: state.pageSize,
      }
    }
    Object.entries(state.filters).forEach(([filterKey, filter]) => {
      params[filterKey] = filter.filter ?? filter.value;
    });
    return params;
  }, []);

  const getHeaders = useCallback(
    () => [
      "product.code",
      "product.name",
      "product.region",
      "product.district",
      "product.dateFrom",
      "product.dateTo",
      "product.maxMembers",
      "",
    ],
    [],
  );
  const getAligns = useCallback(() => {
    const aligns = getHeaders().map(() => null);
    aligns.splice(-1, 1, "right");
    return aligns;
  }, []);

  const onDeleteConfirm = (isConfirmed) => {
    if (isConfirmed) {
      onDelete(productToDelete);
      refetch();
    }
    setProductToDelete(null);
  };

  const itemFormatters = useCallback((filters) => {
    return [
      (p) => p.code,
      (p) => p.name,
      (p) => formatLocation(p.location?.parent ?? p.location),
      (p) => formatLocation(p.location?.parent ? p.location : null),
      (p) => formatDateFromISO(p.dateFrom),
      (p) => formatDateFromISO(p.dateTo),
      (p) => p.maxMembers,

      (p) =>
        !filters.showHistory?.value ? (
          <div className={classes.horizontalButtonContainer}>
            <Tooltip title={formatMessage("ProductSearcher.openNewTab")}>
              <IconButton onClick={() => onDoubleClick(p, true)}>
                <TabIcon />
              </IconButton>
            </Tooltip>
            {canDuplicate(p) && (
              <Tooltip title={formatMessage("ProductSearcher.duplicateProductTooltip")}>
                <IconButton onClick={() => onDuplicate(p, true)}>
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            )}
            {canDelete(p) && (
              <Tooltip title={formatMessage("ProductSearcher.deleteProductTooltip")}>
                <IconButton onClick={() => setProductToDelete(p)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ) : null,
    ];
  }, []);
  return (
    <>
      {productToDelete && (
        <ConfirmDialog
          confirm={{
            title: formatMessage("deleteProductDialog.title"),
            message: formatMessageWithValues("deleteProductDialog.message", { name: productToDelete.name }),
          }}
          onConfirm={onDeleteConfirm}
        />
      )}
      <Searcher
        module="product"
        tableTitle={formatMessageWithValues("ProductSearcher.tableTitle", { count: data?.pageInfo?.totalCount ?? 0 })}
        cacheFiltersKey={cacheFiltersKey}
        items={data.products}
        fetchingItems={isLoading}
        errorItems={error}
        itemsPageInfo={data.pageInfo}
        fetch={setFilters}
        onDelete={onDelete}
        canDelete={canDelete}
        onDoubleClick={onDoubleClick}
        FilterPane={ProductFilters}
        headers={getHeaders}
        aligns={getAligns}
        rowDisabled={isRowDisabled}
        rowIdentifier={(r) => r.uuid}
        filtersToQueryParams={filtersToQueryParam}
        itemFormatters={itemFormatters}
      />
    </>
  );
};

const enhance = combine(withTheme, withStyles(styles));

export default enhance(ProductSearcher);
