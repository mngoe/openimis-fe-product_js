import React, { useCallback } from "react";
import { Searcher } from "@openimis/fe-core";
import _ from "lodash";

const defaultRenderCell = (props) => {
  return "cell";
};

const EditableSearcher = (props) => {
  const { module, items, isLoading, error, columns, defaultOrderBy, title, onFiltersChange, rowIdentifier } = props;

  const getHeaders = useCallback(() => _.map(columns, "label"), [columns]);
  const getItemFormatters = useCallback(() => columns.map((col) => col.renderCell ?? defaultRenderCell), [columns]);
  const getSorts = useCallback(() => _.map(columns, "sortable"), [columns]);
  const getRowIdentifier = useCallback((row) => row[rowIdentifier], [rowIdentifier]);

  return (
    <Searcher
      module={module}
      defaultOrderBy={defaultOrderBy}
      headers={getHeaders}
      items={items}
      sorts={getSorts}
      itemFormatters={getItemFormatters}
      rowIdentifier={getRowIdentifier}
      fetchingItems={isLoading}
      errorItems={error}
      tableTitle={title}
      fetch={onFiltersChange}
    />
  );
};

export default EditableSearcher;
