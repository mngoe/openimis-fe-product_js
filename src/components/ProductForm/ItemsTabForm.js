import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import _ from "lodash";

import {
  useTranslations,
  useModulesManager,
  formatMessage as globalFormatMessage,
  PublishedComponent,
} from "@openimis/fe-core";
import { getLimitType, getPriceOrigin, loadProductItems } from "../../utils";
import GenericItemsTabForm from "./GenericItemsTabForm";

const ItemsTabForm = (props) => {
  const { edited, edited_id, onEditedChanged, limitType, priceOrigin, getLimitValueSwitch, readOnly } = props;
  const modulesManager = useModulesManager();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations("product", modulesManager);
  const [isLoading, setLoading] = useState(false);

  const itemColumns = useMemo(
    () => [
      {
        field: "code",
        valueGetter: (params) => params.row.item.code,
        renderCell: (params) => <strong>{params.value}</strong>,
        headerName: formatMessage("ItemsOrServicesGrid.code"),
        width: 100,
        disableColumnMenu: true,
        description: "Test description",
      },
      {
        field: "name",
        valueGetter: (params) => params.row.item.name,
        renderCell: (params) => (
          <span title={params.value} className="ellipsis">
            {params.value}
          </span>
        ),
        headerName: formatMessage("ItemsOrServicesGrid.name"),
        width: 340,
      },
      {
        field: "type",
        valueGetter: (params) => globalFormatMessage(intl, "medical", `itemType.${params.row.item.type}`),
        headerName: globalFormatMessage(intl, "medical", "itemType"),
        width: 120,
      },
      {
        field: "package",
        valueGetter: (params) => params.row.item.package,
        headerName: formatMessage("ItemsOrServicesGrid.package"),
        width: 180,
      },
      {
        field: "price",
        valueGetter: (params) => params.row.item.price,
        headerName: formatMessage("ItemsOrServicesGrid.price"),
        width: 90,
        disableColumnMenu: true,
      },
    ],
    [],
  );

  useEffect(() => {
    if (!edited.items && edited_id) {
      setLoading(true);
      loadProductItems(edited_id, dispatch).then((items) => {
        setLoading(false);
        onEditedChanged({ ...edited, items, hasEditedItems: true });
      });
    }
  }, []);

  const onChange = (items) => {
    onEditedChanged({ ...edited, items, hasEditedItems: true });
  };

  const onAdd = (selection) => {
    const newItems = selection.map((item) => ({
      id: item.id,
      item,
      priceOrigin: getPriceOrigin(priceOrigin),
      limitationType: getLimitType(limitType),
      limitationTypeR: getLimitType(limitType),
      limitationTypeE: getLimitType(limitType),
      limitAdult: getLimitValueSwitch(limitType),
      limitAdultR: getLimitValueSwitch(limitType),
      limitAdultE: getLimitValueSwitch(limitType),
      limitChild: getLimitValueSwitch(limitType),
      limitChildR: getLimitValueSwitch(limitType),
      limitChildE: getLimitValueSwitch(limitType),
    }));
    onChange(newItems.concat(edited.items ?? []));
  };

  const itemsKeys = useMemo(() => _.map(edited.items, "id"), [edited.items]);
  const filterDialogOptions = (options) => options.filter((o) => !itemsKeys.includes(o.id));

  return (
    <GenericItemsTabForm
      itemColumns={itemColumns}
      isLoading={isLoading}
      rows={edited.items ?? []}
      onChange={onChange}
      readOnly={readOnly}
      addButtonLabel={formatMessage("ItemsOrServicesGrid.addItemsButton")}
      onAdd={onAdd}
      getLimitValueSwitch={getLimitValueSwitch}
      Picker={(props) => (
        <PublishedComponent
          filterOptions={filterDialogOptions}
          extraFragment="price type name package code uuid"
          fullWidth
          multiple
          pubRef="medical.ItemPicker"
          {...props}
        />
      )}
    />
  );
};
export default ItemsTabForm;
