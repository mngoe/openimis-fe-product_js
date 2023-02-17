import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import {
  useTranslations,
  useModulesManager,
  formatMessage as globalFormatMessage,
  PublishedComponent,
} from "@openimis/fe-core";
import { loadProductServices } from "../../utils";
import _ from "lodash";
import GenericItemsTabForm from "./GenericItemsTabForm";

const ServicesTabForm = (props) => {
  const { edited, edited_id, onEditedChanged } = props;
  const modulesManager = useModulesManager();
  const intl = useIntl();
  const dispatch = useDispatch();
  const { formatMessage } = useTranslations("product", modulesManager);
  const [isLoading, setLoading] = useState(false);

  const columns = useMemo(
    () => [
      {
        field: "code",
        valueGetter: (params) => params.row.service.code,
        renderCell: (params) => <strong>{params.value}</strong>,
        headerName: formatMessage("ItemsOrServicesGrid.code"),
        width: 100,
        disableColumnMenu: true,
        description: "Test description",
      },
      {
        field: "name",
        valueGetter: (params) => params.row.service.name,
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
        valueGetter: (params) => globalFormatMessage(intl, "medical", `serviceType.${params.row.service.type}`),
        headerName: globalFormatMessage(intl, "medical", "itemType"),
        width: 120,
      },
      {
        field: "level",
        valueGetter: (params) => params.row.service.level,
        headerName: formatMessage("ItemsOrServicesGrid.level"),
        width: 180,
      },
      {
        field: "price",
        valueGetter: (params) => params.row.service.price,
        headerName: formatMessage("ItemsOrServicesGrid.price"),
        width: 90,
        disableColumnMenu: true,
      },
    ],
    [],
  );

  useEffect(() => {
    if (!edited.services && edited_id) {
      setLoading(true);
      loadProductServices(edited_id, dispatch).then((services) => {
        setLoading(false);
        onEditedChanged({ ...edited, services });
      });
    }
  }, []);

  const onChange = (services) => {
    onEditedChanged({ ...edited, services, hasEditedServices: true });
  };
  const onAdd = (selection) => {
    const newServices = selection.map((service) => ({
      id: service.id,
      service,
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
    onChange(newServices.concat(edited.services ?? []));
  };

  const servicesKeys = useMemo(() => _.map(edited.services, "id"), [edited.services]);
  const filterDialogOptions = (options) => options.filter((o) => !servicesKeys.includes(o.id));

  return (
    <GenericItemsTabForm
      itemColumns={columns}
      isLoading={isLoading}
      rows={edited.services ?? []}
      onChange={onChange}
      onAdd={onAdd}
      Picker={(props) => (
        <PublishedComponent
          filterOptions={filterDialogOptions}
          extraFragment="price type name level code uuid"
          fullWidth
          multiple
          pubRef="medical.ServicePicker"
          {...props}
        />
      )}
    />
  );
};
export default ServicesTabForm;
