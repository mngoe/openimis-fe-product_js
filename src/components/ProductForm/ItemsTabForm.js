import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import {
  useTranslations,
  useModulesManager,
  formatMessage as globalFormatMessage,
  PublishedComponent,
} from "@openimis/fe-core";
import { loadProductItems } from "../../utils";
import _ from "lodash";
import GenericItemsTabForm from "./GenericItemsTabForm";

const ItemsTabForm = (props) => {
  const { edited, edited_id, onEditedChanged } = props;
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
        onEditedChanged({ ...edited, items });
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
      priceOrigin: "PRICELIST",
      limitationType: "FIXED_AMOUNT",
      limitationTypeR: "FIXED_AMOUNT",
      limitationTypeE: "FIXED_AMOUNT",
      limitAdult: 100.00,
      limitAdultR: 100.00,
      limitAdultE: 100.00,
      limitChild: 100.00,
      limitChildR: 100.00,
      limitChildE: 100.00,
      limitNoAdult: 100.00,
      limitNoChild: 100.00,
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
      onAdd={onAdd}
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
