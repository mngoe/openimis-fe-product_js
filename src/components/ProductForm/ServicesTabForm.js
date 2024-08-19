import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import {
  useTranslations,
  useModulesManager,
  formatMessage as globalFormatMessage,
  PublishedComponent,
} from "@openimis/fe-core";
import {getLimitType, getPriceOrigin, loadProductServices} from "../../utils";
import _ from "lodash";
import GenericItemsTabForm from "./GenericItemsTabForm";

const ServicesTabForm = (props) => {
  const { edited, edited_id, onEditedChanged, limitType, priceOrigin, getLimitValueSwitch, readOnly } = props;
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
        onEditedChanged({ ...edited, services, hasEditedServices: true });
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
      readOnly={readOnly}
      addButtonLabel={formatMessage("ItemsOrServicesGrid.addServicesButton")}
      getLimitValueSwitch={getLimitValueSwitch}
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
